"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { SpeakerButton } from "@/components/audio/speaker-button";
import { Button } from "@/components/ui/button";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import type { LearningItem } from "@/lib/content/types";

type KanaLearnSpotlightProps = {
  title: string;
  items: LearningItem[];
  open: boolean;
  onClose: () => void;
};

export function KanaLearnSpotlight({ title, items, open, onClose }: KanaLearnSpotlightProps) {
  const [index, setIndex] = useState(0);
  const { play } = useAudioPlayer();
  const item = items[index];

  const isLast = index === items.length - 1;
  const canGoPrevious = index > 0;
  const canGoNext = index < items.length - 1;
  useEffect(() => {
    if (!open || !item) {
      return;
    }

    window.setTimeout(() => {
      void play({ text: item.japanese });
    }, 250);
  }, [item, open, play]);

  async function closeAndPersist() {
    const introducedIds = items.map((entry) => entry.id);
    if (introducedIds.length > 0) {
      await fetch("/api/kana/progress", {
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
          <button type="button" aria-label="Close" className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => void closeAndPersist()}>
            <X className="size-5" />
          </button>
        </div>
        <div className="space-y-6 p-6">
          <div className="relative overflow-hidden rounded-lg border bg-white p-8 text-center shadow-sm">
            <div className="absolute right-4 top-4">
              <SpeakerButton audioSrc={item.audioSrc} text={item.japanese} />
            </div>
            <p className="text-8xl font-semibold leading-none sm:text-9xl">{item.japanese}</p>
            <p className="mt-5 text-3xl font-semibold">{item.romaji ?? item.reading}</p>
            <p className="mt-2 text-sm text-muted-foreground">{item.meaning}</p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <Button variant="secondary" disabled={!canGoPrevious} onClick={() => setIndex((value) => Math.max(0, value - 1))}>
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <p className="text-sm text-muted-foreground">{index + 1} / {items.length}</p>
            {isLast ? (
              <Button onClick={() => void closeAndPersist()}>Done</Button>
            ) : (
              <Button disabled={!canGoNext} onClick={() => setIndex((value) => Math.min(items.length - 1, value + 1))}>
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
