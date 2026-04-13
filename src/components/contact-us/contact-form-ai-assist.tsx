"use client";

import { useState } from "react";

import { Loader2, Sparkles } from "lucide-react";

import { CONTACT_FORM_LIMITS, getOpenRouterApiKey } from "@/constants/contact-form";
import { sanitizeContactText } from "@/utils/contact-form";
import { openRouterChatCompletion } from "@/utils/openrouter-client";

type Props = {
  draft: string;
  onApply: (text: string) => void;
  disabled: boolean;
};

/**
 * Опциональная подсказка текста через OpenRouter (бесплатные :free модели — см. README).
 */
export function ContactFormAiAssist({ draft, onApply, disabled }: Props) {
  const apiKey = getOpenRouterApiKey();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!apiKey) return null;

  const run = async () => {
    setError(null);
    const trimmed = draft.trim();
    if (trimmed.length < 4) {
      setError("Сначала пару слов в поле сообщения.");
      return;
    }
    const safe = sanitizeContactText(trimmed, CONTACT_FORM_LIMITS.messageMax);
    const prompt = `Ты редактор писем. Переформулируй черновик на русском: вежливо, по делу, без markdown и HTML, без мета-фраз про нейросеть. Не больше 1200 символов.

Черновик:
${safe}`;

    setLoading(true);
    try {
      const result = await openRouterChatCompletion({
        userContent: prompt,
        maxTokens: 768,
        temperature: 0.35,
        xTitle: "per0w.space — форма контактов",
      });
      if (!result.ok) {
        let msg = "AI временно недоступен или сработал лимит. Попробуй позже.";
        if (result.hint) {
          msg = `AI: ${result.hint}`;
        }
        else if (result.network) {
          msg = result.aborted
            ? "Запрос прерван (таймаут или переход со страницы). Попробуй ещё раз."
            : "Браузер не дошёл до OpenRouter. Часто мешают блокировщик рекламы, VPN, режим «только HTTPS» или фильтр сети. Отключи расширения для этого сайта или проверь доступ к openrouter.ai.";
        }
        setError(msg);
        return;
      }
      onApply(sanitizeContactText(result.text, CONTACT_FORM_LIMITS.messageMax).trim());
    } catch {
      setError("Сеть недоступна. Проверь соединение.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-form-ai-root flex flex-col items-end gap-1">
      <button
        aria-label="Подправить текст сообщения с помощью AI"
        className="contact-form-ai-badge group/ai neon-glow flex items-center gap-2 rounded-xl border-2 border-white/35 bg-linear-to-r from-accent via-accent-light to-accent-secondary px-3 py-2 text-sm font-black tracking-tight text-white shadow-[0_4px_22px_color-mix(in_srgb,var(--color-accent)_50%,transparent),0_0_0_1px_color-mix(in_srgb,var(--color-accent-secondary)_35%,transparent)] transition-[filter,box-shadow,transform] hover:brightness-105 hover:shadow-[0_6px_28px_color-mix(in_srgb,var(--color-accent)_58%,transparent),0_0_24px_color-mix(in_srgb,var(--color-accent-secondary)_28%,transparent)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 dark:border-white/20"
        disabled={disabled || loading}
        type="button"
        onClick={() => void run()}
      >
        {loading ? (
          <Loader2 aria-hidden className="size-4 shrink-0 animate-spin text-white" />
        ) : (
          <Sparkles
            aria-hidden
            className="size-4 shrink-0 text-white drop-shadow-[0_0_6px_color-mix(in_srgb,white_55%,transparent)] transition-transform duration-300 group-hover/ai:scale-110"
          />
        )}
        <span className="drop-shadow-sm">AI</span>
      </button>
      {error ? (
        <p className="max-w-[11rem] text-right text-[10px] leading-snug text-amber-800 dark:text-amber-200/90">
          {error}
        </p>
      ) : null}
    </div>
  );
}
