import { NextResponse } from "next/server";
import { queueQuestionGenerationIfNeeded } from "@/lib/server/question-generation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json() as { itemIds?: string[] };
  return NextResponse.json(queueQuestionGenerationIfNeeded(body.itemIds ?? []));
}

