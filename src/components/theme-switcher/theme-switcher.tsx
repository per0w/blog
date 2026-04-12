"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";

const emptySubscribe = () => () => {};

export default function ThemeSwitcher() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  if (!mounted) {
    return <div className="size-9" />;
  }

  return (
    <button
      onClick={() => {
        const next = isDark ? "light" : "dark";
        setTheme(next);
        window.dispatchEvent(
          new CustomEvent("orbo:theme-switch", { detail: { theme: next } }),
        );
      }}
      aria-label="Переключить тему"
      className="group relative flex size-9 cursor-pointer items-center justify-center rounded-xl transition-colors duration-200 hover:bg-accent/10"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.svg
            key="sun"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-[18px] text-amber-400"
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
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
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-[18px] text-indigo-500"
            initial={{ scale: 0, rotate: 90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: -90, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            <path d="M19 3v4" />
            <path d="M21 5h-4" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}
