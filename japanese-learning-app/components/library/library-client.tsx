"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { SpeakerButton } from "@/components/audio/speaker-button";
import { KanaCard } from "@/components/lesson/kana-card";
import { Card, CardContent } from "@/components/ui/card";
import type { LearningItem } from "@/lib/content/types";

type FilterType = "all" | "kana" | "kanji" | "vocab" | "grammar" | "sentence";
type FilterScript = "all" | "hiragana" | "katakana";

const typeFilters: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "kana", label: "Kana" },
  { value: "kanji", label: "Kanji" },
  { value: "vocab", label: "Vocabulary" },
  { value: "grammar", label: "Grammar" },
  { value: "sentence", label: "Sentences" },
];

function matchesSearch(item: LearningItem, query: string) {
  const q = query.toLowerCase();
  return (
    item.japanese.includes(q) ||
    (item.reading ?? "").toLowerCase().includes(q) ||
    (item.romaji ?? "").toLowerCase().includes(q) ||
    item.meaning.toLowerCase().includes(q)
  );
}

function itemTypeToFilterType(type: string): FilterType {
  if (type === "kana" || type === "kanji" || type === "vocab" || type === "grammar" || type === "sentence") return type;
  return "all";
}

export function LibraryClient({ allItems, kanaSections }: { allItems: LearningItem[]; kanaSections: { hiragana: LearningItem[]; katakana: LearningItem[]; variations: LearningItem[]; kanji: LearningItem[] } }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [scriptFilter, setScriptFilter] = useState<FilterScript>("all");

  const filteredKana = useMemo(() => {
    let items = allItems.filter((item) => item.type === "kana");

    if (scriptFilter === "hiragana") items = items.filter((item) => (item.metadata?.script as string) === "hiragana");
    if (scriptFilter === "katakana") items = items.filter((item) => (item.metadata?.script as string) === "katakana");

    if (searchQuery) items = items.filter((item) => matchesSearch(item, searchQuery));

    return items;
  }, [allItems, scriptFilter, searchQuery]);

  const filteredSection = useMemo(() => {
    if (typeFilter !== "all" && typeFilter !== "kana") {
      let items = allItems.filter((item) => itemTypeToFilterType(item.type) === typeFilter);
      if (searchQuery) items = items.filter((item) => matchesSearch(item, searchQuery));
      return items;
    }
    return null;
  }, [allItems, typeFilter, searchQuery]);

  const showKanaGrid = typeFilter === "all" || typeFilter === "kana";
  const showSearchResults = searchQuery || typeFilter !== "all";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by japanese, reading, or meaning..."
            className="h-10 w-full rounded-md border bg-white pl-9 pr-8 text-sm outline-none ring-ring transition focus:ring-2"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                typeFilter === f.value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {showKanaGrid && !showSearchResults ? (
        <>
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Hiragana</h2>
                <p className="text-sm text-muted-foreground">Basic hiragana chart with romaji and pronunciation.</p>
              </div>
              <button
                onClick={() => { setScriptFilter("hiragana"); setTypeFilter("kana"); }}
                className="text-sm text-primary hover:underline"
              >
                Filter
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
              {kanaSections.hiragana.map((item) => <KanaCard key={item.id} item={item} />)}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Katakana</h2>
                <p className="text-sm text-muted-foreground">Basic katakana chart with shared pronunciation audio paths.</p>
              </div>
              <button
                onClick={() => { setScriptFilter("katakana"); setTypeFilter("kana"); }}
                className="text-sm text-primary hover:underline"
              >
                Filter
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
              {kanaSections.katakana.map((item) => <KanaCard key={item.id} item={item} />)}
            </div>
          </section>

          <section className="space-y-3">
            <div>
              <h2 className="text-xl font-semibold">Kana Variations</h2>
              <p className="text-sm text-muted-foreground">Dakuten, handakuten, yoon combinations, and special drills.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
              {kanaSections.variations.map((item) => <KanaCard key={item.id} item={item} />)}
            </div>
          </section>

          <section className="space-y-3">
            <div>
              <h2 className="text-xl font-semibold">Kanji</h2>
              <p className="text-sm text-muted-foreground">Starter N5 kanji separated from kana reference material.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {kanaSections.kanji.map((item) => (
                <Card key={item.id} className="rounded-2xl border-0 bg-white shadow-sm">
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
          </section>

          <section className="space-y-3">
            <div>
              <h2 className="text-xl font-semibold">N5 Starter Materials</h2>
              <p className="text-sm text-muted-foreground">Vocabulary, grammar, and sentence seeds for the next module.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {allItems.filter((item) => item.level === "N5" && item.type !== "kanji").map((item) => (
                <Card key={item.id} className="rounded-2xl border-0 bg-white shadow-sm">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{item.type}</p>
                    <p className="mt-2 text-2xl font-semibold">{item.japanese}</p>
                    <p className="text-sm font-medium">{item.romaji ?? item.reading}</p>
                    <p className="text-sm text-muted-foreground">{item.meaning}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </>
      ) : null}

      {showSearchResults && filteredSection ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Search Results</h2>
          {filteredSection.length === 0 ? (
            <p className="text-sm text-muted-foreground">No items match your search.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {filteredSection.map((item) => (
                <Card key={item.id} className="rounded-2xl border-0 bg-white shadow-sm">
                  <CardContent className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{item.type}</p>
                    <div className="mb-1 mt-2 flex items-start justify-between gap-3">
                      <p className="text-3xl font-semibold">{item.japanese}</p>
                      {item.audioSrc && <SpeakerButton audioSrc={item.audioSrc} text={item.japanese} />}
                    </div>
                    <p className="font-medium">{item.reading}</p>
                    <p className="text-sm text-muted-foreground">{item.meaning}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {showSearchResults && filteredKana.length > 0 && typeFilter === "kana" ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Kana Results</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
            {filteredKana.map((item) => <KanaCard key={item.id} item={item} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}
