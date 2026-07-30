import { NextResponse } from "next/server";
import Database from "better-sqlite3";
import { learningItems } from "@/lib/content/data";
import { queueQuestionGenerationIfNeeded } from "@/lib/server/question-generation";
import type { KanaProgressStatus, PracticeType } from "@/lib/content/types";

export const runtime = "nodejs";

const targetCorrectAttempts = 5;

function openDb() {
  return new Database("local.db");
}

function kanaItemIds(itemIds: string[]) {
  const validIds = new Set(learningItems.filter((item) => item.type === "kana").map((item) => item.id));
  return itemIds.filter((id) => validIds.has(id));
}

export async function POST(request: Request) {
  const body = await request.json() as {
    action?: "introduce" | "practice";
    itemIds?: string[];
    itemId?: string;
    prompt?: string;
    correctAnswer?: string;
    userAnswer?: string;
    isCorrect?: boolean;
    practiceType?: PracticeType;
  };

  const sqlite = openDb();

  try {
    if (body.action === "introduce") {
      const ids = kanaItemIds(body.itemIds ?? []);
      const now = new Date().toISOString();

      sqlite.transaction(() => {
        const update = sqlite.prepare(`
          UPDATE user_item_progress
          SET
            status = CASE WHEN status = 'new' THEN 'introduced' ELSE status END,
            introduced_at = COALESCE(introduced_at, ?),
            target_correct_attempts = COALESCE(target_correct_attempts, ?),
            updated_at = CURRENT_TIMESTAMP
          WHERE item_id = ?
        `);

        ids.forEach((id) => update.run(now, targetCorrectAttempts, id));
      })();

      const generation = queueQuestionGenerationIfNeeded(ids);
      return NextResponse.json({ introduced: ids.length, generation });
    }

    if (body.action === "practice") {
      if (!body.itemId) {
        return NextResponse.json({ error: "itemId is required" }, { status: 400 });
      }

      const item = learningItems.find((entry) => entry.id === body.itemId && entry.type === "kana");
      if (!item) {
        return NextResponse.json({ error: "Kana item not found" }, { status: 404 });
      }

      const current = sqlite.prepare(`
        SELECT correct_attempt_count, practice_attempt_count, target_correct_attempts
        FROM user_item_progress
        WHERE item_id = ?
      `).get(body.itemId) as { correct_attempt_count: number; practice_attempt_count: number; target_correct_attempts: number } | undefined;

      const nextPracticeCount = (current?.practice_attempt_count ?? 0) + 1;
      const nextCorrectCount = (current?.correct_attempt_count ?? 0) + (body.isCorrect ? 1 : 0);
      const target = current?.target_correct_attempts ?? targetCorrectAttempts;
      const status: KanaProgressStatus = nextCorrectCount >= target ? "learned" : "practicing";
      const now = new Date().toISOString();
      const learnedAt = status === "learned" ? now : null;

      sqlite.transaction(() => {
        sqlite.prepare(`
          INSERT INTO practice_attempts (
            id,
            item_id,
            practice_type,
            prompt,
            correct_answer,
            user_answer,
            is_correct,
            time_taken_ms
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          crypto.randomUUID(),
          body.itemId,
          body.practiceType ?? "type_answer",
          body.prompt ?? item.japanese,
          body.correctAnswer ?? item.romaji ?? item.reading ?? item.meaning,
          body.userAnswer ?? "",
          body.isCorrect ? 1 : 0,
          null,
        );

        sqlite.prepare(`
          UPDATE user_item_progress
          SET
            status = ?,
            introduced_at = COALESCE(introduced_at, ?),
            correct_attempt_count = ?,
            practice_attempt_count = ?,
            target_correct_attempts = ?,
            learned_at = COALESCE(learned_at, ?),
            updated_at = CURRENT_TIMESTAMP
          WHERE item_id = ?
        `).run(status, now, nextCorrectCount, nextPracticeCount, target, learnedAt, body.itemId);
      })();

      return NextResponse.json({
        itemId: body.itemId,
        isCorrect: Boolean(body.isCorrect),
        status,
        correctAttemptCount: nextCorrectCount,
        practiceAttemptCount: nextPracticeCount,
        targetCorrectAttempts: target,
      });
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } finally {
    sqlite.close();
  }
}
