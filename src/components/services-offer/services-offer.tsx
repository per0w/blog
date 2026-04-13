import Link from "next/link";

import {
  ArrowRight,
  Gauge,
  Globe,
  Layers,
  Server,
  Sparkles,
  Wrench,
} from "lucide-react";

import { PROFILE_TELEGRAM_URL, SECTIONS_IDS } from "@/constants/common";
import { Section } from "@/ui/section/section";

const OFFER_PILLARS: {
  icon: typeof Globe;
  title: string;
  text: string;
}[] = [
  {
    icon: Globe,
    title: "От визитки до продукта",
    text: "Лендинг, корпоративный сайт, личный кабинет, сложное SPA или админка — беру в работу задачу целиком: от согласования ТЗ до деплоя и сопровождения.",
  },
  {
    icon: Layers,
    title: "Веб-приложения под ключ",
    text: "React, Next.js, TypeScript, состояние, API, доступность и производительность — в духе того, как я строю фронт в банке и на коммерческих проектах.",
  },
  {
    icon: Server,
    title: "Инфра и автоматизация",
    text: "Docker, CI/CD, nginx, скрипты, облако — настрою пайплайны и окружение так, чтобы релизы не были болью.",
  },
  {
    icon: Wrench,
    title: "Донастройка и разбор",
    text: "Уже есть проект, но тормозит, падает сборка или непонятен стек? Разберу, предложу план и доведу до рабочего состояния.",
  },
];

export function ServicesOffer() {
  return (
    <Section id={SECTIONS_IDS.services} title="Разработка на заказ">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4">
        <div className="text-center md:text-left">
          <p className="text-lg leading-relaxed text-muted">
            Можно заказать проект <strong className="font-semibold text-foreground">любой сложности</strong>
            : от лаконичной визитки в сети до полноценного веб-приложения и настройки инфраструктуры. Один
            контакт — и вы получаете инженера с опытом лида и DevOps: без лишних посредников и в лучших
            традициях — прозрачные сроки, аккуратный код и честное «да/нет» по срокам и рискам.
          </p>
          <p className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted md:justify-start">
            <Sparkles aria-hidden className="size-4 shrink-0 text-accent-secondary" />
            <span>
              Формат и бюджет обсуждаем до старта: фикс, этапы или разовый блок часов — как удобнее под
              вашу задачу. Условия работы закреплены в{" "}
              <Link
                className="font-medium text-accent underline decoration-accent/35 underline-offset-2 hover:decoration-accent"
                href="/dev-offer"
              >
                публичной оферте
              </Link>
              .
            </span>
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {OFFER_PILLARS.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="flex gap-3 rounded-2xl border border-border bg-surface p-4 text-left shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Icon aria-hidden className="size-5" />
              </span>
              <div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-stretch gap-5 rounded-2xl border border-accent/25 bg-[color-mix(in_srgb,var(--color-accent)_8%,var(--color-surface))] px-5 py-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <div className="flex max-w-xl flex-col gap-2">
            <p className="flex items-center justify-center gap-2 text-sm font-semibold text-foreground md:justify-start">
              <Gauge aria-hidden className="size-4 text-accent" />
              Расскажите идею или боль — отвечу с оценкой и следующим шагом
            </p>
            <p className="text-sm leading-relaxed text-muted">
              Удобнее всего написать в Telegram: приложите ссылку на прототип, макет или текущий сайт —
              так быстрее сойдёмся в понимании объёма.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-stretch gap-3 sm:flex-row sm:justify-center md:flex-col lg:flex-row">
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-md transition-[filter,box-shadow] hover:brightness-105 hover:shadow-lg"
              href={`/#${SECTIONS_IDS.contactUs}`}
            >
              Обсудить проект
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <a
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-accent/50 px-6 py-3 text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
              href={PROFILE_TELEGRAM_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              Написать в Telegram
              <ArrowRight aria-hidden className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
