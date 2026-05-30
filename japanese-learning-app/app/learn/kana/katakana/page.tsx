import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { learningItems } from "@/lib/content/data";

export default function KatakanaPage() {
  const items = learningItems.filter((item) => item.metadata.script === "katakana");

  return (
    <AppShell>
      <div className="space-y-6">
        <div><Badge variant="secondary" className="mb-3 rounded-md">Kana</Badge><h1 className="text-3xl font-semibold">Katakana</h1></div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-8">
          {items.map((item) => <div key={item.id} className="kana-tile">{item.japanese}</div>)}
        </div>
      </div>
    </AppShell>
  );
}
