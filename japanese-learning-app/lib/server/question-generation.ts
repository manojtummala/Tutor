import Database from "better-sqlite3";
import { buildBackgroundQuestionPrompt } from "@/lib/ai/gemini-prompts";
import { generateStructuredQuestions } from "@/lib/ai/gemini";
import { n5StarterContentPack, validateGeneratedQuestions } from "@/lib/ai/question-schema";
import { ensureGeneratedQuestionTables, getLearnedKanji } from "@/lib/server/generated-question-store";
import type { GeneratedPracticeQuestion, PracticeGenerationContentPack } from "@/lib/practice/generated-practice-types";

const minimumCoverage = 3;
const targetCoverage = 6;
const completedJobCooldown = "-1 day";

type ItemRow = {
  id: string;
  japanese: string;
  reading: string | null;
  romaji: string | null;
  meaning: string;
};

function chunkKeyFor(itemIds: string[]) {
  return [...new Set(itemIds)].sort().join("|");
}

function storeQuestions(sqlite: Database.Database, chunkKey: string, model: string, questions: GeneratedPracticeQuestion[]) {
  const insert = sqlite.prepare(`
    INSERT INTO generated_practice_questions (
      id, chunk_key, type, level, prompt, choices_json, blocks_json, correct_answer_json,
      natural_sentence, explanation, source_item_ids_json, script_mode, kanji_used_json, status, model
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?)
  `);

  sqlite.transaction(() => {
    questions.forEach((question) => insert.run(
      crypto.randomUUID(),
      chunkKey,
      question.type,
      question.level,
      question.prompt,
      question.choices ? JSON.stringify(question.choices) : null,
      question.blocks ? JSON.stringify(question.blocks) : null,
      JSON.stringify(question.correctAnswer),
      question.naturalSentence ?? null,
      question.explanation,
      JSON.stringify(question.sourceItemIds),
      question.scriptMode,
      JSON.stringify(question.kanjiUsed),
      model,
    ));
  })();
}

async function generateAndValidate(
  model: string,
  contentPack: PracticeGenerationContentPack,
  items: ItemRow[],
  existingPrompts: string[],
) {
  const payload = await generateStructuredQuestions(buildBackgroundQuestionPrompt(contentPack, items), model);
  const allowedJapaneseCharacters = [...new Set(
    items
      .flatMap((item) => [item.japanese, item.reading ?? ""])
      .join("")
      .match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaffー]/gu) ?? [],
  )];
  return validateGeneratedQuestions(payload, targetCoverage, {
    allowedSourceItemIds: items.map((item) => item.id),
    allowedKanji: contentPack.allowedKanji,
    allowedJapaneseCharacters,
    existingPrompts,
  });
}

export async function runQuestionGenerationJob(jobId: string) {
  const sqlite = new Database("local.db");
  ensureGeneratedQuestionTables(sqlite);

  try {
    const job = sqlite.prepare(`
      SELECT id, chunk_key, source_item_ids_json
      FROM question_generation_jobs
      WHERE id = ? AND status = 'pending'
    `).get(jobId) as { id: string; chunk_key: string; source_item_ids_json: string } | undefined;
    if (!job) return;

    sqlite.prepare(`
      UPDATE question_generation_jobs
      SET status = 'running', attempt_count = attempt_count + 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(jobId);

    const itemIds = JSON.parse(job.source_item_ids_json) as string[];
    const placeholders = itemIds.map(() => "?").join(",");
    const items = sqlite.prepare(`
      SELECT id, japanese, reading, romaji, meaning
      FROM learning_items
      WHERE id IN (${placeholders})
    `).all(...itemIds) as ItemRow[];
    const allowedKanji = getLearnedKanji(sqlite);
    const contentPack: PracticeGenerationContentPack = {
      ...n5StarterContentPack,
      scriptPolicy: "learned_kanji_only",
      allowedKanji,
    };
    const existingPrompts = (sqlite.prepare(`
      SELECT prompt FROM generated_practice_questions WHERE status = 'active'
    `).all() as Array<{ prompt: string }>).map((row) => row.prompt);

    const simpleModel = process.env.GEMINI_SIMPLE_MODEL ?? "gemini-2.5-flash-lite";
    const strongModel = process.env.GEMINI_STRONG_MODEL ?? "gemini-2.5-flash";
    let model = simpleModel;
    let result = await generateAndValidate(simpleModel, contentPack, items, existingPrompts);

    if (result.questions.length < minimumCoverage) {
      console.warn("Gemini flash-lite produced low valid coverage; retrying with strong model.", result.errors);
      model = strongModel;
      result = await generateAndValidate(strongModel, contentPack, items, existingPrompts);
    }

    if (result.questions.length === 0) {
      throw new Error(`No generated questions passed validation. ${result.errors.join(" ")}`);
    }

    storeQuestions(sqlite, job.chunk_key, model, result.questions);
    sqlite.prepare(`
      UPDATE question_generation_jobs
      SET status = 'completed', model = ?, error = NULL, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(model, jobId);
    console.info("Stored generated practice questions.", { jobId, model, count: result.questions.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown generation error";
    sqlite.prepare(`
      UPDATE question_generation_jobs
      SET status = 'failed', error = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(message, jobId);
    console.error("Background question generation failed.", { jobId, error });
  } finally {
    sqlite.close();
  }
}

export function queueQuestionGenerationIfNeeded(itemIds: string[]) {
  const ids = [...new Set(itemIds)].filter(Boolean);
  if (ids.length === 0 || !process.env.GEMINI_API_KEY) {
    return { queued: false, reason: ids.length === 0 ? "no-items" : "gemini-not-configured" };
  }

  const sqlite = new Database("local.db");
  try {
    ensureGeneratedQuestionTables(sqlite);
    const chunkKey = chunkKeyFor(ids);
    const coverageWhere = ids.map(() => "source_item_ids_json LIKE ?").join(" OR ");
    const activeCount = (sqlite.prepare(`
      SELECT COUNT(*) AS count
      FROM generated_practice_questions
      WHERE status = 'active' AND (${coverageWhere})
    `).get(...ids.map((id) => `%"${id}"%`)) as { count: number }).count;

    if (activeCount >= minimumCoverage) {
      return { queued: false, reason: "coverage-sufficient", activeCount };
    }

    const existingJob = sqlite.prepare(`
      SELECT id, status FROM question_generation_jobs
      WHERE chunk_key = ?
        AND (
          status IN ('pending', 'running')
          OR (status = 'failed' AND updated_at >= datetime('now', '-1 hour'))
          OR (status = 'completed' AND updated_at >= datetime('now', ?))
        )
      LIMIT 1
    `).get(chunkKey, completedJobCooldown) as { id: string; status: string } | undefined;
    if (existingJob) {
      return {
        queued: false,
        reason: existingJob.status === "completed" ? "recent-row-generation" : "job-exists",
        jobId: existingJob.id,
        activeCount,
      };
    }

    const jobId = crypto.randomUUID();
    sqlite.prepare(`
      INSERT INTO question_generation_jobs (id, chunk_key, source_item_ids_json, status)
      VALUES (?, ?, ?, 'pending')
    `).run(jobId, chunkKey, JSON.stringify(ids));

    queueMicrotask(() => {
      void runQuestionGenerationJob(jobId);
    });
    return { queued: true, jobId, activeCount };
  } finally {
    sqlite.close();
  }
}
