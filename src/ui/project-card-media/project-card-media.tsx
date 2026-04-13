"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import Image, { type StaticImageData } from "next/image";

import { useReducedMotion } from "framer-motion";

import { withBasePath } from "@/constants/base-path";
import { PROJECT_CARD_SLIDE_INTERVAL_MS } from "@/constants/project-card";

export type ProjectCardSlide = {
  src: string | StaticImageData;
  alt: string;
};

function resolveSrc(src: StaticImageData | string) {
  return typeof src === "string" && src.startsWith("/") ? withBasePath(src) : src;
}

type ProjectCardMediaProps = {
  slides: ProjectCardSlide[];
  imageClassName?: string;
  /** Если слайдов нет — плейсхолдер */
  placeholderEmoji?: string;
  /** Пауза автопрокрутки (фокус на карточке, WCAG 2.2.2) */
  pauseAutoplay?: boolean;
};

/**
 * Общий механизм превью проекта: один или несколько кадров, автосмена и точки только при 2+.
 */
export const ProjectCardMedia = ({
  slides,
  imageClassName,
  placeholderEmoji = "🚀",
  pauseAutoplay = false,
}: ProjectCardMediaProps) => {
  const reduceMotion = useReducedMotion();

  const list = useMemo(() => slides.filter((s) => s.src), [slides]);

  const [index, setIndex] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);

  const goNext = useCallback(() => {
    setIndex((i) => (list.length ? (i + 1) % list.length : 0));
  }, [list.length]);

  useEffect(() => {
    if (list.length <= 1) {
      return;
    }
    if (reduceMotion || hoverPaused || pauseAutoplay) {
      return;
    }
    const id = window.setInterval(goNext, PROJECT_CARD_SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [list.length, reduceMotion, hoverPaused, pauseAutoplay, goNext]);

  const activeIndex = list.length > 0 ? index % list.length : 0;

  const imgCls = `absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out${imageClassName ? ` ${imageClassName}` : ""}`;

  if (list.length === 0) {
    return (
      <div className="project-card-placeholder flex aspect-video w-full items-center justify-center rounded-xl bg-linear-to-br from-accent/10 via-accent-secondary/5 to-accent-light/10">
        <span aria-hidden className="text-5xl">
          {placeholderEmoji}
        </span>
      </div>
    );
  }

  return (
    <div
      {...(list.length > 1
        ? {
            "aria-label":
              "Превью проекта, несколько кадров меняются автоматически; наведите курсор или сфокусируйте карточку, чтобы остановить",
            role: "group" as const,
          }
        : {})}
      className="project-card-media relative aspect-video overflow-hidden rounded-xl"
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
    >
      {list.map((slide, i) => {
        const isActive = i === activeIndex;
        const key = typeof slide.src === "string" ? slide.src : `slide-${i}`;
        return (
          <Image
            key={key}
            alt={slide.alt}
            aria-hidden={!isActive}
            className={`${imgCls} ${isActive ? "z-[1] opacity-100" : "z-0 opacity-0"}`}
            height={225}
            loading={i === 0 ? "eager" : "lazy"}
            src={resolveSrc(slide.src)}
            width={400}
          />
        );
      })}
      {list.length > 1 ? (
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 bottom-2 left-0 z-[2] flex justify-center gap-1.5"
        >
          {list.map((slide, i) => (
            <span
              key={typeof slide.src === "string" ? slide.src : `dot-${i}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-4 bg-white shadow-sm" : "w-1.5 bg-white/45"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};
