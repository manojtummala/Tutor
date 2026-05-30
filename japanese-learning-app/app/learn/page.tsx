import Link from "next/link";
import { Lock, Route } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { modules, getLessonsForModule } from "@/lib/content/data";

export default function LearnPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <Badge className="mb-3 rounded-md" variant="secondary">Roadmap</Badge>
          <h1 className="text-3xl font-semibold">Learning Path</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Start with kana, then move into JLPT N5 vocabulary, kanji, grammar, and sentences.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {modules.map((module) => {
            const moduleLessons = getLessonsForModule(module.id);
            const progress = module.id === "kana-foundations" ? 40 : 0;

            return (
              <Card key={module.id} className="rounded-md bg-white/90">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle>{module.title}</CardTitle>
                      <p className="mt-2 text-sm text-muted-foreground">{module.description}</p>
                    </div>
                    {module.isUnlocked ? <Route className="size-5 text-primary" /> : <Lock className="size-5 text-muted-foreground" />}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>{moduleLessons.length} lessons</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                  <Link
                    href={module.id === "kana-foundations" ? "/learn/kana" : "/learn/n5"}
                    className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                  >
                    {module.isUnlocked ? "Open module" : "Preview module"}
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
