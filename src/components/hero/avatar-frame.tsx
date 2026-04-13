"use client";

import type { ReactNode } from "react";

import { motion, useReducedMotion } from "framer-motion";

type AvatarFrameProps = {
  children: ReactNode;
};

export const AvatarFrame = ({ children }: AvatarFrameProps) => {
  const reduced = useReducedMotion();

  return (
    <div className="relative flex w-full max-w-full items-center justify-center py-2 md:py-3">
      {/* Мягкая aura — компактнее, без «облака» */}
      <motion.div
        className="absolute inset-4 rounded-xl bg-linear-to-br from-accent/14 via-accent-secondary/8 to-accent-light/12 blur-2xl md:inset-3 md:rounded-[0.85rem]"
        animate={
          reduced
            ? { scale: 1, opacity: 0.28 }
            : {
                scale: [1, 1.04, 1],
                opacity: [0.18, 0.32, 0.18],
              }
        }
        transition={
          reduced
            ? { duration: 0 }
            : {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut" as const,
              }
        }
      />

      {/* Одно медленное кольцо — conic gradient border */}
      <div className="avatar-ring absolute inset-[-2px] rounded-xl" />

      {/* Две тихие орбитальные точки — ближе к кадру */}
      <div className="avatar-dot-orbit absolute inset-[-6px]" style={{ animationDuration: "22s" }}>
        <span className="avatar-dot avatar-dot--accent" style={{ top: 0, left: "45%" }} />
      </div>
      <div
        className="avatar-dot-orbit absolute inset-[-6px]"
        style={{ animationDuration: "28s", animationDirection: "reverse" }}
      >
        <span className="avatar-dot avatar-dot--cyan" style={{ bottom: 0, right: "40%" }} />
      </div>

      {/* Фото: фильтры + неон-оверлей, виньетка, лёгкие сканлайны */}
      <div className="hero-photo-shell relative z-10 overflow-hidden rounded-xl shadow-[0_8px_32px_-8px_color-mix(in_srgb,var(--color-accent)_22%,transparent)]">
        <div className="hero-photo-stack relative">
          {children}
          <div aria-hidden className="hero-photo-gradient" />
          <div aria-hidden className="hero-photo-vignette" />
          <div aria-hidden className="hero-photo-scanlines" />
          <div aria-hidden className="hero-photo-corner-accent" />
        </div>
      </div>
    </div>
  );
};
