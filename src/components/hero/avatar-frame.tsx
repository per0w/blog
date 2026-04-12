"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

type AvatarFrameProps = {
  children: ReactNode;
};

export const AvatarFrame = ({ children }: AvatarFrameProps) => {
  return (
    <div className="relative flex items-center justify-center p-6">
      {/* Мягкая aura — дышащее свечение за фото */}
      <motion.div
        className="absolute inset-2 rounded-2xl bg-linear-to-br from-accent/20 via-accent-secondary/10 to-accent-light/20 blur-3xl"
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.25, 0.45, 0.25],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut" as const,
        }}
      />

      {/* Одно медленное кольцо — conic gradient border */}
      <div className="avatar-ring absolute inset-[-4px] rounded-2xl" />

      {/* Две тихие орбитальные точки */}
      <div className="avatar-dot-orbit absolute inset-[-10px]" style={{ animationDuration: "20s" }}>
        <span className="avatar-dot avatar-dot--accent" style={{ top: 0, left: "45%" }} />
      </div>
      <div
        className="avatar-dot-orbit absolute inset-[-10px]"
        style={{ animationDuration: "26s", animationDirection: "reverse" }}
      >
        <span className="avatar-dot avatar-dot--cyan" style={{ bottom: 0, right: "40%" }} />
      </div>

      {/* Фото */}
      <div className="relative z-10 overflow-hidden rounded-2xl">{children}</div>
    </div>
  );
};
