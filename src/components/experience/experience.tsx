"use client";

import { motion } from "framer-motion";

import { SECTIONS_IDS } from "@/constants/common";
import { Section } from "@/ui/section/section";

import {
  ExperienceTitleEasterEgg,
  type ExperienceTitleEasterEggProps,
} from "./experience-title-easter-egg";

const EXPERIENCE_EASTER_EGGS: Record<string, Omit<ExperienceTitleEasterEggProps, "title">> = {
  "Frontend Team Lead": {
    photoSrc: "/images/easter-eggs/experience-secret-frontend-lead.png",
    photoAlt: "Секретное фото после десяти кликов по должности Frontend Team Lead",
    photoIntrinsicWidth: 768,
    photoIntrinsicHeight: 1024,
    modalHeading: "Секрет тимлида",
    modalDescription: "Личный кадр — награда за десять нажатий по заголовку.",
  },
  "DevOps-инженер": {
    photoSrc: "/images/easter-eggs/experience-secret-devops.png",
    photoAlt: "Секретное фото после десяти кликов по должности DevOps-инженер",
    photoIntrinsicWidth: 1024,
    photoIntrinsicHeight: 768,
    modalHeading: "Дежурный кадр",
    modalDescription: "Снимок с рабочего места — открывается только десятью кликами.",
  },
};

type ExperienceItemProps = {
  title: string;
  company: string;
  companyUrl?: string;
  description: string;
  highlights?: string[];
  current?: boolean;
};

const JOBS: ExperienceItemProps[] = [
  {
    company: "Газпромбанк",
    companyUrl: "https://www.gazprombank.ru",
    title: "Главный инженер разработки",
    description:
      "Полный цикл разработки в одном из крупнейших банков России — от аналитики и проектирования API-контрактов до frontend-реализации и настройки CI/CD.",
    highlights: [
      "Микрофронтенды на React и Module Federation: автономные модули, которые подключаются к единому каркасу приложения банка",
      "Продуктовые и маркетинговые лендинги — от согласования требований до выката и сопровождения",
      "Сценарии подписания документов с квалифицированной электронной подписью (КЭП) в браузере",
      "Конструктор форм: динамическая сборка полей и валидаций под каждый лендинг — без копипасты вёрстки с нуля",
      "Аналитика задач под ключ: декомпозиция, проектирование контрактов бэкенда, реализация фронтенда",
      "DevOps-практики: CI/CD, TeamCity; рефакторинг архитектуры ускорил внедрение новых фич примерно вдвое",
      "Менторинг и онбординг разработчиков в команде",
    ],
    current: true,
  },
  {
    company: "Optimax Dev",
    companyUrl: "https://optimax.dev",
    title: "Frontend Team Lead",
    description:
      "E-commerce проекты для международных заказчиков. Полный цикл: архитектура → разработка → сдача → поддержка.",
    highlights: [
      "Руководство командой из 4+ разработчиков (Agile)",
      "Интеграция платёжных систем: PayPal, Klarna, Apple Pay, Stripe",
      "Ведение проектов от нуля до передачи заказчику",
    ],
  },
  {
    company: "Optimax Dev",
    companyUrl: "https://optimax.dev",
    title: "Frontend-разработчик",
    description:
      "Разработка e-commerce платформ для международных клиентов: высокие нагрузки, SSR и чувствительные checkout-сценарии.",
    highlights: [
      "Внедрение SSR — улучшение Core Web Vitals и конверсии",
      "Рост до Team Lead за счёт высокой личной эффективности",
    ],
  },
  {
    company: "CosySoft",
    companyUrl: "https://cosysoft.org",
    title: "Frontend-разработчик",
    description:
      "Кроссплатформенная разработка веб и мобильных приложений. React, React Native, Redux, RxJS.",
  },
  {
    company: "Optimax Dev",
    companyUrl: "https://optimax.dev",
    title: "DevOps-инженер",
    description:
      "Инфраструктура и автоматизация. Фундамент, который дал понимание всего стека — от железа до продакшена.",
    highlights: [
      "Docker, Nginx, TeamCity — CI/CD пайплайны с нуля",
      "Ansible, Bash, Python — автоматизация деплоя и конфигурации",
      "Kubernetes, настройка и администрирование Linux-серверов",
    ],
  },
];

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export const Experience = () => {
  return (
    <Section id={SECTIONS_IDS.experience} title="Опыт">
      <div className="w-full max-w-2xl px-4">
        <ol className="relative border-l-2 border-accent/40">
          {JOBS.map((job, index) => (
            <motion.li
              key={`${job.company}-${job.title}`}
              className="relative pb-10 pl-8 last:pb-0"
              initial="hidden"
              transition={{ duration: 0.4, delay: index * 0.1 }}
              variants={itemVariants}
              viewport={{ once: true, margin: "-50px" }}
              whileInView="visible"
            >
              <div
                className={`absolute top-1.5 -left-[7px] h-3 w-3 rounded-full ${
                  job.current
                    ? "bg-accent-secondary shadow-[0_0_8px_var(--color-accent-secondary)] ring-4 ring-accent-secondary/20"
                    : "bg-accent"
                }`}
              />

              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                {EXPERIENCE_EASTER_EGGS[job.title] ? (
                  <ExperienceTitleEasterEgg
                    title={job.title}
                    {...EXPERIENCE_EASTER_EGGS[job.title]}
                  />
                ) : (
                  <h3 className="text-lg font-bold">{job.title}</h3>
                )}
                {job.companyUrl ? (
                  <a
                    className="text-sm font-medium text-accent transition-colors hover:text-accent-light"
                    href={job.companyUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {job.company} ↗
                  </a>
                ) : (
                  <span className="text-sm font-medium text-accent">{job.company}</span>
                )}
                {job.current && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-secondary/30 bg-accent-secondary/10 px-2.5 py-0.5 text-xs font-medium text-accent-secondary">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-secondary" />
                    сейчас
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm leading-relaxed text-muted">{job.description}</p>

              {job.highlights && (
                <ul className="mt-2 space-y-1">
                  {job.highlights.map((h) => (
                    <li key={h} className="flex gap-2 text-sm text-foreground/70">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                      {h}
                    </li>
                  ))}
                </ul>
              )}
            </motion.li>
          ))}
        </ol>
      </div>
    </Section>
  );
};
