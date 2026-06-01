import type { AgentPracticeContentPack } from "@/lib/practice/agent-practice-types";

export function buildAgentPracticePrompt(contentPack: AgentPracticeContentPack, candidateCount = 16) {
  return `Return JSON only. No markdown. No prose outside JSON.

Generate up to ${candidateCount} concise JLPT N5 practice questions.

Allowed content pack:
${JSON.stringify(contentPack, null, 2)}

Rules:
- Use only the allowed content and safe templates.
- Question types: multiple_choice, sentence_reorder, fill_blank.
- Do not force unnatural sentences.
- If there is not enough content, generate fewer questions.
- Avoid identity/self-referential nonsense like 私は私です.
- Avoid unnatural sentences like 学生は私です.
- Prefer natural beginner Japanese.
- Explanations must be simple English and one sentence only.
- For multiple_choice, correctAnswer must exactly match one choice.
- For fill_blank, choices must include correctAnswer.
- For sentence_reorder, use string blocks and a string-array correctAnswer buildable from blocks.

JSON shape:
{
  "questions": [
    {
      "type": "multiple_choice",
      "level": "N5",
      "prompt": "What does 私は学生です mean?",
      "choices": ["I am a student.", "I am a teacher.", "You are a student.", "Today is Japanese."],
      "correctAnswer": "I am a student.",
      "naturalSentence": "私は学生です。",
      "explanation": "私は学生です means I am a student.",
      "sourceItemIds": []
    }
  ]
}`;
}
