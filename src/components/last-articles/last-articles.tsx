import { SECTIONS_IDS } from "@/constants/common";
import { Section } from "@/ui/section/section";

const ARTICLES = Array(3).fill({
  date: "Февраль 21, 2024",
  tags: ["React"],
  title: "Реакт головного мозга",
  description: `Всегда слышал выражение «Java-головного мозга». Так называли
            программистов, которые из-за длительного использования одного языка
            или фреймворка (структуры) или библиотеки начинают решать простые
            задачи сложно и запутанно, потому что они привыкли к определенной
            плоскости решения проблем, которую диктует этот язык или
            общепринятые практики на нем.`,
});

type LastArticleProps = {
  tags: string[];
  title: string;
  date: string;
  description: string;
};

const LastArticle = ({ tags, title, date, description }: LastArticleProps) => {
  return (
    <article className="rounded-xl bg-white shadow-lg duration-100 hover:scale-105 hover:transform hover:shadow-xl w-full m-4 p-4 md:w-1/2 lg:w-1/3">
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
          <a href="#">
            <span className="absolute inset-0"></span>
            {title}
          </a>
        </h3>
        <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
          {description}
        </p>
      </div>
    </article>
  );
};

type LastArticlesProps = {
  articles?: LastArticleProps[];
};

export const LastArticles = ({ articles = ARTICLES }: LastArticlesProps) => {
  return (
    <Section id={SECTIONS_IDS.lastArticles} title="Последние статьи из блога">
      <div className="mb-10 flex w-full flex-col items-center md:flex-row">
        {articles.map((article) => (
          <LastArticle key={article.title} {...article} />
        ))}
      </div>
    </Section>
  );
};
