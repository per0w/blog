"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { SECTIONS_IDS } from "@/constants/common";
import { Skills } from "@/components/skills/skills";
import { Section } from "@/ui/section/section";

export const About = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Section id={SECTIONS_IDS.about} title="Обо мне">
      <p className="max-w-2xl px-4 text-center text-lg leading-relaxed text-muted">
        <span
          className="relative inline-block cursor-help border-b border-dashed border-accent/50 text-foreground font-semibold transition-colors hover:text-accent"
          onMouseEnter={() => {
            setShowTooltip(true);
            window.dispatchEvent(new CustomEvent("orbo:experience-tooltip"));
          }}
          onMouseLeave={() => setShowTooltip(false)}
          onTouchStart={() => {
            setShowTooltip((prev) => {
              if (!prev) window.dispatchEvent(new CustomEvent("orbo:experience-tooltip"));
              return !prev;
            });
          }}
        >
          8+ лет в IT
          <AnimatePresence>
            {showTooltip && (
              <motion.span
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full left-1/2 z-50 mb-3 w-72 -translate-x-1/2 rounded-xl border border-accent/20 bg-surface p-4 text-left text-sm leading-relaxed font-normal text-foreground shadow-lg shadow-accent/5 sm:w-80"
              >
                <span className="block text-xs font-semibold tracking-wide text-accent uppercase">
                  Почему «+»?
                </span>
                <span className="mt-2 block text-muted">
                  Всю жизнь в IT — начинал как системный администратор и специалист по безопасности:
                  настраивал сети, обслуживал серверы, 1С, инфраструктуру. Решил не перечислять всё,
                  а остановиться на самом важном для разработки.
                </span>
                {/* Стрелка */}
                <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-r border-b border-accent/20 bg-surface" />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
        {" — "}от DevOps до Senior Frontend в&nbsp;Газпромбанке.
        Строю сложные веб-приложения на React и TypeScript, понимаю весь стек от серверного железа
        до пиксель-перфект UI. Активно применяю AI-инструменты для ускорения разработки.
      </p>
      <Skills />
    </Section>
  );
};
