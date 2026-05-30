import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Flame, Goal, RotateCcw, Star, Trophy } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getDashboardSnapshot, getLessonsForModule } from "@/lib/content/data";

export default function DashboardPage() {
  const snapshot = getDashboardSnapshot();
  const kanaLessons = getLessonsForModule("kana-foundations");

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="mb-3 rounded-md bg-accent text-accent-foreground hover:bg-accent">Kana Foundations</Badge>
            <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">Welcome back.</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">Keep your Japanese streak alive with a short kana session today.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link className={buttonVariants()} href={`/lesson/${snapshot.nextLesson.id}`}>
              Continue <ArrowRight className="size-4" />
            </Link>
            <Link className={buttonVariants({ variant: "secondary" })} href="/review">
              Review <RotateCcw className="size-4" />
            </Link>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Flame} label="Current streak" value={`${snapshot.streak} days`} detail="Complete 10 actions to start" />
          <StatCard icon={Goal} label="Today's goal" value={`${snapshot.dailyGoal.completed}/${snapshot.dailyGoal.target}`} detail="Practice or review actions" />
          <StatCard icon={Star} label="XP today" value={`${snapshot.xpToday}`} detail="Correct answers earn XP" />
          <StatCard icon={RotateCcw} label="Reviews due" value={`${snapshot.reviewsDue}`} detail="Seeded kana review queue" />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <Card className="rounded-md bg-white/90">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle>Continue Learning</CardTitle>
                <p className="text-sm text-muted-foreground">{snapshot.nextLesson.description}</p>
              </div>
              <Badge variant="secondary">{snapshot.nextLesson.items.length} items</Badge>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-5 gap-2 sm:max-w-md">
                {snapshot.nextLesson.items.slice(0, 5).map((item) => (
                  <div key={item.id} className="kana-tile">
                    {item.japanese}
                  </div>
                ))}
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Kana progress</span>
                  <span className="font-medium">{snapshot.kanaProgress}%</span>
                </div>
                <Progress value={snapshot.kanaProgress} className="h-3" />
              </div>
              <Link className={buttonVariants({ className: "w-full sm:w-auto" })} href={`/lesson/${snapshot.nextLesson.id}`}>
                Start {snapshot.nextLesson.title}
              </Link>
            </CardContent>
          </Card>

          <Card className="rounded-md bg-white/90">
            <CardHeader>
              <CardTitle>Roadmap Snapshot</CardTitle>
              <p className="text-sm text-muted-foreground">Kana first, N5 shell ready next.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Hiragana</span>
                  <span>{snapshot.kanaStats.hiragana} items</span>
                </div>
                <Progress value={48} />
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Katakana</span>
                  <span>{snapshot.kanaStats.katakana} items</span>
                </div>
                <Progress value={16} />
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Variations</span>
                  <span>{snapshot.kanaStats.variations} items</span>
                </div>
                <Progress value={12} />
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          {[
            { href: "/learn", icon: BookOpen, label: "Open Roadmap", detail: `${kanaLessons.length} starter lessons` },
            { href: "/practice", icon: Brain, label: "Practice Kana", detail: "Flashcards first, tests next" },
            { href: "/progress", icon: Trophy, label: "View Progress", detail: "Accuracy, XP, streaks" },
          ].map((action) => (
            <Link key={action.href} href={action.href} className="rounded-md border bg-white/80 p-4 transition hover:-translate-y-0.5 hover:shadow-sm">
              <action.icon className="mb-3 size-5 text-primary" />
              <p className="font-semibold">{action.label}</p>
              <p className="text-sm text-muted-foreground">{action.detail}</p>
            </Link>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
