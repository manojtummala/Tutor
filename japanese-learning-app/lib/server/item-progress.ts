import Database from "better-sqlite3";
import type { KanaProgress, KanaProgressStatus } from "@/lib/content/types";

type ProgressRow = {
  item_id: string;
  status: KanaProgressStatus;
  introduced_at: string | null;
  correct_attempt_count: number;
  practice_attempt_count: number;
  target_correct_attempts: number;
  learned_at: string | null;
};

export function getProgressMap(itemIds: string[]) {
  if (itemIds.length === 0) {
    return new Map<string, KanaProgress>();
  }

  const sqlite = new Database("local.db", { readonly: true });
  try {
    const placeholders = itemIds.map(() => "?").join(",");
    const rows = sqlite
      .prepare(`SELECT item_id, status, introduced_at, correct_attempt_count, practice_attempt_count, target_correct_attempts, learned_at FROM user_item_progress WHERE item_id IN (${placeholders})`)
      .all(...itemIds) as ProgressRow[];

    return new Map<string, KanaProgress>(rows.map((row) => [row.item_id, {
      itemId: row.item_id,
      status: row.status,
      introducedAt: row.introduced_at,
      correctAttemptCount: row.correct_attempt_count,
      practiceAttemptCount: row.practice_attempt_count,
      targetCorrectAttempts: row.target_correct_attempts,
      learnedAt: row.learned_at,
    }]));
  } catch {
    return new Map<string, KanaProgress>();
  } finally {
    sqlite.close();
  }
}
