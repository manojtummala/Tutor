"use client";

import { useEffect, useState } from "react";
import { KanaPracticeSession } from "@/components/practice/kana-practice-session";
import type { KanaProgressStatus, LearningItem } from "@/lib/content/types";

type PracticeItem = LearningItem & {
  status?: KanaProgressStatus;
  correctAttemptCount?: number;
  targetCorrectAttempts?: number;
};

export function KanaPracticePage() {
  const [items, setItems] = useState<PracticeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadItems() {
      const response = await fetch("/api/review");
      if (!response.ok) {
        setIsLoading(false);
        return;
      }

      const data = await response.json() as { items: PracticeItem[] };
      if (alive) {
        setItems(data.items);
        setIsLoading(false);
      }
    }

    void loadItems();

    return () => {
      alive = false;
    };
  }, []);

  if (isLoading) {
    return <div className="rounded-md border bg-white/90 p-5 text-sm text-muted-foreground">Loading practice queue...</div>;
  }

  return <KanaPracticeSession items={items} emptyText="You have mastered all you have learned." />;
}
