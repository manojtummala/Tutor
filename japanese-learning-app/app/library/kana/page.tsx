import { AppShell } from "@/components/layout/app-shell";
import { KanaCard } from "@/components/lesson/kana-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getKanaSections } from "@/lib/content/data";
import type { LearningItem } from "@/lib/content/types";

function KanaGrid({ items }: { items: LearningItem[] }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
      {items.map((item) => <KanaCard key={item.id} item={item} />)}
    </div>
  );
}

function Section({ title, description, items }: { title: string; description: string; items: LearningItem[] }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <KanaGrid items={items} />
    </section>
  );
}

export default function KanaLibraryPage() {
  const sections = getKanaSections();
  const hiraganaVariations = sections.variations.filter((item) => item.metadata.script === "hiragana");
  const katakanaVariations = sections.variations.filter((item) => item.metadata.script === "katakana");
  const sharedVariations = sections.variations.filter((item) => item.metadata.script !== "hiragana" && item.metadata.script !== "katakana");

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Kana Library</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Reference kana by script. Use the speaker icon to hear browser Japanese TTS at beginner speed.</p>
        </div>

        <Tabs defaultValue="hiragana" className="space-y-5">
          <div className="flex justify-center">
            <TabsList className="h-12 rounded-md p-1">
              <TabsTrigger value="hiragana" className="px-8 py-2 text-base">Hiragana</TabsTrigger>
              <TabsTrigger value="katakana" className="px-8 py-2 text-base">Katakana</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="hiragana" className="space-y-6">
            <Section title="Hiragana Basics" description="The core hiragana chart, grouped by standard readings." items={sections.hiragana} />
            <Section title="Hiragana Variations" description="Dakuten, handakuten, yoon, and hiragana-specific special drills." items={hiraganaVariations} />
          </TabsContent>
          <TabsContent value="katakana" className="space-y-6">
            <Section title="Katakana Basics" description="The core katakana chart with the same romaji readings as hiragana." items={sections.katakana} />
            <Section title="Katakana Variations" description="Dakuten, handakuten, yoon, long vowels, and katakana-specific drills." items={katakanaVariations} />
          </TabsContent>
        </Tabs>

        {sharedVariations.length > 0 ? (
          <Section title="Shared Special Drills" description="Cross-script kana comparison drills." items={sharedVariations} />
        ) : null}
      </div>
    </AppShell>
  );
}
