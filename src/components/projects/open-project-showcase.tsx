"use client";

import { ExternalLink } from "lucide-react";

import { PROFILE_GITHUB_URL } from "@/constants/common";
import { GitHubIcon } from "@/ui/icons";
import {
  ProjectCardMedia,
  type ProjectCardSlide,
} from "@/ui/project-card-media/project-card-media";
import { Tags } from "@/ui/tags/tags";

export type OpenProjectShowcaseProps = {
  title: string;
  /** Одно предложение: что это за продукт. */
  summary: string;
  /** Зачем сделано / какую боль закрывает. */
  motivation: string;
  tags: string[];
  slides: ProjectCardSlide[];
  demoUrl: string;
  demoLabel?: string;
  /** Ссылка на репозиторий или профиль GitHub, если отдельного репо нет. */
  sourceUrl?: string;
  sourceLabel?: string;
  /** panel — широкий блок; carousel — узкая вертикальная карточка для ленты */
  variant?: "panel" | "carousel";
};

const articleClass =
  "overflow-hidden rounded-2xl border border-border bg-surface shadow-lg transition-[border-color,box-shadow] duration-300 hover:border-accent/40 hover:shadow-[0_12px_40px_-12px_color-mix(in_srgb,var(--color-accent)_20%,transparent)]";

/**
 * Открытый проект: превью, смысл, стек, демо и ссылка на код — витрина для найма.
 */
export function OpenProjectShowcase({
  title,
  summary,
  motivation,
  tags,
  slides,
  demoUrl,
  demoLabel = "Живое демо",
  sourceUrl = PROFILE_GITHUB_URL,
  sourceLabel = "GitHub",
  variant = "panel",
}: OpenProjectShowcaseProps) {
  const titleClass =
    variant === "carousel"
      ? "text-lg leading-tight font-bold tracking-tight text-foreground"
      : "text-xl font-bold tracking-tight text-foreground sm:text-2xl";

  const contentWrapperClass =
    variant === "carousel"
      ? "flex flex-col gap-2.5 p-4 sm:gap-3 sm:p-5"
      : "flex flex-col gap-3 p-5 sm:p-6";

  const footerClass =
    variant === "carousel"
      ? "mt-auto flex flex-col gap-2 border-t border-border/60 pt-3"
      : "mt-auto flex flex-wrap gap-3 border-t border-border/60 pt-4";

  const primaryBtnClass =
    variant === "carousel"
      ? "inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_18px_-2px_color-mix(in_srgb,var(--color-accent)_45%,transparent)] transition-[transform,box-shadow,background-color] hover:bg-accent-light hover:shadow-[0_6px_24px_-4px_color-mix(in_srgb,var(--color-accent)_52%,transparent)] active:scale-[0.99] dark:text-white"
      : "inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent transition-colors hover:border-accent/50 hover:bg-accent/15 dark:text-accent-light";

  const secondaryBtnClass =
    variant === "carousel"
      ? "inline-flex w-full min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-[border-color,background-color,box-shadow] hover:border-accent/40 hover:bg-surface-hover hover:shadow-md active:scale-[0.99]"
      : "inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent/35 hover:bg-surface-hover";

  const body = (
    <div className={contentWrapperClass}>
      {variant === "panel" ? (
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className={titleClass}>{title}</h3>
        </div>
      ) : (
        <h3 className={titleClass}>{title}</h3>
      )}
      <p className="text-sm leading-relaxed text-muted">
        <span className="font-semibold text-foreground">Что делает: </span>
        {summary}
      </p>
      <p className="text-sm leading-relaxed text-muted">
        <span className="font-semibold text-foreground">Зачем: </span>
        {motivation}
      </p>
      <div>
        <span className="text-xs font-semibold tracking-wide text-muted uppercase">Стек</span>
        <Tags tags={tags} />
      </div>
      <div className={footerClass}>
        <a className={primaryBtnClass} href={demoUrl} rel="noopener noreferrer" target="_blank">
          {demoLabel}
          <ExternalLink aria-hidden className="size-4 shrink-0 opacity-80" />
        </a>
        {sourceUrl ? (
          <a
            className={secondaryBtnClass}
            href={sourceUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <GitHubIcon className="size-4 shrink-0" />
            {sourceLabel}
          </a>
        ) : null}
      </div>
    </div>
  );

  if (variant === "carousel") {
    return (
      <article className={`${articleClass} flex h-full min-h-0 flex-col`}>
        <ProjectCardMedia slides={slides} />
        {body}
      </article>
    );
  }

  return (
    <article className={articleClass}>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-stretch">
        <div className="border-border lg:border-r">
          <ProjectCardMedia slides={slides} />
        </div>
        {body}
      </div>
    </article>
  );
}
