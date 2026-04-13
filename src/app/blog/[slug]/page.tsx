import Link from "next/link";
import { notFound } from "next/navigation";

import { formatDate, getBlogPosts } from "@/app/blog/utils";
import { CustomMDX } from "@/components/mdx/mdx";
import { MAIN_CONTENT_ID } from "@/constants/common";

import type { Metadata } from "next";

const BASE_URL = "https://per0w.space";

export async function generateStaticParams() {
  const posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type Params = {
  params: Promise<{
    metadata: Metadata;
    slug: string;
    content: string;
  }>;
};

export async function generateMetadata(props: Params) {
  const params = await props.params;
  const post = getBlogPosts().find((post) => post.slug === params.slug);
  if (!post) {
    return;
  }

  const { title, publishedAt: publishedTime, description, image } = post.metadata;
  const ogImage = image ? image : `${BASE_URL}/og?title=${encodeURIComponent(title)}`;

  return {
    title: `${title} | per0w.space`,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      url: `${BASE_URL}/blog/${post.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPost(props: Params) {
  const params = await props.params;
  const post = getBlogPosts().find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main
      aria-label="Страница заметки"
      className="outline-none focus:outline-none"
      id={MAIN_CONTENT_ID}
      tabIndex={-1}
    >
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.description,
            image: post.metadata.image
              ? `${BASE_URL}${post.metadata.image}`
              : `${BASE_URL}/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${BASE_URL}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: "Владимир Перов",
            },
          }),
        }}
        suppressHydrationWarning
        type="application/ld+json"
      />

      <nav aria-label="Хлебные крошки" className="mb-6">
        <Link
          className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-accent"
          href="/blog"
        >
          ← Назад к заметкам
        </Link>
      </nav>

      <article className="prose max-w-none">
        <header className="not-prose mb-8">
          <h1 className="title text-2xl font-semibold tracking-tighter">{post.metadata.title}</h1>
          <p className="mt-2 text-sm text-muted">
            <time dateTime={post.metadata.publishedAt}>
              {formatDate(post.metadata.publishedAt)}
            </time>
          </p>
        </header>
        <CustomMDX source={post.content} />
      </article>
    </main>
  );
}
