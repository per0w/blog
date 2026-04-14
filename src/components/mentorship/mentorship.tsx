import Link from "next/link";

import {
  Briefcase,
  Code2,
  Coffee,
  GraduationCap,
  MessageSquare,
  Settings2,
  Users,
} from "lucide-react";

import { PROFILE_TELEGRAM_URL, SECTIONS_IDS } from "@/constants/common";
import { Section } from "@/ui/section/section";

const FORMATS: {
  icon: typeof GraduationCap;
  title: string;
  text: string;
}[] = [
  {
    icon: GraduationCap,
    title: "Сопровождение на пути в IT",
    text: "Структура обучения, портфолио, собеседования, переговоры о зарплате — веду по этапам, без воды.",
  },
  {
    icon: MessageSquare,
    title: "Разовые консультации",
    text: "Один созвон по запросу: куда расти, как выйти из тупика, что докрутить в резюме или на проекте.",
  },
  {
    icon: Code2,
    title: "Код-ревью и практика",
    text: "Разбор MR, архитектуры фронта, TypeScript/React, тесты, производительность — как у коллеги с опытом лида.",
  },
  {
    icon: Settings2,
    title: "Настройка и инфра под задачу",
    text: "Окружение, CI, Docker, монорепо, линтеры — помогаю настроить так, чтобы не отвлекало от разработки.",
  },
  {
    icon: Users,
    title: "Командное сопровождение",
    text: "Процессы, онбординг, парное менторство внутри команды — формат обсуждаем под ваш контекст.",
  },
  {
    icon: Briefcase,
    title: "Полное ведение",
    text: "Долгий контракт: регулярные сессии, цели, разбор кейсов — как менторство в продуктовой компании, только напрямую со мной.",
  },
];

export function Mentorship() {
  return (
    <Section id={SECTIONS_IDS.mentorship} title="Менторство">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4">
        <div className="text-center md:text-left">
          <p className="text-lg leading-relaxed text-muted">
            Работаю как <strong className="font-semibold text-foreground">частный ментор</strong>:
            делюсь опытом senior / team lead и восьми лет в IT — от кода до процессов. Формат и
            глубина — под ваш запрос: от одной встречи до долгого сопровождения.
          </p>
          <p className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted md:justify-start">
            <Coffee aria-hidden className="size-4 shrink-0 text-accent" />
            <span>
              Оплата <strong className="font-medium text-foreground">обсуждаема</strong>: можно
              начать с лёгкого формата (условно «за кофе») и перейти к оплате по согласованным
              реквизитам и{" "}
              <Link
                className="font-medium text-accent underline decoration-accent/35 underline-offset-2 hover:decoration-accent"
                href="/mentorship-offer"
              >
                публичной оферте
              </Link>
              , если решаем работать системно.
            </span>
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {FORMATS.map(({ icon: Icon, title, text }) => (
            <li
              key={title}
              className="shadow-elevation-panel hover:shadow-elevation-card flex gap-3 rounded-2xl border border-border bg-surface p-4 text-left transition-[box-shadow] duration-200"
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

        <div className="flex flex-col items-center gap-3 rounded-2xl border border-accent/20 bg-[color-mix(in_srgb,var(--color-accent)_6%,var(--color-surface))] px-5 py-6 text-center md:flex-row md:justify-between md:text-left">
          <p className="max-w-xl text-sm leading-relaxed text-muted">
            Напишите, что хотите получить от менторства — предложу формат и ритм. Ответ в Telegram
            обычно быстрее всего.
          </p>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Link
              className="focus-ring-accent shadow-elevation-panel hover:shadow-elevation-card inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-[opacity,box-shadow] hover:opacity-90"
              href={`/#${SECTIONS_IDS.contactUs}`}
            >
              Форма на сайте
            </Link>
            <a
              className="focus-ring-accent shadow-elevation-panel hover:shadow-elevation-card inline-flex items-center justify-center rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-[border-color,box-shadow,color] hover:border-accent/40 hover:text-accent"
              href={PROFILE_TELEGRAM_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
