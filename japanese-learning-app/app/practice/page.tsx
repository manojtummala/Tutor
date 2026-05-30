import { Brain } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";

const modes = ["Kana Practice", "Vocabulary Practice", "Grammar Practice", "Mixed Practice", "Weak Items", "Random Review"];

export default function PracticePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-semibold">Practice</h1><p className="mt-2 text-muted-foreground">Mode selection shell for Duolingo-style practice sessions.</p></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modes.map((mode) => <Card key={mode} className="rounded-md bg-white/90"><CardContent className="p-4"><Brain className="mb-3 size-5 text-primary" /><p className="font-semibold">{mode}</p><p className="text-sm text-muted-foreground">Flashcards first, interactive tests next.</p></CardContent></Card>)}
        </div>
      </div>
    </AppShell>
  );
}
