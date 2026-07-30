import { NextResponse } from "next/server";
import { markGeneratedQuestionShown } from "@/lib/server/generated-question-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json() as { questionId?: string; isCorrect?: boolean };
  if (!body.questionId) {
    return NextResponse.json({ error: "questionId is required" }, { status: 400 });
  }

  markGeneratedQuestionShown(body.questionId, Boolean(body.isCorrect));
  return NextResponse.json({ ok: true });
}

