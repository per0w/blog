"use client";

import { useCallback, useId, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { Skills } from "@/components/skills/skills";
import { SECTIONS_IDS } from "@/constants/common";
import { Section } from "@/ui/section/section";

export const About = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tipId = useId();

  const openTooltip = useCallback(() => {
    setShowTooltip(true);
    window.dispatchEvent(new CustomEvent("orbo:experience-tooltip"));
  }, []);

  const toggleTooltip = useCallback(() => {
    setShowTooltip((prev) => {
      if (!prev) {
        window.dispatchEvent(new CustomEvent("orbo:experience-tooltip"));
      }
      return !prev;
    });
  }, []);

  return (
    <Section id={SECTIONS_IDS.about} title="Обо мне">
      <div className="max-w-2xl px-4 text-center text-lg leading-relaxed text-muted">
        <span
          className="relative inline-block"
          role="group"
          onMouseEnter={openTooltip}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button
            aria-controls={tipId}
            aria-describedby={showTooltip ? tipId : undefined}
            aria-expanded={showTooltip}
            aria-label="Пояснение к формулировке «8+ лет в IT»"
            className="focus-ring-accent inline cursor-help rounded-sm border-b border-dashed border-accent/50 bg-transparent font-semibold text-foreground transition-colors hover:text-accent"
            type="button"
            onBlur={() => setShowTooltip(false)}
            onClick={toggleTooltip}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setShowTooltip(false);
              }
            }}
          >
            8+ лет в IT
          </button>
          <AnimatePresence>
            {showTooltip ? (
              <motion.span
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="shadow-elevation-card absolute left-1/2 z-[60] w-[min(20rem,calc(100vw-2rem))] max-w-none -translate-x-1/2 rounded-xl border border-accent/20 bg-surface p-3 text-left text-sm leading-relaxed font-normal text-foreground max-sm:top-full max-sm:mt-2 max-sm:max-h-[min(55vh,22rem)] max-sm:overflow-y-auto sm:top-auto sm:bottom-full sm:mt-0 sm:mb-3 sm:max-w-[22rem] sm:p-4"
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                id={tipId}
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                role="tooltip"
                transition={{ duration: 0.2 }}
              >
                <span className="block text-xs font-semibold tracking-wide text-accent uppercase">
                  Почему «+»?
                </span>
                <span className="mt-2 block text-muted">
                  Всю жизнь в IT — начинал как системный администратор и специалист по безопасности:
                  настраивал сети, обслуживал серверы, 1С, инфраструктуру. Решил не перечислять всё,
                  а остановиться на самом важном для разработки.
                </span>
                <span
                  aria-hidden
                  className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-t border-l border-accent/20 bg-surface sm:hidden"
                />
                <span
                  aria-hidden
                  className="absolute -bottom-1.5 left-1/2 hidden h-3 w-3 -translate-x-1/2 rotate-45 border-r border-b border-accent/20 bg-surface sm:block"
                />
              </motion.span>
            ) : null}
          </AnimatePresence>
        </span>
        {" — "}от DevOps до Senior Frontend в&nbsp;Газпромбанке. Строю сложные веб-приложения для
        высоконагруженных продуктов, понимаю весь стек от серверного железа до пиксель-перфект UI.
        Активно применяю AI-инструменты для ускорения разработки.
      </div>
      <Skills />
    </Section>
  );
};
