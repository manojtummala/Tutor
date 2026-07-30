import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const modules = sqliteTable("modules", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  level: text("level").notNull(),
  orderIndex: integer("order_index").notNull(),
  isUnlocked: integer("is_unlocked", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const lessons = sqliteTable("lessons", {
  id: text("id").primaryKey(),
  moduleId: text("module_id").notNull().references(() => modules.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  orderIndex: integer("order_index").notNull(),
  lessonType: text("lesson_type").notNull(),
  isUnlocked: integer("is_unlocked", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const learningItems = sqliteTable("learning_items", {
  id: text("id").primaryKey(),
  type: text("type", { enum: ["kana", "vocab", "kanji", "grammar", "sentence"] }).notNull(),
  level: text("level", { enum: ["kana", "N5", "N4", "N3", "N2", "N1"] }).notNull(),
  moduleId: text("module_id").notNull().references(() => modules.id),
  lessonId: text("lesson_id").notNull().references(() => lessons.id),
  japanese: text("japanese").notNull(),
  reading: text("reading"),
  romaji: text("romaji"),
  meaning: text("meaning").notNull(),
  audioSrc: text("audio_src"),
  explanation: text("explanation"),
  metadataJson: text("metadata_json"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const userItemProgress = sqliteTable("user_item_progress", {
  id: text("id").primaryKey(),
  itemId: text("item_id").notNull().references(() => learningItems.id),
  status: text("status", { enum: ["new", "introduced", "practicing", "learned", "learning", "reviewing", "mastered", "difficult"] }).notNull().default("new"),
  ease: real("ease").notNull().default(2.5),
  intervalDays: integer("interval_days").notNull().default(0),
  dueAt: text("due_at"),
  correctCount: integer("correct_count").notNull().default(0),
  wrongCount: integer("wrong_count").notNull().default(0),
  introducedAt: text("introduced_at"),
  correctAttemptCount: integer("correct_attempt_count").notNull().default(0),
  practiceAttemptCount: integer("practice_attempt_count").notNull().default(0),
  targetCorrectAttempts: integer("target_correct_attempts").notNull().default(5),
  learnedAt: text("learned_at"),
  lastReviewedAt: text("last_reviewed_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const practiceAttempts = sqliteTable("practice_attempts", {
  id: text("id").primaryKey(),
  itemId: text("item_id").notNull().references(() => learningItems.id),
  practiceType: text("practice_type", {
    enum: ["flashcard", "multiple_choice", "match_pairs", "type_answer", "audio_recognition", "fill_blank", "sentence_reorder"],
  }).notNull(),
  prompt: text("prompt").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  userAnswer: text("user_answer"),
  isCorrect: integer("is_correct", { mode: "boolean" }).notNull(),
  timeTakenMs: integer("time_taken_ms"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const generatedPracticeQuestions = sqliteTable("generated_practice_questions", {
  id: text("id").primaryKey(),
  chunkKey: text("chunk_key").notNull(),
  type: text("type", { enum: ["multiple_choice", "fill_blank", "sentence_reorder", "match_pairs"] }).notNull(),
  level: text("level").notNull(),
  prompt: text("prompt").notNull(),
  choicesJson: text("choices_json"),
  blocksJson: text("blocks_json"),
  correctAnswerJson: text("correct_answer_json").notNull(),
  naturalSentence: text("natural_sentence"),
  explanation: text("explanation").notNull(),
  sourceItemIdsJson: text("source_item_ids_json").notNull(),
  scriptMode: text("script_mode", { enum: ["kana_only", "learned_kanji_only"] }).notNull(),
  kanjiUsedJson: text("kanji_used_json").notNull(),
  status: text("status", { enum: ["active", "rejected", "archived"] }).notNull().default("active"),
  model: text("model").notNull(),
  timesShown: integer("times_shown").notNull().default(0),
  timesCorrect: integer("times_correct").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const questionGenerationJobs = sqliteTable("question_generation_jobs", {
  id: text("id").primaryKey(),
  chunkKey: text("chunk_key").notNull(),
  sourceItemIdsJson: text("source_item_ids_json").notNull(),
  status: text("status", { enum: ["pending", "running", "completed", "failed"] }).notNull().default("pending"),
  model: text("model"),
  attemptCount: integer("attempt_count").notNull().default(0),
  error: text("error"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const dailyStats = sqliteTable("daily_stats", {
  date: text("date").primaryKey(),
  xp: integer("xp").notNull().default(0),
  reviewsCompleted: integer("reviews_completed").notNull().default(0),
  newItemsLearned: integer("new_items_learned").notNull().default(0),
  practiceAttempts: integer("practice_attempts").notNull().default(0),
  correctAttempts: integer("correct_attempts").notNull().default(0),
  wrongAttempts: integer("wrong_attempts").notNull().default(0),
  dailyGoalCompleted: integer("daily_goal_completed", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const streaks = sqliteTable("streaks", {
  id: text("id").primaryKey(),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActiveDate: text("last_active_date"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
