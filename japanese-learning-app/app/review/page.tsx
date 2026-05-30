import { RotateCcw } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { learningItems } from "@/lib/content/data";

export default function ReviewPage() {
  const dueItems = learningItems.filter((item) => item.type === "kana").slice(0, 8);

  return (
    <AppShell>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-semibold">Review</h1><p className="mt-2 text-muted-foreground">Due review shell with SRS ratings ready for persistence.</p></div>
        <Card className="rounded-md bg-white/90">
          <CardHeader><CardTitle className="flex items-center gap-2"><RotateCcw className="size-5" /> Due now</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
              {dueItems.map((item) => <div key={item.id} className="kana-tile text-3xl">{item.japanese}</div>)}
            </div>
            <div className="flex flex-wrap gap-2">
              {["Again", "Hard", "Good", "Easy"].map((rating) => <Button key={rating} variant={rating === "Good" ? "default" : "secondary"}>{rating}</Button>)}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
