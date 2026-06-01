import { AppShell } from "@/components/layout/app-shell";
import { KanaLearnClient } from "@/components/learn/kana-learn-client";
import { getLessonsForModule } from "@/lib/content/data";

export default function KanaPage() {
  const lessons = getLessonsForModule("kana-foundations");
  const hiraganaLessons = lessons.filter((lesson) => lesson.id.startsWith("hiragana-"));
  const katakanaLessons = lessons.filter((lesson) => lesson.id.startsWith("katakana-"));
  const specialLessons = lessons.filter((lesson) => lesson.id.startsWith("kana-"));

  return (
    <AppShell>
      <KanaLearnClient hiraganaLessons={hiraganaLessons} katakanaLessons={katakanaLessons} specialLessons={specialLessons} />
    </AppShell>
  );
}
