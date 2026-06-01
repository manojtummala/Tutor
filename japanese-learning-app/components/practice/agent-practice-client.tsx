"use client";

import { useState } from "react";
import { Bot, Loader2, Sparkles } from "lucide-react";
import { AgentPracticeSession } from "@/components/practice/agent-practice-session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GeneratedPracticeQuestion } from "@/lib/practice/agent-practice-types";

type ErrorState = {
  message: string;
  detail?: string;
  baseUrl?: string;
};

const contentSummary = {
  vocabulary: ["私", "あなた", "学生", "先生", "日本語", "今日"],
  particles: ["は", "を", "か"],
  grammar: ["A は B です", "A は B ではありません", "A は B ですか", "A は N を Vます"],
};

export function AgentPracticeClient() {
  const [questions, setQuestions] = useState<GeneratedPracticeQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);

  async function generate() {
    setIsGenerating(true);
    setError(null);
    setQuestions([]);

    try {
      const response = await fetch("/api/agent-practice/generate", { method: "POST" });
      const data = await response.json();

      if (!response.ok) {
        setError({
          message: data.error ?? "Could not generate practice questions.",
          detail: data.detail,
          baseUrl: data.baseUrl,
        });
        return;
      }

      setQuestions(data.questions ?? []);
    } catch (error) {
      setError({
        message: "Could not reach the local generation API.",
        detail: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  if (questions.length > 0) {
    return <AgentPracticeSession questions={questions} onRestart={() => setQuestions([])} />;
  }

  return (
    <div className="space-y-5">
      <Card className="rounded-md bg-white/95 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <Bot className="size-5" />
            </div>
            <div>
              <CardTitle>Agent Practice Setup</CardTitle>
              <p className="text-sm text-muted-foreground">Generate N5 grammar, sentence, and real-life practice from a scoped starter pack.</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-3 rounded-md border bg-muted/35 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">Level</span>
              <Badge>N5 enabled</Badge>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">Session size</span>
              <span className="text-sm text-muted-foreground">Target 6 questions, up to 8 candidates</span>
            </div>
            <div>
              <p className="mb-2 font-medium">Question types</p>
              <div className="flex flex-wrap gap-2">
                {["Multiple choice", "Sentence reorder", "Fill blank"].map((type) => <Badge key={type} variant="secondary">{type}</Badge>)}
              </div>
            </div>
          </div>
          <div className="space-y-3 rounded-md border bg-white p-4">
            <p className="font-medium">Content source</p>
            <p className="text-sm text-muted-foreground">Local N5 starter pack until learned vocab/grammar content is expanded.</p>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Vocabulary:</span> {contentSummary.vocabulary.join(", ")}</p>
              <p><span className="font-medium">Particles:</span> {contentSummary.particles.join(", ")}</p>
              <p><span className="font-medium">Grammar:</span> {contentSummary.grammar.join("; ")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {error ? (
        <Card className="rounded-md border-destructive/30 bg-white/95">
          <CardContent className="space-y-2 p-4">
            <p className="font-semibold text-destructive">{error.message}</p>
            {error.baseUrl ? <p className="text-sm text-muted-foreground">LM Studio base URL: {error.baseUrl}</p> : null}
            {error.detail ? <p className="text-xs text-muted-foreground">{error.detail}</p> : null}
          </CardContent>
        </Card>
      ) : null}

      <Button onClick={() => void generate()} disabled={isGenerating} className="h-10 px-4">
        {isGenerating ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
        {isGenerating ? "Generating..." : "Generate / Start"}
      </Button>
    </div>
  );
}
