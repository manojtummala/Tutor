import { RotateCcw } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { KanaReviewSession } from "@/components/review/kana-review-session";

export default function ReviewPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <RotateCcw className="size-5" />
          </div>
          <h1 className="text-3xl font-semibold">Review</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Review introduced kana with a smooth flip card. Practice scoring now lives in Practice.</p>
        </div>
        <KanaReviewSession />
      </div>
    </AppShell>
  );
}
