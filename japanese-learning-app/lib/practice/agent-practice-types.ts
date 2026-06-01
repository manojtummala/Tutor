export type GeneratedQuestionType = "multiple_choice" | "fill_blank" | "sentence_reorder";

export type GeneratedPracticeQuestion = {
  id: string;
  type: GeneratedQuestionType;
  level: "N5";
  prompt: string;
  choices?: string[];
  blocks?: string[];
  correctAnswer: string | string[];
  naturalSentence?: string;
  explanation: string;
  sourceItemIds: string[];
};

export type AgentPracticeContentPack = {
  level: "N5";
  allowedVocabulary: string[];
  allowedParticles: string[];
  allowedGrammar: string[];
  allowedVerbs: string[];
  safeTemplates: Array<{
    pattern: string;
    slots: Record<string, string[]>;
  }>;
};

export type AgentPracticeGenerationResult =
  | { ok: true; questions: GeneratedPracticeQuestion[] }
  | { ok: false; error: string; detail?: string };
