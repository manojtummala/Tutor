import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getDashboardSnapshot } from "@/lib/content/data";

export default function ProgressPage() {
  const snapshot = getDashboardSnapshot();

  return (
    <AppShell>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-semibold">Progress</h1><p className="mt-2 text-muted-foreground">Initial analytics cards for kana mastery, streaks, XP, and accuracy.</p></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Kana progress", snapshot.kanaProgress],
            ["N5 progress", snapshot.n5Progress],
            ["Accuracy", snapshot.accuracy],
            ["Daily goal", 0],
          ].map(([label, value]) => <Card key={label} className="rounded-md bg-white/90"><CardContent className="space-y-3 p-4"><p className="font-semibold">{label}</p><Progress value={Number(value)} /><p className="text-sm text-muted-foreground">{value}%</p></CardContent></Card>)}
        </div>
      </div>
    </AppShell>
  );
}
