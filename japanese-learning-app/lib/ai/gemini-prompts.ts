import type { PracticeGenerationContentPack } from "@/lib/practice/generated-practice-types";

export function buildBackgroundQuestionPrompt(
  contentPack: PracticeGenerationContentPack,
  targetItems: Array<{ id: string; japanese: string; reading: string | null; romaji: string | null; meaning: string }>,
) {
  return `Generate 5-6 beginner Japanese practice questions involving the target items.
Use multiple_choice, fill_blank, sentence_reorder, or match_pairs when the available content supports them.
Use only the provided allowed content and source item IDs.
Prefer natural N5-level Japanese and short English explanations.
Avoid unnatural/self-referential sentences such as 私は私です.
If valid content is limited, generate fewer questions instead of forcing bad questions.
Use only allowed kanji. If allowedKanji is empty, write Japanese using kana only.
Do not introduce unknown vocabulary, grammar, or kanji.

Target items:
${JSON.stringify(targetItems)}

Allowed content and script policy:
${JSON.stringify(contentPack)}`;
}
