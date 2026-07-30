export type GeneratedQuestionType = "multiple_choice" | "fill_blank" | "sentence_reorder" | "match_pairs";
export type ScriptMode = "kana_only" | "learned_kanji_only";

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
  scriptMode: ScriptMode;
  kanjiUsed: string[];
};

export type PracticeGenerationContentPack = {
  level: "N5";
  allowedVocabulary: string[];
  allowedParticles: string[];
  allowedGrammar: string[];
  allowedVerbs: string[];
  safeTemplates: Array<{
    pattern: string;
    slots: Record<string, string[]>;
  }>;
  scriptPolicy: "learned_kanji_only";
  allowedKanji: string[];
};
