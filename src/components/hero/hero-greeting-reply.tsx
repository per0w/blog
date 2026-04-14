"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MessageCircleReply, Send } from "lucide-react";

import { ORBO_HERO_GREETING_REPLY_EVENT } from "@/constants/common";
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

function pickRandomFallback(): string {
  return pickRandom(HERO_GREETING_ORBO_FALLBACKS);
}

export function HeroGreetingReply() {
  const baseId = useId();
  const panelId = `${baseId}-panel`;
  const inputId = `${baseId}-input`;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [trapWebsite, setTrapWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastSendAtRef = useRef(0);
  const lastSubmitAttemptAtRef = useRef(0);
  const floodTimestampsRef = useRef<number[]>([]);
  const submitInFlightRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (open) {
      queueMicrotask(() => inputRef.current?.focus());
    }
  }, [open]);

  const closePanel = useCallback(() => {
    setOpen(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePanel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closePanel]);

  const dispatchOrbo = useCallback((message: string) => {
    window.dispatchEvent(
      new CustomEvent(ORBO_HERO_GREETING_REPLY_EVENT, {
        detail: { message: sanitizeHeroGreetingReply(message) },
      }),
    );
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || submitInFlightRef.current) return;

    const now = Date.now();
    if (now - lastSubmitAttemptAtRef.current < HERO_GREETING_DOUBLE_SUBMIT_GUARD_MS) {
      return;
    }
    lastSubmitAttemptAtRef.current = now;

    if (trapWebsite.trim() !== "") {
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
      setError("С этой вкладки уже много приветов. Обновите страницу позже.");
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
        "per0w.space - hero greeting",
      );

      if (ac.signal.aborted) {
        return;
      }

      dispatchOrbo(sanitizeHeroGreetingReply(line));
      bumpHeroGreetingSessionCount();
      setValue("");
      closePanel();
    } catch {
      if (!ac.signal.aborted) {
        dispatchOrbo(pickRandomFallback());
        bumpHeroGreetingSessionCount();
        setValue("");
        closePanel();
      }
    } finally {
      finish();
    }
  };

  const fieldClass =
    "min-w-0 flex-1 rounded-xl border border-accent/25 bg-surface/80 px-3 py-2 text-sm text-foreground shadow-sm outline-none backdrop-blur-sm transition-[border-color,box-shadow] placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-accent)_30%,transparent)] dark:border-accent/20 dark:bg-surface/60";

  return (
    <div data-orbo-hero-greet className="w-full">
      <div className="relative z-10 flex flex-col items-center gap-2 md:items-start">
        <p className="hero-greet-cyber-row inline-flex w-full max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 text-pretty md:justify-start md:text-left">
          <span className="hero-greet-cyber-soft text-sm font-semibold tracking-[0.2em] text-accent-secondary uppercase">
            Привет! Меня зовут
          </span>
          <button
            aria-controls={panelId}
            aria-expanded={open}
            aria-label={open ? "Скрыть поле для приветствия" : "Ответить приветствием Орбо"}
            className="hero-greet-cyber-icon -m-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md text-accent-secondary/70 transition-colors hover:bg-surface/60 hover:text-accent-secondary focus-visible:ring-2 focus-visible:ring-accent/25 focus-visible:outline-none dark:hover:bg-surface/40"
            type="button"
            onClick={() => {
              setOpen((v) => !v);
              setError(null);
            }}
          >
            <MessageCircleReply aria-hidden className="size-3.5" />
          </button>
        </p>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              key="hero-greet-panel"
              animate={{ opacity: 1, y: 0 }}
              className="w-full overflow-hidden"
              exit={{ opacity: 0, y: -6 }}
              id={panelId}
              initial={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <form
                className="relative flex flex-col gap-2 rounded-xl border border-accent/15 bg-surface/40 p-3 backdrop-blur-sm sm:flex-row sm:items-stretch"
                onSubmit={onSubmit}
              >
                <div aria-hidden="true" className="contact-form-honeypot-text">
                  <label htmlFor={`${baseId}-website`}>Сайт</label>
                  <input
                    autoComplete="off"
                    id={`${baseId}-website`}
                    name="website_url"
                    tabIndex={-1}
                    type="text"
                    value={trapWebsite}
                    onChange={(ev) => setTrapWebsite(ev.target.value)}
                  />
                </div>

                <label className="sr-only" htmlFor={inputId}>
                  Ваше приветствие для Орбо
                </label>
                <input
                  ref={inputRef}
                  autoComplete="off"
                  className={fieldClass}
                  id={inputId}
                  maxLength={HERO_GREETING_MAX_CHARS}
                  name="hero_greeting"
                  placeholder="Например: привет, я фронтендер из Казани"
                  spellCheck={true}
                  value={value}
                  onChange={(ev) => setValue(ev.target.value)}
                />
                <button
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-accent via-accent-light to-accent-secondary px-4 py-2 text-sm font-semibold text-white shadow-md transition-[filter] disabled:opacity-50"
                  disabled={submitting}
                  type="submit"
                >
                  {submitting ? (
                    <>
                      <Loader2 aria-hidden className="size-4 animate-spin" />
                      <span>Ждём…</span>
                    </>
                  ) : (
                    <>
                      <Send aria-hidden className="size-4" />
                      <span>Отправить</span>
                    </>
                  )}
                </button>
              </form>
              <p className="mt-1 text-right text-[11px] text-muted tabular-nums">
                {value.length}/{HERO_GREETING_MAX_CHARS}
              </p>
              {error ? (
                <p className="mt-1.5 text-xs text-red-600 dark:text-red-300" role="alert">
                  {error}
                </p>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
