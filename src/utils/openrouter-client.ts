import {
  CONTACT_FORM_OPENROUTER_URL,
  getOpenRouterApiKey,
  getOpenRouterModel,
} from "@/constants/contact-form";

function extractOpenRouterChatText(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const choices = (data as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return null;
  const first = choices[0] as { message?: { content?: unknown } };
  const content = first.message?.content;
  return typeof content === "string" ? content : null;
}

function openRouterHttpErrorHint(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const err = (data as { error?: { message?: unknown } }).error;
  if (err && typeof err === "object" && typeof err.message === "string") {
    return err.message.slice(0, 120);
  }
  return null;
}

export type OpenRouterChatResult =
  | { ok: true; text: string }
  | { ok: false; hint: string | null; network: boolean };

/**
 * Один запрос chat/completions к OpenRouter (ключ из NEXT_PUBLIC_OPENROUTER_API_KEY).
 */
export async function openRouterChatCompletion(params: {
  userContent: string;
  maxTokens: number;
  temperature: number;
  /** Заголовок X-Title для атрибуции в кабинете OpenRouter. */
  xTitle: string;
  signal?: AbortSignal;
}): Promise<OpenRouterChatResult> {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) return { ok: false, hint: null, network: false };

  try {
    const res = await fetch(CONTACT_FORM_OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "X-Title": params.xTitle,
      },
      body: JSON.stringify({
        model: getOpenRouterModel(),
        messages: [{ role: "user", content: params.userContent }],
        max_tokens: params.maxTokens,
        temperature: params.temperature,
      }),
      signal: params.signal,
    });
    const data: unknown = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, hint: openRouterHttpErrorHint(data), network: false };
    }
    const text = extractOpenRouterChatText(data);
    if (!text?.trim()) return { ok: false, hint: null, network: false };
    return { ok: true, text: text.trim() };
  } catch (e) {
    const aborted = e instanceof DOMException && e.name === "AbortError";
    if (aborted || (e instanceof Error && e.name === "AbortError")) {
      return { ok: false, hint: null, network: true };
    }
    return { ok: false, hint: null, network: true };
  }
}
