import Link from "next/link";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { LessonWithItems } from "@/lib/content/types";

export function LessonPath({ lessons }: { lessons: LessonWithItems[] }) {
  return (
    <div className="space-y-3">
      {lessons.map((lesson, index) => {
        const locked = !lesson.isUnlocked;
        const complete = lesson.completion >= 100;
        const Icon = locked ? Lock : complete ? CheckCircle2 : PlayCircle;

        return (
          <Card key={lesson.id} className="rounded-md bg-white/90">
            <CardContent className="grid gap-4 p-4 sm:grid-cols-[44px_1fr_auto] sm:items-center">
              <span className="flex size-11 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Icon className="size-5" />
              </span>
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{lesson.title}</p>
                  <Badge variant={locked ? "secondary" : "default"}>{locked ? "Locked" : `Lesson ${index + 1}`}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{lesson.description}</p>
                <div className="flex items-center gap-3">
                  <Progress value={lesson.completion} className="h-2 max-w-sm" />
                  <span className="w-10 text-right text-xs text-muted-foreground">{lesson.completion}%</span>
                </div>
              </div>
              {locked ? (
                <span className="text-sm text-muted-foreground">Complete earlier lessons</span>
              ) : (
                <Link className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground transition hover:opacity-90" href={`/lesson/${lesson.id}`}>
                  Start
                </Link>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
