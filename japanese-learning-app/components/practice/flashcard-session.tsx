"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { SpeakerButton } from "@/components/audio/speaker-button";
import { StatusBadge } from "@/components/practice/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ItemStatus, LearningItem } from "@/lib/content/types";
import type { ReviewRating } from "@/lib/srs";

type PracticeItem = LearningItem & {
  status?: ItemStatus;
};

type FlashcardSessionProps = {
  items: PracticeItem[];
  title?: string;
  emptyText?: string;
  onRated?: (itemId: string, status: ItemStatus) => void;
};

const ratings: { value: ReviewRating; label: string; helper: string }[] = [
  { value: "again", label: "Again", helper: "5 min" },
  { value: "hard", label: "Hard", helper: "1 day" },
  { value: "good", label: "Good", helper: "3 days" },
  { value: "easy", label: "Easy", helper: "7 days" },
];

export function FlashcardSession({ items, title = "Flashcards", emptyText = "No cards available.", onRated }: FlashcardSessionProps) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sessionItems, setSessionItems] = useState(items);
  const [completed, setCompleted] = useState(0);

  const item = sessionItems[index];
  const progress = useMemo(() => {
    if (sessionItems.length === 0) {
      return 0;
    }

    return Math.round((completed / sessionItems.length) * 100);
  }, [completed, sessionItems.length]);

  async function rate(rating: ReviewRating) {
    if (!item || isSaving) {
      return;
    }

    setIsSaving(true);
    const answer = item.romaji ?? item.reading ?? item.meaning;

    const response = await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemId: item.id,
        rating,
        practiceType: "flashcard",
        prompt: item.japanese,
        correctAnswer: answer,
        userAnswer: rating,
      }),
    });

    if (response.ok) {
      const result = await response.json() as { itemId: string; status: ItemStatus };
      setSessionItems((current) => current.map((entry) => entry.id === result.itemId ? { ...entry, status: result.status } : entry));
      onRated?.(result.itemId, result.status);
      setCompleted((value) => value + 1);
      setRevealed(false);
      setIndex((value) => Math.min(value + 1, sessionItems.length));
    }

    setIsSaving(false);
  }

  if (sessionItems.length === 0) {
    return (
      <Card className="rounded-md bg-white/90">
        <CardContent className="p-6 text-sm text-muted-foreground">{emptyText}</CardContent>
      </Card>
    );
  }

  if (!item) {
    return (
      <Card className="rounded-md bg-white/90">
        <CardContent className="space-y-4 p-6">
          <CheckCircle2 className="size-8 text-primary" />
          <div>
            <p className="text-xl font-semibold">Session complete</p>
            <p className="text-sm text-muted-foreground">Reviewed {completed} cards.</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              setIndex(0);
              setCompleted(0);
              setRevealed(false);
            }}
          >
            <RotateCcw className="size-4" />
            Restart
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-md bg-white/90">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-2">
            <StatusBadge status={item.status} />
            <span className="text-sm text-muted-foreground">{index + 1} / {sessionItems.length}</span>
          </div>
        </div>
        <Progress value={progress} />
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="relative flex min-h-56 items-center justify-center rounded-md border bg-muted/55 p-6">
          <div className="absolute right-3 top-3">
            <SpeakerButton audioSrc={item.audioSrc} text={item.japanese} />
          </div>
          <div className="text-center">
            <p className="text-7xl font-semibold leading-none">{item.japanese}</p>
            <p className="mt-4 text-sm text-muted-foreground">Recall the reading, then reveal.</p>
          </div>
        </div>

        {revealed ? (
          <div className="space-y-4">
            <div className="rounded-md border bg-white p-4">
              <p className="text-sm text-muted-foreground">Answer</p>
              <p className="text-2xl font-semibold">{item.romaji ?? item.reading}</p>
              <p className="text-sm text-muted-foreground">{item.meaning}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ratings.map((rating) => (
                <Button key={rating.value} variant={rating.value === "good" ? "default" : "secondary"} disabled={isSaving} onClick={() => void rate(rating.value)}>
                  <span>{rating.label}</span>
                  <span className="text-xs opacity-70">{rating.helper}</span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <Button className="w-full" onClick={() => setRevealed(true)}>Reveal answer</Button>
        )}
      </CardContent>
    </Card>
  );
}
