import createMDX from "@next/mdx";

const isGithubPages = process.env.GITHUB_PAGES === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    unoptimized: true,
  },
  output: "export",
  ...(isGithubPages && {
    basePath: "/blog",
    assetPrefix: "/blog",
  }),
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
