import type { LearningItem } from "@/lib/content/types";

export function buildMultipleChoicePrompt(item: LearningItem, choices: LearningItem[]) {
  return {
    prompt: `What sound does ${item.japanese} represent?`,
    correctAnswer: item.romaji ?? item.reading ?? item.meaning,
    choices: choices.map((choice) => choice.romaji ?? choice.reading ?? choice.meaning),
  };
}
