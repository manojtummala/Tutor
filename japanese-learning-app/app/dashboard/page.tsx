import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Flame, Goal, GraduationCap, Trophy } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getDashboardData } from "@/lib/server/dashboard";

function ProgressRing({ value, size = 80, strokeWidth = 6, label }: { value: number; size?: number; strokeWidth?: number; label: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="oklch(0.9 0.025 83.58)" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="oklch(0.55 0.19 147.08)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
      </div>
      <span className="text-xl font-bold">{value}%</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export default function DashboardPage() {
  const data = getDashboardData();

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge className="mb-3 rounded-full bg-primary/10 text-primary border-none hover:bg-primary/15">Kana Foundations</Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Welcome back.</h1>
            <p className="mt-3 max-w-xl text-muted-foreground text-lg leading-relaxed">
              Keep your Japanese streak alive with a short kana session today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className={buttonVariants({ className: "gap-2 rounded-xl h-11 px-5" })} href={`/lesson/${data.nextLesson.id}`}>
              Continue <ArrowRight className="size-4" />
            </Link>
            <Link className={buttonVariants({ variant: "secondary", className: "gap-2 rounded-xl h-11 px-5" })} href="/practice">
              <Brain className="size-4" /> Practice
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-2xl border-0 bg-white shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-sm">
                <Flame className="size-6" />
              </span>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current streak</p>
                <p className="text-3xl font-bold leading-tight tracking-tight">
                  {data.streak} <span className="text-sm font-normal text-muted-foreground">days</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {data.streak > 0 ? "Keep going!" : "Start today to begin"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <Goal className="size-4 text-primary" />
                </span>
                <span className="text-sm font-medium text-muted-foreground">Daily goal</span>
              </div>
              <p className="text-3xl font-bold tracking-tight">
                {data.dailyGoal.completed}<span className="text-base font-normal text-muted-foreground"> / {data.dailyGoal.target}</span>
              </p>
              <Progress
                value={(data.dailyGoal.completed / data.dailyGoal.target) * 100}
                className="mt-3 h-2.5 rounded-full bg-muted"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">Practice or review actions</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-amber-50">
                  <Trophy className="size-4 text-amber-500" />
                </span>
                <span className="text-sm font-medium text-muted-foreground">XP today</span>
              </div>
              <p className="text-3xl font-bold tracking-tight">
                {data.xpToday}<span className="text-base font-normal text-muted-foreground"> XP</span>
              </p>
              <Progress value={data.xpToday > 0 ? Math.min((data.xpToday / 50) * 100, 100) : 0} className="mt-3 h-2.5 rounded-full bg-muted" />
              <p className="mt-1.5 text-xs text-muted-foreground">50 XP unlocks daily bonus</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-white shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-sm">
                <BookOpen className="size-6" />
              </span>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Kana mastery</p>
                <p className="text-3xl font-bold leading-tight tracking-tight">
                  {data.learnedKana} <span className="text-sm font-normal text-muted-foreground">/ {data.totalKana}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {data.practicingKana} practicing · {data.introducedKana} introduced
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <Card className="rounded-2xl border-0 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
              <div>
                <CardTitle className="text-lg">Continue Learning</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">{data.nextLesson.description}</p>
              </div>
              <Badge variant="secondary" className="rounded-full">{data.reviewsDue} items due</Badge>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Kana progress</span>
                  <span className="font-semibold">{data.kanaProgress}%</span>
                </div>
                <Progress value={data.kanaProgress} className="h-3 rounded-full bg-muted" />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/50 px-5 py-4">
                <div className="flex items-center gap-4">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-lg">あ</span>
                  <div>
                    <p className="font-semibold">{data.nextLesson.title}</p>
                    <p className="text-sm text-muted-foreground">{data.nextLesson.description}</p>
                  </div>
                </div>
                <Link className={buttonVariants({ size: "sm", className: "gap-1.5 rounded-xl" })} href={`/lesson/${data.nextLesson.id}`}>
                  Start <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-0 bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Kana Progress</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">Track your mastery</p>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-around">
                <ProgressRing value={data.hiraganaProgress} label="Hiragana" />
                <ProgressRing value={data.katakanaProgress} label="Katakana" />
                <ProgressRing value={data.variationsProgress} label="Variations" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { href: "/learn", icon: GraduationCap, label: "Open Roadmap", detail: "View all lessons", color: "from-emerald-400 to-emerald-500" },
            { href: "/practice", icon: Brain, label: "Practice Kana", detail: `${data.practicingKana} items in progress`, color: "from-violet-400 to-violet-500" },
            { href: "/progress", icon: Trophy, label: "View Progress", detail: `Best streak: ${data.longestStreak} days`, color: "from-amber-400 to-amber-500" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-2xl border-0 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <span className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-white shadow-sm mb-4`}>
                <action.icon className="size-5" />
              </span>
              <p className="font-semibold text-base">{action.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{action.detail}</p>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
