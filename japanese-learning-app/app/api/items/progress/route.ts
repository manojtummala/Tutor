import { NextResponse } from "next/server";
import Database from "better-sqlite3";
import { learningItems } from "@/lib/content/data";
import { queueQuestionGenerationIfNeeded } from "@/lib/server/question-generation";

export const runtime = "nodejs";

function openDb() {
  return new Database("local.db");
}

export async function POST(request: Request) {
  const body = await request.json() as {
    action: "introduce";
    itemIds: string[];
  };

  if (body.action !== "introduce") {
    return NextResponse.json({ error: "Only 'introduce' action is supported" }, { status: 400 });
  }

  const ids = [...new Set(body.itemIds)].filter(Boolean);
  const validIds = new Set(learningItems.map((item) => item.id));
  const validItems = ids.filter((id) => validIds.has(id));

  if (validItems.length === 0) {
    return NextResponse.json({ error: "No valid item IDs provided" }, { status: 400 });
  }

  const sqlite = openDb();

  try {
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

      validItems.forEach((id) => update.run(now, 5, id));
    })();

    const generation = queueQuestionGenerationIfNeeded(validItems);
    return NextResponse.json({ introduced: validItems.length, generation });
  } finally {
    sqlite.close();
  }
}
