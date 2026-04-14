"use client";

import type { ComponentType, SVGProps } from "react";

import { motion, useReducedMotion } from "framer-motion";
import { Mail, Send } from "lucide-react";

import {
  MAX_MESSENGER_PROFILE_URL,
  ORBO_MAX_HOVER_EVENT,
  PROFILE_EMAIL,
  PROFILE_GITHUB_URL,
  PROFILE_TELEGRAM_URL,
  PROFILE_VK_URL,
  SECTIONS_IDS,
} from "@/constants/common";
import { GitHubIcon, MaxMessengerIcon, VkIcon } from "@/ui/icons";
import { Section } from "@/ui/section/section";

import { ContactForm } from "./contact-form";

type ContactItem = {
  label: string;
  value: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  external: boolean;
  /** Явный aria-label (например почта — с адресом для скринридеров). */
  ariaLabel?: string;
};

const CONTACTS: ContactItem[] = [
  {
    label: "Почта",
    value: "Почта",
    href: `mailto:${PROFILE_EMAIL}`,
    icon: Mail as ContactItem["icon"],
    external: false,
    ariaLabel: `Почта: ${PROFILE_EMAIL}`,
  },
  {
    label: "Telegram",
    value: "Telegram",
    href: PROFILE_TELEGRAM_URL,
    icon: Send as ContactItem["icon"],
    external: true,
  },
  {
    label: "GitHub",
    value: "GitHub",
    href: PROFILE_GITHUB_URL,
    icon: GitHubIcon,
    external: true,
  },
  {
    label: "ВКонтакте",
    value: "ВКонтакте",
    href: PROFILE_VK_URL,
    icon: VkIcon,
    external: true,
  },
  {
    label: "MAX",
    value: "MAX",
    href: MAX_MESSENGER_PROFILE_URL,
    icon: MaxMessengerIcon as ContactItem["icon"],
    external: true,
  },
];

export const ContactUs = () => {
  const reduceMotion = useReducedMotion();

  const panelVariants = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduceMotion ? { duration: 0 } : { duration: 0.52, ease: "easeOut" as const },
    },
  };

  /** Обёртка контента: stagger только у прямых motion-потомков */
  const innerVariants = {
    hidden: {},
    visible: reduceMotion
      ? {}
      : {
          transition: { delayChildren: 0.08, staggerChildren: 0.13 },
        },
  };

  const fadeUp = {
    hidden: { opacity: reduceMotion ? 1 : 0, y: reduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.45, ease: "easeOut" as const },
    },
  };

  return (
    <Section id={SECTIONS_IDS.contactUs}>
      <motion.div
        className="contact-cta-shell w-full rounded-2xl border border-white/25 bg-linear-to-br from-accent via-accent-light to-accent-secondary px-6 py-14 text-center text-white md:px-12"
        initial="hidden"
        variants={panelVariants}
        viewport={{ amount: 0.2, margin: "-60px", once: true }}
        whileInView="visible"
      >
        <div aria-hidden className="contact-cta-scan-wrap">
          <div className="contact-cta-scanbeam" />
        </div>

        <motion.div className="contact-cta-inner" variants={innerVariants}>
          <motion.h2
            className="contact-cta-title text-2xl font-bold tracking-tight text-balance md:text-3xl"
            variants={fadeUp}
          >
            Ищете опытного разработчика?
          </motion.h2>

          <motion.p
            className="contact-cta-sub mx-auto mt-4 max-w-xl text-base leading-relaxed text-pretty text-white/88 md:text-lg"
            variants={fadeUp}
          >
            Свяжитесь со мной — обсудим ваш проект
          </motion.p>

          <motion.div className="mx-auto mt-10 w-full max-w-3xl" variants={fadeUp}>
            <ContactForm />
          </motion.div>

          <motion.p
            className="contact-cta-sub mx-auto mt-10 text-sm font-medium tracking-[0.2em] text-white/55 uppercase"
            variants={fadeUp}
          >
            Или мессенджеры и соцсети
          </motion.p>

          <motion.div className="mx-auto mt-4 w-full max-w-4xl" variants={fadeUp}>
            <div className="flex flex-col flex-wrap items-center justify-center gap-3 sm:flex-row sm:gap-4">
              {CONTACTS.map(({ label, value, href, icon: Icon, external, ariaLabel }) => {
                const isMax = label === "MAX";
                const fireOrboMax = () => {
                  window.dispatchEvent(new CustomEvent(ORBO_MAX_HOVER_EVENT));
                };

                return (
                  <a
                    key={label}
                    aria-label={ariaLabel ?? label}
                    className="group/contact-cta contact-cta-link contact-cta-link-row inline-flex items-center gap-3 rounded-xl px-5 py-3 text-sm font-medium motion-safe:transition-[box-shadow,filter] motion-safe:duration-300 md:px-6 md:text-base"
                    href={href}
                    {...(isMax && { "data-orbo-max": "" })}
                    {...(isMax && { onFocus: fireOrboMax, onMouseEnter: fireOrboMax })}
                    {...(external
                      ? { rel: "noopener noreferrer" as const, target: "_blank" as const }
                      : {})}
                  >
                    <Icon className="h-5 w-5 shrink-0 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/contact-cta:scale-110" />
                    <span>{value}</span>
                  </a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </Section>
  );
};
