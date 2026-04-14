"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";

import Link from "next/link";

import { ArrowLeft, BriefcaseBusiness, Download, Mail, Send } from "lucide-react";

import {
  CV_READER_ROLES,
  MAIN_CONTENT_ID,
  ORBO_CV_ROLE_CHANGE_EVENT,
  PROFILE_EMAIL,
  PROFILE_GITHUB_URL,
  PROFILE_TELEGRAM_URL,
  type CvReaderRole,
} from "@/constants/common";
import { GitHubIcon } from "@/ui/icons";

type CvContact = {
  key: string;
  Icon: ComponentType<{ className?: string }>;
  label: string;
  href: string;
  external: boolean;
};

type CvFact = {
  key: string;
  label: string;
  value: string;
};

type ExperienceItem = {
  key: string;
  title: string;
  company: string;
  companyUrl: string;
  period: string;
  current?: boolean;
  stack: string;
  points: string[];
};

/** Абстрактный кейс без публичных ссылок и брендов — детали на созвоне. */
type WorkHighlight = {
  key: string;
  title: string;
  stack: string;
  paragraphs: string[];
};

type CvReaderPersona = {
  id: CvReaderRole;
  label: string;
  title: string;
  description: string;
  focus: string;
  cta: string;
};

type CvRoleCopy = {
  summary: string;
  profilePoints: string[];
  expertiseLead: string;
  skillsLead: string;
  projectsLead: string;
  expertiseItems: string[];
  experiencePointOverrides: Partial<Record<ExperienceItem["key"], string[]>>;
};

type CvHighlightSectionKey =
  | "profile"
  | "projects"
  | "expertise"
  | "skills"
  | "education"
  | "languages"
  | ExperienceItem["key"];

const HABR_CAREER_URL = "https://career.habr.com/per0w";

const CONTACTS: CvContact[] = [
  {
    key: "email",
    Icon: Mail,
    label: PROFILE_EMAIL,
    href: `mailto:${PROFILE_EMAIL}`,
    external: false,
  },
  {
    key: "telegram",
    Icon: Send,
    label: "Telegram @per0w",
    href: PROFILE_TELEGRAM_URL,
    external: true,
  },
  {
    key: "github",
    Icon: GitHubIcon,
    label: "github.com/per0w",
    href: PROFILE_GITHUB_URL,
    external: true,
  },
  {
    key: "habr",
    Icon: BriefcaseBusiness,
    label: "career.habr.com/per0w",
    href: HABR_CAREER_URL,
    external: true,
  },
];

const QUICK_FACTS: CvFact[] = [
  { key: "experience", label: "Опыт", value: "9+ лет в IT" },
  { key: "location", label: "Локация", value: "Тольятти, Россия" },
  { key: "format", label: "Формат", value: "Удалённо / гибрид" },
  { key: "english", label: "Английский", value: "B1 (intermediate)" },
];

const TARGET_ROLES = [
  "Senior Frontend Developer",
  "Lead Frontend Developer",
  "React / Next.js Engineer",
];

const EXPERTISE_ITEMS = [
  "React",
  "TypeScript",
  "Next.js",
  "Redux",
  "Architecture",
  "Performance",
  "SSR",
  "Code Review",
  "Mentoring",
  "CI/CD",
];

const CV_READER_PERSONAS: Record<CvReaderRole, CvReaderPersona> = {
  [CV_READER_ROLES.hr]: {
    id: CV_READER_ROLES.hr,
    label: "HR",
    title: "Режим для HR / recruiter",
    description:
      "Орбо делает акцент на понятном позиционировании, зрелом опыте, прозрачных контактах и шансах быстро закрыть вакансию.",
    focus: "Профиль, карьерная динамика, адекватный уровень, скорость выхода на интервью.",
    cta: "Подходит, чтобы быстро понять: звать на первый скрининг или нет.",
  },
  [CV_READER_ROLES.frontendLead]: {
    id: CV_READER_ROLES.frontendLead,
    label: "Frontend Lead",
    title: "Режим для Frontend Lead",
    description:
      "Орбо подсвечивает архитектуру, performance, mentoring, code review и глубину инженерного мышления.",
    focus: "Стек, рефакторинг, SSR, delivery, качество кода и влияние на команду.",
    cta: "Подходит, чтобы быстро оценить техническую зрелость и командный fit.",
  },
  [CV_READER_ROLES.cto]: {
    id: CV_READER_ROLES.cto,
    label: "CTO",
    title: "Режим для CTO / Head of Engineering",
    description:
      "Орбо фокусируется на ownership, бизнес-эффекте, системном мышлении и умении доводить продукт до результата.",
    focus:
      "Ответственность за delivery, масштаб, кросс-функциональность, DevOps-бэкграунд и продуктовый подход.",
    cta: "Подходит, чтобы понять, усилит ли кандидат команду и процессы целиком.",
  },
};

const SKILLS = {
  "Основной стек": "React, TypeScript, JavaScript, Next.js, Redux, HTML5, CSS3, Tailwind CSS, Sass",
  "Инженерные практики":
    "Архитектура frontend-приложений, рефакторинг, code review, mentoring, performance optimization, SSR, Agile / Scrum",
  "Infra & Delivery": "Docker, Linux, CI/CD, TeamCity, Nginx, Bash, Ansible, Kubernetes",
  Инструменты: "Node.js, Vite, Webpack, Jest, React Testing Library, Git",
  "AI workflow":
    "Cursor AI, ChatGPT, Claude, GitHub Copilot, prompt engineering, AI-assisted development",
};

const EXPERIENCE: ExperienceItem[] = [
  {
    key: "gazprombank-senior-frontend",
    title: "Главный инженер разработки / Senior Frontend Developer",
    company: "Газпромбанк",
    companyUrl: "https://www.gazprombank.ru",
    period: "Октябрь 2021 — настоящее время",
    current: true,
    stack: "React, TypeScript, JavaScript, Redux, TeamCity, CI/CD",
    points: [
      "Разрабатываю и сопровождаю frontend-часть банковских продуктов на React / TypeScript в связке с аналитиками, backend и QA.",
      "Участвую в проектировании API-контрактов, бизнес-логики и технических решений на уровне команды.",
      "Провожу code review, менторю разработчиков и помогаю с онбордингом новых участников команды.",
      "Провёл рефакторинг проекта, который упростил развитие продукта и ускорил внедрение новых фич.",
      "Использую DevOps-подход в ежедневной работе: пайплайны, автоматизация, контроль качества delivery.",
    ],
  },
  {
    key: "optimax-team-lead",
    title: "Frontend Team Lead",
    company: "Optimax Dev",
    companyUrl: "https://optimax.dev",
    period: "Декабрь 2020 — Октябрь 2021",
    stack: "React, TypeScript, JavaScript, Redux, Agile, e-commerce",
    points: [
      "Вёл frontend-команду, отвечал за планирование, приоритизацию задач и delivery по Agile-процессу.",
      "Проектировал архитектуру новых фич и сопровождал проекты от старта до передачи заказчику и дальнейшей поддержки.",
      "Отвечал за интеграции платёжных систем: PayPal, Amazon Pay, Klarna, Apple Pay и gateway-решений уровня Stripe.",
      "Развивал команду через mentoring, обучение и выстраивание инженерных практик.",
    ],
  },
  {
    key: "optimax-frontend",
    title: "Frontend-разработчик",
    company: "Optimax Dev",
    companyUrl: "https://optimax.dev",
    period: "Август 2019 — Декабрь 2020",
    stack: "React, JavaScript, TypeScript, Redux, SSR, e-commerce",
    points: [
      "Разрабатывал новый функционал для e-commerce проектов с фокусом на критичные пользовательские сценарии.",
      "Был ответственным за интеграции платёжных систем и стабильность checkout-потока.",
      "Внедрил SSR, что улучшило производительность приложения и ключевые web-метрики.",
      "За счёт высокой личной эффективности постепенно взял на себя часть обязанностей Team Lead.",
      "Работал с международными заказчиками на крупных e-commerce витринах и чувствительных сценариях оплаты.",
    ],
  },
  {
    key: "cosysoft-frontend",
    title: "Frontend-разработчик",
    company: "CosySoft",
    companyUrl: "https://cosysoft.org",
    period: "Январь 2019 — Август 2019",
    stack: "React, React Native, TypeScript, Redux, RxJS",
    points: [
      "Разрабатывал web и mobile интерфейсы на React и React Native, включая production-ready UI по макетам и прототипам.",
      "Использовал TypeScript, Redux и RxJS для поддержки сложной клиентской логики и реактивных сценариев.",
      "Участвовал во внедрении интеграций, автоматизации разработки и DevOps-практик внутри команды.",
      "Работал над продуктами с большой пользовательской базой, включая решения для сферы образования.",
    ],
  },
  {
    key: "optimax-devops",
    title: "DevOps-инженер",
    company: "Optimax Dev",
    companyUrl: "https://optimax.dev",
    period: "Декабрь 2016 — Январь 2019",
    stack: "Linux, Docker, Nginx, TeamCity, Bash, Python, Ansible, Kubernetes, GCP",
    points: [
      "Поддерживал инфраструктуру разработки: рабочие станции, контейнеры, локальные и dedicated-серверы на Linux.",
      "Настраивал и сопровождал CI/CD-процессы, конфигурации Docker, Nginx, Apache, TeamCity, Bitbucket и Jira.",
      "Автоматизировал рутинные операции с помощью Bash, Python и Ansible, обучал разработчиков инструментам доставки.",
      "Внедрял DevOps-практики, мониторинг и инженерные процессы, которые снижали ручную нагрузку на команду.",
    ],
  },
];

const WORK_HIGHLIGHTS: WorkHighlight[] = [
  {
    key: "personal-pwa-fitness",
    title: "Собственный PWA-продукт: дневник тренировок и прогресс",
    stack: "React, TypeScript, Fastify, Prisma, PWA, Docker",
    paragraphs: [
      "Спроектировал и веду продукт с упором на сценарий в зале: старт тренировки, подходы и веса, история по упражнению, календарь планов и фактов, замеры тела и наглядные графики без лишнего шума в интерфейсе.",
      "Offline-first: логирование и просмотр данных без сети, синхронизация при появлении подключения; установка с лендинга на главный экран как у привычного приложения, без обязательного стора.",
    ],
  },
  {
    key: "edtech-diary-scale",
    title: "Кроссплатформенный клиент в крупной образовательной экосистеме",
    stack: "React Native, TypeScript, RxJS, MobX",
    paragraphs: [
      "Развивал электронный дневник и смежные сценарии для массовой аудитории учеников и родителей: расписание и карточки уроков, успеваемость и тематическое оценивание, домашние задания с тестами и прогрессом, посещаемость и уведомления.",
      "Одна кодовая база под мобильные ОС и веб, реактивная модель и интеграции с backend и партнёрскими сервисами; работа в связке с DevOps, QA и мониторингом на проде.",
    ],
  },
  {
    key: "ecommerce-international",
    title: "Международный e-commerce: витрина, SSR и чек-аут",
    stack: "React, SSR, Redux, платёжные интеграции",
    paragraphs: [
      "Разрабатывал пользовательские потоки для крупного online-ритейлера с фокусом на конверсию, доверие к оплате и устойчивость под пиковый трафик.",
      "SSR и поэтапная оптимизация клиентской части под продакшен-нагрузку, web-метрики и регрессии в критичных сценариях оформления заказа.",
    ],
  },
];

const CV_ROLE_COPY: Record<CvReaderRole, CvRoleCopy> = {
  [CV_READER_ROLES.hr]: {
    summary:
      "Senior / Lead Frontend Developer с 9+ годами опыта в продуктовой и аутсорс-разработке. Работал в fintech, e-commerce и high-load среде, умею быстро встраиваться в команду и брать ответственность за результат. Сильные стороны для найма: понятный senior-профиль, опыт лидерских ролей, прозрачная коммуникация и быстрый выход на рабочий диалог.",
    profilePoints: [
      "Подхожу на Senior / Lead Frontend роли с фокусом на React, TypeScript и Next.js.",
      "Есть понятная карьерная динамика: от DevOps-инженера до Team Lead и Senior Frontend в банковском секторе.",
      "Работал в доменах, где важны надёжность, скорость delivery и качество взаимодействия внутри команды.",
      "Умею не только писать код, но и менторить, проводить code review и помогать новым разработчикам быстрее адаптироваться.",
    ],
    expertiseLead:
      "В HR-режиме стоит смотреть на стек как на подтверждение уровня и скорости адаптации, а не как на самоцель.",
    skillsLead:
      "Этот блок в первую очередь показывает зрелость профиля: сильный frontend, понятный delivery и полезный DevOps-бэкграунд.",
    projectsLead:
      "Короткие абстрактные кейсы без ссылок и брендов — удобно для первого скрина; нюансы и контекст готов обсудить на созвоне.",
    expertiseItems: [
      ...EXPERTISE_ITEMS.filter((item) => ["React", "TypeScript", "Next.js"].includes(item)),
      "Mentoring",
      "Code Review",
      "Architecture",
      "Performance",
      "SSR",
      "CI/CD",
      "Redux",
    ],
    experiencePointOverrides: {
      "gazprombank-senior-frontend": [
        "Работаю в банковском секторе на Senior / Lead уровне и отвечаю за frontend-часть внутренних и продуктовых решений.",
        "Участвую в проектировании решений вместе с аналитиками, backend и QA, что помогает быстрее доводить задачи до результата.",
        "Провожу code review, менторю разработчиков и помогаю команде держать стабильный темп delivery.",
        "Рефакторинг проекта упростил развитие продукта и ускорил внедрение новых фич.",
      ],
      "optimax-team-lead": [
        "Вёл frontend-команду и отвечал за delivery, планирование и сопровождение проектов от старта до поддержки.",
        "Работал с международными e-commerce проектами, включая критичные для бизнеса платёжные интеграции.",
        "Помогал развивать команду через mentoring, обучение и выстраивание инженерных практик.",
      ],
      "optimax-frontend": [
        "Разрабатывал e-commerce функциональность и отвечал за чувствительные checkout-сценарии.",
        "Внедрил SSR и улучшил производительность приложения, что повысило качество пользовательского опыта.",
        "За счёт высокой эффективности постепенно взял на себя часть лидерских обязанностей.",
      ],
    },
  },
  [CV_READER_ROLES.frontendLead]: {
    summary:
      "Senior / Lead Frontend Developer с сильной экспертизой в React, TypeScript, Next.js и архитектуре клиентских приложений. Основной фокус: производительность, качество кода, рефакторинг, SSR, mentoring и стабильный delivery. Полезен там, где нужен не просто исполнитель, а инженер, который усиливает технический уровень команды.",
    profilePoints: [
      "Специализируюсь на React, TypeScript, Next.js и проектировании frontend-архитектуры под production-нагрузку.",
      "Есть опыт performance-оптимизации, SSR, code review и постепенного улучшения легаси-кода без остановки delivery.",
      "Умею вести технический диалог с backend, аналитиками и QA, проектировать контракты и снижать интеграционные риски.",
      "Сильный side-skill: mentoring и инженерные практики, которые помогают команде расти системно, а не случайно.",
    ],
    expertiseLead:
      "В режиме Frontend Lead блок экспертизы показывает, где именно кандидат будет полезен как технический усилитель команды.",
    skillsLead:
      "Здесь главное не ширина списка, а сочетание архитектуры, качества кода, delivery и реального production-опыта.",
    projectsLead:
      "По формулировкам видно PWA/offline-first, кроссплатформу под нагрузкой и зрелый e-commerce — без маркетинговых названий, зато с техническим мясом.",
    expertiseItems: [
      "Architecture",
      "Performance",
      ...EXPERTISE_ITEMS.filter((item) => ["React", "TypeScript", "Next.js"].includes(item)),
      "Code Review",
      "Mentoring",
      "SSR",
      "CI/CD",
      "Redux",
    ],
    experiencePointOverrides: {
      "gazprombank-senior-frontend": [
        "Разрабатываю frontend банковских продуктов на React / TypeScript и участвую в проектировании API-контрактов и бизнес-логики.",
        "Работаю на стыке frontend, backend, аналитики и QA, чтобы технические решения были реализуемыми и устойчивыми.",
        "Провожу code review, менторю разработчиков и помогаю удерживать качество кода на уровне команды.",
        "Рефакторинг проекта упростил развитие архитектуры и ускорил внедрение новых фич без потери стабильности.",
        "Использую DevOps-подход в delivery: пайплайны, автоматизация, контроль качества поставки изменений.",
      ],
      "optimax-team-lead": [
        "Проектировал архитектуру новых фич и вёл команду разработки в e-commerce проектах.",
        "Отвечал за сложные платёжные интеграции: PayPal, Amazon Pay, Klarna, Apple Pay и gateway-решения уровня Stripe.",
        "Помогал команде расти через mentoring, техобсуждения и инженерные практики, а не только через контроль сроков.",
      ],
      "optimax-frontend": [
        "Отвечал за функциональность e-commerce проекта в критичных пользовательских сценариях, включая checkout и платёжные потоки.",
        "Внедрил SSR, улучшив web-метрики и общую производительность клиентской части.",
        "За счёт высокой эффективности постепенно перешёл от роли individual contributor к техническому лидерству.",
      ],
      "cosysoft-frontend": [
        "Разрабатывал web и mobile интерфейсы на React и React Native с production-ready реализацией по макетам и прототипам.",
        "Использовал TypeScript, Redux и RxJS для сложной клиентской логики и реактивных сценариев.",
        "Работал над продуктами с большой пользовательской базой, где важны устойчивость UI и предсказуемость поведения.",
      ],
    },
  },
  [CV_READER_ROLES.cto]: {
    summary:
      "Senior / Lead Frontend Developer с 9+ годами опыта и сильным ownership-подходом. Полезен там, где нужно не просто закрывать frontend-задачи, а усиливать delivery, архитектурную устойчивость и взаимодействие между командами. За счёт DevOps-бэкграунда хорошо понимаю полный путь продукта: от инфраструктуры и релиза до UX и бизнес-результата.",
    profilePoints: [
      "Смотрю на frontend не как на изолированный UI-слой, а как на часть общей системы delivery и пользовательской ценности.",
      "Есть опыт в финтехе, международном e-commerce и продуктах с большой аудиторией, где ошибки дорого стоят.",
      "Полезен в ролях, где нужны ownership, системное мышление, зрелая коммуникация и способность снижать организационное трение.",
      "DevOps-бэкграунд помогает быстрее находить общий язык с инфраструктурой, релизными процессами и инженерными ограничениями продукта.",
    ],
    expertiseLead:
      "Для CTO здесь важен не просто стек, а ширина зоны ответственности и способность кандидата усиливать delivery-систему целиком.",
    skillsLead:
      "Блок навыков показывает, что кандидат может быть связующим звеном между frontend, инженерными процессами и инфраструктурой.",
    projectsLead:
      "Кейсы читайте как сочетание ownership, масштаба и зрелого delivery; публичные ссылки сознательно не привожу — это нормальная практика под NDA и переговоры.",
    expertiseItems: [
      "Architecture",
      "CI/CD",
      "Performance",
      "Mentoring",
      "Code Review",
      ...EXPERTISE_ITEMS.filter((item) => ["React", "TypeScript", "Next.js"].includes(item)),
      "SSR",
      "Redux",
    ],
    experiencePointOverrides: {
      "gazprombank-senior-frontend": [
        "Отвечаю за frontend-часть банковских решений в домене, где критичны надёжность, согласованность процессов и качество поставки изменений.",
        "Участвую в проектировании решений на стыке аналитики, backend, QA и frontend, помогая снижать риски ещё до реализации.",
        "Менторю разработчиков, провожу code review и усиливаю инженерную дисциплину внутри команды.",
        "Рефакторинг проекта упростил развитие продукта и ускорил delivery без потери устойчивости.",
      ],
      "optimax-team-lead": [
        "Вёл frontend-команду и сопровождал проекты от старта до поддержки, совмещая delivery, архитектуру и развитие людей.",
        "Работал с международными e-commerce решениями и критичными платёжными интеграциями, где важны надёжность и бизнес-непрерывность.",
        "Выстраивал инженерные практики, которые повышали предсказуемость разработки и снижали зависимость от отдельных людей.",
      ],
      "optimax-devops": [
        "Поддерживал инфраструктуру разработки и production-окружения, что дало сильное понимание реального пути изменений до прода.",
        "Автоматизировал рутинные процессы, CI/CD и конфигурации, снижая ручную нагрузку и ускоряя delivery команды.",
        "Этот опыт полезен и сейчас: лучше вижу системные ограничения, риски релизов и точки для оптимизации процессов.",
      ],
    },
  },
};

const CV_ROLE_LABELS: Record<CvReaderRole, string> = {
  [CV_READER_ROLES.hr]: "HR",
  [CV_READER_ROLES.frontendLead]: "Frontend Lead",
  [CV_READER_ROLES.cto]: "CTO",
};

const CV_ROLE_SECTION_PRIORITY: Record<
  CvReaderRole,
  {
    focus: CvHighlightSectionKey[];
    supporting: CvHighlightSectionKey[];
  }
> = {
  [CV_READER_ROLES.hr]: {
    focus: ["profile", "gazprombank-senior-frontend", "optimax-team-lead", "projects", "languages"],
    supporting: ["skills", "education", "optimax-frontend"],
  },
  [CV_READER_ROLES.frontendLead]: {
    focus: [
      "expertise",
      "skills",
      "gazprombank-senior-frontend",
      "optimax-team-lead",
      "optimax-frontend",
      "projects",
    ],
    supporting: ["profile", "cosysoft-frontend", "optimax-devops"],
  },
  [CV_READER_ROLES.cto]: {
    focus: [
      "profile",
      "gazprombank-senior-frontend",
      "optimax-team-lead",
      "optimax-devops",
      "projects",
    ],
    supporting: ["expertise", "skills", "languages"],
  },
};

function getRoleAwareExperiencePoints(roleCopy: CvRoleCopy, job: ExperienceItem): string[] {
  return roleCopy.experiencePointOverrides[job.key] ?? job.points;
}

function getSectionTone(
  role: CvReaderRole,
  key: CvHighlightSectionKey,
): "focus" | "supporting" | "neutral" {
  const priority = CV_ROLE_SECTION_PRIORITY[role];
  if (priority.focus.includes(key)) return "focus";
  if (priority.supporting.includes(key)) return "supporting";
  return "neutral";
}

function getSectionCardClass(role: CvReaderRole, key: CvHighlightSectionKey): string {
  const tone = getSectionTone(role, key);

  if (tone === "focus") {
    return "rounded-2xl border border-accent/35 bg-accent/6 p-5 shadow-[0_0_26px_color-mix(in_srgb,var(--color-accent)_10%,transparent)] transition-all duration-300 print:border-border print:bg-transparent print:shadow-none";
  }

  if (tone === "supporting") {
    return "rounded-2xl border border-border/60 bg-surface/45 p-5 transition-all duration-300 print:border-border print:bg-transparent";
  }

  return "rounded-2xl border border-border/40 bg-transparent p-5 transition-all duration-300 print:border-border print:bg-transparent";
}

function getSectionBadge(role: CvReaderRole, key: CvHighlightSectionKey): string | null {
  const tone = getSectionTone(role, key);
  if (tone !== "focus") return null;
  return `В фокусе для ${CV_ROLE_LABELS[role]}`;
}

export const CvContent = () => {
  const [selectedReaderRole, setSelectedReaderRole] = useState<CvReaderRole>(CV_READER_ROLES.hr);
  const handlePrint = () => window.print();
  const activeReaderPersona = CV_READER_PERSONAS[selectedReaderRole];
  const activeRoleCopy = CV_ROLE_COPY[selectedReaderRole];

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent<{ role: CvReaderRole }>(ORBO_CV_ROLE_CHANGE_EVENT, {
        detail: { role: selectedReaderRole },
      }),
    );
  }, [selectedReaderRole]);

  return (
    <main
      aria-labelledby="cv-page-title"
      className="py-10 outline-none focus:outline-none print:py-0"
      id={MAIN_CONTENT_ID}
      tabIndex={-1}
    >
      <div className="mb-8 flex items-center justify-between print:hidden">
        <Link
          className="inline-flex items-center gap-1.5 text-[15px] text-foreground/75 transition-colors hover:text-accent md:text-base"
          href="/"
        >
          <ArrowLeft aria-hidden className="h-4 w-4" />
          На главную
        </Link>
        <button
          aria-label="Открыть диалог печати браузера для сохранения резюме в PDF"
          className="neon-glow inline-flex items-center gap-2 rounded-lg border border-accent/60 px-5 py-2.5 text-[15px] font-medium text-accent transition-all hover:border-accent hover:bg-accent/10 md:text-base"
          data-orbo-cv-action="download"
          type="button"
          onClick={handlePrint}
        >
          <Download className="h-4 w-4" />
          Скачать PDF
        </button>
      </div>

      <header className="mb-10 border-b border-border/50 pb-8" data-orbo-cv="header">
        <h1
          className="bg-linear-to-r from-accent via-accent-light to-accent-secondary bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl print:text-foreground"
          id="cv-page-title"
        >
          Владимир Перов
        </h1>
        <p className="mt-1 text-xl font-semibold text-foreground md:text-2xl">
          Senior / Lead Frontend Developer
        </p>
        <p className="mt-3 max-w-3xl text-[15px] leading-[1.65] text-foreground/85 md:text-[17px] md:leading-[1.68]">
          {activeRoleCopy.summary}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {TARGET_ROLES.map((role) => (
            <span
              key={role}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground/90 md:text-sm"
              data-orbo-cv-item={`role-${role.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            >
              {role}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
          {CONTACTS.map(({ key, Icon, label, href, external }) => (
            <a
              key={label}
              className="inline-flex items-center gap-1.5 text-[15px] text-foreground/78 transition-colors hover:text-accent md:text-base"
              data-orbo-cv-action={`contact-${key}`}
              data-orbo-cv-item={`contact-${key}`}
              href={href}
              rel={external ? "noopener noreferrer" : undefined}
              target={external ? "_blank" : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </a>
          ))}
        </div>

        <dl className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {QUICK_FACTS.map((fact) => (
            <div
              key={fact.key}
              className="rounded-xl border border-border/60 bg-surface/70 px-4 py-3"
              data-orbo-cv-item={`fact-${fact.key}`}
            >
              <dt className="text-xs font-semibold tracking-wide text-foreground/60 uppercase">
                {fact.label}
              </dt>
              <dd className="mt-1 text-[15px] font-semibold text-foreground md:text-base">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        <section
          aria-labelledby="cv-reader-mode-title"
          className="mt-6 rounded-2xl border border-border/60 bg-surface/70 p-4 print:hidden"
          data-orbo-cv="reader-mode"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-foreground" id="cv-reader-mode-title">
                Смотреть CV глазами
              </h2>
              <p className="mt-1 text-[15px] leading-[1.65] text-foreground/80 md:text-base">
                Выбери роль читателя, и страница подстроит акценты в тексте резюме, а Орбо начнёт
                подсвечивать релевантные сильные стороны.
              </p>
            </div>
            <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              Role-aware режим
            </span>
          </div>

          <div
            aria-label="Режимы чтения CV"
            className="mt-4 grid gap-2 sm:grid-cols-3"
            role="tablist"
          >
            {Object.values(CV_READER_PERSONAS).map((persona) => {
              const isActive = persona.id === selectedReaderRole;

              return (
                <button
                  key={persona.id}
                  aria-pressed={isActive}
                  data-orbo-cv-action={`persona-${persona.id}`}
                  data-orbo-cv-item={`persona-${persona.id}`}
                  type="button"
                  className={`min-h-11 rounded-xl border px-4 py-3 text-left transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-95 ${
                    isActive
                      ? "border-accent/60 bg-accent/10 text-foreground shadow-[0_0_18px_color-mix(in_srgb,var(--color-accent)_12%,transparent)]"
                      : "border-border bg-background/40 text-foreground/80 hover:border-accent/30 hover:bg-accent/5"
                  }`}
                  onClick={() => setSelectedReaderRole(persona.id)}
                >
                  <span className="block text-[15px] font-semibold md:text-base">
                    {persona.label}
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-foreground/72">
                    {persona.title}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className="mt-4 rounded-2xl border border-border/60 bg-background/40 p-4"
            data-orbo-cv-item={`persona-panel-${selectedReaderRole}`}
          >
            <p className="text-base font-semibold text-foreground">{activeReaderPersona.title}</p>
            <p className="mt-2 text-[15px] leading-[1.65] text-foreground/82 md:text-base">
              {activeReaderPersona.description}
            </p>
            <p className="mt-3 text-xs font-semibold tracking-wide text-accent uppercase">
              Что будет в фокусе
            </p>
            <p className="mt-1 text-[15px] leading-[1.65] text-foreground/88 md:text-base">
              {activeReaderPersona.focus}
            </p>
            <p className="mt-3 text-[15px] leading-[1.65] text-foreground/88 md:text-base">
              {activeReaderPersona.cta}
            </p>
          </div>
        </section>
      </header>

      <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <section
            className={getSectionCardClass(selectedReaderRole, "profile")}
            data-orbo-cv="profile"
          >
            <SectionHeader badge={getSectionBadge(selectedReaderRole, "profile")} title="Профиль" />
            <ul className="space-y-2">
              {activeRoleCopy.profilePoints.map((point) => (
                <li
                  key={point}
                  className="flex gap-2 text-[15px] leading-[1.65] text-foreground/92 md:text-base"
                  data-orbo-cv-item="profile-point"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60 print:bg-foreground/40" />
                  {point}
                </li>
              ))}
            </ul>
          </section>

          <SectionTitle className="mt-10">Опыт работы</SectionTitle>
          <div className="space-y-5">
            {EXPERIENCE.map((job) => (
              <article
                key={`${job.company}-${job.title}`}
                className={getSectionCardClass(selectedReaderRole, job.key)}
                data-orbo-cv={`job-${job.key}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <SectionHeader
                      badge={getSectionBadge(selectedReaderRole, job.key)}
                      title={job.title}
                      titleClassName="text-lg md:text-xl"
                    />
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      {job.current && (
                        <span className="rounded-full border border-accent-secondary/30 bg-accent-secondary/10 px-2 py-0.5 text-xs font-medium text-accent-secondary print:border-foreground/30 print:text-foreground">
                          сейчас
                        </span>
                      )}
                    </div>
                    <a
                      className="text-[15px] font-semibold text-accent transition-colors hover:text-accent-light md:text-base print:text-foreground"
                      href={job.companyUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {job.company} ↗
                    </a>
                  </div>
                  <p className="text-[15px] font-medium text-foreground/70 md:text-base">
                    {job.period}
                  </p>
                </div>

                <p className="mt-2 text-[15px] text-foreground/88 md:text-base">
                  <span className="font-semibold text-foreground">Стек:</span> {job.stack}
                </p>

                <ul className="mt-3 space-y-2">
                  {getRoleAwareExperiencePoints(activeRoleCopy, job).map((point) => (
                    <li
                      key={point}
                      className="flex gap-2 text-[15px] leading-[1.65] text-foreground/92 md:text-base"
                    >
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/60 print:bg-foreground/40" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <section
            className={`mt-10 ${getSectionCardClass(selectedReaderRole, "projects")}`}
            data-orbo-cv="projects"
          >
            <SectionHeader
              badge={getSectionBadge(selectedReaderRole, "projects")}
              title="Кейсы и продуктовый опыт"
            />
            <p className="mb-4 text-[15px] leading-[1.65] text-foreground/82 md:text-base">
              {activeRoleCopy.projectsLead}
            </p>
            <div className="space-y-6">
              {WORK_HIGHLIGHTS.map((item) => (
                <div key={item.key} data-orbo-cv-item={`work-${item.key}`}>
                  <h3 className="text-base font-bold text-foreground md:text-lg">{item.title}</h3>
                  <p className="mt-1 text-[15px] text-foreground/75 md:text-base">
                    <span className="font-semibold text-foreground">Стек: </span>
                    {item.stack}
                  </p>
                  <div className="mt-2 space-y-2">
                    {item.paragraphs.map((p, i) => (
                      <p
                        key={`${item.key}-${i}`}
                        className="text-[15px] leading-[1.65] text-foreground/88 md:text-base"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside>
          <section
            className={getSectionCardClass(selectedReaderRole, "expertise")}
            data-orbo-cv="expertise"
          >
            <SectionHeader
              badge={getSectionBadge(selectedReaderRole, "expertise")}
              title="Ключевая экспертиза"
            />
            <p className="mb-4 text-[15px] leading-[1.65] text-foreground/82 md:text-base">
              {activeRoleCopy.expertiseLead}
            </p>
            <div className="flex flex-wrap gap-2">
              {activeRoleCopy.expertiseItems.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground/90 md:text-sm"
                  data-orbo-cv-item={`expertise-${item.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section
            className={`mt-10 ${getSectionCardClass(selectedReaderRole, "skills")}`}
            data-orbo-cv="skills"
          >
            <SectionHeader badge={getSectionBadge(selectedReaderRole, "skills")} title="Навыки" />
            <p className="mb-4 text-[15px] leading-[1.65] text-foreground/82 md:text-base">
              {activeRoleCopy.skillsLead}
            </p>
            <div className="space-y-5">
              {Object.entries(SKILLS).map(([group, skills]) => (
                <div
                  key={group}
                  data-orbo-cv-item={`skills-${group.toLowerCase().replace(/[^a-zа-я0-9]+/gi, "-")}`}
                >
                  <h4 className="text-xs font-semibold tracking-wide text-accent uppercase md:text-sm print:text-foreground">
                    {group}
                  </h4>
                  <p className="mt-1.5 text-[15px] leading-[1.65] text-foreground/88 md:text-base">
                    {skills}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section
            className={`mt-10 ${getSectionCardClass(selectedReaderRole, "education")}`}
            data-orbo-cv="education"
          >
            <SectionHeader
              badge={getSectionBadge(selectedReaderRole, "education")}
              title="Образование"
            />
            <div
              className="space-y-2 text-[15px] leading-[1.65] text-foreground/85 md:text-base"
              data-orbo-cv-item="education-degree"
            >
              <p className="font-semibold text-foreground">
                Волжский университет им. В.Н. Татищева
              </p>
              <p>Факультет информатики и телекоммуникаций</p>
              <p>Информатика и системы управления, 2016</p>
            </div>
          </section>

          <section
            className={`mt-10 ${getSectionCardClass(selectedReaderRole, "languages")}`}
            data-orbo-cv="languages"
          >
            <SectionHeader badge={getSectionBadge(selectedReaderRole, "languages")} title="Языки" />
            <p
              className="text-[15px] text-foreground/88 md:text-base"
              data-orbo-cv-item="language-ru"
            >
              Русский — родной
            </p>
            <p
              className="text-[15px] text-foreground/88 md:text-base"
              data-orbo-cv-item="language-en"
            >
              English — B1 (intermediate)
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
};

const SectionTitle = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <h2
    className={`mb-4 border-b border-border/50 pb-2 text-sm font-bold tracking-wide text-foreground uppercase md:text-base ${className}`}
  >
    {children}
  </h2>
);

const SectionHeader = ({
  title,
  badge,
  titleClassName = "",
}: {
  title: ReactNode;
  badge?: string | null;
  titleClassName?: string;
}) => (
  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
    <SectionTitle className={`mb-0 border-none pb-0 ${titleClassName}`}>{title}</SectionTitle>
    {badge ? (
      <span className="rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-[11px] font-medium tracking-wide text-accent uppercase print:border-border print:bg-transparent print:text-foreground">
        {badge}
      </span>
    ) : null}
  </div>
);
