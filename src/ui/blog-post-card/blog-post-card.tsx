import Image from "next/image";
import Link from "next/link";

import { Tags } from "@/ui/tags/tags";

import { BlogPostPreviewArt } from "./blog-post-preview-art";

export type BlogPostCardProps = {
  href: string;
  /** Уже отформатированная дата для отображения */
  dateLabel: string;
  publishedAt: string;
  title: string;
  description: string;
  tags: string[];
  /** Заголовок карточки: на странице блога — h2, на главной — h3 */
  titleAs?: "h2" | "h3";
  /** Обложка из frontmatter; иначе — тематическая SVG */
  coverImage?: string;
};

export function BlogPostCard({
  href,
  dateLabel,
  publishedAt,
  title,
  description,
  tags,
  titleAs = "h3",
  coverImage,
}: BlogPostCardProps) {
  const TitleTag = titleAs;

  return (
    <Link
      className="group block rounded-xl border border-t-2 border-border/50 border-t-accent bg-[var(--color-surface)] p-5 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_color-mix(in_srgb,var(--color-accent)_15%,transparent)] sm:p-6"
      href={href}
    >
      <article>
        {/*
          Обтекание: плавающий блок справа + shape-outside для аккуратного зазора у скругления.
          На узком экране — сверху по центру без float, чтобы текст не сжимался в полоску.
        */}
        <div
          className="mx-auto mb-3 w-[5.5rem] shrink-0 sm:float-right sm:mt-0.5 sm:mb-2 sm:ml-4 sm:w-[6.75rem] md:w-[7.25rem]"
          style={{
            shapeOutside: "inset(0 round 0.75rem)",
          }}
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-accent/25 bg-[color-mix(in_srgb,var(--color-accent)_6%,var(--color-surface))] shadow-[inset_0_1px_0_color-mix(in_srgb,var(--color-foreground)_8%,transparent)]">
            {coverImage ? (
              <Image
                unoptimized
                alt=""
                className="size-full object-cover"
                height={160}
                src={coverImage}
                width={160}
              />
            ) : (
              <BlogPostPreviewArt className="size-full p-2.5" />
            )}
          </div>
        </div>

        <time className="text-xs text-muted" dateTime={publishedAt}>
          {dateLabel}
        </time>

        <TitleTag className="mt-2 text-lg leading-snug font-semibold group-hover:text-accent">
          {title}
        </TitleTag>

        <p className="mt-2 line-clamp-3 text-sm text-pretty text-muted">{description}</p>

        <div className="clear-both" />

        <Tags tags={tags} />
      </article>
    </Link>
  );
}
