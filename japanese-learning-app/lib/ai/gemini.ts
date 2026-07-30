const responseJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["questions"],
  properties: {
    questions: {
      type: "array",
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "type",
          "level",
          "prompt",
          "correctAnswer",
          "explanation",
          "sourceItemIds",
          "scriptMode",
          "kanjiUsed",
        ],
        properties: {
          type: { type: "string", enum: ["multiple_choice", "fill_blank", "sentence_reorder", "match_pairs"] },
          level: { type: "string", enum: ["N5"] },
          prompt: { type: "string" },
          choices: { type: "array", items: { type: "string" } },
          blocks: { type: "array", items: { type: "string" } },
          correctAnswer: {
            anyOf: [
              { type: "string" },
              { type: "array", items: { type: "string" } },
            ],
          },
          naturalSentence: { type: "string" },
          explanation: { type: "string" },
          sourceItemIds: { type: "array", minItems: 1, items: { type: "string" } },
          scriptMode: { type: "string", enum: ["kana_only", "learned_kanji_only"] },
          kanjiUsed: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

export async function generateStructuredQuestions(prompt: string, model: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2200,
        responseMimeType: "application/json",
        responseJsonSchema,
      },
    }),
    signal: AbortSignal.timeout(120000),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Gemini request failed with ${response.status}: ${detail.slice(0, 300)}`);
  }

  const data = await response.json() as GeminiResponse;
  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
  if (!text) {
    throw new Error("Gemini returned no structured question content.");
  }

  return JSON.parse(text) as unknown;
}
