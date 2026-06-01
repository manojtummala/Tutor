"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, PlayCircle, Sparkles, X } from "lucide-react";
import { KanaLearnSpotlight } from "@/components/learn/kana-learn-spotlight";
import { KanaPracticeSession } from "@/components/practice/kana-practice-session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  return (
    <Card
      className={`rounded-md bg-white/90 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${selected ? "border-primary ring-2 ring-primary/25" : ""} ${selectionMode ? "cursor-pointer" : ""}`}
      onClick={selectionMode ? onToggle : undefined}
    >
      <CardContent className="grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{lesson.title}</h3>
            <Badge variant={lesson.isUnlocked ? "secondary" : "outline"}>{lesson.items.length} kana</Badge>
            {selected ? <Badge><CheckCircle2 className="size-3" /> Selected</Badge> : null}
          </div>
          <p className="text-sm text-muted-foreground">{lesson.description}</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Button
            onClick={(event) => {
              event.stopPropagation();
              onStart();
            }}
          >
            <PlayCircle className="size-4" />
            Start
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function KanaLearnClient({ hiraganaLessons, katakanaLessons, specialLessons }: { hiraganaLessons: LessonWithItems[]; katakanaLessons: LessonWithItems[]; specialLessons: LessonWithItems[] }) {
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [practiceStarted, setPracticeStarted] = useState(false);
  const [spotlight, setSpotlight] = useState<{ title: string; items: LearningItem[] } | null>(null);

  const allLessons = useMemo(() => [...hiraganaLessons, ...katakanaLessons, ...specialLessons], [hiraganaLessons, katakanaLessons, specialLessons]);
  const selectedItems = useMemo(
    () => allLessons.filter((lesson) => selectedLessonIds.includes(lesson.id)).flatMap((lesson) => lesson.items),
    [allLessons, selectedLessonIds],
  );

  function toggleLesson(lessonId: string) {
    if (!selectionMode) {
      return;
    }

    setSelectedLessonIds((current) => current.includes(lessonId) ? current.filter((id) => id !== lessonId) : [...current, lessonId]);
    setPracticeStarted(false);
  }

  function cancelPracticeSelection() {
    setSelectedLessonIds([]);
    setSelectionMode(false);
    setPracticeStarted(false);
  }

  function startPractice() {
    if (selectedLessonIds.length === 0) {
      return;
    }

    setSelectionMode(false);
    setPracticeStarted(true);
  }

  function renderLessons(lessons: LessonWithItems[]) {
    return (
      <div className="space-y-3">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            selected={selectedLessonIds.includes(lesson.id)}
            selectionMode={selectionMode}
            onToggle={() => toggleLesson(lesson.id)}
            onStart={() => setSpotlight({ title: lesson.title, items: lesson.items })}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge className="mb-3 rounded-md bg-accent text-accent-foreground hover:bg-accent">Beginner module</Badge>
            <h1 className="text-3xl font-semibold">Kana Foundations</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">Learn each kana first, then practice selected rows with scored typing.</p>
          </div>
          <Card className="w-full rounded-md bg-white/90 shadow-sm lg:max-w-md">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                <p className="font-semibold">Practice rows</p>
              </div>
              {selectionMode ? (
                <>
                  <p className="text-sm text-muted-foreground">Click any lesson row below to include it in the practice session.</p>
                  <p className="text-sm font-medium">{selectedLessonIds.length} rows selected · {selectedItems.length} kana</p>
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
                  <p className="text-sm text-muted-foreground">Choose rows from the current page, then start a scored romaji practice session.</p>
                  <Button onClick={() => {
                    setSelectionMode(true);
                    setPracticeStarted(false);
                  }}>
                    Select rows to practice
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </section>

        <Tabs defaultValue="hiragana" className="space-y-5">
          <div className="flex justify-center">
            <TabsList className="h-12 rounded-md p-1">
              <TabsTrigger value="hiragana" className="px-8 py-2 text-base">Hiragana</TabsTrigger>
              <TabsTrigger value="katakana" className="px-8 py-2 text-base">Katakana</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="hiragana" className="space-y-4">
            {renderLessons(hiraganaLessons)}
          </TabsContent>
          <TabsContent value="katakana" className="space-y-4">
            {renderLessons(katakanaLessons)}
          </TabsContent>
        </Tabs>

        <section className="space-y-3">
          <div>
            <h2 className="text-xl font-semibold">Shared Kana Skills</h2>
            <p className="text-sm text-muted-foreground">Use these after the core rows feel familiar.</p>
          </div>
          {renderLessons(specialLessons)}
        </section>

        {practiceStarted ? <KanaPracticeSession key={selectedLessonIds.join(",")} items={selectedItems} /> : null}
      </div>

      <KanaLearnSpotlight
        key={spotlight?.title ?? "closed"}
        title={spotlight?.title ?? ""}
        items={spotlight?.items ?? []}
        open={Boolean(spotlight)}
        onClose={() => setSpotlight(null)}
      />
    </>
  );
}
