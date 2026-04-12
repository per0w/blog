import { Metadata } from "next";
import Link from "next/link";

import { formatDate, getBlogPosts } from "@/app/blog/utils";
import { Tags } from "@/ui/tags/tags";

export const metadata: Metadata = {
  title: "Блог | per0w.space",
  description: "Статьи о фронтенде, React, TypeScript, DevOps и разработке",
};

export default function BlogPage() {
  const posts = getBlogPosts().sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime(),
  );

  return (
    <main className="py-12">
      <header className="mb-10 text-center">
        <h1 className="bg-linear-to-r from-accent to-accent-secondary bg-clip-text text-4xl font-bold tracking-tight text-transparent">
          Блог
        </h1>
        <p className="mt-3 text-lg text-muted">Статьи о фронтенде, DevOps и разработке</p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-xl border border-border/50 border-t-2 border-t-accent bg-[var(--color-surface)] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_color-mix(in_srgb,var(--color-accent)_15%,transparent)]"
          >
            <article>
              <time dateTime={post.metadata.publishedAt} className="text-xs text-muted">
                {formatDate(post.metadata.publishedAt)}
              </time>

              <h2 className="mt-2 text-lg leading-snug font-semibold group-hover:text-accent">
                {post.metadata.title}
              </h2>

              <p className="mt-2 line-clamp-3 text-sm text-muted">{post.metadata.description}</p>

              <Tags tags={post.metadata.tags.split(", ")} />
            </article>
          </Link>
        ))}
      </div>
    </main>
  );
}
