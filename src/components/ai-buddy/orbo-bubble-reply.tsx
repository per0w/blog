"use client";

import { useEffect, useId, useRef, useState } from "react";

import { Loader2, Send } from "lucide-react";

import {
  bumpHeroGreetingSessionCount,
  getHeroGreetingSessionCount,
  HERO_GREETING_COOLDOWN_MS,
  HERO_GREETING_DOUBLE_SUBMIT_GUARD_MS,
  HERO_GREETING_FLOOD_MESSAGES,
  HERO_GREETING_FLOOD_THRESHOLD,
  HERO_GREETING_FLOOD_WINDOW_MS,
  HERO_GREETING_MAX_CHARS,
  HERO_GREETING_ORBO_FALLBACKS,
  HERO_GREETING_SESSION_MAX,
} from "@/constants/hero-greeting";
import {
  getHeroGreetingValidationError,
  sanitizeHeroGreetingInput,
  sanitizeHeroGreetingReply,
} from "@/utils/hero-greeting";
import { fetchOrboGreetingReplyLine } from "@/utils/orbo-greeting-reply-fetch";

function pickRandom<T extends readonly string[]>(arr: T): T[number] {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

type OrboBubbleReplyProps = {
  /** Готовая строка для пузыря (уже санитизирована снаружи при необходимости). */
  onOrboLine: (line: string) => void;
  /** Продлить автоскрытие пузыря, пока пользователь в поле. */
  onFieldFocus: () => void;
  /** Вернуть короткий таймер после ухода с поля. */
  onFieldBlur: () => void;
};

/**
 * Мини-форма «ответить Орбо» внутри карточки пузыря (те же лимиты и защита, что у hero).
 */
export function OrboBubbleReply({ onOrboLine, onFieldFocus, onFieldBlur }: OrboBubbleReplyProps) {
  const baseId = useId();
  const inputId = `${baseId}-bubble-input`;

  const [value, setValue] = useState("");
  const [trap, setTrap] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastSendAtRef = useRef(0);
  const lastSubmitAttemptAtRef = useRef(0);
  const floodTimestampsRef = useRef<number[]>([]);
  const submitInFlightRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || submitInFlightRef.current) return;

    const now = Date.now();
    if (now - lastSubmitAttemptAtRef.current < HERO_GREETING_DOUBLE_SUBMIT_GUARD_MS) {
      return;
    }
    lastSubmitAttemptAtRef.current = now;

    if (trap.trim() !== "") {
      return;
    }

    const floodSlice = floodTimestampsRef.current.filter(
      (t) => now - t < HERO_GREETING_FLOOD_WINDOW_MS,
    );
    floodSlice.push(now);
    floodTimestampsRef.current = floodSlice;
    if (floodSlice.length >= HERO_GREETING_FLOOD_THRESHOLD) {
      setError(pickRandom(HERO_GREETING_FLOOD_MESSAGES));
      return;
    }

    if (now - lastSendAtRef.current < HERO_GREETING_COOLDOWN_MS) {
      setError("Погодите пару секунд перед следующим приветом.");
      return;
    }

    if (getHeroGreetingSessionCount() >= HERO_GREETING_SESSION_MAX) {
      setError("С этой вкладки уже много реплик. Обновите страницу позже.");
      return;
    }

    const cleaned = sanitizeHeroGreetingInput(value);
    if (cleaned !== value) {
      setValue(cleaned);
    }

    const validationError = getHeroGreetingValidationError(cleaned);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    lastSendAtRef.current = now;
    submitInFlightRef.current = true;
    setSubmitting(true);
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    const finish = () => {
      submitInFlightRef.current = false;
      setSubmitting(false);
    };

    try {
      const line = await fetchOrboGreetingReplyLine(
        cleaned,
        ac.signal,
        "per0w.space - orbo bubble reply",
      );

      if (ac.signal.aborted) {
        return;
      }

      onOrboLine(sanitizeHeroGreetingReply(line));
      bumpHeroGreetingSessionCount();
      setValue("");
    } catch {
      if (!ac.signal.aborted) {
        const fb = pickRandom(HERO_GREETING_ORBO_FALLBACKS);
        onOrboLine(sanitizeHeroGreetingReply(fb));
        bumpHeroGreetingSessionCount();
        setValue("");
      }
    } finally {
      finish();
    }
  };

  const fieldClass =
    "min-w-0 flex-1 rounded-lg border border-border/45 bg-background/35 py-1.5 pr-2 pl-2 text-xs text-foreground outline-none placeholder:text-muted/75 focus:border-accent/50 focus:ring-1 focus:ring-accent/20 dark:bg-surface/30";

  return (
    <div data-orbo-bubble-reply className="mt-3 border-border/35 border-t pt-3">
      <p className="mb-1.5 text-[10px] font-medium tracking-wide text-muted">Ответить Орбо</p>
      <form className="relative" onSubmit={onSubmit}>
        <div aria-hidden="true" className="contact-form-honeypot-text">
          <label htmlFor={`${baseId}-trap`}>Веб-сайт</label>
          <input
            autoComplete="off"
            id={`${baseId}-trap`}
            name="url_trap"
            tabIndex={-1}
            type="text"
            value={trap}
            onChange={(ev) => setTrap(ev.target.value)}
          />
        </div>
        <div className="flex items-stretch gap-1.5">
          <label className="sr-only" htmlFor={inputId}>
            Реплика для Орбо
          </label>
          <input
            autoComplete="off"
            className={fieldClass}
            id={inputId}
            maxLength={HERO_GREETING_MAX_CHARS}
            name="orbo_bubble_reply"
            placeholder="Короткая фраза…"
            spellCheck={true}
            value={value}
            onBlur={onFieldBlur}
            onChange={(ev) => setValue(ev.target.value)}
            onFocus={onFieldFocus}
          />
          <button
            aria-label="Отправить реплику"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-accent/35 bg-accent/12 text-accent transition-colors hover:bg-accent/20 focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:outline-none disabled:opacity-45"
            disabled={submitting}
            type="submit"
          >
            {submitting ? (
              <Loader2 aria-hidden className="size-3.5 animate-spin" />
            ) : (
              <Send aria-hidden className="size-3.5" />
            )}
          </button>
        </div>
        <div className="mt-1 text-[10px] text-muted tabular-nums">
          {value.length}/{HERO_GREETING_MAX_CHARS}
        </div>
        {error ? (
          <p className="mt-1 text-[11px] text-red-600 dark:text-red-300" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  );
}