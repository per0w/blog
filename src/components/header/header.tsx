"use client";

import { useState, useEffect, type ComponentProps } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { GitHubIcon, TelegramIcon } from "@/ui/icons";

import { SECTIONS_IDS } from "@/constants/common";
import ThemeSwitcher from "../theme-switcher/theme-switcher";

const NAV_LINKS = [
  { label: "Обо мне", href: `/#${SECTIONS_IDS.about}` },
  { label: "Опыт", href: `/#${SECTIONS_IDS.experience}` },
  { label: "Проекты", href: `/#${SECTIONS_IDS.projects}` },
  { label: "Блог", href: `/#${SECTIONS_IDS.lastArticles}` },
  { label: "CV", href: "/cv" },
  { label: "Контакты", href: `/#${SECTIONS_IDS.contactUs}` },
];

function IconLink({
  href,
  label,
  children,
  className = "",
  ...props
}: ComponentProps<"a"> & { label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`group/icon flex size-9 items-center justify-center rounded-xl text-muted transition-all duration-200 hover:bg-accent/10 hover:text-foreground ${className}`}
      {...props}
    >
      {children}
    </a>
  );
}

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-accent/10 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-5">
        <Link
          href="/"
          className="bg-linear-to-r from-accent to-accent-secondary bg-clip-text text-xl font-bold tracking-tighter text-transparent"
        >
          PER0W.SPACE
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="group relative text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-linear-to-r from-accent to-accent-secondary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <ThemeSwitcher />

          <IconLink
            href="https://github.com/per0w"
            label="GitHub"
            className="hidden lg:flex"
          >
            <GitHubIcon className="size-[18px] transition-transform duration-200 group-hover/icon:scale-110" />
          </IconLink>

          <IconLink
            href="https://t.me/per0w/"
            label="Telegram"
            className="hidden lg:flex"
          >
            <TelegramIcon className="size-[18px] transition-transform duration-200 group-hover/icon:scale-110" />
          </IconLink>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="flex size-9 items-center justify-center rounded-xl text-muted transition-all duration-200 hover:bg-accent/10 hover:text-foreground lg:hidden"
            aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" as const }}
            className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <nav className="flex flex-col items-center gap-8 pt-16">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-muted transition-colors hover:text-foreground"
                >
                  {label}
                </Link>
              ))}

              <div className="flex items-center gap-2 pt-4">
                <IconLink href="https://github.com/per0w" label="GitHub">
                  <GitHubIcon className="size-5 transition-transform duration-200 group-hover/icon:scale-110" />
                </IconLink>
                <IconLink href="https://t.me/per0w/" label="Telegram">
                  <TelegramIcon className="size-5 transition-transform duration-200 group-hover/icon:scale-110" />
                </IconLink>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
