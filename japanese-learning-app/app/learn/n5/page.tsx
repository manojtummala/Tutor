import Database from "better-sqlite3";
import { AppShell } from "@/components/layout/app-shell";
import { N5LearnClient } from "@/components/learn/n5-learn-client";
import { getLessonsForModule } from "@/lib/content/data";
import type { LessonWithItems } from "@/lib/content/types";

export default function N5Page() {
  const sqlite = new Database("local.db", { readonly: true });
  let lessons: LessonWithItems[];

  try {
    lessons = getLessonsForModule("jlpt-n5");

    const progressRows = sqlite.prepare(`
      SELECT item_id, status FROM user_item_progress
    `).all() as Array<{ item_id: string; status: string }>;

    const progressMap = new Map(progressRows.map((r) => [r.item_id, r.status]));

    lessons = lessons.map((lesson) => {
      const progressedItems = lesson.items.filter((item) => {
        const status = progressMap.get(item.id);
        return status && status !== "new";
      });
      const completion = lesson.items.length > 0
        ? Math.round((progressedItems.length / lesson.items.length) * 100)
        : 0;

      return { ...lesson, completion };
    });
  } finally {
    sqlite.close();
  }

  return (
    <AppShell>
      <N5LearnClient lessons={lessons} />
    </AppShell>
  );
}
