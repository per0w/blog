import createMDX from "@next/mdx";

const isGithubPages = process.env.GITHUB_PAGES === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    unoptimized: true,
  },
  output: "export",
  // Для клиентских проверок пути (GitHub Pages) — см. withBasePath, ai-buddy CV.
  // OpenRouter: явный проброс из process.env после loadEnvConfig (.env.local) — иначе в Turbopack
  // иногда не попадает в клиентский бандл и кнопка AI не рендерится.
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? "/blog" : "",
    NEXT_PUBLIC_OPENROUTER_API_KEY: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ?? "",
    NEXT_PUBLIC_OPENROUTER_MODEL: process.env.NEXT_PUBLIC_OPENROUTER_MODEL ?? "",
  },
  ...(isGithubPages && {
    basePath: "/blog",
    assetPrefix: "/blog",
  }),
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
