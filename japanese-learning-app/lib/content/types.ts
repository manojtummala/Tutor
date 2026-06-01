export type LearningItemType = "kana" | "vocab" | "kanji" | "grammar" | "sentence";
export type PracticeType = "flashcard" | "multiple_choice" | "match_pairs" | "type_answer" | "audio_recognition" | "fill_blank" | "sentence_reorder";
export type ItemStatus = "new" | "introduced" | "practicing" | "learned" | "learning" | "reviewing" | "mastered" | "difficult";
export type KanaProgressStatus = "new" | "introduced" | "practicing" | "learned";
export type Level = "kana" | "N5" | "N4" | "N3" | "N2" | "N1";

export type Module = {
  id: string;
  title: string;
  description: string;
  level: Level;
  orderIndex: number;
  isUnlocked: boolean;
};

export type Lesson = {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  orderIndex: number;
  lessonType: string;
  isUnlocked: boolean;
};

export type LearningItem = {
  id: string;
  type: LearningItemType;
  level: Level;
  moduleId: string;
  lessonId: string;
  japanese: string;
  reading: string | null;
  romaji: string | null;
  meaning: string;
  audioSrc?: string | null;
  explanation?: string | null;
  metadata: Record<string, unknown>;
};

export type LessonWithItems = Lesson & {
  items: LearningItem[];
  completion: number;
};

export type KanaProgress = {
  itemId: string;
  status: KanaProgressStatus;
  introducedAt: string | null;
  correctAttemptCount: number;
  practiceAttemptCount: number;
  targetCorrectAttempts: number;
  learnedAt: string | null;
};
