import Link from "next/link";

import { formatDate, getBlogPosts } from "@/app/blog/utils";
import { SECTIONS_IDS } from "@/constants/common";
import { Section } from "@/ui/section/section";
import { Tags } from "@/ui/tags/tags";

export const Posts = () => {
  const allBlogs = getBlogPosts();

  const sorted = allBlogs.sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime(),
  );

  return (
    <Section id={SECTIONS_IDS.lastArticles} title="Блог">
      <div className="grid w-full grid-cols-1 gap-6 px-4 md:grid-cols-2 lg:grid-cols-3">
        {sorted.map((post) => {
          const date = formatDate(post.metadata.publishedAt, false);

          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-xl border border-border/50 border-t-2 border-t-accent bg-[var(--color-surface)] p-5 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_color-mix(in_srgb,var(--color-accent)_15%,transparent)]"
            >
              <article>
                <time dateTime={post.metadata.publishedAt} className="text-xs text-muted">
                  {date}
                </time>

                <h3 className="mt-2 text-lg leading-snug font-semibold group-hover:text-accent">
                  {post.metadata.title}
                </h3>

                <p className="mt-2 line-clamp-3 text-sm text-muted">{post.metadata.description}</p>

                <Tags tags={post.metadata.tags.split(", ")} />
              </article>
            </Link>
          );
        })}
      </div>

      <Link
        href="/blog"
        className="mt-8 inline-block rounded-lg border border-accent px-6 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
      >
        Все статьи
      </Link>
    </Section>
  );
};
