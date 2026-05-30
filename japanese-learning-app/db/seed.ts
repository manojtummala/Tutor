import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import modulesData from "@/data/modules.json";
import lessonsData from "@/data/lessons.json";
import hiraganaData from "@/data/kana/hiragana.json";
import katakanaData from "@/data/kana/katakana.json";
import variationsData from "@/data/kana/variations.json";
import n5VocabularyData from "@/data/jlpt/n5_vocab.json";
import n5KanjiData from "@/data/jlpt/n5_kanji.json";
import n5GrammarData from "@/data/jlpt/n5_grammar.json";
import n5SentencesData from "@/data/jlpt/n5_sentences.json";
import { dailyStats, learningItems, lessons, modules, streaks, userItemProgress } from "./schema";

const sqlite = new Database("local.db");
const db = drizzle(sqlite);

const learningData = [
  ...hiraganaData,
  ...katakanaData,
  ...variationsData,
  ...n5VocabularyData,
  ...n5KanjiData,
  ...n5GrammarData,
  ...n5SentencesData,
];

function createTables() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS modules (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      level TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      is_unlocked INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      module_id TEXT NOT NULL REFERENCES modules(id),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      lesson_type TEXT NOT NULL,
      is_unlocked INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS learning_items (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      level TEXT NOT NULL,
      module_id TEXT NOT NULL REFERENCES modules(id),
      lesson_id TEXT NOT NULL REFERENCES lessons(id),
      japanese TEXT NOT NULL,
      reading TEXT,
      romaji TEXT,
      meaning TEXT NOT NULL,
      explanation TEXT,
      metadata_json TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_item_progress (
      id TEXT PRIMARY KEY,
      item_id TEXT NOT NULL REFERENCES learning_items(id),
      status TEXT NOT NULL DEFAULT 'new',
      ease REAL NOT NULL DEFAULT 2.5,
      interval_days INTEGER NOT NULL DEFAULT 0,
      due_at TEXT,
      correct_count INTEGER NOT NULL DEFAULT 0,
      wrong_count INTEGER NOT NULL DEFAULT 0,
      last_reviewed_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS practice_attempts (
      id TEXT PRIMARY KEY,
      item_id TEXT NOT NULL REFERENCES learning_items(id),
      practice_type TEXT NOT NULL,
      prompt TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      user_answer TEXT,
      is_correct INTEGER NOT NULL,
      time_taken_ms INTEGER,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS daily_stats (
      date TEXT PRIMARY KEY,
      xp INTEGER NOT NULL DEFAULT 0,
      reviews_completed INTEGER NOT NULL DEFAULT 0,
      new_items_learned INTEGER NOT NULL DEFAULT 0,
      practice_attempts INTEGER NOT NULL DEFAULT 0,
      correct_attempts INTEGER NOT NULL DEFAULT 0,
      wrong_attempts INTEGER NOT NULL DEFAULT 0,
      daily_goal_completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS streaks (
      id TEXT PRIMARY KEY,
      current_streak INTEGER NOT NULL DEFAULT 0,
      longest_streak INTEGER NOT NULL DEFAULT 0,
      last_active_date TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

async function seed() {
  createTables();

  await db.delete(userItemProgress);
  await db.delete(learningItems);
  await db.delete(lessons);
  await db.delete(modules);
  await db.delete(dailyStats);
  await db.delete(streaks);

  await db.insert(modules).values(modulesData);
  await db.insert(lessons).values(lessonsData);
  await db.insert(learningItems).values(
    learningData.map((item) => ({
      id: item.id,
      type: item.type as "kana" | "vocab" | "kanji" | "grammar" | "sentence",
      level: item.level as "kana" | "N5" | "N4" | "N3" | "N2" | "N1",
      moduleId: item.moduleId,
      lessonId: item.lessonId,
      japanese: item.japanese,
      reading: item.reading ?? null,
      romaji: item.romaji ?? null,
      meaning: item.meaning,
      explanation: "explanation" in item ? item.explanation ?? null : null,
      metadataJson: JSON.stringify(item.metadata ?? {}),
    })),
  );
  await db.insert(userItemProgress).values(
    learningData.map((item) => ({
      id: `${item.id}_progress`,
      itemId: item.id,
      status: "new" as const,
    })),
  );
  await db.insert(streaks).values({ id: "personal" });

  console.log(`Seeded ${modulesData.length} modules, ${lessonsData.length} lessons, and ${learningData.length} learning items.`);
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => sqlite.close());
