"use client";

import { type ComponentType, type SVGProps } from "react";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";

import { SECTIONS_IDS } from "@/constants/common";
import { GitHubIcon } from "@/ui/icons";
import { Section } from "@/ui/section/section";

type ContactItem = {
  label: string;
  value: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
  external: boolean;
};

const CONTACTS: ContactItem[] = [
  {
    label: "Email",
    value: "per0w@yandex.ru",
    href: "mailto:per0w@yandex.ru",
    icon: Mail as ContactItem["icon"],
    external: false,
  },
  {
    label: "Telegram",
    value: "@per0w",
    href: "https://t.me/per0w",
    icon: Send as ContactItem["icon"],
    external: true,
  },
  {
    label: "GitHub",
    value: "per0w",
    href: "https://github.com/per0w",
    icon: GitHubIcon,
    external: true,
  },
];

export const ContactUs = () => {
  return (
    <Section id={SECTIONS_IDS.contactUs}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="w-full rounded-2xl bg-linear-to-br from-accent via-accent-light to-accent-secondary px-6 py-12 text-center text-white md:px-12"
      >
        <h2 className="text-2xl font-bold md:text-3xl">Ищете опытного разработчика?</h2>
        <p className="mt-3 text-lg text-white/80">Свяжитесь со мной — обсудим ваш проект</p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          {CONTACTS.map(({ label, value, href, icon: Icon, external }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              {...(external && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
              className="neon-glow flex items-center gap-3 rounded-xl bg-white/15 px-6 py-3 font-medium backdrop-blur-sm transition-colors hover:bg-white/25"
            >
              <Icon className="h-5 w-5" />
              <span>{value}</span>
            </a>
          ))}
        </div>
      </motion.div>
    </Section>
  );
};
