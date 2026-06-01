import { Brain } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { KanaPracticePage } from "@/components/practice/kana-practice-page";

export default function KanaPracticeRoutePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Brain className="size-5" />
          </div>
          <h1 className="text-3xl font-semibold">Kana Practice</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Practice introduced kana with mixed typing, matching, audio recognition, reorder, and multiple choice.</p>
        </div>
        <KanaPracticePage />
      </div>
    </AppShell>
  );
}
