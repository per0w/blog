"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { useInView, useReducedMotion } from "framer-motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "X";
}

function toScrambled(target: string): string {
  return target
    .split("")
    .map((ch) => {
      if (ch === " ") return " ";
      if (/\s/.test(ch)) return ch;
      return randomGlyph();
    })
    .join("");
}

type ScrambleRevealTextProps = {
  /** Итоговая строка (a11y, SEO). */
  text: string;
  className?: string;
  /** Тег в DOM. */
  as?: "h2" | "p";
  /** Связь секции через aria-labelledby. */
  id?: string;
  /**
   * true — старт сразу (hero). false — один раз при входе блока в зону видимости.
   */
  immediate?: boolean;
};

/**
 * Эффект «расшифровки» как у подзаголовка в hero.
 * Секции: запуск по viewport (once), без лишней нагрузки до скролла.
 *
 * Нельзя блокировать повторный запуск через ref после cleanup: в Strict Mode эффект
 * монтируется дважды подряд — второй раз анимация должна стартовать заново.
 */
export function ScrambleRevealText({
  as = "p",
  className,
  id,
  immediate = false,
  text,
}: ScrambleRevealTextProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLHeadingElement | HTMLParagraphElement>(null);
  const isInView = useInView(ref, { amount: 0.35, margin: "-12% 0px -12% 0px", once: true });
  const [display, setDisplay] = useState(text);

  const shouldStart = immediate || isInView;

  useLayoutEffect(() => {
    if (!shouldStart) {
      return;
    }

    if (prefersReduced === true) {
      queueMicrotask(() => {
        setDisplay(text);
      });
      return;
    }

    queueMicrotask(() => {
      setDisplay(toScrambled(text));
    });

    const totalTicks = 28;
    let tick = 0;
    const intervalId = window.setInterval(() => {
      tick += 1;
      const revealRatio = tick / totalTicks;

      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            const pos = i / Math.max(text.length, 1);
            if (pos < revealRatio) return char;
            return randomGlyph();
          })
          .join(""),
      );

      if (tick >= totalTicks) {
        window.clearInterval(intervalId);
        setDisplay(text);
      }
    }, 38);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [prefersReduced, shouldStart, text]);

  if (as === "h2") {
    return (
      <h2 ref={ref} aria-label={text} className={className} id={id}>
        {display}
      </h2>
    );
  }

  return (
    <p ref={ref} aria-label={text} className={className} id={id}>
      {display}
    </p>
  );
}
