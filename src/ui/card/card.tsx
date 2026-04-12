"use client";

import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

import { Tags } from "../tags/tags";

interface CardProps {
  url?: string;
  alt?: string;
  title?: string;
  description: string;
  tags: string[];
  image?: StaticImageData | string;
  emoji?: string;
}

export const Card = ({ url, alt = "", description, title, tags, image, emoji }: CardProps) => {
  return (
    <div className="w-full p-3 md:w-1/2 lg:w-1/3">
      <motion.article
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3, ease: "easeOut" as const }}
        className="flex h-full flex-col rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-lg transition-all duration-300 ease-in-out hover:border-[var(--color-accent)]/60 hover:shadow-[0_4px_20px_color-mix(in_srgb,var(--color-accent)_15%,transparent)]"
      >
        <a
          href={url}
          aria-label={`${title} — открыть проект`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 flex-col"
        >
          <div className="relative overflow-hidden rounded-xl">
            {image ? (
              <Image
                src={image}
                alt={alt}
                width={400}
                height={225}
                className="aspect-video w-full object-cover"
                loading="eager"
              />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-linear-to-br from-accent/10 via-accent-secondary/5 to-accent-light/10">
                <span className="text-5xl">{emoji ?? "🚀"}</span>
              </div>
            )}
          </div>
          <div className="mt-1 flex flex-1 flex-col p-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold lg:text-xl">{title}</h3>
              <ExternalLink className="h-3.5 w-3.5 text-muted" />
            </div>
            <p className="mt-1 text-sm text-muted">{description}</p>
            <div className="mt-auto">
              <Tags tags={tags} />
            </div>
          </div>
        </a>
      </motion.article>
    </div>
  );
};
