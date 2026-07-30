import Database from "better-sqlite3";
import { getLessonsForModule } from "@/lib/content/data";

type DailyStatsRow = {
  date: string;
  xp: number;
  reviews_completed: number;
  new_items_learned: number;
  practice_attempts: number;
  correct_attempts: number;
  wrong_attempts: number;
  daily_goal_completed: number;
};

type StreakRow = {
  id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
};

type ProgressRow = {
  item_id: string;
  status: string;
};

const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Chicago",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function getChicagoDateKey(date = new Date()) {
  return formatter.format(date);
}

function openDb() {
  return new Database("local.db", { readonly: true });
}

export type DashboardData = {
  dailyGoal: { completed: number; target: number };
  xpToday: number;
  streak: number;
  longestStreak: number;
  accuracy: number;
  kanaProgress: number;
  n5Progress: number;
  hiraganaProgress: number;
  katakanaProgress: number;
  variationsProgress: number;
  nextLesson: { id: string; title: string; description: string };
  totalKana: number;
  introducedKana: number;
  practicingKana: number;
  learnedKana: number;
  reviewsDue: number;
};

export function getDashboardData(): DashboardData {
  const sqlite = openDb();

  try {
    const todayKey = getChicagoDateKey();

    const dailyRow = sqlite.prepare("SELECT * FROM daily_stats WHERE date = ?").get(todayKey) as DailyStatsRow | undefined;
    const streakRow = sqlite.prepare("SELECT * FROM streaks LIMIT 1").get() as StreakRow | undefined;

    const todayXp = dailyRow?.xp ?? 0;
    const totalAttempts = (dailyRow?.correct_attempts ?? 0) + (dailyRow?.wrong_attempts ?? 0);
    const accuracy = totalAttempts > 0 ? Math.round((dailyRow!.correct_attempts / totalAttempts) * 100) : 0;

    const allProgress = sqlite.prepare("SELECT item_id, status FROM user_item_progress").all() as ProgressRow[];
    const introduced = allProgress.filter((p) => p.status === "introduced").length;
    const practicing = allProgress.filter((p) => p.status === "practicing").length;
    const learned = allProgress.filter((p) => p.status === "learned").length;
    const totalProgressed = introduced + practicing + learned;

    const kanaLessons = getLessonsForModule("kana-foundations");
    const allKanaItems = kanaLessons.flatMap((l) => l.items);
    const totalKana = allKanaItems.length;

    const kanaProgress = totalKana > 0 ? Math.round((totalProgressed / totalKana) * 100) : 0;

    const hiraganaItems = allKanaItems.filter((i) => (i.metadata?.script as string) === "hiragana");
    const katakanaItems = allKanaItems.filter((i) => (i.metadata?.script as string) === "katakana");
    const variationsItems = allKanaItems.filter((i) => (i.metadata?.variationType as string) !== "basic");

    const hiraganaProgressed = hiraganaItems.filter((i) => allProgress.find((p) => p.item_id === i.id && p.status !== "new")).length;
    const katakanaProgressed = katakanaItems.filter((i) => allProgress.find((p) => p.item_id === i.id && p.status !== "new")).length;
    const variationsProgressed = variationsItems.filter((i) => allProgress.find((p) => p.item_id === i.id && p.status !== "new")).length;

    const reviewsDue = allProgress.filter((p) => p.status === "introduced" || p.status === "practicing").length;
    const n5Lessons = getLessonsForModule("jlpt-n5");
    const allN5Items = n5Lessons.flatMap((l) => l.items);
    const n5Total = allN5Items.length;
    const n5Progressed = allN5Items.filter((i) => allProgress.find((p) => p.item_id === i.id && p.status !== "new")).length;
    const n5Progress = n5Total > 0 ? Math.round((n5Progressed / n5Total) * 100) : 0;

    const nextLesson = kanaLessons.find((l) => l.isUnlocked && l.completion < 100) ?? kanaLessons[0];

    return {
      dailyGoal: { completed: dailyRow?.practice_attempts ?? 0, target: 10 },
      xpToday: todayXp,
      streak: streakRow?.current_streak ?? 0,
      longestStreak: streakRow?.longest_streak ?? 0,
      accuracy,
      kanaProgress,
      n5Progress,
      hiraganaProgress: hiraganaItems.length > 0 ? Math.round((hiraganaProgressed / hiraganaItems.length) * 100) : 0,
      katakanaProgress: katakanaItems.length > 0 ? Math.round((katakanaProgressed / katakanaItems.length) * 100) : 0,
      variationsProgress: variationsItems.length > 0 ? Math.round((variationsProgressed / variationsItems.length) * 100) : 0,
      nextLesson: { id: nextLesson.id, title: nextLesson.title, description: nextLesson.description },
      totalKana,
      introducedKana: introduced,
      practicingKana: practicing,
      learnedKana: learned,
      reviewsDue,
    };
  } finally {
    sqlite.close();
  }
}
