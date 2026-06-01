import { Bot } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { AgentPracticeClient } from "@/components/practice/agent-practice-client";

export default function AgentPracticePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Bot className="size-5" />
          </div>
          <h1 className="text-3xl font-semibold">Agent Practice</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Generate validated N5 questions locally through LM Studio.</p>
        </div>
        <AgentPracticeClient />
      </div>
    </AppShell>
  );
}
