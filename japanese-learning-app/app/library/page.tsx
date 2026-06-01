import { AppShell } from "@/components/layout/app-shell";
import { SpeakerButton } from "@/components/audio/speaker-button";
import { KanaCard } from "@/components/lesson/kana-card";
import { Card, CardContent } from "@/components/ui/card";
import { getKanaSections, learningItems } from "@/lib/content/data";

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

export default function LibraryPage() {
  const sections = getKanaSections();
  const n5Items = learningItems.filter((item) => item.level === "N5" && item.type !== "kanji");

  return (
    <AppShell>
      <div className="space-y-6">
        <div><h1 className="text-3xl font-semibold">Library</h1><p className="mt-2 text-muted-foreground">Browse seeded kana and N5 learning materials.</p></div>
        <Section title="Hiragana" description="Basic hiragana chart with romaji and pronunciation.">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
            {sections.hiragana.map((item) => <KanaCard key={item.id} item={item} />)}
          </div>
        </Section>
        <Section title="Katakana" description="Basic katakana chart with shared pronunciation audio paths.">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
            {sections.katakana.map((item) => <KanaCard key={item.id} item={item} />)}
          </div>
        </Section>
        <Section title="Kana Variations" description="Dakuten, handakuten, yoon combinations, and special drills.">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
            {sections.variations.map((item) => <KanaCard key={item.id} item={item} />)}
          </div>
        </Section>
        <Section title="Kanji" description="Starter N5 kanji separated from kana reference material.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sections.kanji.map((item) => (
              <Card key={item.id} className="rounded-md bg-white/90">
                <CardContent className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <p className="text-3xl font-semibold">{item.japanese}</p>
                    <SpeakerButton audioSrc={item.audioSrc} text={item.japanese} />
                  </div>
                  <p className="font-medium">{item.reading}</p>
                  <p className="text-sm text-muted-foreground">{item.meaning}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
        <Section title="N5 Starter Materials" description="Vocabulary, grammar, and sentence seeds for the next module.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {n5Items.map((item) => <Card key={item.id} className="rounded-md bg-white/90"><CardContent className="p-4"><p className="text-xs font-medium uppercase text-muted-foreground">{item.type}</p><p className="mt-2 text-2xl font-semibold">{item.japanese}</p><p className="text-sm font-medium">{item.romaji ?? item.reading}</p><p className="text-sm text-muted-foreground">{item.meaning}</p></CardContent></Card>)}
          </div>
        </Section>
      </div>
    </AppShell>
  );
}
