import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Brain, CheckCircle2, Layers } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getItemsForLesson, getLesson } from "@/lib/content/data";

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);

  if (!lesson) {
    notFound();
  }

  const items = getItemsForLesson(lesson.id);

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
          <div className="flex gap-2">
            <Button><Layers className="size-4" /> Flashcards</Button>
            <Button variant="secondary"><Brain className="size-4" /> Practice</Button>
          </div>
        </section>
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item) => (
            <Card key={item.id} className="rounded-md bg-white/90">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase text-muted-foreground">{item.type}</span>
                  <CheckCircle2 className="size-4 text-muted-foreground" />
                </div>
                <div className="mb-3 flex h-24 items-center justify-center rounded-md bg-muted text-5xl font-semibold">{item.japanese}</div>
                <p className="font-semibold">{item.romaji ?? item.reading}</p>
                <p className="text-sm text-muted-foreground">{item.meaning}</p>
              </CardContent>
            </Card>
          ))}
        </section>
        <Card className="rounded-md bg-white/90">
          <CardHeader>
            <CardTitle>Practice queue</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border p-4"><p className="font-semibold">Flashcard reveal</p><p className="text-sm text-muted-foreground">Front, back, then Again/Hard/Good/Easy.</p></div>
            <div className="rounded-md border p-4"><p className="font-semibold">Multiple choice</p><p className="text-sm text-muted-foreground">Pick the right romaji for each kana.</p></div>
            <div className="rounded-md border p-4"><p className="font-semibold">Type answer</p><p className="text-sm text-muted-foreground">Recall kana readings without hints.</p></div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
