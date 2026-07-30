import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getDashboardData } from "@/lib/server/dashboard";
import { BarChart3, BookOpen, Flame, Target, Trophy } from "lucide-react";

export default function ProgressPage() {
  const data = getDashboardData();

  const statCards = [
    { icon: BarChart3, label: "Kana progress", value: `${data.kanaProgress}%`, detail: `${data.learnedKana} learned · ${data.practicingKana} practicing · ${data.introducedKana} introduced` },
    { icon: Flame, label: "Current streak", value: `${data.streak} days`, detail: `Longest: ${data.longestStreak} days` },
    { icon: Target, label: "Accuracy", value: `${data.accuracy}%`, detail: "Across all practice sessions" },
    { icon: Trophy, label: "Total XP", value: `${data.xpToday} XP`, detail: "Today's earnings" },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Progress</h1>
          <p className="mt-2 text-muted-foreground">Track your kana journey with real stats from your practice sessions.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <Card key={card.label} className="rounded-2xl border-0 bg-white shadow-sm">
              <CardContent className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                    <card.icon className="size-4 text-primary" />
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
                </div>
                <p className="text-3xl font-bold tracking-tight">{card.value}</p>
                <p className="mt-1.5 text-xs text-muted-foreground">{card.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-2xl border-0 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="size-5 text-primary" />
              Kana Mastery Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Hiragana</span>
                <span className="font-semibold">{data.hiraganaProgress}%</span>
              </div>
              <Progress value={data.hiraganaProgress} className="h-3 rounded-full bg-muted" />
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Katakana</span>
                <span className="font-semibold">{data.katakanaProgress}%</span>
              </div>
              <Progress value={data.katakanaProgress} className="h-3 rounded-full bg-muted" />
            </div>
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted-foreground">Variations</span>
                <span className="font-semibold">{data.variationsProgress}%</span>
              </div>
              <Progress value={data.variationsProgress} className="h-3 rounded-full bg-muted" />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
