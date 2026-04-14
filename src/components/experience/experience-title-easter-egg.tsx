"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

import { withBasePath } from "@/constants/base-path";
import { ORBO_EASTER_EGG_HINT_EVENT } from "@/constants/common";

const REQUIRED_CLICKS = 10;
/** Первые клики без Орбо — чтобы не палить пасхалку слишком рано */
const MIN_CLICKS_BEFORE_ORBO_HINT = 5;

export type ExperienceTitleEasterEggProps = {
  title: string;
  photoSrc: string;
  photoAlt: string;
  modalHeading: string;
  modalDescription: string;
  /**
   * Пиксельные размеры файла (ширина × высота) — модалка и масштаб подстраиваются под ориентацию.
   * Без этого остаётся запасной блок 3:4.
   */
  photoIntrinsicWidth?: number;
  photoIntrinsicHeight?: number;
};

function clicksWord(n: number): string {
  const mod100 = n % 100;
  const mod10 = n % 10;
  if (mod10 === 1 && mod100 !== 11) {
    return "клик";
  }
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return "клика";
  }
  return "кликов";
}

function hintMessage(remaining: number): string {
  return `Ещё ${remaining} ${clicksWord(remaining)} до секрета. Дави!`;
}

export const ExperienceTitleEasterEgg = ({
  title,
  photoSrc,
  photoAlt,
  modalHeading,
  modalDescription,
  photoIntrinsicWidth,
  photoIntrinsicHeight,
}: ExperienceTitleEasterEggProps) => {
  const reduceMotion = useReducedMotion();
  const clickCountRef = useRef(0);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dialogTitleId = `easter-egg-title-${title.replace(/\s+/g, "-").toLowerCase()}`;

  const hasIntrinsicSize =
    typeof photoIntrinsicWidth === "number" &&
    typeof photoIntrinsicHeight === "number" &&
    photoIntrinsicWidth > 0 &&
    photoIntrinsicHeight > 0;
  const isLandscapePhoto = hasIntrinsicSize && photoIntrinsicWidth >= photoIntrinsicHeight;
  const resolvedPhotoSrc = withBasePath(photoSrc);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      // Компенсируем исчезнувший скроллбар, чтобы страница не «прыгала» влево.
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleTitleClick = () => {
    clickCountRef.current += 1;

    if (clickCountRef.current >= REQUIRED_CLICKS) {
      clickCountRef.current = 0;
      setIsOpen(true);
      return;
    }

    if (clickCountRef.current < MIN_CLICKS_BEFORE_ORBO_HINT) {
      return;
    }

    const remaining = REQUIRED_CLICKS - clickCountRef.current;
    window.dispatchEvent(
      new CustomEvent(ORBO_EASTER_EGG_HINT_EVENT, {
        detail: { message: hintMessage(remaining) },
      }),
    );
  };

  return (
    <>
      <h3 className="text-lg font-bold">
        <motion.button
          aria-label={`${title}. Скрытая пасхалка откроется после десяти нажатий.`}
          className="focus-ring-accent cursor-pointer rounded-md text-left transition-colors duration-200 hover:text-accent"
          transition={{ duration: 0.18, ease: "easeOut" }}
          type="button"
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          onClick={handleTitleClick}
        >
          {title}
        </motion.button>
      </h3>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key={`experience-easter-backdrop-${title}`}
            animate={{ opacity: 1 }}
            aria-labelledby={dialogTitleId}
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4 py-6 backdrop-blur-md"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            role="dialog"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 16 }}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 24 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className={`relative max-h-[min(92vh,56rem)] w-full overflow-x-hidden overflow-y-auto rounded-[2rem] border border-accent/20 bg-surface/95 p-4 shadow-[0_24px_80px_-24px_color-mix(in_srgb,var(--color-accent)_40%,transparent)] sm:p-6 ${
                isLandscapePhoto ? "max-w-3xl" : "max-w-xl"
              }`}
              onClick={(event) => event.stopPropagation()}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,color-mix(in_srgb,var(--color-accent)_18%,transparent),transparent_48%),radial-gradient(circle_at_bottom,color-mix(in_srgb,var(--color-accent-secondary)_16%,transparent),transparent_42%)]"
              />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.28em] text-accent-secondary uppercase">
                    secret unlocked
                  </p>
                  <h4 className="mt-2 text-2xl font-black text-foreground" id={dialogTitleId}>
                    {modalHeading}
                  </h4>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                    {modalDescription}
                  </p>
                </div>

                <button
                  ref={closeButtonRef}
                  aria-label="Закрыть пасхалку"
                  className="focus-ring-accent inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background/65 text-muted transition-colors duration-200 hover:text-foreground"
                  type="button"
                  onClick={() => setIsOpen(false)}
                >
                  <X aria-hidden className="size-5" />
                </button>
              </div>

              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
                className="relative mt-5 overflow-hidden rounded-[1.5rem] border border-white/8 bg-black/10 shadow-inner"
                transition={{
                  duration: 4.4,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                {hasIntrinsicSize ? (
                  <div className="flex justify-center p-1 sm:p-2">
                    <Image
                      priority
                      alt={photoAlt}
                      className="h-auto max-h-[min(58vh,560px)] w-auto max-w-full object-contain"
                      height={photoIntrinsicHeight}
                      src={resolvedPhotoSrc}
                      width={photoIntrinsicWidth}
                      sizes={
                        isLandscapePhoto
                          ? "(max-width: 768px) 92vw, min(896px, 92vw)"
                          : "(max-width: 768px) 92vw, min(448px, 92vw)"
                      }
                    />
                  </div>
                ) : (
                  <div className="relative mx-auto aspect-[3/4] w-full max-w-md">
                    <Image
                      fill
                      priority
                      alt={photoAlt}
                      className="object-contain"
                      sizes="(max-width: 768px) 90vw, 480px"
                      src={resolvedPhotoSrc}
                    />
                  </div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};
