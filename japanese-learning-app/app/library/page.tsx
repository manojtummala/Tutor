import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { learningItems } from "@/lib/content/data";

export default function LibraryPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-semibold">Library</h1><p className="mt-2 text-muted-foreground">Browse seeded kana and N5 learning materials.</p></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {learningItems.map((item) => <Card key={item.id} className="rounded-md bg-white/90"><CardContent className="p-4"><p className="text-xs font-medium uppercase text-muted-foreground">{item.type}</p><p className="mt-2 text-2xl font-semibold">{item.japanese}</p><p className="text-sm text-muted-foreground">{item.meaning}</p></CardContent></Card>)}
        </div>
      </div>
    </AppShell>
  );
}
