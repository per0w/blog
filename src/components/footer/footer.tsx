import Link from "next/link";
import { Send } from "lucide-react";
import { GitHubIcon } from "@/ui/icons";

import { SECTIONS_IDS } from "@/constants/common";

const NAV_LINKS = [
  { label: "Обо мне", href: `/#${SECTIONS_IDS.about}` },
  { label: "Опыт", href: `/#${SECTIONS_IDS.experience}` },
  { label: "Проекты", href: `/#${SECTIONS_IDS.projects}` },
  { label: "Блог", href: `/#${SECTIONS_IDS.lastArticles}` },
  { label: "Контакты", href: `/#${SECTIONS_IDS.contactUs}` },
];

export const Footer = () => {
  return (
    <footer className="mt-16 border-t border-accent/10 py-10">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-8 px-5">
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <a
            href="https://github.com/per0w"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition-colors hover:text-foreground"
            aria-label="GitHub"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
          <a
            href="https://t.me/per0w/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition-colors hover:text-foreground"
            aria-label="Telegram"
          >
            <Send size={20} />
          </a>
        </div>

        <p className="text-sm text-muted">© {new Date().getFullYear()} per0w.space</p>
      </div>
    </footer>
  );
};
