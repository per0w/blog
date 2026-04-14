"use client";

import { type ReactNode, useCallback, useEffect, useId, useRef, useState } from "react";

import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ProjectsCarouselProps = {
  children: ReactNode;
  /** Число карточек (для точек и кнопок) */
  itemCount: number;
  /** Подпись над лентой; если не задана — нейтральная подсказка про свайп и стрелки */
  helperText?: string;
  /** Текст для screen reader заголовка региона */
  ariaLabel?: string;
};

/**
 * Горизонтальная лента проектов: меньше высоты секции, удобно листать эйчарам с десктопа и с телефона.
 */
const DEFAULT_HELPER =
  "Листайте карточки свайпом или стрелками — так секция не разрастается по вертикали при новых проектах.";

export const ProjectsCarousel = ({
  children,
  itemCount,
  helperText = DEFAULT_HELPER,
  ariaLabel = "Горизонтальная карусель карточек",
}: ProjectsCarouselProps) => {
  const reduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const regionId = useId();
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [activeDot, setActiveDot] = useState(0);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const eps = 6;
    setAtStart(scrollLeft <= eps);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - eps);

    const childrenArr = Array.from(el.children) as HTMLElement[];
    if (childrenArr.length === 0) {
      return;
    }
    let nearest = 0;
    let best = Infinity;
    const mid = scrollLeft + clientWidth / 2;
    childrenArr.forEach((child, i) => {
      const left = child.offsetLeft;
      const right = left + child.offsetWidth;
      const center = (left + right) / 2;
      const d = Math.abs(center - mid);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setActiveDot(nearest);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState, itemCount]);

  const scrollStepPx = useCallback(() => {
    const el = scrollerRef.current;
    const first = el?.firstElementChild as HTMLElement | undefined;
    const w = first?.offsetWidth ?? 288;
    const gap = 16;
    return w + gap;
  }, []);

  const scrollToIndex = useCallback(
    (index: number) => {
      const el = scrollerRef.current;
      if (!el || index < 0 || index >= itemCount) {
        return;
      }
      const child = el.children[index] as HTMLElement | undefined;
      child?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "nearest",
        inline: "start",
      });
    },
    [itemCount, reduceMotion],
  );

  const goPrev = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }
    el.scrollBy({
      behavior: reduceMotion ? "auto" : "smooth",
      left: -scrollStepPx(),
    });
  }, [reduceMotion, scrollStepPx]);

  const goNext = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) {
      return;
    }
    el.scrollBy({
      behavior: reduceMotion ? "auto" : "smooth",
      left: scrollStepPx(),
    });
  }, [reduceMotion, scrollStepPx]);

  if (itemCount <= 0) {
    return null;
  }

  return (
    <section
      aria-labelledby={`${regionId}-title`}
      aria-roledescription="Карусель"
      className="relative w-full max-w-5xl px-0 sm:px-2"
    >
      <p className="sr-only" id={`${regionId}-title`}>
        {ariaLabel}. Используйте кнопки или свайп, чтобы листать.
      </p>
      <p className="mb-3 text-center text-xs text-muted sm:text-sm">{helperText}</p>

      <div className="flex items-stretch gap-0 sm:gap-3">
        <button
          aria-controls={`${regionId}-track`}
          aria-label="Предыдущий проект"
          className="focus-ring-accent shadow-elevation-panel hidden size-10 shrink-0 items-center justify-center self-center rounded-xl border border-border bg-surface text-muted transition-colors hover:border-accent/40 hover:text-accent disabled:pointer-events-none disabled:opacity-35 sm:flex sm:size-11"
          disabled={atStart}
          type="button"
          onClick={goPrev}
        >
          <ChevronLeft aria-hidden className="size-5" />
        </button>

        <div className="min-w-0 w-full flex-1 touch-pan-x">
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory items-stretch gap-3 overflow-x-auto scroll-smooth py-2 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden"
            id={`${regionId}-track`}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                goPrev();
              }
              if (e.key === "ArrowRight") {
                e.preventDefault();
                goNext();
              }
            }}
          >
            {children}
          </div>
        </div>

        <button
          aria-controls={`${regionId}-track`}
          aria-label="Следующий проект"
          className="focus-ring-accent shadow-elevation-panel hidden size-10 shrink-0 items-center justify-center self-center rounded-xl border border-border bg-surface text-muted transition-colors hover:border-accent/40 hover:text-accent disabled:pointer-events-none disabled:opacity-35 sm:flex sm:size-11"
          disabled={atEnd}
          type="button"
          onClick={goNext}
        >
          <ChevronRight aria-hidden className="size-5" />
        </button>
      </div>

      {itemCount > 1 ? (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {Array.from({ length: itemCount }, (_, i) => (
            <button
              key={i}
              aria-current={i === activeDot ? true : undefined}
              aria-label={`Показать проект ${i + 1} из ${itemCount}`}
              type="button"
              className={`focus-ring-accent h-2 rounded-full transition-all duration-200 ${
                i === activeDot ? "w-6 bg-accent" : "w-2 bg-border hover:bg-muted"
              }`}
              onClick={() => scrollToIndex(i)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
};
