type ChatMessage = {
  role: "system" | "user";
  content: string;
};

type LmStudioErrorCode = "timeout" | "connection" | "http" | "empty";

export class LmStudioError extends Error {
  code: LmStudioErrorCode;
  baseUrl: string;

  constructor(code: LmStudioErrorCode, message: string, baseUrl: string) {
    super(message);
    this.name = "LmStudioError";
    this.code = code;
    this.baseUrl = baseUrl;
  }
}

function envNumber(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function getRequestTimeoutMs() {
  return Math.max(envNumber("AI_REQUEST_TIMEOUT_MS", 120000), 120000);
}

function getMaxTokens() {
  return envNumber("AI_MAX_OUTPUT_TOKENS", 1400);
}

function isTimeoutError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error.name === "TimeoutError" || error.name === "AbortError")
  );
}

export async function callLmStudio(messages: ChatMessage[], temperature = 0.2) {
  const baseUrl = process.env.LM_STUDIO_BASE_URL ?? "http://127.0.0.1:1234";
  const model = process.env.LM_STUDIO_MODEL ?? "qwen2.5-3b-instruct-mlx";
  const apiKey = process.env.LM_STUDIO_API_KEY ?? "lm-studio";
  const requestTimeoutMs = getRequestTimeoutMs();
  const maxTokens = getMaxTokens();
  const endpoint = `${baseUrl.replace(/\/$/, "")}/v1/chat/completions`;

  console.info("Agent Practice LM Studio request starting.", {
    baseUrl,
    model,
    requestTimeoutMs,
    maxTokens,
    messages: messages.length,
  });

  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      signal: AbortSignal.timeout(requestTimeoutMs),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });
  } catch (error) {
    if (isTimeoutError(error)) {
      console.warn("Agent Practice LM Studio request timed out.", { baseUrl, requestTimeoutMs });
      throw new LmStudioError("timeout", `LM Studio request timed out after ${requestTimeoutMs}ms.`, baseUrl);
    }

    console.error("Agent Practice LM Studio connection failed.", { baseUrl, error });
    throw new LmStudioError("connection", `Could not connect to LM Studio at ${baseUrl}.`, baseUrl);
  }

  console.info("Agent Practice LM Studio response received.", {
    baseUrl,
    status: response.status,
    ok: response.ok,
  });

  if (!response.ok) {
    throw new LmStudioError("http", `LM Studio request failed with ${response.status} at ${baseUrl}.`, baseUrl);
  }

  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new LmStudioError("empty", "LM Studio returned no message content.", baseUrl);
  }

  console.info("Agent Practice LM Studio content received.", { characters: content.length });

  return content;
}
