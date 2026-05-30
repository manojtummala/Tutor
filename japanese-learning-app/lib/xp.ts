import type { PracticeType } from "@/lib/content/types";

const xpByPracticeType: Record<PracticeType, number> = {
  flashcard: 5,
  multiple_choice: 5,
  match_pairs: 6,
  type_answer: 8,
  fill_blank: 8,
  sentence_reorder: 10,
};

export function getPracticeXp(practiceType: PracticeType, isCorrect: boolean) {
  return isCorrect ? xpByPracticeType[practiceType] : 0;
}

export function getLessonCompletionXp() {
  return 25;
}

export function getDailyGoalBonusXp() {
  return 20;
}
