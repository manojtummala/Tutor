import type { AgentPracticeContentPack, GeneratedPracticeQuestion } from "@/lib/practice/agent-practice-types";

const allowedTypes = new Set(["multiple_choice", "fill_blank", "sentence_reorder"]);

export const n5StarterContentPack: AgentPracticeContentPack = {
  level: "N5",
  allowedVocabulary: ["私", "あなた", "学生", "先生", "日本語", "今日"],
  allowedParticles: ["は", "を", "か"],
  allowedGrammar: [
    "A は B です",
    "A は B ではありません",
    "A は B ですか",
    "A は N を Vます",
  ],
  allowedVerbs: ["勉強します"],
  safeTemplates: [
    { pattern: "A は B です", slots: { A: ["私", "あなた"], B: ["学生", "先生"] } },
    { pattern: "A は B ではありません", slots: { A: ["私", "あなた"], B: ["学生", "先生"] } },
    { pattern: "A は B ですか", slots: { A: ["私", "あなた"], B: ["学生", "先生"] } },
    { pattern: "A は N を Vます", slots: { A: ["私", "あなた"], N: ["日本語"], V: ["勉強します"] } },
  ],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function stringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(nonEmptyString);
}

function canBuildFromBlocks(answer: string[], blocks: string[]) {
  const remaining = [...blocks];

  for (const part of answer) {
    const index = remaining.indexOf(part);
    if (index === -1) {
      return false;
    }
    remaining.splice(index, 1);
  }

  return true;
}

function hasBadSentence(question: GeneratedPracticeQuestion) {
  const joined = [question.prompt, question.naturalSentence, question.explanation].filter(Boolean).join(" ");
  return joined.includes("私は私です") || joined.includes("学生は私です");
}

function normalizeQuestion(raw: Record<string, unknown>, index: number): GeneratedPracticeQuestion | null {
  if (!nonEmptyString(raw.type) || !allowedTypes.has(raw.type)) return null;
  if (raw.level !== "N5") return null;
  if (!nonEmptyString(raw.prompt)) return null;
  if (!("correctAnswer" in raw)) return null;
  if (!nonEmptyString(raw.explanation)) return null;

  const base = {
    id: nonEmptyString(raw.id) ? raw.id : `agent-${index + 1}`,
    type: raw.type as GeneratedPracticeQuestion["type"],
    level: "N5" as const,
    prompt: raw.prompt.trim(),
    naturalSentence: nonEmptyString(raw.naturalSentence) ? raw.naturalSentence.trim() : undefined,
    explanation: raw.explanation.trim(),
    sourceItemIds: stringArray(raw.sourceItemIds) ? raw.sourceItemIds : [],
  };

  if (base.type === "multiple_choice") {
    if (!stringArray(raw.choices)) return null;
    if (!nonEmptyString(raw.correctAnswer)) return null;
    if (!raw.choices.includes(raw.correctAnswer)) return null;
    return { ...base, choices: raw.choices, correctAnswer: raw.correctAnswer };
  }

  if (base.type === "fill_blank") {
    if (!nonEmptyString(raw.correctAnswer)) return null;
    const choices = stringArray(raw.choices) ? raw.choices : undefined;
    if (choices && !choices.includes(raw.correctAnswer)) return null;
    return { ...base, choices, correctAnswer: raw.correctAnswer };
  }

  if (!stringArray(raw.blocks) || raw.blocks.length === 0) return null;
  if (!stringArray(raw.correctAnswer)) return null;
  if (!canBuildFromBlocks(raw.correctAnswer, raw.blocks)) return null;

  return { ...base, blocks: raw.blocks, correctAnswer: raw.correctAnswer };
}

export function validateGeneratedQuestions(payload: unknown, limit = 10) {
  if (!isRecord(payload) || !Array.isArray(payload.questions)) {
    return { questions: [], errors: ["Top-level object must contain a questions array."] };
  }

  const seenPrompts = new Set<string>();
  const errors: string[] = [];
  const questions: GeneratedPracticeQuestion[] = [];

  payload.questions.forEach((rawQuestion, index) => {
    if (!isRecord(rawQuestion)) {
      errors.push(`Question ${index + 1} is not an object.`);
      return;
    }

    const normalized = normalizeQuestion(rawQuestion, index);
    if (!normalized) {
      errors.push(`Question ${index + 1} failed validation.`);
      return;
    }

    const promptKey = normalized.prompt.trim().toLowerCase();
    if (seenPrompts.has(promptKey)) {
      errors.push(`Question ${index + 1} duplicates a prompt.`);
      return;
    }

    if (hasBadSentence(normalized)) {
      errors.push(`Question ${index + 1} contains an unnatural starter sentence.`);
      return;
    }

    seenPrompts.add(promptKey);
    questions.push(normalized);
  });

  return { questions: questions.slice(0, limit), errors };
}

export function parseModelJson(text: string) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error("The model responded, but not with valid JSON.", { cause: error });
  }
}
