import { buildAgentPracticePrompt } from "@/lib/ai/prompts";
import { LmStudioError } from "@/lib/ai/lm-studio";
import { n5StarterContentPack, parseModelJson, validateGeneratedQuestions } from "@/lib/ai/question-schema";
import { generateWithConfiguredProvider } from "@/lib/ai/provider";
import type { AgentPracticeGenerationResult, GeneratedPracticeQuestion } from "@/lib/practice/agent-practice-types";

const initialCandidateCount = 8;
const retryCandidateCount = 6;
const targetQuestionCount = 6;

function mockQuestions(): GeneratedPracticeQuestion[] {
  return [
    {
      id: "mock-mc-1",
      type: "multiple_choice",
      level: "N5",
      prompt: "What does 私は学生です mean?",
      choices: ["I am a student.", "I am a teacher.", "You are a student.", "I study Japanese."],
      correctAnswer: "I am a student.",
      naturalSentence: "私は学生です。",
      explanation: "私は学生です means I am a student.",
      sourceItemIds: [],
    },
    {
      id: "mock-reorder-1",
      type: "sentence_reorder",
      level: "N5",
      prompt: "Build: I study Japanese.",
      blocks: ["私", "は", "日本語", "を", "勉強します"],
      correctAnswer: ["私", "は", "日本語", "を", "勉強します"],
      naturalSentence: "私は日本語を勉強します。",
      explanation: "A は N を Vます can describe what someone does.",
      sourceItemIds: [],
    },
    {
      id: "mock-fill-1",
      type: "fill_blank",
      level: "N5",
      prompt: "私__学生です。",
      choices: ["は", "を", "か"],
      correctAnswer: "は",
      naturalSentence: "私は学生です。",
      explanation: "は marks the topic.",
      sourceItemIds: [],
    },
    {
      id: "mock-mc-2",
      type: "multiple_choice",
      level: "N5",
      prompt: "What does あなたは先生ですか mean?",
      choices: ["Are you a teacher?", "I am not a teacher.", "You study Japanese.", "Today is Japanese."],
      correctAnswer: "Are you a teacher?",
      naturalSentence: "あなたは先生ですか。",
      explanation: "か marks a question.",
      sourceItemIds: [],
    },
    {
      id: "mock-reorder-2",
      type: "sentence_reorder",
      level: "N5",
      prompt: "Build: I am not a teacher.",
      blocks: ["私", "は", "先生", "ではありません"],
      correctAnswer: ["私", "は", "先生", "ではありません"],
      naturalSentence: "私は先生ではありません。",
      explanation: "ではありません is the negative form of です.",
      sourceItemIds: [],
    },
    {
      id: "mock-fill-2",
      type: "fill_blank",
      level: "N5",
      prompt: "私は日本語__勉強します。",
      choices: ["を", "は", "か"],
      correctAnswer: "を",
      naturalSentence: "私は日本語を勉強します。",
      explanation: "を marks the object of the verb.",
      sourceItemIds: [],
    },
  ];
}

async function generateOnce(candidateCount: number) {
  console.info("Agent Practice generation attempt starting.", { candidateCount, targetQuestionCount });
  const prompt = buildAgentPracticePrompt(n5StarterContentPack, candidateCount);
  const text = await generateWithConfiguredProvider(prompt, 0.1);
  const result = validateGeneratedQuestions(parseModelJson(text), targetQuestionCount);
  console.info("Agent Practice validation complete.", {
    candidateCount,
    validQuestions: result.questions.length,
    validationErrors: result.errors.length,
  });
  return result;
}

export async function generateAgentPracticeQuestions(): Promise<AgentPracticeGenerationResult> {
  if (process.env.AGENT_PRACTICE_MOCK === "true") {
    return { ok: true, questions: mockQuestions() };
  }

  try {
    let result = await generateOnce(initialCandidateCount);

    if (result.questions.length < targetQuestionCount) {
      console.warn("Agent Practice validation produced too few questions, retrying.", result.errors);
      result = await generateOnce(retryCandidateCount);
    }

    if (result.questions.length < targetQuestionCount) {
      console.warn("Agent Practice validation failed after retry.", result.errors);
      if (result.questions.length === 0) {
        return {
          ok: false,
          error: "The model responded, but no valid practice questions passed validation.",
          detail: result.errors.join(" "),
        };
      }

      return {
        ok: false,
        error: "The model did not return enough valid questions.",
        detail: `${result.questions.length} of ${targetQuestionCount} questions passed validation.`,
      };
    }

    return { ok: true, questions: result.questions };
  } catch (error) {
    console.error("Agent Practice generation failed:", error);

    if (error instanceof LmStudioError) {
      if (error.code === "timeout") {
        return {
          ok: false,
          error: "LM Studio took too long to respond. Try fewer questions or a smaller/faster model.",
          detail: error.message,
        };
      }

      if (error.code === "connection") {
        return {
          ok: false,
          error: `Could not connect to LM Studio at ${error.baseUrl}.`,
          detail: error.message,
        };
      }
    }

    if (error instanceof Error && error.message === "The model responded, but not with valid JSON.") {
      return {
        ok: false,
        error: "The model responded, but not with valid JSON.",
        detail: "The response must be one complete JSON object with a questions array.",
      };
    }

    return {
      ok: false,
      error: "Could not generate Agent Practice questions.",
      detail: error instanceof Error ? error.message : "Unknown generation error.",
    };
  }
}
