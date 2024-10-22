import Link from "next/link";
import { formatDate, getBlogPosts } from "@/app/blog/utils";

import { SECTIONS_IDS } from "@/constants/common";
import { Section } from "@/ui/section/section";

type LastArticleProps = {
  tags: string[];
  title: string;
  date: string;
  description: string;
};

const LastArticle = ({ tags, title, date, description }: LastArticleProps) => {
  return (
    <article>
      <div className="flex items-center gap-x-4 text-xs">
        <time dateTime="2020-03-16" className="text-gray-500">
          {date}
        </time>
        {tags.map((tag) => (
          <span
            key={tag}
            className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="group relative">
        <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
          <span className="absolute inset-0"></span>
          {title}
        </h3>
        <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
          {description}
        </p>
      </div>
    </article>
  );
};

export const Posts = () => {
  const allBlogs = getBlogPosts();

  return (
    <Section id={SECTIONS_IDS.lastArticles} title="Блог">
      <div className="mb-10 flex w-full flex-col items-center md:flex-row">
        {allBlogs
          .sort((a, b) => {
            if (
              new Date(a.metadata.publishedAt) >
              new Date(b.metadata.publishedAt)
            ) {
              return -1;
            }
            return 1;
          })
          .map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-xl bg-white shadow-lg duration-100 hover:scale-105 hover:transform hover:shadow-xl w-full m-4 p-4 md:w-1/2 lg:w-1/3"
            >
              <LastArticle
                title={post.metadata.title}
                tags={[post.metadata.tags]}
                description={post.metadata.description}
                date={formatDate(post.metadata.publishedAt, false)}
              />
            </Link>
          ))}
      </div>
    </Section>
  );
};
