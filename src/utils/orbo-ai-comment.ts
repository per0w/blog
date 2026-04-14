import { AI_PROMPT_TEMPLATE, SECTION_NAMES } from "@/components/ai-buddy/orbo-data";
import { ORBO_AI_TIMEOUT_MS } from "@/constants/ai-buddy";
import { CV_READER_ROLES, type CvReaderRole } from "@/constants/common";
import {
  getOpenRouterApiKey,
  ORBO_OPENROUTER_COOLDOWN_MS,
  ORBO_OPENROUTER_MAX_FALLBACK_ATTEMPTS,
} from "@/constants/contact-form";
import { openRouterChatCompletion } from "@/utils/openrouter-client";
import { withOrboOpenRouterSlot } from "@/utils/orbo-openrouter-mutex";

let orboOpenRouterLastAttemptAt = 0;

/** Подпись роли для промпта CV (режим «глазами читателя»). */
const CV_READER_ROLE_LABELS: Record<CvReaderRole, string> = {
  [CV_READER_ROLES.hr]: "HR / рекрутёр",
  [CV_READER_ROLES.frontendLead]: "Frontend Lead",
  [CV_READER_ROLES.cto]: "CTO / техлид на уровне команды",
};

async function fetchOrboLineFromLlm(userContent: string, xTitle: string): Promise<string | null> {
  if (getOpenRouterApiKey()) {
    const fromOpenRouter = await withOrboOpenRouterSlot(async () => {
      const now = Date.now();
      if (now - orboOpenRouterLastAttemptAt < ORBO_OPENROUTER_COOLDOWN_MS) {
        return null;
      }
      orboOpenRouterLastAttemptAt = Date.now();

      const ac = new AbortController();
      const t = window.setTimeout(() => ac.abort(), 12_000);
      try {
        const or = await openRouterChatCompletion({
          userContent,
          maxTokens: 120,
          temperature: 0.55,
          xTitle,
          signal: ac.signal,
          maxFallbackAttempts: ORBO_OPENROUTER_MAX_FALLBACK_ATTEMPTS,
        });
        if (or.ok) {
          const line = or.text.replace(/\s+/g, " ").trim().slice(0, 280);
          return line.length > 0 ? line : null;
        }
      } catch {
        /* падаем на встроенную модель Chrome */
      } finally {
        window.clearTimeout(t);
      }
      return null;
    });
    if (fromOpenRouter) return fromOpenRouter;
  }

  try {
    if (typeof LanguageModel === "undefined") return null;

    const availability = await LanguageModel.availability();
    if (availability === "unavailable") return null;

    const createPromise = LanguageModel.create();
    try {
      const session = await Promise.race([
        createPromise,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), ORBO_AI_TIMEOUT_MS),
        ),
      ]);
      try {
        const result = await session.prompt(userContent);
        return result?.trim() || null;
      } finally {
        session.destroy();
      }
    } catch {
      /* Таймаут гонки: create() всё равно может завершиться — обязательно destroy. */
      void createPromise
        .then((s) => {
          try {
            s.destroy();
          } catch {
            /* сессия уже закрыта */
          }
        })
        .catch(() => {});
      return null;
    }
  } catch {
    return null;
  }
}

export async function getOrboAiComment(sectionId: string): Promise<string | null> {
  const sectionName = SECTION_NAMES[sectionId] ?? sectionId;
  const prompt = AI_PROMPT_TEMPLATE(sectionName);
  return fetchOrboLineFromLlm(prompt, "per0w.space - Orbo");
}

/**
 * Реплика при переключении режима «Смотреть CV глазами». OpenRouter / Chrome AI;
 * при null вызывающий подставляет хардкод из `CV_ROLE_CHANGE_COMMENTS`.
 */
export async function getOrboCvRoleSwitchComment(role: CvReaderRole): Promise<string | null> {
  const label = CV_READER_ROLE_LABELS[role];
  const userContent = `Ты — Орбо, ироничный добрый маскот на CV-сайте Владимира Перова (русский язык).
Пользователь переключил режим чтения резюме на роль: «${label}».
Напиши одно короткое предложение-комментарий (до 18 слов), с лёгкой иронией, по делу про эту роль читателя.
Без кавычек, без Markdown, без списков — только одна строка.`;
  return fetchOrboLineFromLlm(userContent, "per0w.space - Orbo CV role");
}
