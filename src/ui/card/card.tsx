"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

import {
  ProjectCardMedia,
  type ProjectCardSlide,
} from "@/ui/project-card-media/project-card-media";

import { Tags } from "../tags/tags";

interface CardProps {
  url?: string;
  description: string;
  tags: string[];
  title?: string;
  /** Все превью проекта: один элемент — статичная картинка, несколько — общий слайдер */
  slides: ProjectCardSlide[];
  imageClassName?: string;
  emoji?: string;
  /** Коротко для эйчаров (карусель); иначе описание режется */
  hook?: string;
  /** Карусель: узкая карточка в горизонтальной ленте */
  variant?: "carousel" | "grid";
}

export const Card = ({
  url,
  description,
  title,
  tags,
  slides,
  imageClassName,
  emoji,
  hook,
  variant = "grid",
}: CardProps) => {
  const [pauseCarousel, setPauseCarousel] = useState(false);
  const isCarousel = variant === "carousel";

  const wrapCls = isCarousel
    ? "w-[min(17.5rem,calc(100vw-5rem))] shrink-0 snap-start sm:w-72"
    : "w-full p-3 md:w-1/2 lg:w-1/3";

  return (
    <div className={wrapCls}>
      {/* В карусели не двигаем карточку: overflow-x на треке даёт clip по вертикали — бордер визуально «рвётся». */}
      <motion.article
        transition={{ duration: 0.3, ease: "easeOut" as const }}
        whileHover={isCarousel ? undefined : { scale: 1.02, y: -3 }}
        className={`group/project-card shadow-elevation-card flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-[border-color,box-shadow] duration-300 ease-out hover:border-[var(--color-accent)]/55 ${
          isCarousel
            ? "hover:shadow-[0_12px_32px_-8px_color-mix(in_srgb,var(--color-accent)_18%,transparent)]"
            : ""
        }`}
      >
        <a
          aria-label={`${title} — открыть проект в новой вкладке`}
          className="flex flex-1 flex-col"
          href={url}
          rel="noopener noreferrer"
          target="_blank"
          onFocus={() => setPauseCarousel(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setPauseCarousel(false);
            }
          }}
        >
          {hook && isCarousel ? <span className="sr-only">{description}</span> : null}
          <div className={isCarousel ? "p-2" : "p-3"}>
            <ProjectCardMedia
              imageClassName={imageClassName}
              pauseAutoplay={pauseCarousel}
              placeholderEmoji={emoji}
              slides={slides}
            />
            <div
              className={`mt-1.5 flex flex-1 flex-col ${isCarousel ? "px-0.5 pt-0 pb-1" : "p-2"}`}
            >
              <div className="flex items-start gap-1.5">
                <h3
                  className={
                    isCarousel
                      ? "min-w-0 flex-1 text-base leading-tight font-bold text-foreground"
                      : "text-lg font-bold lg:text-xl"
                  }
                >
                  {title}
                </h3>
                <ExternalLink
                  aria-hidden
                  className={`mt-0.5 shrink-0 text-muted ${isCarousel ? "size-3.5" : "h-3.5 w-3.5"}`}
                />
              </div>
              {hook ? (
                <p className="mt-1.5 line-clamp-2 text-sm leading-snug font-medium text-foreground">
                  {hook}
                </p>
              ) : (
                <p
                  className={`mt-1.5 text-muted ${isCarousel ? "line-clamp-2 text-xs leading-snug" : "text-sm"}`}
                >
                  {description}
                </p>
              )}
              <div className="mt-auto">
                <Tags size={isCarousel ? "sm" : "default"} tags={tags} />
              </div>
            </div>
          </div>
        </a>
      </motion.article>
    </div>
  );
};
