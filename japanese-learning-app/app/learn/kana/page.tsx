import { AppShell } from "@/components/layout/app-shell";
import { LessonPath } from "@/components/lesson/lesson-path";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getKanaStats, getLessonsForModule } from "@/lib/content/data";

export default function KanaPage() {
  const lessons = getLessonsForModule("kana-foundations");
  const stats = getKanaStats();

  return (
    <AppShell>
      <div className="space-y-6">
        <section>
          <Badge className="mb-3 rounded-md bg-accent text-accent-foreground hover:bg-accent">Beginner module</Badge>
          <h1 className="text-3xl font-semibold">Kana Foundations</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Learn hiragana, katakana, and the first variations with short lessons and review-ready items.</p>
        </section>
        <section className="grid gap-3 sm:grid-cols-3">
          <Card className="rounded-md bg-white/90"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Hiragana</p><p className="text-2xl font-semibold">{stats.hiragana}</p></CardContent></Card>
          <Card className="rounded-md bg-white/90"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Katakana</p><p className="text-2xl font-semibold">{stats.katakana}</p></CardContent></Card>
          <Card className="rounded-md bg-white/90"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Variations</p><p className="text-2xl font-semibold">{stats.variations}</p></CardContent></Card>
        </section>
        <LessonPath lessons={lessons} />
      </div>
    </AppShell>
  );
}
