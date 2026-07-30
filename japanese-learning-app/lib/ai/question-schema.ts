import type { GeneratedPracticeQuestion, PracticeGenerationContentPack, ScriptMode } from "@/lib/practice/generated-practice-types";

const allowedTypes = new Set(["multiple_choice", "fill_blank", "sentence_reorder", "match_pairs"]);
const commonQuestionFields = new Set([
  "id",
  "type",
  "level",
  "prompt",
  "correctAnswer",
  "naturalSentence",
  "explanation",
  "sourceItemIds",
  "scriptMode",
  "kanjiUsed",
]);
const fieldsByType = {
  multiple_choice: new Set([...commonQuestionFields, "choices"]),
  fill_blank: new Set([...commonQuestionFields, "choices"]),
  sentence_reorder: new Set([...commonQuestionFields, "blocks"]),
  match_pairs: new Set([...commonQuestionFields, "blocks", "choices"]),
};

export const n5StarterContentPack: PracticeGenerationContentPack = {
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
  scriptPolicy: "learned_kanji_only",
  allowedKanji: [],
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

function hasChoiceLabel(value: string) {
  return /^[A-D][.)]\s+/i.test(value.trim());
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

function extractKanji(value: string) {
  return [...new Set(value.match(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/gu) ?? [])];
}

function questionKanji(question: GeneratedPracticeQuestion) {
  const values = [
    question.prompt,
    ...(question.choices ?? []),
    ...(question.blocks ?? []),
    ...(Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer]),
    question.naturalSentence ?? "",
  ];
  return [...new Set(values.flatMap(extractKanji))];
}

function questionJapaneseCharacters(question: GeneratedPracticeQuestion) {
  const values = [
    question.prompt,
    ...(question.choices ?? []),
    ...(question.blocks ?? []),
    ...(Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer]),
    question.naturalSentence ?? "",
  ];
  return [...new Set(values.join("").match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaffー]/gu) ?? [])];
}

function promptKey(prompt: string) {
  return prompt.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
}

type QuestionValidationResult =
  | { question: GeneratedPracticeQuestion }
  | { reason: string };

function validateQuestionFields(raw: Record<string, unknown>, type: GeneratedPracticeQuestion["type"]) {
  const allowedFields = fieldsByType[type];
  const unexpectedField = Object.keys(raw).find((field) => !allowedFields.has(field));
  return unexpectedField ? `unexpected field ${unexpectedField}` : null;
}

function normalizeQuestion(raw: Record<string, unknown>, index: number): QuestionValidationResult {
  if (!nonEmptyString(raw.type)) return { reason: "type must be a string" };
  if (!allowedTypes.has(raw.type)) return { reason: `unsupported type ${raw.type}` };

  const type = raw.type as GeneratedPracticeQuestion["type"];
  const fieldError = validateQuestionFields(raw, type);
  if (fieldError) return { reason: fieldError };

  if (raw.level !== "N5") return { reason: "level must be N5" };
  if (!nonEmptyString(raw.prompt)) return { reason: "prompt must be a non-empty string" };
  if (!("correctAnswer" in raw)) return { reason: "correctAnswer is required" };
  if (!nonEmptyString(raw.explanation)) return { reason: "explanation must be a non-empty string" };
  if (raw.scriptMode !== "kana_only" && raw.scriptMode !== "learned_kanji_only") return { reason: "scriptMode is invalid" };
  if (!stringArray(raw.sourceItemIds) || raw.sourceItemIds.length === 0) return { reason: "sourceItemIds must be a non-empty array of strings" };
  if (!Array.isArray(raw.kanjiUsed) || !raw.kanjiUsed.every((value) => typeof value === "string")) return { reason: "kanjiUsed must be an array of strings" };

  const base = {
    id: nonEmptyString(raw.id) ? raw.id : `agent-${index + 1}`,
    type,
    level: "N5" as const,
    prompt: raw.prompt.trim(),
    naturalSentence: nonEmptyString(raw.naturalSentence) ? raw.naturalSentence.trim() : undefined,
    explanation: raw.explanation.trim(),
    sourceItemIds: raw.sourceItemIds,
    scriptMode: raw.scriptMode as ScriptMode,
    kanjiUsed: raw.kanjiUsed,
  };

  if (base.type === "multiple_choice") {
    if (!stringArray(raw.choices)) return { reason: "choices must be an array of strings" };
    if (raw.choices.length !== 4) return { reason: "choices must contain exactly 4 strings" };
    if (raw.choices.some(hasChoiceLabel)) return { reason: "choices must not use A/B/C/D prefixes" };
    if (!nonEmptyString(raw.correctAnswer)) return { reason: "correctAnswer must be string" };
    if (!raw.choices.includes(raw.correctAnswer)) return { reason: "correctAnswer must exactly match one choice" };
    return { question: { ...base, choices: raw.choices, correctAnswer: raw.correctAnswer } };
  }

  if (base.type === "fill_blank") {
    if (!nonEmptyString(raw.correctAnswer)) return { reason: "correctAnswer must be string" };
    const choices = stringArray(raw.choices) ? raw.choices : undefined;
    if ("choices" in raw && raw.choices !== undefined && !choices) return { reason: "choices must be an array of strings" };
    if (choices && !choices.includes(raw.correctAnswer)) return { reason: "correctAnswer must exactly match one choice" };
    return { question: { ...base, choices, correctAnswer: raw.correctAnswer } };
  }

  if (base.type === "match_pairs") {
    if (!stringArray(raw.blocks) || raw.blocks.length === 0) return { reason: "blocks must be a non-empty array of strings" };
    if (!stringArray(raw.choices) || raw.choices.length !== raw.blocks.length) return { reason: "choices must match the number of blocks" };
    if (!stringArray(raw.correctAnswer) || raw.correctAnswer.length !== raw.blocks.length) return { reason: "correctAnswer must contain one pair per block" };
    const blocks = raw.blocks;
    const choices = raw.choices;
    const correctAnswer = raw.correctAnswer;
    const possiblePairs = new Set(blocks.flatMap((block) => choices.map((choice) => `${block}=${choice}`)));
    if (correctAnswer.some((pair) => !possiblePairs.has(pair))) return { reason: "correctAnswer pairs must use blocks and choices" };
    return { question: { ...base, blocks, choices, correctAnswer } };
  }

  if (!stringArray(raw.blocks) || raw.blocks.length === 0) return { reason: "blocks must be a non-empty array of strings" };
  if (!stringArray(raw.correctAnswer)) return { reason: "correctAnswer must be an array of strings" };
  if (!canBuildFromBlocks(raw.correctAnswer, raw.blocks)) return { reason: "correctAnswer must be buildable from blocks" };

  return { question: { ...base, blocks: raw.blocks, correctAnswer: raw.correctAnswer } };
}

export function validateGeneratedQuestions(
  payload: unknown,
  limit = 10,
  options: {
    allowedSourceItemIds?: string[];
    allowedKanji?: string[];
    allowedJapaneseCharacters?: string[];
    existingPrompts?: string[];
  } = {},
) {
  if (!isRecord(payload) || !Array.isArray(payload.questions)) {
    return { questions: [], errors: ["Top-level object must contain a questions array."] };
  }

  const seenPrompts = new Set((options.existingPrompts ?? []).map(promptKey));
  const allowedSourceItemIds = new Set(options.allowedSourceItemIds ?? []);
  const allowedKanji = new Set(options.allowedKanji ?? []);
  const allowedJapaneseCharacters = new Set(options.allowedJapaneseCharacters ?? []);
  const errors: string[] = [];
  const questions: GeneratedPracticeQuestion[] = [];

  payload.questions.forEach((rawQuestion, index) => {
    if (!isRecord(rawQuestion)) {
      errors.push(`Question ${index + 1} is not an object.`);
      return;
    }

    const result = normalizeQuestion(rawQuestion, index);
    if ("reason" in result) {
      const type = nonEmptyString(rawQuestion.type) ? rawQuestion.type : "unknown";
      const prompt = nonEmptyString(rawQuestion.prompt) ? rawQuestion.prompt : "";
      const message = `Rejected question ${index + 1}: ${type} ${result.reason}`;
      console.warn(message, { prompt });
      errors.push(message);
      return;
    }

    const normalized = result.question;
    if (allowedSourceItemIds.size > 0 && normalized.sourceItemIds.some((id) => !allowedSourceItemIds.has(id))) {
      const message = `Rejected question ${index + 1}: ${normalized.type} contains invalid source item IDs`;
      console.warn(message, { prompt: normalized.prompt });
      errors.push(message);
      return;
    }

    const usedKanji = questionKanji(normalized);
    const unknownKanji = usedKanji.filter((kanji) => !allowedKanji.has(kanji));
    if (unknownKanji.length > 0) {
      const message = `Rejected question ${index + 1}: ${normalized.type} contains unknown kanji ${unknownKanji.join(", ")}`;
      console.warn(message, { prompt: normalized.prompt });
      errors.push(message);
      return;
    }

    if (allowedJapaneseCharacters.size > 0) {
      const unknownCharacters = questionJapaneseCharacters(normalized).filter((character) => !allowedJapaneseCharacters.has(character));
      if (unknownCharacters.length > 0) {
        const message = `Rejected question ${index + 1}: ${normalized.type} contains Japanese outside allowed content ${unknownCharacters.join(", ")}`;
        console.warn(message, { prompt: normalized.prompt });
        errors.push(message);
        return;
      }
    }

    if (normalized.kanjiUsed.some((kanji) => !usedKanji.includes(kanji)) || usedKanji.some((kanji) => !normalized.kanjiUsed.includes(kanji))) {
      const message = `Rejected question ${index + 1}: ${normalized.type} kanjiUsed does not match question text`;
      console.warn(message, { prompt: normalized.prompt });
      errors.push(message);
      return;
    }

    if (usedKanji.length === 0 && normalized.scriptMode !== "kana_only") {
      normalized.scriptMode = "kana_only";
    }

    const normalizedPromptKey = promptKey(normalized.prompt);
    if (seenPrompts.has(normalizedPromptKey)) {
      const message = `Rejected question ${index + 1}: ${normalized.type} duplicates a prompt`;
      console.warn(message, { prompt: normalized.prompt });
      errors.push(message);
      return;
    }

    if (hasBadSentence(normalized)) {
      const message = `Rejected question ${index + 1}: ${normalized.type} contains an unnatural starter sentence`;
      console.warn(message, { prompt: normalized.prompt });
      errors.push(message);
      return;
    }

    seenPrompts.add(normalizedPromptKey);
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
