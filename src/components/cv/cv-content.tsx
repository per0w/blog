"use client";

import type { ComponentType } from "react";

import Link from "next/link";

import { Download, Mail, Send, ArrowLeft } from "lucide-react";

import {
  MAIN_CONTENT_ID,
  MAX_MESSENGER_PROFILE_URL,
  PROFILE_EMAIL,
  PROFILE_GITHUB_URL,
  PROFILE_TELEGRAM_URL,
  PROFILE_VK_URL,
} from "@/constants/common";
import { GitHubIcon, MaxMessengerIcon, VkIcon } from "@/ui/icons";

type CvContact = {
  Icon: ComponentType<{ className?: string }>;
  label: string;
  href: string;
  external: boolean;
};

const CONTACTS: CvContact[] = [
  { Icon: Mail, label: PROFILE_EMAIL, href: `mailto:${PROFILE_EMAIL}`, external: false },
  { Icon: Send, label: "Telegram @per0w", href: PROFILE_TELEGRAM_URL, external: true },
  { Icon: GitHubIcon, label: "github.com/per0w", href: PROFILE_GITHUB_URL, external: true },
  { Icon: VkIcon, label: "vk.com/per0w", href: PROFILE_VK_URL, external: true },
  {
    Icon: MaxMessengerIcon,
    label: "MAX — профиль",
    href: MAX_MESSENGER_PROFILE_URL,
    external: true,
  },
];

const SKILLS = {
  Frontend:
    "React, TypeScript, JavaScript, Next.js, Redux, Tailwind CSS, Svelte, Astro, HTML5, CSS3, Sass, Material UI, Framer Motion",
  "DevOps & Infra": "Docker, Kubernetes, Nginx, Linux, Bash, Ansible, CI/CD, TeamCity",
  "Backend & Tools": "Node.js, Deno, Vite, Webpack, Babel, Gulp",
  "AI & Modern": "LLM, Cursor AI, ChatGPT, Claude, GitHub Copilot, Prompt Engineering",
};

const EXPERIENCE = [
  {
    title: "Главный инженер разработки",
    company: "Газпромбанк",
    companyUrl: "https://www.gazprombank.ru",
    current: true,
    points: [
      "Полный цикл: аналитика → проектирование API-контрактов → frontend → CI/CD",
      "Легаси и микросервисы на современном стеке экосистемы React",
      "DevOps-практики: пайплайны, скрипты деплоя, TeamCity",
      "Рефакторинг архитектуры — ускорение внедрения фич в 2×",
      "Менторинг и онбординг разработчиков",
    ],
  },
  {
    title: "Frontend Team Lead",
    company: "Optimax Dev",
    companyUrl: "https://optimax.dev",
    points: [
      "Руководство командой 4+ разработчиков, Agile",
      "Интеграция платёжных систем: PayPal, Klarna, Apple Pay, Stripe",
      "Проекты для международных e-commerce заказчиков (GlassesUSA)",
    ],
  },
  {
    title: "Frontend-разработчик",
    company: "Optimax Dev",
    companyUrl: "https://optimax.dev",
    points: [
      "SSR — улучшение Core Web Vitals и конверсии",
      "Рост до Team Lead за счёт высокой эффективности",
    ],
  },
  {
    title: "Frontend-разработчик",
    company: "CosySoft",
    companyUrl: "https://cosysoft.org",
    points: [
      "React, React Native, Redux, RxJS — кроссплатформа (Web, iOS, Android)",
      "Электронный дневник МЭШ для миллионов пользователей",
    ],
  },
  {
    title: "DevOps-инженер",
    company: "Optimax Dev",
    companyUrl: "https://optimax.dev",
    points: [
      "Docker, Nginx, TeamCity — CI/CD пайплайны с нуля",
      "Ansible, Bash, Python — автоматизация деплоя",
      "Kubernetes, администрирование Linux-серверов",
    ],
  },
];

const PROJECTS = [
  {
    name: "Сервис24 — мобильные акты",
    url: "https://neyron163.github.io/service24/dashboard",
    desc: "PWA для сервисных инженеров: акты, 1С, офлайн-очередь. Ionic, TanStack Query, Dexie, Vite (в разработке)",
  },
  {
    name: "Trenika",
    url: "https://trenika.space",
    desc: "PWA-дневник тренировок. Full-stack: React, Fastify, Prisma, Docker",
  },
  {
    name: "МЭШ — Электронный дневник",
    url: "https://cosysoft.org/portfolio/lms-digital-diary",
    desc: "Кроссплатформенное приложение для миллионов учеников. React Native, RxJS",
  },
  {
    name: "GlassesUSA",
    url: "https://www.glassesusa.com",
    desc: "E-commerce для крупнейшего US ритейлера очков. SSR, платёжные интеграции",
  },
];

export const CvContent = () => {
  const handlePrint = () => window.print();

  return (
    <main
      aria-labelledby="cv-page-title"
      className="py-10 outline-none focus:outline-none print:py-0"
      id={MAIN_CONTENT_ID}
      tabIndex={-1}
    >
      {/* Навигация */}
      <div className="mb-8 flex items-center justify-between print:hidden">
        <Link
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
          href="/"
        >
          <ArrowLeft aria-hidden className="h-4 w-4" />
          На главную
        </Link>
        <button
          aria-label="Открыть диалог печати браузера для сохранения резюме в PDF"
          className="neon-glow inline-flex items-center gap-2 rounded-lg border border-accent/60 px-5 py-2.5 text-sm font-medium text-accent transition-all hover:border-accent hover:bg-accent/10"
          type="button"
          onClick={handlePrint}
        >
          <Download className="h-4 w-4" />
          Скачать PDF
        </button>
      </div>

      {/* Шапка */}
      <header className="mb-10 border-b border-border/50 pb-8" data-orbo-cv="header">
        <h1
          className="bg-linear-to-r from-accent via-accent-light to-accent-secondary bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl print:text-foreground"
          id="cv-page-title"
        >
          Владимир Перов
        </h1>
        <p className="mt-1 text-xl font-semibold text-foreground/80">Senior Frontend Developer</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          8+ лет в IT. От DevOps-инженера до ведущего frontend-разработчика в банковском секторе.
          Понимаю весь стек — от серверной инфраструктуры до пиксель-перфект UI. Активно применяю
          AI-инструменты для ускорения разработки.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {CONTACTS.map(({ Icon, label, href, external }) => (
            <a
              key={label}
              className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
              href={href}
              rel={external ? "noopener noreferrer" : undefined}
              target={external ? "_blank" : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </a>
          ))}
        </div>
      </header>

      <div className="grid gap-10 md:grid-cols-[1fr_280px]">
        {/* Левая колонка — опыт */}
        <div>
          <SectionTitle>Опыт работы</SectionTitle>
          <div className="space-y-7">
            {EXPERIENCE.map((job) => (
              <div
                key={`${job.company}-${job.title}`}
                data-orbo-cv={`job-${job.company}-${job.title}`.toLowerCase().replace(/\s+/g, "-")}
              >
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                  <h3 className="text-base font-bold">{job.title}</h3>
                  <a
                    className="text-sm font-medium text-accent transition-colors hover:text-accent-light print:text-foreground"
                    href={job.companyUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {job.company} ↗
                  </a>
                  {job.current && (
                    <span className="rounded-full border border-accent-secondary/30 bg-accent-secondary/10 px-2 py-0.5 text-xs font-medium text-accent-secondary print:border-foreground/30 print:text-foreground">
                      сейчас
                    </span>
                  )}
                </div>
                <ul className="mt-2 space-y-1">
                  {job.points.map((p) => (
                    <li key={p} className="flex gap-2 text-sm text-foreground/70">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/60 print:bg-foreground/40" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <SectionTitle className="mt-10">Проекты</SectionTitle>
          <div className="space-y-4" data-orbo-cv="projects">
            {PROJECTS.map((p) => (
              <div key={p.name}>
                <a
                  className="text-sm font-bold text-foreground transition-colors hover:text-accent"
                  href={p.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {p.name} ↗
                </a>
                <p className="text-sm text-muted">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Правая колонка — навыки */}
        <aside data-orbo-cv="skills">
          <SectionTitle>Навыки</SectionTitle>
          <div className="space-y-5">
            {Object.entries(SKILLS).map(([group, skills]) => (
              <div key={group}>
                <h4 className="text-xs font-semibold tracking-wide text-accent uppercase print:text-foreground">
                  {group}
                </h4>
                <p className="mt-1 text-sm leading-relaxed text-muted">{skills}</p>
              </div>
            ))}
          </div>

          <SectionTitle className="mt-10">Образование</SectionTitle>
          <p className="text-sm text-muted">
            Самообразование, профессиональные курсы, 8+ лет коммерческой практики
          </p>

          <SectionTitle className="mt-10">Языки</SectionTitle>
          <p className="text-sm text-muted">Русский — родной</p>
          <p className="text-sm text-muted">English — B1 (intermediate)</p>
        </aside>
      </div>
    </main>
  );
};

const SectionTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h2
    className={`mb-4 border-b border-border/50 pb-2 text-sm font-bold tracking-wide text-foreground uppercase ${className}`}
  >
    {children}
  </h2>
);
