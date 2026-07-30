"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LearningItem } from "@/lib/content/types";

type N5ItemCardsProps = {
  title: string;
  items: LearningItem[];
  open: boolean;
  onClose: () => void;
};

export function N5ItemCards({ title, items, open, onClose }: N5ItemCardsProps) {
  const [index, setIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const item = items[index];

  const isLast = index === items.length - 1;
  const canGoPrevious = index > 0;
  const canGoNext = index < items.length - 1;

  async function closeAndPersist() {
    setSaving(true);
    const introducedIds = items.map((entry) => entry.id);
    if (introducedIds.length > 0) {
      await fetch("/api/items/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "introduce", itemIds: introducedIds }),
      });
    }
    onClose();
  }

  if (!open || !item) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-lg border bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <p className="text-sm text-muted-foreground">Learning</p>
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            disabled={saving}
            onClick={() => void closeAndPersist()}
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="space-y-6 p-6">
          <div className="relative overflow-hidden rounded-lg border bg-white p-6 text-center shadow-sm">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{item.type}</p>
            <p className="text-5xl font-semibold leading-tight sm:text-6xl">{item.japanese}</p>
            <p className="mt-3 text-xl font-semibold">{item.romaji ?? item.reading}</p>
            <p className="mt-1 text-base text-muted-foreground">{item.meaning}</p>
            {item.explanation ? (
              <p className="mt-4 text-left text-sm leading-relaxed text-muted-foreground">{item.explanation}</p>
            ) : null}
            {item.type === "grammar" && item.metadata?.examples ? (
              <div className="mt-4 space-y-3 text-left">
                {(item.metadata.examples as Array<{ ja: string; kana: string; en: string }>).map((ex, i) => (
                  <div key={i} className="rounded-md bg-secondary/50 p-3">
                    <p className="font-medium">{ex.ja}</p>
                    <p className="text-sm text-muted-foreground">{ex.kana}</p>
                    <p className="text-sm text-muted-foreground">{ex.en}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="flex items-center justify-between gap-3">
            <Button variant="secondary" disabled={!canGoPrevious || saving} onClick={() => setIndex((value) => Math.max(0, value - 1))}>
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <p className="text-sm text-muted-foreground">{index + 1} / {items.length}</p>
            {isLast ? (
              <Button disabled={saving} onClick={() => void closeAndPersist()}>
                {saving ? "Saving..." : "Done"}
              </Button>
            ) : (
              <Button disabled={!canGoNext || saving} onClick={() => setIndex((value) => Math.min(items.length - 1, value + 1))}>
                Next
                <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
