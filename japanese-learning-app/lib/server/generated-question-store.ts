import Database from "better-sqlite3";
import type { GeneratedPracticeQuestion, ScriptMode } from "@/lib/practice/generated-practice-types";

type StoredQuestionRow = {
  id: string;
  type: GeneratedPracticeQuestion["type"];
  level: "N5";
  prompt: string;
  choices_json: string | null;
  blocks_json: string | null;
  correct_answer_json: string;
  natural_sentence: string | null;
  explanation: string;
  source_item_ids_json: string;
  script_mode: ScriptMode;
  kanji_used_json: string;
};

export function ensureGeneratedQuestionTables(sqlite: Database.Database) {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS generated_practice_questions (
      id TEXT PRIMARY KEY,
      chunk_key TEXT NOT NULL,
      type TEXT NOT NULL,
      level TEXT NOT NULL,
      prompt TEXT NOT NULL,
      choices_json TEXT,
      blocks_json TEXT,
      correct_answer_json TEXT NOT NULL,
      natural_sentence TEXT,
      explanation TEXT NOT NULL,
      source_item_ids_json TEXT NOT NULL,
      script_mode TEXT NOT NULL,
      kanji_used_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      model TEXT NOT NULL,
      times_shown INTEGER NOT NULL DEFAULT 0,
      times_correct INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS generated_practice_questions_chunk_status_idx
      ON generated_practice_questions(chunk_key, status);
    CREATE TABLE IF NOT EXISTS question_generation_jobs (
      id TEXT PRIMARY KEY,
      chunk_key TEXT NOT NULL,
      source_item_ids_json TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      model TEXT,
      attempt_count INTEGER NOT NULL DEFAULT 0,
      error TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS question_generation_jobs_chunk_status_idx
      ON question_generation_jobs(chunk_key, status);
  `);
}

export function parseStoredQuestion(row: StoredQuestionRow): GeneratedPracticeQuestion {
  return {
    id: row.id,
    type: row.type,
    level: row.level,
    prompt: row.prompt,
    choices: row.choices_json ? JSON.parse(row.choices_json) as string[] : undefined,
    blocks: row.blocks_json ? JSON.parse(row.blocks_json) as string[] : undefined,
    correctAnswer: JSON.parse(row.correct_answer_json) as string | string[],
    naturalSentence: row.natural_sentence ?? undefined,
    explanation: row.explanation,
    sourceItemIds: JSON.parse(row.source_item_ids_json) as string[],
    scriptMode: row.script_mode,
    kanjiUsed: JSON.parse(row.kanji_used_json) as string[],
  };
}

export function getLearnedKanji(sqlite: Database.Database) {
  const rows = sqlite.prepare(`
    SELECT learning_items.japanese
    FROM learning_items
    JOIN user_item_progress ON user_item_progress.item_id = learning_items.id
    WHERE learning_items.type = 'kanji'
      AND user_item_progress.status IN ('learned', 'mastered')
  `).all() as Array<{ japanese: string }>;

  return [...new Set(rows.flatMap((row) => row.japanese.match(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/gu) ?? []))];
}

export function getReadyGeneratedQuestions(sqlite: Database.Database, sourceItemIds: string[], allowedKanji: string[], limit = 12) {
  ensureGeneratedQuestionTables(sqlite);
  const rows = sqlite.prepare(`
    SELECT id, type, level, prompt, choices_json, blocks_json, correct_answer_json,
      natural_sentence, explanation, source_item_ids_json, script_mode, kanji_used_json
    FROM generated_practice_questions
    WHERE status = 'active'
    ORDER BY times_shown ASC, created_at DESC
    LIMIT 80
  `).all() as StoredQuestionRow[];

  const sourceSet = new Set(sourceItemIds);
  const kanjiSet = new Set(allowedKanji);
  return rows
    .map(parseStoredQuestion)
    .filter((question) => question.sourceItemIds.some((id) => sourceSet.has(id)))
    .filter((question) => question.kanjiUsed.every((kanji) => kanjiSet.has(kanji)))
    .slice(0, limit);
}

export function markGeneratedQuestionShown(questionId: string, isCorrect: boolean) {
  const sqlite = new Database("local.db");
  try {
    ensureGeneratedQuestionTables(sqlite);
    sqlite.prepare(`
      UPDATE generated_practice_questions
      SET times_shown = times_shown + 1,
        times_correct = times_correct + ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(isCorrect ? 1 : 0, questionId);
  } finally {
    sqlite.close();
  }
}
