"use client";

import type { ReactNode } from "react";

import { motion } from "framer-motion";

import { useDisplayFont } from "@/components/display-font/display-font-context";
import { displayFontNeedsSectionTightTracking } from "@/constants/display-font";
import { DISPLAY_FONT_CLASSNAMES } from "@/fonts/display-font-classnames";
import { ScrambleRevealText } from "@/ui/scramble-reveal/scramble-reveal";

type SectionProps = {
  id: string;
  children: ReactNode;
  title?: string;
};

export const Section = ({ id, children, title }: SectionProps) => {
  const { id: displayFontId } = useDisplayFont();
  const displayFontClass = DISPLAY_FONT_CLASSNAMES[displayFontId];
  const sectionTitleTrackingClass = displayFontNeedsSectionTightTracking(displayFontId)
    ? "tracking-tighter"
    : "tracking-wide";
  const headingId = title ? `${id}-heading` : undefined;

  return (
    <motion.section
      aria-labelledby={headingId}
      className="mb-10 flex w-full max-w-full min-w-0 flex-col items-center justify-center md:mb-24"
      id={id}
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" as const }}
      viewport={{ once: true, margin: "-100px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {title ? (
        <ScrambleRevealText
          as="h2"
          className={`${displayFontClass} bg-linear-to-r from-accent via-accent-light to-accent-secondary bg-clip-text py-4 text-3xl font-bold ${sectionTitleTrackingClass} text-transparent`}
          id={headingId}
          text={title}
        />
      ) : null}
      {children}
    </motion.section>
  );
};
