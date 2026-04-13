"use client";

import { useState } from "react";

import { Loader2, Sparkles } from "lucide-react";

import {
  CONTACT_FORM_GEMINI_MODEL,
  CONTACT_FORM_LIMITS,
  getGeminiApiKey,
} from "@/constants/contact-form";
import { sanitizeContactText } from "@/utils/contact-form";

type Props = {
  draft: string;
  onApply: (text: string) => void;
  disabled: boolean;
};

function extractGeminiText(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const cands = (data as { candidates?: unknown }).candidates;
  if (!Array.isArray(cands) || cands.length === 0) return null;
  const first = cands[0];
  if (!first || typeof first !== "object") return null;
  const content = (first as { content?: unknown }).content;
  if (!content || typeof content !== "object") return null;
  const parts = (content as { parts?: unknown }).parts;
  if (!Array.isArray(parts) || parts.length === 0) return null;
  const part = parts[0] as { text?: unknown };
  return typeof part.text === "string" ? part.text : null;
}

/**
 * Опциональная подсказка текста через Gemini (ключ только NEXT_PUBLIC_* — см. README).
 */
export function ContactFormAiAssist({ draft, onApply, disabled }: Props) {
  const apiKey = getGeminiApiKey();
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
    setLoading(true);
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONTACT_FORM_GEMINI_MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Ты редактор писем. Переформулируй черновик на русском: вежливо, по делу, без markdown и HTML, без мета-фраз про нейросеть. Не больше 1200 символов.

Черновик:
${safe}`,
                },
              ],
            },
          ],
          generationConfig: { maxOutputTokens: 768, temperature: 0.35 },
        }),
      });
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        setError("AI временно недоступен или сработал лимит. Попробуй позже.");
        return;
      }
      const text = extractGeminiText(data);
      if (!text) {
        setError("Пустой ответ — упрости формулировку и повтори.");
        return;
      }
      onApply(sanitizeContactText(text.trim(), CONTACT_FORM_LIMITS.messageMax).trim());
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
        className="contact-form-ai-badge group/ai flex items-center gap-1.5 rounded-lg border border-cyan-400/50 bg-linear-to-br from-cyan-500/25 via-fuchsia-600/20 to-violet-600/25 px-2.5 py-1.5 text-cyan-50 shadow-[0_0_20px_color-mix(in_srgb,var(--color-accent-secondary)_35%,transparent)] backdrop-blur-sm transition-[transform,box-shadow] hover:shadow-[0_0_28px_color-mix(in_srgb,var(--color-accent)_40%,transparent)] disabled:pointer-events-none disabled:opacity-45 dark:border-cyan-300/40 dark:from-cyan-400/20 dark:via-fuchsia-500/15 dark:to-violet-500/20"
        disabled={disabled || loading}
        type="button"
        onClick={() => void run()}
      >
        {loading ? (
          <Loader2 aria-hidden className="size-4 shrink-0 animate-spin text-cyan-200" />
        ) : (
          <Sparkles
            aria-hidden
            className="size-4 shrink-0 text-cyan-200 transition-transform duration-300 group-hover/ai:scale-110"
          />
        )}
        <span className="font-black tracking-tighter">AI</span>
      </button>
      {error ? (
        <p className="max-w-[11rem] text-right text-[10px] leading-snug text-amber-800 dark:text-amber-200/90">
          {error}
        </p>
      ) : null}
    </div>
  );
}
