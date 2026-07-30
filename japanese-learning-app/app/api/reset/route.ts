import { NextResponse } from "next/server";
import Database from "better-sqlite3";

export const runtime = "nodejs";

export async function POST() {
  const sqlite = new Database("local.db");

  try {
    sqlite.exec(`
      DELETE FROM practice_attempts;
      DELETE FROM user_item_progress;
      DELETE FROM daily_stats;
      UPDATE streaks SET current_streak = 0, last_active_date = NULL;
    `);

    return NextResponse.json({ ok: true });
  } finally {
    sqlite.close();
  }
}
