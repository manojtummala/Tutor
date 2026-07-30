"use client";

import { useState } from "react";
import { CheckCircle2, Layers, MousePointer2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { GeneratedPracticeQuestion } from "@/lib/practice/generated-practice-types";

function normalizeAnswer(value: string | string[]) {
  return Array.isArray(value) ? value.join("") : value.trim();
}

export function GeneratedPracticeSession({
  questions,
  onRestart,
  onAnswer,
}: {
  questions: GeneratedPracticeQuestion[];
  onRestart: () => void;
  onAnswer?: (questionId: string, isCorrect: boolean) => void;
}) {
  const [index, setIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [reorderAnswer, setReorderAnswer] = useState<string[]>([]);
  const [remainingBlocks, setRemainingBlocks] = useState<string[] | null>(null);
  const [selectedMatchBlock, setSelectedMatchBlock] = useState<string | null>(null);
  const [selectedMatchChoice, setSelectedMatchChoice] = useState<string | null>(null);
  const [matchedBlocks, setMatchedBlocks] = useState<string[]>([]);
  const [matchedChoices, setMatchedChoices] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [score, setScore] = useState(0);

  const question = questions[index];
  const progress = questions.length > 0 ? Math.round((index / questions.length) * 100) : 0;
  const currentBlocks = remainingBlocks ?? question?.blocks ?? [];

  function resetQuestionState() {
    setSelectedChoice(null);
    setTypedAnswer("");
    setReorderAnswer([]);
    setRemainingBlocks(null);
    setSelectedMatchBlock(null);
    setSelectedMatchChoice(null);
    setMatchedBlocks([]);
    setMatchedChoices([]);
    setFeedback(null);
  }

  function resolve(isCorrect: boolean) {
    setFeedback(isCorrect ? "correct" : "incorrect");
    if (question) {
      onAnswer?.(question.id, isCorrect);
    }
    if (isCorrect) {
      setScore((value) => value + 1);
    }
    window.setTimeout(() => {
      resetQuestionState();
      setIndex((value) => value + 1);
    }, isCorrect ? 850 : 1500);
  }

  function choose(choice: string) {
    if (!question || feedback) return;
    setSelectedChoice(choice);
    resolve(normalizeAnswer(question.correctAnswer) === choice);
  }

  function checkTyped(value = typedAnswer) {
    if (!question || !value) return;
    resolve(value.trim() === normalizeAnswer(question.correctAnswer));
  }

  function chooseBlock(block: string, blockIndex: number) {
    if (!question || feedback) return;

    const nextAnswer = [...reorderAnswer, block];
    const nextBlocks = currentBlocks.filter((_, index) => index !== blockIndex);
    setReorderAnswer(nextAnswer);
    setRemainingBlocks(nextBlocks);

    if (Array.isArray(question.correctAnswer) && nextAnswer.length >= question.correctAnswer.length) {
      resolve(nextAnswer.join("") === question.correctAnswer.join(""));
    }
  }

  function judgeMatch(block: string | null, choice: string | null) {
    if (!question || !block || !choice || feedback || !Array.isArray(question.correctAnswer)) return;
    const isCorrect = question.correctAnswer.includes(`${block}=${choice}`);
    setSelectedMatchBlock(null);
    setSelectedMatchChoice(null);

    if (!isCorrect) {
      resolve(false);
      return;
    }

    const next = [...matchedBlocks, block];
    setMatchedBlocks(next);
    setMatchedChoices((current) => [...current, choice]);
    if (next.length === (question.blocks?.length ?? 0)) {
      resolve(true);
    }
  }

  if (!question) {
    return (
      <Card className="rounded-md bg-white/90">
        <CardContent className="space-y-4 p-6">
          <CheckCircle2 className="size-8 text-primary" />
          <div>
            <p className="text-xl font-semibold">Generated questions complete</p>
            <p className="text-sm text-muted-foreground">Score: {score} / {questions.length}</p>
          </div>
          <Button onClick={onRestart}>Continue practice</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-md bg-white/95 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Practice</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{question.type.replace("_", " ")}</span>
            <span>{index + 1} / {questions.length}</span>
          </div>
        </div>
        <Progress value={progress} />
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-md border bg-muted/50 p-5">
          <p className="text-lg font-semibold">{question.prompt}</p>
          {question.naturalSentence ? <p className="mt-2 text-sm text-muted-foreground">{question.naturalSentence}</p> : null}
        </div>

        {question.type === "multiple_choice" || question.type === "fill_blank" ? (
          <div className="grid gap-2 sm:grid-cols-2">
            {question.choices?.map((choice) => {
              const picked = selectedChoice === choice;
              const correct = choice === question.correctAnswer;
              return (
                <Button key={choice} variant={picked ? (correct ? "default" : "destructive") : "secondary"} onClick={() => choose(choice)} disabled={Boolean(feedback)}>
                  <MousePointer2 className="size-4" />
                  {choice}
                </Button>
              );
            })}
          </div>
        ) : null}

        {question.type === "sentence_reorder" ? (
          <div className="space-y-3">
            <p className="min-h-11 rounded-md border bg-white px-3 py-2 text-lg font-semibold">{reorderAnswer.join(" ") || "Pick blocks below"}</p>
            <div className="flex flex-wrap gap-2">
              {currentBlocks.map((block, blockIndex) => (
                <Button key={`${block}-${blockIndex}`} variant="secondary" onClick={() => chooseBlock(block, blockIndex)} disabled={Boolean(feedback)}>
                  <Layers className="size-4" />
                  {block}
                </Button>
              ))}
            </div>
          </div>
        ) : null}

        {question.type === "match_pairs" ? (
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              {question.blocks?.map((block) => (
                <Button
                  key={block}
                  variant={matchedBlocks.includes(block) || selectedMatchBlock === block ? "default" : "secondary"}
                  disabled={matchedBlocks.includes(block) || Boolean(feedback)}
                  onClick={() => {
                    setSelectedMatchBlock(block);
                    judgeMatch(block, selectedMatchChoice);
                  }}
                  className="w-full"
                >
                  {block}
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              {question.choices?.map((choice) => (
                <Button
                  key={choice}
                  variant={matchedChoices.includes(choice) || selectedMatchChoice === choice ? "default" : "secondary"}
                  disabled={matchedChoices.includes(choice) || Boolean(feedback)}
                  onClick={() => {
                    setSelectedMatchChoice(choice);
                    judgeMatch(selectedMatchBlock, choice);
                  }}
                  className="w-full"
                >
                  {choice}
                </Button>
              ))}
            </div>
          </div>
        ) : null}

        {question.type === "fill_blank" && !question.choices ? (
          <div className="space-y-3">
            <input
              value={typedAnswer}
              onChange={(event) => setTypedAnswer(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") checkTyped();
              }}
              className="h-11 w-full rounded-md border bg-white px-3 text-lg outline-none ring-ring transition focus:ring-2"
              placeholder="Type the missing answer"
            />
            <Button onClick={() => checkTyped()} disabled={!typedAnswer}>Check</Button>
          </div>
        ) : null}

        {feedback === "correct" ? (
          <p className="flex items-center gap-2 text-sm font-medium text-primary"><CheckCircle2 className="size-4" /> Correct. {question.explanation}</p>
        ) : null}
        {feedback === "incorrect" ? (
          <p className="flex items-center gap-2 text-sm font-medium text-destructive"><XCircle className="size-4" /> Answer: {normalizeAnswer(question.correctAnswer)}. {question.explanation}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
