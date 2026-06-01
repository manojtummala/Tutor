import { callLmStudio } from "@/lib/ai/lm-studio";

export function getAiProvider() {
  return process.env.AI_PROVIDER ?? "lmstudio";
}

export async function generateWithConfiguredProvider(prompt: string, temperature = 0.2) {
  const provider = getAiProvider();

  if (provider !== "lmstudio") {
    throw new Error(`Unsupported AI_PROVIDER: ${provider}`);
  }

  return callLmStudio([
    { role: "system", content: "You generate safe, valid JSON practice questions for a beginner Japanese learning app." },
    { role: "user", content: prompt },
  ], temperature);
}
