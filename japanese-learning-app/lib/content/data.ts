import modulesData from "@/data/modules.json";
import lessonsData from "@/data/lessons.json";
import hiraganaData from "@/data/kana/hiragana.json";
import katakanaData from "@/data/kana/katakana.json";
import variationsData from "@/data/kana/variations.json";
import n5VocabularyData from "@/data/jlpt/n5_vocab.json";
import n5KanjiData from "@/data/jlpt/n5_kanji.json";
import n5GrammarData from "@/data/jlpt/n5_grammar.json";
import n5SentencesData from "@/data/jlpt/n5_sentences.json";
import type { LearningItem, Lesson, LessonWithItems, Module } from "./types";

export const modules = modulesData as Module[];
export const lessons = lessonsData as Lesson[];
export const learningItems = [
  ...hiraganaData,
  ...katakanaData,
  ...variationsData,
  ...n5VocabularyData,
  ...n5KanjiData,
  ...n5GrammarData,
  ...n5SentencesData,
] as LearningItem[];

export function getModule(moduleId: string) {
  return modules.find((module) => module.id === moduleId);
}

export function getLesson(lessonId: string) {
  return lessons.find((lesson) => lesson.id === lessonId);
}

export function getItemsForLesson(lessonId: string) {
  return learningItems.filter((item) => item.lessonId === lessonId);
}

export function getLessonsForModule(moduleId: string): LessonWithItems[] {
  return lessons
    .filter((lesson) => lesson.moduleId === moduleId)
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((lesson, index) => {
      const items = getItemsForLesson(lesson.id);
      const completion = lesson.isUnlocked ? Math.max(12, Math.min(100, index * 18)) : 0;

      return {
        ...lesson,
        items,
        completion,
      };
    });
}

export function getKanaStats() {
  const kanaItems = learningItems.filter((item) => item.type === "kana");
  const hiragana = kanaItems.filter((item) => item.metadata.script === "hiragana" && item.metadata.variationType === "basic");
  const katakana = kanaItems.filter((item) => item.metadata.script === "katakana" && item.metadata.variationType === "basic");
  const variations = kanaItems.filter((item) => item.metadata.variationType !== "basic");

  return {
    total: kanaItems.length,
    hiragana: hiragana.length,
    katakana: katakana.length,
    variations: variations.length,
    unlockedLessons: lessons.filter((lesson) => lesson.moduleId === "kana-foundations" && lesson.isUnlocked).length,
  };
}

export function getKanaSections() {
  const kanaItems = learningItems.filter((item) => item.type === "kana");

  return {
    hiragana: kanaItems.filter((item) => item.metadata.script === "hiragana" && item.metadata.variationType === "basic"),
    katakana: kanaItems.filter((item) => item.metadata.script === "katakana" && item.metadata.variationType === "basic"),
    variations: kanaItems.filter((item) => item.metadata.variationType !== "basic"),
    kanji: learningItems.filter((item) => item.type === "kanji"),
  };
}

export function getDashboardSnapshot() {
  const kanaLessons = getLessonsForModule("kana-foundations");
  const nextLesson = kanaLessons.find((lesson) => lesson.isUnlocked && lesson.completion < 100) ?? kanaLessons[0];
  const kanaStats = getKanaStats();

  return {
    dailyGoal: { completed: 0, target: 10 },
    xpToday: 0,
    reviewsDue: learningItems.filter((item) => item.type === "kana" && item.lessonId !== "hiragana-vowels").length,
    streak: 0,
    accuracy: 0,
    kanaProgress: Math.round((kanaStats.unlockedLessons / Math.max(kanaLessons.length, 1)) * 100),
    n5Progress: 0,
    nextLesson,
    kanaStats,
  };
}
