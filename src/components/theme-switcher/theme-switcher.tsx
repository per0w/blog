"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";

const emptySubscribe = () => () => {};

const FLIP_MS = 340;

export default function ThemeSwitcher() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const reduceMotion = useReducedMotion();
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [flipGlitch, setFlipGlitch] = useState(false);
  /** В браузере setTimeout возвращает number (в отличие от Node). */
  const flipTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (flipTimeoutRef.current !== null) {
        window.clearTimeout(flipTimeoutRef.current);
      }
    };
  }, []);

  const triggerTheme = useCallback(() => {
    const next = isDark ? "light" : "dark";
    if (!reduceMotion) {
      setFlipGlitch(true);
      if (flipTimeoutRef.current !== null) {
        window.clearTimeout(flipTimeoutRef.current);
      }
      flipTimeoutRef.current = window.setTimeout(() => {
        setFlipGlitch(false);
        flipTimeoutRef.current = null;
      }, FLIP_MS);
    }
    setTheme(next);
    window.dispatchEvent(new CustomEvent("orbo:theme-switch", { detail: { theme: next } }));
  }, [isDark, reduceMotion, setTheme]);

  if (!mounted) {
    return <span aria-hidden className="inline-block size-[2.35rem]" />;
  }

  const cyberStatic = Boolean(reduceMotion);

  return (
    <button
      type="button"
      aria-label={
        isDark
          ? "Тёмная тема включена. Переключить на светлую"
          : "Светлая тема. Переключить на тёмную"
      }
      className={[
        "theme-switcher-cyber",
        flipGlitch ? "theme-switcher-cyber--flip" : "",
        cyberStatic ? "theme-switcher-cyber--static" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={triggerTheme}
    >
      <span className="relative z-[2] flex items-center justify-center">
        <AnimatePresence initial={false} mode="wait">
          {isDark ? (
            <motion.svg
              key="sun"
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              className="size-[18px] text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.55)]"
              exit={{ opacity: 0, rotate: 56, scale: 0.4 }}
              fill="none"
              initial={{ opacity: 0, rotate: -56, scale: 0.4 }}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.25}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 420, damping: 24, mass: 0.65 }
              }
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </motion.svg>
          ) : (
            <motion.svg
              key="moon"
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              className="size-[18px] text-cyan-400 drop-shadow-[0_0_10px_color-mix(in_srgb,var(--color-accent-secondary)_65%,transparent)] dark:text-cyan-300"
              exit={{ opacity: 0, rotate: -52, scale: 0.4 }}
              fill="none"
              initial={{ opacity: 0, rotate: 52, scale: 0.4 }}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.25}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 420, damping: 24, mass: 0.65 }
              }
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              <path d="M19 3v4" />
              <path d="M21 5h-4" />
            </motion.svg>
          )}
        </AnimatePresence>
      </span>
    </button>
  );
}
