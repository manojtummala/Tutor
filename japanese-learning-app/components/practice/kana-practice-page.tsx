"use client";

import { useEffect, useState } from "react";
import { GeneratedPracticeSession } from "@/components/practice/generated-practice-session";
import { KanaPracticeSession } from "@/components/practice/kana-practice-session";
import type { KanaProgressStatus, LearningItem } from "@/lib/content/types";
import type { GeneratedPracticeQuestion } from "@/lib/practice/generated-practice-types";

type PracticeItem = LearningItem & {
  status?: KanaProgressStatus;
  correctAttemptCount?: number;
  targetCorrectAttempts?: number;
};

export function KanaPracticePage({
  initialItems = [],
  initialGeneratedQuestions = [],
  isCustomSession = false,
}: {
  initialItems?: PracticeItem[];
  initialGeneratedQuestions?: GeneratedPracticeQuestion[];
  isCustomSession?: boolean;
}) {
  const [items, setItems] = useState<PracticeItem[]>(initialItems);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedPracticeQuestion[]>(initialGeneratedQuestions);
  const [isLoading, setIsLoading] = useState(!isCustomSession);

  useEffect(() => {
    if (isCustomSession) {
      return;
    }

    let alive = true;

    async function loadItems() {
      const response = await fetch("/api/review");
      if (!response.ok) {
        setIsLoading(false);
        return;
      }

      const data = await response.json() as { items: PracticeItem[]; generatedQuestions?: GeneratedPracticeQuestion[] };
      if (alive) {
        setItems(data.items);
        setGeneratedQuestions(data.generatedQuestions ?? []);
        setIsLoading(false);
      }
    }

    void loadItems();

    return () => {
      alive = false;
    };
  }, [isCustomSession]);

  if (isLoading) {
    return <div className="rounded-md border bg-white/90 p-5 text-sm text-muted-foreground">Loading practice queue...</div>;
  }

  if (generatedQuestions.length > 0) {
    return (
      <GeneratedPracticeSession
        questions={generatedQuestions}
        onRestart={() => setGeneratedQuestions([])}
        onAnswer={(questionId, isCorrect) => {
          void fetch("/api/practice/generated-attempt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questionId, isCorrect }),
          });
        }}
      />
    );
  }

  return (
    <KanaPracticeSession
      items={items}
      emptyText={isCustomSession ? "No kana were found for the selected rows." : "You have mastered all you have learned."}
      completionHref="/practice"
    />
  );
}
