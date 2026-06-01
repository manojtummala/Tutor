import { AppShell } from "@/components/layout/app-shell";
import { KanaCard } from "@/components/lesson/kana-card";
import { Badge } from "@/components/ui/badge";
import { learningItems } from "@/lib/content/data";

export default function HiraganaPage() {
  const items = learningItems.filter((item) => item.metadata.script === "hiragana" && item.metadata.variationType === "basic");

  return (
    <AppShell>
      <div className="space-y-6">
        <div><Badge variant="secondary" className="mb-3 rounded-md">Kana</Badge><h1 className="text-3xl font-semibold">Hiragana</h1></div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-8">
          {items.map((item) => <KanaCard key={item.id} item={item} />)}
        </div>
      </div>
    </AppShell>
  );
}
