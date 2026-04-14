import {
  getOpenRouterApiKey,
  ORBO_OPENROUTER_MAX_FALLBACK_ATTEMPTS,
} from "@/constants/contact-form";
import { HERO_GREETING_ORBO_FALLBACKS } from "@/constants/hero-greeting";
import { buildOrboHeroGreetingPrompt, sanitizeHeroGreetingReply } from "@/utils/hero-greeting";
import { openRouterChatCompletion } from "@/utils/openrouter-client";

function pickRandomFallback(): string {
  const i = Math.floor(Math.random() * HERO_GREETING_ORBO_FALLBACKS.length);
  return HERO_GREETING_ORBO_FALLBACKS[i]!;
}

/**
 * Один запрос «реплика пользователя → фраза Орбо» (hero или пузырь).
 * Без учёта сессии/кулдауна — это остаётся в UI.
 */
export async function fetchOrboGreetingReplyLine(
  cleanedUserText: string,
  signal: AbortSignal,
  xTitle: string,
): Promise<string> {
  if (!getOpenRouterApiKey()) {
    return pickRandomFallback();
  }

  const result = await openRouterChatCompletion({
    userContent: buildOrboHeroGreetingPrompt(cleanedUserText),
    maxTokens: 140,
    temperature: 0.62,
    xTitle,
    signal,
    maxFallbackAttempts: ORBO_OPENROUTER_MAX_FALLBACK_ATTEMPTS,
  });

  if (!result.ok) {
    return pickRandomFallback();
  }

  const line = sanitizeHeroGreetingReply(result.text);
  return line.length > 0 ? line : pickRandomFallback();
}
