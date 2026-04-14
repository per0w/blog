import Link from "next/link";

import { formatDate, getBlogPosts } from "@/app/blog/utils";
import { SECTIONS_IDS } from "@/constants/common";
import { BlogPostCard } from "@/ui/blog-post-card/blog-post-card";
import { Section } from "@/ui/section/section";

export const Posts = () => {
  const allBlogs = getBlogPosts();

  const sorted = allBlogs.sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime(),
  );

  return (
    <Section id={SECTIONS_IDS.lastArticles} title="Заметки">
      <section
        aria-label="Последние заметки"
        className="grid w-full grid-cols-1 gap-6 px-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {sorted.map((post) => (
          <BlogPostCard
            key={post.slug}
            coverImage={post.metadata.image}
            dateLabel={formatDate(post.metadata.publishedAt, false)}
            description={post.metadata.description}
            href={`/blog/${post.slug}`}
            publishedAt={post.metadata.publishedAt}
            tags={post.metadata.tags.split(", ")}
            title={post.metadata.title}
            titleAs="h3"
          />
        ))}
      </section>

      <Link
        className="focus-ring-accent mt-8 inline-block rounded-lg border border-accent px-6 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
        href="/blog"
      >
        Все заметки
      </Link>
    </Section>
  );
};
