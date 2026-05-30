import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { learningItems } from "@/lib/content/data";

export default function N5Page() {
  const n5Items = learningItems.filter((item) => item.level === "N5");

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <Badge className="mb-3 rounded-md" variant="secondary">Preview</Badge>
          <h1 className="text-3xl font-semibold">JLPT N5</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Starter vocabulary, kanji, grammar, and sentence content is seeded for the next module.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {n5Items.map((item) => (
            <Card key={item.id} className="rounded-md bg-white/90">
              <CardContent className="p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">{item.type}</p>
                <p className="mt-2 text-2xl font-semibold">{item.japanese}</p>
                <p className="text-sm text-muted-foreground">{item.meaning}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
