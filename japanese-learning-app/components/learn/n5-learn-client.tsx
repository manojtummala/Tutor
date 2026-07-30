"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, CheckCircle2, PlayCircle, Sparkles, X } from "lucide-react";
import { N5ItemCards } from "@/components/learn/n5-item-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LearningItem, LessonWithItems } from "@/lib/content/types";

function LessonCard({
  lesson,
  selected,
  selectionMode,
  onToggle,
  onStart,
}: {
  lesson: LessonWithItems;
  selected: boolean;
  selectionMode: boolean;
  onToggle: () => void;
  onStart: () => void;
}) {
  const locked = !lesson.isUnlocked;
  const complete = lesson.completion >= 100;
  const Icon = locked ? BookOpen : complete ? CheckCircle2 : PlayCircle;

  const vocabCount = lesson.items.filter((i) => i.type === "vocab").length;
  const kanjiCount = lesson.items.filter((i) => i.type === "kanji").length;
  const grammarCount = lesson.items.filter((i) => i.type === "grammar").length;
  const sentenceCount = lesson.items.filter((i) => i.type === "sentence").length;
  const typeLabels: string[] = [
    ...(vocabCount > 0 ? [`${vocabCount} vocab`] : []),
    ...(kanjiCount > 0 ? [`${kanjiCount} kanji`] : []),
    ...(grammarCount > 0 ? [`${grammarCount} grammar`] : []),
    ...(sentenceCount > 0 ? [`${sentenceCount} sentences`] : []),
  ];

  return (
    <Card
      className={`rounded-2xl border-0 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${selected ? "ring-2 ring-primary/30" : ""} ${selectionMode ? "cursor-pointer" : ""}`}
      onClick={selectionMode ? onToggle : undefined}
    >
      <CardContent className="grid gap-4 p-4 sm:grid-cols-[44px_1fr_auto] sm:items-center">
        <span className="flex size-11 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{lesson.title}</h3>
            {typeLabels.map((label) => (
              <Badge key={label} variant="secondary">{label}</Badge>
            ))}
            {locked && <Badge variant="outline">Locked</Badge>}
            {selected ? <Badge><CheckCircle2 className="size-3" /> Selected</Badge> : null}
          </div>
          <p className="text-sm text-muted-foreground">{lesson.description}</p>
          <div className="mt-2 flex items-center gap-3">
            <Progress value={lesson.completion} className="h-2 max-w-32" />
            <span className="text-xs text-muted-foreground">{lesson.completion}%</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button
            size="sm"
            disabled={locked}
            onClick={(event) => {
              event.stopPropagation();
              onStart();
            }}
          >
            <PlayCircle className="size-4" />
            {complete ? "Review" : "Start"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function N5LearnClient({ lessons }: { lessons: LessonWithItems[] }) {
  const router = useRouter();
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [cardSequence, setCardSequence] = useState<{ title: string; items: LearningItem[] } | null>(null);

  const selectedItems = useMemo(
    () => lessons.filter((lesson) => selectedLessonIds.includes(lesson.id)).flatMap((lesson) => lesson.items),
    [lessons, selectedLessonIds],
  );

  function toggleLesson(lessonId: string) {
    if (!selectionMode) return;
    setSelectedLessonIds((current) => current.includes(lessonId) ? current.filter((id) => id !== lessonId) : [...current, lessonId]);
  }

  function cancelPracticeSelection() {
    setSelectedLessonIds([]);
    setSelectionMode(false);
  }

  function startPractice() {
    if (selectedItems.length === 0) return;
    const lessonIds = [...new Set(selectedItems.map((i) => i.lessonId))];
    const params = new URLSearchParams({ lessonIds: lessonIds.join(",") });
    router.push(`/practice?${params.toString()}`);
  }

  return (
    <>
      <div className="space-y-6">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge className="mb-3 rounded-md bg-accent text-accent-foreground hover:bg-accent">N5 module</Badge>
            <h1 className="text-3xl font-semibold">JLPT N5</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">Build vocabulary, learn kanji, master grammar patterns, and practice with sentences.</p>
          </div>
          <Card className="w-full rounded-md bg-white/90 shadow-sm lg:max-w-md">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                <p className="font-semibold">Practice items</p>
              </div>
              {selectionMode ? (
                <>
                  <p className="text-sm text-muted-foreground">Click any lesson below to include its items in the practice session.</p>
                  <p className="text-sm font-medium">{selectedLessonIds.length} lessons selected · {selectedItems.length} items</p>
                  <div className="flex flex-wrap gap-2">
                    <Button disabled={selectedLessonIds.length === 0} onClick={startPractice}>Start Practice</Button>
                    <Button variant="secondary" onClick={cancelPracticeSelection}>
                      <X className="size-4" />
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">Learn each lesson first, then practice with scored questions.</p>
                  <Button onClick={() => setSelectionMode(true)}>
                    Select lessons to practice
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </section>

        <div className="space-y-3">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              selected={selectedLessonIds.includes(lesson.id)}
              selectionMode={selectionMode}
              onToggle={() => toggleLesson(lesson.id)}
              onStart={() => setCardSequence({ title: lesson.title, items: lesson.items })}
            />
          ))}
        </div>
      </div>

      <N5ItemCards
        key={cardSequence?.title ?? "closed"}
        title={cardSequence?.title ?? ""}
        items={cardSequence?.items ?? []}
        open={Boolean(cardSequence)}
        onClose={() => setCardSequence(null)}
      />
    </>
  );
}
