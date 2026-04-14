import Link from "next/link";

import { Send } from "lucide-react";

import {
  PROFILE_GITHUB_URL,
  PROFILE_TELEGRAM_URL,
  PROFILE_VK_URL,
  SECTIONS_IDS,
} from "@/constants/common";
import { GitHubIcon, VkIcon } from "@/ui/icons";

import { FooterMaxLink } from "./footer-max-link";

const NAV_LINKS = [
  { label: "Обо мне", href: `/#${SECTIONS_IDS.about}` },
  { label: "Опыт", href: `/#${SECTIONS_IDS.experience}` },
  { label: "Проекты", href: `/#${SECTIONS_IDS.projects}` },
  { label: "На заказ", href: `/#${SECTIONS_IDS.services}` },
  { label: "Менторство", href: `/#${SECTIONS_IDS.mentorship}` },
  { label: "Заметки", href: `/#${SECTIONS_IDS.lastArticles}` },
  { label: "Контакты", href: `/#${SECTIONS_IDS.contactUs}` },
];

export const Footer = () => {
  return (
    <footer className="mt-16 border-t border-accent/10 py-10">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-8 px-5">
        <nav
          aria-label="Навигация в подвале"
          className="flex flex-wrap justify-center gap-x-8 gap-y-3"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              className="focus-ring-accent rounded-sm text-sm text-muted transition-colors hover:text-foreground"
              href={href}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div
          aria-label="Профили в соцсетях и на GitHub"
          className="flex flex-wrap items-center justify-center gap-5"
        >
          <a
            aria-label="GitHub"
            className="focus-ring-accent rounded-md text-muted transition-colors hover:text-foreground"
            href={PROFILE_GITHUB_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
          <a
            aria-label="Telegram"
            className="focus-ring-accent rounded-md text-muted transition-colors hover:text-foreground"
            href={PROFILE_TELEGRAM_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Send size={20} />
          </a>
          <a
            aria-label="ВКонтакте"
            className="focus-ring-accent rounded-md text-muted transition-colors hover:text-foreground"
            href={PROFILE_VK_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <VkIcon className="h-5 w-5" />
          </a>
          <FooterMaxLink />
        </div>

        <section
          aria-label="Правовая оговорка"
          className="max-w-2xl border-t border-border/40 pt-6 text-center"
        >
          <h2 className="sr-only">Правовая оговорка</h2>
          <p className="text-xs leading-relaxed text-pretty text-muted">
            Материалы сайта, включая текст, визуальные элементы и интерактивные функции (в том числе
            шутки и высказывания виртуального персонажа), публикуются исключительно в
            ознакомительных и развлекательных целях, «как есть», без каких-либо гарантий полноты,
            актуальности или пригодности для конкретных целей. Это не юридическая, финансовая,
            медицинская или иная профессиональная консультация. Администрация и владелец ресурса не
            несут ответственности за решения, действия или убытки, возникшие в связи с
            использованием сайта, за содержание внешних ресурсов по ссылкам и за возможные
            технические сбои. Упоминание товарных знаков и сервисов принадлежит их правообладателям.
            При несогласии с условиями пользуйтесь сайтом не в полном объёме или прекратите его
            использование.
          </p>
        </section>

        <p className="text-sm text-muted">© {new Date().getFullYear()} per0w.space</p>
      </div>
    </footer>
  );
};
