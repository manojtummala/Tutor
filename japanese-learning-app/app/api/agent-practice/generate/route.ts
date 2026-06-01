import { NextResponse } from "next/server";
import { generateAgentPracticeQuestions } from "@/lib/ai/question-generator";

export const runtime = "nodejs";

export async function POST() {
  const result = await generateAgentPracticeQuestions();

  if (!result.ok) {
    return NextResponse.json({
      error: result.error,
      detail: result.detail,
      baseUrl: process.env.LM_STUDIO_BASE_URL ?? "http://127.0.0.1:1234",
    }, { status: 503 });
  }

  return NextResponse.json({ questions: result.questions });
}
