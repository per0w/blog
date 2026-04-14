"use client";

import { useState, useEffect, type ComponentProps, type ComponentType } from "react";

import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";
import { Mail, Menu, PanelBottom, X } from "lucide-react";

import { useDisplayFont } from "@/components/display-font/display-font-context";
import { DisplayFontSwitcher } from "@/components/display-font/display-font-switcher";
import {
  MAX_MESSENGER_PROFILE_URL,
  ORBO_MAX_HOVER_EVENT,
  PROFILE_EMAIL,
  PROFILE_GITHUB_URL,
  PROFILE_TELEGRAM_URL,
  PROFILE_VK_URL,
  SECTIONS_IDS,
} from "@/constants/common";
import { DISPLAY_FONT_CLASSNAMES } from "@/fonts/display-font-classnames";
import { GitHubIcon, MaxMessengerIcon, TelegramIcon, VkIcon } from "@/ui/icons";

import ThemeSwitcher from "../theme-switcher/theme-switcher";

const MOBILE_NAV_ID = "site-mobile-nav";

function notifyOrboMaxHover() {
  window.dispatchEvent(new CustomEvent(ORBO_MAX_HOVER_EVENT));
}

const NAV_LINKS = [
  { label: "Обо мне", href: `/#${SECTIONS_IDS.about}` },
  { label: "Опыт", href: `/#${SECTIONS_IDS.experience}` },
  { label: "Проекты", href: `/#${SECTIONS_IDS.projects}` },
  { label: "На заказ", href: `/#${SECTIONS_IDS.services}` },
  { label: "Менторство", href: `/#${SECTIONS_IDS.mentorship}` },
  { label: "Заметки", href: `/#${SECTIONS_IDS.lastArticles}` },
  { label: "CV", href: "/cv" },
  { label: "Контакты", href: `/#${SECTIONS_IDS.contactUs}` },
];

const QUICK_CONTACTS: {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  external: boolean;
}[] = [
  { href: PROFILE_GITHUB_URL, label: "GitHub", Icon: GitHubIcon, external: true },
  { href: PROFILE_TELEGRAM_URL, label: "Telegram", Icon: TelegramIcon, external: true },
  { href: PROFILE_VK_URL, label: "ВКонтакте", Icon: VkIcon, external: true },
  { href: MAX_MESSENGER_PROFILE_URL, label: "MAX", Icon: MaxMessengerIcon, external: true },
  { href: `mailto:${PROFILE_EMAIL}`, label: "Email", Icon: Mail, external: false },
];

function IconLink({
  href,
  label,
  external = true,
  children,
  className = "",
  ...props
}: ComponentProps<"a"> & { label: string; external?: boolean }) {
  return (
    <a
      aria-label={label}
      className={`focus-ring-accent group/icon flex size-8 shrink-0 items-center justify-center rounded-xl text-muted transition-all duration-200 hover:bg-accent/10 hover:text-foreground sm:size-9 ${className}`}
      href={href}
      rel={external ? "noopener noreferrer" : undefined}
      target={external ? "_blank" : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

/** Ссылка на секцию со всеми способами связи (главная) */
function AllContactsLink({
  className = "",
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      aria-label="Все контакты — перейти к блоку на главной"
      className={`focus-ring-accent group/allcontacts flex size-8 shrink-0 items-center justify-center rounded-xl text-muted transition-all duration-200 hover:bg-accent/10 hover:text-foreground sm:size-9 ${className}`}
      href={`/#${SECTIONS_IDS.contactUs}`}
      title="Все способы связи на главной"
      onClick={onNavigate}
    >
      <PanelBottom
        aria-hidden
        className="size-[17px] transition-transform duration-200 group-hover/allcontacts:translate-y-0.5 sm:size-[18px]"
      />
    </Link>
  );
}

export const Header = () => {
  const { id: displayFontId } = useDisplayFont();
  const displayFontClass = DISPLAY_FONT_CLASSNAMES[displayFontId];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Снаружи header: backdrop-filter у шапки создаёт containing block и ломает fixed (оверлей с нулевой высотой). */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 top-16 z-40 border-t border-border bg-surface/98 backdrop-blur-xl lg:hidden"
            exit={{ opacity: 0, y: -10 }}
            id={MOBILE_NAV_ID}
            initial={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" as const }}
          >
            <nav
              aria-label="Мобильная навигация"
              className="flex flex-col items-center gap-8 pt-10"
            >
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  className="focus-ring-accent rounded-md text-lg font-medium text-foreground/90 transition-colors hover:text-accent"
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}

              <div className="flex flex-wrap items-center justify-center gap-1 px-4 pt-2">
                {QUICK_CONTACTS.map(({ href, label, Icon, external }) => (
                  <IconLink
                    key={label}
                    external={external}
                    href={href}
                    label={label}
                    {...(label === "MAX" && {
                      "data-orbo-max": "",
                      onFocus: notifyOrboMaxHover,
                      onMouseEnter: notifyOrboMaxHover,
                    })}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="size-[18px] transition-transform duration-200 group-hover/icon:scale-110" />
                  </IconLink>
                ))}
                <AllContactsLink onNavigate={() => setIsMobileMenuOpen(false)} />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-50 w-full border-b border-accent/10 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-2 px-3 sm:gap-3 sm:px-5">
          <Link
            aria-label="На главную, per0w.space"
            className={`focus-ring-accent ${displayFontClass} min-w-0 max-w-[50vw] shrink-0 truncate rounded-md bg-linear-to-r from-accent to-accent-secondary bg-clip-text text-lg font-bold tracking-tighter text-transparent sm:max-w-none sm:text-xl`}
            href="/"
          >
            PER0W.SPACE
          </Link>

          {/* На широких экранах много пунктов — даём flex-1 и горизонтальный скролл без полосы, чтобы не ломать вёрстку */}
          <div className="hidden min-h-0 min-w-0 flex-1 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] lg:block [&::-webkit-scrollbar]:hidden">
            <nav
              aria-label="Основная навигация"
              className="flex h-16 w-max items-center gap-x-2.5 pr-1 pl-0.5 sm:gap-x-3 lg:mx-auto lg:justify-center"
            >
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  className="focus-ring-accent group relative shrink-0 rounded-md text-xs font-medium whitespace-nowrap text-muted transition-colors hover:text-foreground sm:text-sm"
                  href={href}
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-linear-to-r from-accent to-accent-secondary transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-0.5 sm:gap-1">
            <DisplayFontSwitcher />
            <ThemeSwitcher />

            <div className="hidden items-center border-l border-border/60 pl-1 sm:pl-2 md:flex">
              {QUICK_CONTACTS.map(({ href, label, Icon, external }) => (
                <IconLink
                  key={label}
                  external={external}
                  href={href}
                  label={label}
                  {...(label === "MAX" && {
                    "data-orbo-max": "",
                    onFocus: notifyOrboMaxHover,
                    onMouseEnter: notifyOrboMaxHover,
                  })}
                >
                  <Icon className="size-[17px] transition-transform duration-200 group-hover/icon:scale-110 sm:size-[18px]" />
                </IconLink>
              ))}
              <AllContactsLink />
            </div>

            <button
              aria-controls={isMobileMenuOpen ? MOBILE_NAV_ID : undefined}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
              className="focus-ring-accent flex size-9 shrink-0 items-center justify-center rounded-xl text-muted transition-all duration-200 hover:bg-accent/10 hover:text-foreground lg:hidden"
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
