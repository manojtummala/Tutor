import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { SpeakerButton } from "@/components/audio/speaker-button";
import { StatusBadge } from "@/components/practice/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getItemsForLesson, getLesson } from "@/lib/content/data";
import { getProgressMap } from "@/lib/server/item-progress";

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);

  if (!lesson) {
    notFound();
  }

  const baseItems = getItemsForLesson(lesson.id);
  const progressMap = getProgressMap(baseItems.map((item) => item.id));
  const items = baseItems.map((item) => ({ ...item, status: progressMap.get(item.id)?.status ?? "new" as const }));

  return (
    <AppShell>
      <div className="space-y-6">
        <Link href="/learn/kana" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Kana roadmap
        </Link>
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="mb-3 rounded-md" variant="secondary">{lesson.lessonType}</Badge>
            <h1 className="text-3xl font-semibold">{lesson.title}</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">{lesson.description}</p>
          </div>
        </section>
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item) => (
            <Card key={item.id} className="rounded-md bg-white/90">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <StatusBadge status={item.status} />
                  <div className="flex items-center gap-2">
                    <SpeakerButton audioSrc={item.audioSrc} text={item.japanese} className="size-7" />
                    <CheckCircle2 className="size-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="mb-3 flex h-24 items-center justify-center rounded-md bg-muted text-5xl font-semibold">{item.japanese}</div>
                <p className="font-semibold">{item.romaji ?? item.reading}</p>
                <p className="text-sm text-muted-foreground">{item.metadata.script ? `${item.metadata.script}` : item.meaning}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
