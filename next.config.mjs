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
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? "/blog" : "",
  },
  ...(isGithubPages && {
    basePath: "/blog",
    assetPrefix: "/blog",
  }),
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
