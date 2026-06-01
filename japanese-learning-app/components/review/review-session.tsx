"use client";

import { useEffect, useState } from "react";
import { FlashcardSession } from "@/components/practice/flashcard-session";
import type { ItemStatus, LearningItem } from "@/lib/content/types";

type ReviewItem = LearningItem & {
  status?: ItemStatus;
  dueAt?: string | null;
};

export function ReviewSession() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadDueItems() {
      const response = await fetch("/api/review");
      if (!response.ok) {
        setIsLoading(false);
        return;
      }

      const data = await response.json() as { items: ReviewItem[] };
      if (alive) {
        setItems(data.items);
        setIsLoading(false);
      }
    }

    void loadDueItems();

    return () => {
      alive = false;
    };
  }, []);

  if (isLoading) {
    return <FlashcardSession items={[]} emptyText="Loading due reviews..." />;
  }

  return <FlashcardSession items={items} title="Due Reviews" emptyText="No due reviews right now." />;
}
