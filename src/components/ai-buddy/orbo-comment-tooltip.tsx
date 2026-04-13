"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X } from "lucide-react";

const TYPEWRITER_MS_PER_CHAR = 16;
const TYPEWRITER_MIN_STEP_MS = 8;

type CommentTooltipProps = {
  comment: string | null;
  visible: boolean;
  thinking: boolean;
  commentKey: number;
  /** Пока идёт «речь» — лёгкое свечение карточки. */
  speaking?: boolean;
  onDismiss: () => void;
};

export function CommentTooltip({
  comment,
  visible,
  thinking,
  commentKey,
  speaking = false,
  onDismiss,
}: CommentTooltipProps) {
  const showBubble = visible && (thinking || !!comment);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!comment || thinking) {
      queueMicrotask(() => setTyped(""));
      return;
    }

    queueMicrotask(() => setTyped(""));
    let i = 0;
    let intervalId: number | null = null;
    const bootId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        i += 1;
        setTyped(comment.slice(0, i));
        if (i >= comment.length && intervalId !== null) {
          window.clearInterval(intervalId);
          intervalId = null;
        }
      }, TYPEWRITER_MS_PER_CHAR);
    }, TYPEWRITER_MIN_STEP_MS);

    return () => {
      window.clearTimeout(bootId);
      if (intervalId !== null) window.clearInterval(intervalId);
    };
  }, [comment, thinking, commentKey]);

  const displayText = thinking ? "" : typed;

  return (
    <AnimatePresence mode="wait">
      {showBubble && (
        <motion.div
          key="orbo-tooltip-shell"
          animate={{ opacity: 1, y: 0, scale: 1 }}
          aria-live="polite"
          className="pointer-events-auto relative z-10 w-full max-w-[min(22rem,calc(100vw-1.5rem))] max-sm:relative max-sm:mx-auto max-sm:mb-1 sm:absolute sm:right-0 sm:bottom-[3.35rem] sm:mb-0 sm:w-64 sm:max-w-none"
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          initial={{ opacity: 0, y: 14, scale: 0.94 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Карточка + якорь: треугольник через border (острый только низ), не rotate-45 — без боковых «рогов». */}
          <div
            className={`relative overflow-hidden rounded-2xl bg-surface transition-shadow duration-500 ${speaking ? "shadow-[0_12px_40px_color-mix(in_srgb,var(--color-accent)_18%,transparent)]" : "shadow-[0_8px_30px_color-mix(in_srgb,black_12%,transparent)]"}`}
          >
            <div className="relative w-full px-5 pt-4 pb-5 sm:px-6 sm:pb-6">
              <button
                aria-label="Закрыть Орбо"
                className="absolute top-2.5 right-2.5 z-20 flex size-6 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                type="button"
                onClick={onDismiss}
              >
                <X className="size-3.5 opacity-60" />
              </button>

              <p className="text-[10px] font-semibold tracking-[0.18em] text-accent/80 uppercase">
                Мысли Орбо
              </p>

              <AnimatePresence initial={false} mode="wait">
                {thinking && (
                  <motion.div
                    key="think"
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    className="mt-2 flex items-center gap-2 text-sm text-muted"
                    exit={{ opacity: 0, filter: "blur(4px)" }}
                    initial={{ opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <Loader2 aria-hidden className="size-4 shrink-0 animate-spin text-accent/80" />
                    <span>Думаю…</span>
                  </motion.div>
                )}
                {!thinking && comment && (
                  <motion.p
                    key={`c-${commentKey}`}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    className="mt-2 pr-4 text-sm leading-relaxed text-foreground"
                    exit={{ opacity: 0, y: -6, filter: "blur(3px)" }}
                    initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                    transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {displayText}
                    {displayText.length > 0 && displayText.length < comment.length && (
                      <span className="ml-0.5 inline-block w-0.5 animate-pulse bg-accent align-baseline motion-reduce:animate-none" />
                    )}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute top-full left-1/2 z-0 -mt-px h-0 w-0 -translate-x-1/2 border-x-[7px] border-t-[9px] border-x-transparent border-t-surface sm:right-[26px] sm:left-auto sm:translate-x-0"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
