import { formatDate, getBlogPosts } from "@/app/blog/utils";
import { MAIN_CONTENT_ID } from "@/constants/common";
import { BlogPostCard } from "@/ui/blog-post-card/blog-post-card";

import type { Metadata } from "next";

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
    <main
      aria-labelledby="blog-page-title"
      className="py-12 outline-none focus:outline-none"
      id={MAIN_CONTENT_ID}
      tabIndex={-1}
    >
      <header className="mb-10 text-center">
        <h1
          className="bg-linear-to-r from-accent to-accent-secondary bg-clip-text text-4xl font-bold tracking-tight text-transparent"
          id="blog-page-title"
        >
          Блог
        </h1>
        <p className="mt-3 text-lg text-muted">Статьи о фронтенде, DevOps и разработке</p>
      </header>

      <section
        aria-label="Статьи блога"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {posts.map((post) => (
          <BlogPostCard
            key={post.slug}
            coverImage={post.metadata.image}
            dateLabel={formatDate(post.metadata.publishedAt)}
            description={post.metadata.description}
            href={`/blog/${post.slug}`}
            publishedAt={post.metadata.publishedAt}
            tags={post.metadata.tags.split(", ")}
            title={post.metadata.title}
            titleAs="h2"
          />
        ))}
      </section>
    </main>
  );
}
