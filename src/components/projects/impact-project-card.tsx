import Link from "next/link";

import { Tags } from "@/ui/tags/tags";

/** Префикс позиции в тексте роли — выделяем визуально, чтобы быстро считывался уровень ответственности. */
const ROLE_POSITION_PREFIX = "Tech Lead & Frontend.";

export type ImpactProjectCardProps = {
  emoji: string;
  title: string;
  /** Какую задачу решает продукт (не список фич). */
  problem: string;
  stack: readonly string[];
  /** Зона ответственности на проекте. */
  role: string;
};

/**
 * Карточка коммерческого опыта без брендов и скринов NDA: масштаб, стек, роль.
 * Детали — только в резюме.
 */
export function ImpactProjectCard({ emoji, title, problem, stack, role }: ImpactProjectCardProps) {
  const roleStartsWithPosition =
    role.startsWith(ROLE_POSITION_PREFIX) && role.length > ROLE_POSITION_PREFIX.length;
  const roleRest = roleStartsWithPosition
    ? role.slice(ROLE_POSITION_PREFIX.length).replace(/^\s+/, "")
    : null;

  return (
    <article
      className="shadow-elevation-panel hover:shadow-elevation-card flex h-full min-h-0 flex-col rounded-2xl border border-border bg-surface p-5 text-left transition-[box-shadow,border-color] duration-300 hover:border-accent/35"
      data-orbo-impact-card=""
    >
      <div aria-hidden className="mb-3 text-3xl">
        {emoji}
      </div>
      <h3 className="text-lg leading-snug font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{problem}</p>
      <div className="mt-3">
        <Tags size="sm" tags={stack} />
      </div>
      <div className="mt-4 text-sm leading-relaxed">
        <span className="text-xs font-semibold tracking-wide text-muted uppercase">Роль</span>
        <p className="mt-1.5 text-foreground">
          {roleStartsWithPosition ? (
            <>
              <span className="font-semibold text-accent dark:text-accent-light">
                {ROLE_POSITION_PREFIX}
              </span>{" "}
              {roleRest}
            </>
          ) : (
            role
          )}
        </p>
      </div>
      <p className="mt-4 text-xs">
        <Link
          className="font-medium text-accent underline-offset-2 transition-colors hover:text-accent-light hover:underline"
          href="/cv"
        >
          Подробности в резюме
        </Link>
      </p>
    </article>
  );
}
