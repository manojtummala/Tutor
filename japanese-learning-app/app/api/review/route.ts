import { NextResponse } from "next/server";
import Database from "better-sqlite3";
import { learningItems } from "@/lib/content/data";
import { ensureGeneratedQuestionTables, getLearnedKanji, getReadyGeneratedQuestions } from "@/lib/server/generated-question-store";
import type { KanaProgressStatus } from "@/lib/content/types";

export const runtime = "nodejs";

type ProgressRow = {
  item_id: string;
  status: KanaProgressStatus;
  correct_attempt_count: number;
  target_correct_attempts: number;
};

function openDb() {
  return new Database("local.db");
}

export async function GET() {
  const sqlite = openDb();

  try {
    ensureGeneratedQuestionTables(sqlite);
    const rows = sqlite.prepare(`
      SELECT item_id, status, correct_attempt_count, target_correct_attempts
      FROM user_item_progress
      WHERE status IN ('introduced', 'practicing')
      ORDER BY
        CASE status
          WHEN 'practicing' THEN 0
          WHEN 'introduced' THEN 1
          ELSE 3
        END,
        correct_attempt_count ASC
      LIMIT 40
    `).all() as ProgressRow[];

    const progressByItemId = new Map(rows.map((row) => [row.item_id, row]));
    const dueItems = learningItems
      .filter((item) => item.type === "kana" && progressByItemId.has(item.id))
      .map((item) => ({
        ...item,
        status: progressByItemId.get(item.id)?.status ?? "new",
        correctAttemptCount: progressByItemId.get(item.id)?.correct_attempt_count ?? 0,
        targetCorrectAttempts: progressByItemId.get(item.id)?.target_correct_attempts ?? 5,
      }));

    const learnedKanji = getLearnedKanji(sqlite);
    const generatedQuestions = getReadyGeneratedQuestions(sqlite, rows.map((row) => row.item_id), learnedKanji);

    return NextResponse.json({ items: dueItems, generatedQuestions });
  } finally {
    sqlite.close();
  }
}
