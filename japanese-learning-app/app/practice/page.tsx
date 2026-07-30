import Database from "better-sqlite3";
import { Brain } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { KanaPracticePage } from "@/components/practice/kana-practice-page";
import { getItemsForLesson } from "@/lib/content/data";
import { ensureGeneratedQuestionTables, getLearnedKanji, getReadyGeneratedQuestions } from "@/lib/server/generated-question-store";
import type { GeneratedPracticeQuestion } from "@/lib/practice/generated-practice-types";

type PracticePageProps = {
  searchParams?: Promise<{
    lessonIds?: string | string[];
  }>;
};

function parseLessonIds(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value.join(",") : value;
  return [...new Set((rawValue ?? "").split(",").map((id) => id.trim()).filter(Boolean))];
}

export default async function PracticePage({ searchParams }: PracticePageProps) {
  const params = await searchParams;
  const lessonIds = parseLessonIds(params?.lessonIds);
  const selectedItems = lessonIds.flatMap(getItemsForLesson).filter((item) => item.type === "kana");
  const sqlite = new Database("local.db");
  let generatedQuestions: GeneratedPracticeQuestion[] = [];

  try {
    ensureGeneratedQuestionTables(sqlite);
    generatedQuestions = getReadyGeneratedQuestions(sqlite, selectedItems.map((item) => item.id), getLearnedKanji(sqlite));
  } finally {
    sqlite.close();
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Brain className="size-5" />
          </div>
          <h1 className="text-3xl font-semibold">Practice</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Start immediately with ready questions from your current learning queue.</p>
        </div>
        <KanaPracticePage
          initialItems={selectedItems}
          initialGeneratedQuestions={generatedQuestions}
          isCustomSession={lessonIds.length > 0}
        />
      </div>
    </AppShell>
  );
}
