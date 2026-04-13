import {
  CONTACT_FORM_OPENROUTER_URL,
  getOpenRouterApiKey,
  getOpenRouterModelsToTry,
} from "@/constants/contact-form";

/** OpenAI-совместимый ответ: `content` строка или массив частей `{ type, text }`. */
function extractOpenRouterChatText(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const choices = (data as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return null;
  const first = choices[0] as { message?: { content?: unknown } };
  const content = first.message?.content;

  if (typeof content === "string") {
    const t = content.trim();
    return t.length > 0 ? t : null;
  }

  if (Array.isArray(content)) {
    const joined = content
      .map((part) => {
        if (typeof part === "string") return part;
        if (!part || typeof part !== "object") return "";
        const o = part as { type?: unknown; text?: unknown };
        if (typeof o.text === "string") return o.text;
        return "";
      })
      .join("");
    const t = joined.trim();
    return t.length > 0 ? t : null;
  }

  return null;
}

const OPENROUTER_HINT_MAX = 220;

function openRouterHttpErrorHint(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const err = (data as { error?: unknown }).error;
  if (!err || typeof err !== "object") return null;

  const meta = (err as { metadata?: unknown }).metadata;
  if (meta && typeof meta === "object") {
    const raw = (meta as { raw?: unknown }).raw;
    if (typeof raw === "string" && raw.trim()) {
      return raw.trim().slice(0, OPENROUTER_HINT_MAX);
    }
  }

  const message = (err as { message?: unknown }).message;
  if (typeof message === "string" && message.trim()) {
    return message.trim().slice(0, OPENROUTER_HINT_MAX);
  }
  return null;
}

/**
 * Fetch в Chromium требует, чтобы значения заголовков были в ISO-8859-1; кириллица и «умные» тире
 * (U+2013/U+2014) дают TypeError: Failed to read the 'headers' property...
 */
function toIso88591HeaderValue(value: string, fallback: string): string {
  const normalized = value
    .replaceAll("\u2013", "-")
    .replaceAll("\u2014", "-")
    .replace(/[^\x00-\xff]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return normalized.length > 0 ? normalized : fallback;
}

export type OpenRouterChatResult =
  | { ok: true; text: string }
  | {
      ok: false;
      hint: string | null;
      network: boolean;
      /** Сработал AbortSignal (таймаут, уход со страницы) — не путать с «нет интернета». */
      aborted?: boolean;
    };

/**
 * Один запрос chat/completions к OpenRouter (ключ из NEXT_PUBLIC_OPENROUTER_API_KEY).
 * @param maxFallbackAttempts — сколько моделей из цепочки пробовать при 429 (форма: все; Орбо: 1–2).
 */
export async function openRouterChatCompletion(params: {
  userContent: string;
  maxTokens: number;
  temperature: number;
  /** Заголовок X-Title для атрибуции в кабинете OpenRouter. */
  xTitle: string;
  signal?: AbortSignal;
  maxFallbackAttempts?: number;
}): Promise<OpenRouterChatResult> {
  const apiKey = getOpenRouterApiKey();
  if (!apiKey) return { ok: false, hint: null, network: false };

  // OpenRouter рекомендует HTTP-Referer для атрибуции; с ограничением ключа по URL без него запросы могут отклоняться.
  const referer = typeof window !== "undefined" ? window.location.origin : "https://per0w.space";
  const xTitleSafe = toIso88591HeaderValue(params.xTitle, "per0w.space");

  try {
    const chain = getOpenRouterModelsToTry();
    const cap =
      params.maxFallbackAttempts === undefined
        ? chain.length
        : Math.max(1, Math.min(params.maxFallbackAttempts, chain.length));
    const modelsToUse = chain.slice(0, cap);
    let lastHint: string | null = null;

    for (let i = 0; i < modelsToUse.length; i++) {
      if (params.signal?.aborted) {
        return { ok: false, hint: null, network: true, aborted: true };
      }

      const res = await fetch(CONTACT_FORM_OPENROUTER_URL, {
        method: "POST",
        mode: "cors",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": referer,
          "X-Title": xTitleSafe,
        },
        body: JSON.stringify({
          model: modelsToUse[i],
          messages: [{ role: "user", content: params.userContent }],
          max_tokens: params.maxTokens,
          temperature: params.temperature,
        }),
        signal: params.signal,
      });
      const data: unknown = await res.json().catch(() => null);

      if (res.ok) {
        const text = extractOpenRouterChatText(data);
        if (!text?.trim()) return { ok: false, hint: null, network: false };
        return { ok: true, text: text.trim() };
      }

      lastHint = openRouterHttpErrorHint(data);
      /* Бесплатные upstream часто отдают 429; при явной модели в env цикл из одного шага. */
      if (res.status === 429 && i < modelsToUse.length - 1) {
        continue;
      }
      return { ok: false, hint: lastHint, network: false };
    }

    return { ok: false, hint: lastHint, network: false };
  } catch (e) {
    const aborted =
      (e instanceof DOMException && e.name === "AbortError") ||
      (e instanceof Error && e.name === "AbortError");
    if (aborted) {
      return { ok: false, hint: null, network: true, aborted: true };
    }

    if (process.env.NODE_ENV === "development") {
      console.warn("[OpenRouter] запрос из браузера не выполнен:", e);
    }

    const message = e instanceof Error ? e.message : "";
    const typicalBrowserBlock =
      message === "Failed to fetch" ||
      message === "Load failed" ||
      message === "NetworkError when attempting to fetch resource." ||
      message.startsWith("NetworkError");

    let fetchHint: string | null = null;
    if (!typicalBrowserBlock && message) {
      fetchHint = message.slice(0, 120);
    }

    return {
      ok: false,
      hint: fetchHint,
      network: true,
    };
  }
}
