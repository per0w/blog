"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

type SectionProps = {
  id: string;
  children: ReactNode;
  title?: string;
};

export const Section = ({ id, children, title }: SectionProps) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" as const }}
      className="mb-10 flex flex-col items-center justify-center md:mb-24"
    >
      {title && (
        <h2 className="bg-linear-to-r from-accent via-accent-light to-accent-secondary bg-clip-text py-4 text-3xl font-bold tracking-tighter text-transparent">
          {title}
        </h2>
      )}
      {children}
    </motion.section>
  );
};
