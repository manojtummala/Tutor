"use client";

import { useEffect, useState } from "react";
import { ChevronRight, RotateCcw } from "lucide-react";
import { SpeakerButton } from "@/components/audio/speaker-button";
import { StatusBadge } from "@/components/practice/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { KanaProgressStatus, LearningItem } from "@/lib/content/types";

type ReviewItem = LearningItem & {
  status?: KanaProgressStatus;
};

export function KanaReviewSession() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
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

  const item = items[index];

  if (isLoading) {
    return <Card className="rounded-md bg-white/90"><CardContent className="p-6 text-sm text-muted-foreground">Loading introduced kana...</CardContent></Card>;
  }

  if (!item) {
    return (
      <Card className="rounded-md bg-white/90">
        <CardContent className="space-y-3 p-6">
          <RotateCcw className="size-8 text-primary" />
          <p className="text-xl font-semibold">No introduced kana to review.</p>
          <p className="text-sm text-muted-foreground">Start a lesson in Learn first. Completed spotlight rows become available here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-md bg-white/95 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle>Flashcard Review</CardTitle>
        <div className="flex items-center gap-2">
          <StatusBadge status={item.status ?? "introduced"} />
          <span className="text-sm text-muted-foreground">{index + 1} / {items.length}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <button
          type="button"
          onClick={() => setIsFlipped((value) => !value)}
          className="group relative h-80 w-full rounded-lg outline-none [perspective:1200px]"
          aria-label="Flip review card"
        >
          <div className={`relative size-full rounded-lg transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}>
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg border bg-muted p-8 shadow-sm [backface-visibility:hidden]">
              <div className="absolute right-4 top-4">
                <SpeakerButton audioSrc={item.audioSrc} text={item.japanese} />
              </div>
              <p className="text-8xl font-semibold leading-none">{item.japanese}</p>
              <p className="mt-5 text-sm text-muted-foreground">Click to flip</p>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg border bg-white p-8 text-center shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <p className="text-4xl font-semibold">{item.romaji ?? item.reading}</p>
              <p className="mt-3 text-muted-foreground">{item.meaning}</p>
              <p className="mt-5 text-sm text-muted-foreground">Click to return</p>
            </div>
          </div>
        </button>
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setIsFlipped(false);
              setIndex((value) => value + 1);
            }}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
