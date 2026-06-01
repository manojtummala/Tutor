"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Layers, MousePointer2, Shuffle, XCircle } from "lucide-react";
import { SpeakerButton } from "@/components/audio/speaker-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { KanaProgressStatus, LearningItem, PracticeType } from "@/lib/content/types";

type PracticeItem = LearningItem & {
  status?: KanaProgressStatus;
  correctAttemptCount?: number;
  targetCorrectAttempts?: number;
};

type QuestionMode = Exclude<PracticeType, "flashcard" | "fill_blank">;

type PracticeQuestion = {
  id: string;
  mode: QuestionMode;
  item: PracticeItem;
  prompt: string;
  correctAnswer: string;
  choices?: string[];
  matchItems?: PracticeItem[];
  retried?: boolean;
};

const maxQuestions = 12;
const modes: QuestionMode[] = ["multiple_choice", "type_answer", "audio_recognition", "match_pairs", "sentence_reorder"];

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function answerFor(item: PracticeItem) {
  return item.romaji ?? item.reading ?? "";
}

function distractors(items: PracticeItem[], item: PracticeItem) {
  return [...new Set(shuffle(items.filter((candidate) => candidate.id !== item.id))
    .map((candidate) => answerFor(candidate))
    .filter(Boolean))]
    .slice(0, 3);
}

function createQuestion(item: PracticeItem, items: PracticeItem[], index: number): PracticeQuestion {
  const mode = modes[index % modes.length];
  const correctAnswer = answerFor(item);

  if (mode === "multiple_choice") {
    return {
      id: `${item.id}-${mode}-${index}`,
      mode,
      item,
      prompt: `Choose the romaji for ${item.japanese}`,
      correctAnswer,
      choices: shuffle([correctAnswer, ...distractors(items, item)]),
    };
  }

  if (mode === "sentence_reorder") {
    const answer = item.romaji ?? item.reading ?? "";
    return {
      id: `${item.id}-${mode}-${index}`,
      mode,
      item,
      prompt: `Build the reading for ${item.japanese}`,
      correctAnswer: answer,
      choices: shuffle(answer.split("")),
    };
  }

  if (mode === "audio_recognition") {
    return {
      id: `${item.id}-${mode}-${index}`,
      mode,
      item,
      prompt: "Listen and type the romaji.",
      correctAnswer,
    };
  }

  if (mode === "match_pairs") {
    const matchItems = shuffle([item, ...shuffle(items.filter((candidate) => candidate.id !== item.id)).slice(0, 4)]).slice(0, Math.min(5, items.length));
    return {
      id: `${item.id}-${mode}-${index}`,
      mode,
      item,
      prompt: "Match each kana to its reading.",
      correctAnswer: matchItems.map((matchItem) => `${matchItem.japanese}=${answerFor(matchItem)}`).join(","),
      matchItems,
    };
  }

  return {
    id: `${item.id}-${mode}-${index}`,
    mode,
    item,
    prompt: `Type the romaji for ${item.japanese}`,
    correctAnswer,
  };
}

function createSession(items: PracticeItem[]) {
  return shuffle(items)
    .slice(0, Math.min(maxQuestions, Math.max(items.length, 1) * 2))
    .map((item, index) => createQuestion(item, items, index));
}

async function persistAttempt(question: PracticeQuestion, userAnswer: string, isCorrect: boolean) {
  await fetch("/api/kana/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "practice",
      itemId: question.item.id,
      practiceType: question.mode,
      prompt: question.prompt,
      correctAnswer: question.correctAnswer,
      userAnswer,
      isCorrect,
    }),
  });
}

function modeLabel(mode: QuestionMode) {
  return {
    multiple_choice: "Multiple choice",
    match_pairs: "Match pairs",
    type_answer: "Type answer",
    audio_recognition: "Audio",
    sentence_reorder: "Reorder",
  }[mode];
}

export function KanaPracticeSession({ items, emptyText = "Select one or more lessons above to start scored kana practice." }: { items: PracticeItem[]; emptyText?: string }) {
  const [questions, setQuestions] = useState<PracticeQuestion[]>(() => createSession(items));
  const [index, setIndex] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [reorderAnswer, setReorderAnswer] = useState<string[]>([]);
  const [reorderChoices, setReorderChoices] = useState<string[] | null>(null);
  const [selectedKanaId, setSelectedKanaId] = useState<string | null>(null);
  const [selectedReadingId, setSelectedReadingId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [score, setScore] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const question = questions[index];
  const progress = questions.length > 0 ? Math.round((index / questions.length) * 100) : 0;
  const matchItems = useMemo(() => question?.matchItems ?? [], [question]);
  const shuffledReadings = useMemo(() => shuffle(matchItems), [matchItems]);
  const currentReorderChoices = reorderChoices ?? question?.choices ?? [];

  function moveNext() {
    setTypedAnswer("");
    setSelectedChoice(null);
    setReorderAnswer([]);
    setReorderChoices(null);
    setSelectedKanaId(null);
    setSelectedReadingId(null);
    setMatchedIds([]);
    setFeedback(null);
    setIndex((value) => value + 1);
    setIsSaving(false);
  }

  async function resolve(questionToResolve: PracticeQuestion, userAnswer: string, isCorrect: boolean) {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setFeedback(isCorrect ? "correct" : "incorrect");
    await persistAttempt(questionToResolve, userAnswer, isCorrect);

    if (isCorrect) {
      setScore((value) => value + 1);
    } else if (!questionToResolve.retried) {
      setQuestions((current) => [...current, { ...questionToResolve, id: `${questionToResolve.id}-retry`, retried: true }]);
    }

    window.setTimeout(moveNext, isCorrect ? 700 : 1300);
  }

  async function submitTypedAnswer(value = typedAnswer) {
    if (!question || !value) {
      return;
    }

    await resolve(question, value, normalize(value) === normalize(question.correctAnswer));
  }

  async function selectChoice(choice: string) {
    if (!question || feedback) {
      return;
    }

    setSelectedChoice(choice);
    await resolve(question, choice, normalize(choice) === normalize(question.correctAnswer));
  }

  async function chooseReorderPart(part: string, partIndex: number) {
    if (!question || feedback) {
      return;
    }

    const nextAnswerParts = [...reorderAnswer, part];
    const nextChoices = currentReorderChoices.filter((_, index) => index !== partIndex);
    const nextAnswer = nextAnswerParts.join("");
    setReorderAnswer(nextAnswerParts);
    setReorderChoices(nextChoices);

    if (nextAnswerParts.length >= question.correctAnswer.length) {
      await resolve(question, nextAnswer, normalize(nextAnswer) === normalize(question.correctAnswer));
    }
  }

  async function judgeMatch(nextKanaId: string | null, nextReadingId: string | null) {
    if (!question || !nextKanaId || !nextReadingId) {
      return;
    }

    const isCorrect = nextKanaId === nextReadingId;

    if (isCorrect) {
      const next = [...matchedIds, nextKanaId];
      setMatchedIds(next);
      setSelectedKanaId(null);
      setSelectedReadingId(null);

      if (next.length === matchItems.length) {
        await resolve(question, `matched ${next.length} pairs`, true);
      }
      return;
    }

    setFeedback("incorrect");
    if (!question.retried) {
      setQuestions((current) => [...current, { ...question, id: `${question.id}-retry`, retried: true }]);
    }
    await persistAttempt(question, `${nextKanaId}:${nextReadingId}`, false);
    window.setTimeout(moveNext, 1200);
  }

  function selectKanaForMatch(itemId: string) {
    if (feedback || matchedIds.includes(itemId)) {
      return;
    }

    setSelectedKanaId(itemId);
    void judgeMatch(itemId, selectedReadingId);
  }

  function selectReadingForMatch(itemId: string) {
    if (feedback || matchedIds.includes(itemId)) {
      return;
    }

    setSelectedReadingId(itemId);
    void judgeMatch(selectedKanaId, itemId);
  }

  if (items.length === 0) {
    return <Card className="rounded-md bg-white/90"><CardContent className="p-5 text-sm text-muted-foreground">{emptyText}</CardContent></Card>;
  }

  if (!question) {
    return (
      <Card className="rounded-md bg-white/90">
        <CardContent className="space-y-3 p-6">
          <CheckCircle2 className="size-8 text-primary" />
          <p className="text-xl font-semibold">Practice complete</p>
          <p className="text-sm text-muted-foreground">Score: {score} / {questions.length}. Missed questions were added back once during the session.</p>
          <Button onClick={() => {
            setQuestions(createSession(items));
            setIndex(0);
            setScore(0);
            moveNext();
          }}>
            Start again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-md bg-white/95 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2"><Shuffle className="size-5" /> Mixed Practice</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{modeLabel(question.mode)}</span>
            <span>{index + 1} / {questions.length}</span>
          </div>
        </div>
        <Progress value={progress} />
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="relative flex min-h-56 items-center justify-center rounded-md border bg-muted/60 p-5 text-center">
          <div className="absolute right-3 top-3">
            <SpeakerButton audioSrc={question.item.audioSrc} text={question.item.japanese} />
          </div>
          {question.mode === "audio_recognition" ? (
            <div className="flex flex-col items-center gap-4">
              <SpeakerButton audioSrc={question.item.audioSrc} text={question.item.japanese} className="size-16" />
              <p className="text-sm text-muted-foreground">Replay the sound</p>
            </div>
          ) : (
            <p className="text-7xl font-semibold">{question.item.japanese}</p>
          )}
        </div>
        <div className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">{question.prompt}</p>
          {question.mode === "sentence_reorder" ? <p className="min-h-10 rounded-md border bg-muted/50 px-3 py-2 text-xl font-semibold">{reorderAnswer.join("") || "Pick blocks below"}</p> : null}

          {question.mode === "multiple_choice" ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {question.choices?.map((choice) => {
                const picked = selectedChoice === choice;
                const correct = normalize(choice) === normalize(question.correctAnswer);
                return (
                  <Button key={choice} variant={picked ? (correct ? "default" : "destructive") : "secondary"} onClick={() => void selectChoice(choice)} disabled={Boolean(feedback)}>
                    <MousePointer2 className="size-4" />
                    {choice}
                  </Button>
                );
              })}
            </div>
          ) : null}

          {question.mode === "type_answer" || question.mode === "audio_recognition" ? (
            <div className="space-y-3">
              <input
                value={typedAnswer}
                onChange={(event) => {
                  const value = event.target.value;
                  setTypedAnswer(value);
                  if (normalize(value) === normalize(question.correctAnswer)) {
                    void submitTypedAnswer(value);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    void submitTypedAnswer();
                  }
                }}
                className="h-11 w-full rounded-md border bg-white px-3 text-lg outline-none ring-ring transition focus:ring-2"
                placeholder="Type the answer"
                disabled={isSaving}
              />
              <Button onClick={() => void submitTypedAnswer()} disabled={!typedAnswer || isSaving}>Check</Button>
            </div>
          ) : null}

          {question.mode === "sentence_reorder" ? (
            <div className="flex flex-wrap gap-2">
              {currentReorderChoices.map((part, partIndex) => (
                <Button key={`${part}-${partIndex}`} variant="secondary" disabled={Boolean(feedback)} onClick={() => void chooseReorderPart(part, partIndex)}>
                  <Layers className="size-4" />
                  {part}
                </Button>
              ))}
            </div>
          ) : null}

          {question.mode === "match_pairs" ? (
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase text-muted-foreground">Japanese</p>
                {matchItems.map((matchItem) => (
                  <Button key={matchItem.id} variant={matchedIds.includes(matchItem.id) || selectedKanaId === matchItem.id ? "default" : "secondary"} disabled={matchedIds.includes(matchItem.id) || Boolean(feedback)} onClick={() => selectKanaForMatch(matchItem.id)} className="h-12 w-full text-2xl">
                    {matchItem.japanese}
                  </Button>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase text-muted-foreground">Romaji</p>
                {shuffledReadings.map((matchItem) => (
                  <Button key={matchItem.id} variant={matchedIds.includes(matchItem.id) || selectedReadingId === matchItem.id ? "default" : "secondary"} disabled={matchedIds.includes(matchItem.id) || Boolean(feedback)} onClick={() => selectReadingForMatch(matchItem.id)} className="h-12 w-full">
                    {matchItem.romaji ?? matchItem.reading}
                  </Button>
                ))}
              </div>
            </div>
          ) : null}

          {feedback === "correct" ? <p className="flex items-center gap-2 text-sm font-medium text-primary"><CheckCircle2 className="size-4" /> Correct</p> : null}
          {feedback === "incorrect" ? <p className="flex items-center gap-2 text-sm font-medium text-destructive"><XCircle className="size-4" /> Answer: {question.correctAnswer}. This will come back once.</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
