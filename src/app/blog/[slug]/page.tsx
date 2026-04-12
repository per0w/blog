import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

import { CustomMDX } from "@/components/mdx/mdx";
import { formatDate, getBlogPosts } from "@/app/blog/utils";

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
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
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
      />

      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-accent"
      >
        ← Назад к блогу
      </Link>

      <h1 className="title text-2xl font-semibold tracking-tighter">{post.metadata.title}</h1>
      <div className="mt-2 mb-8 flex items-center justify-between text-sm">
        <p className="text-sm text-muted">{formatDate(post.metadata.publishedAt)}</p>
      </div>
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
    </section>
  );
}
