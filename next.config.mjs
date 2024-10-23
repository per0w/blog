import createMDX from "@next/mdx";

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  assetPrefix: isProd ? '/blog/' : '',
  basePath: isProd ? '/blog' : '',
  output: isProd ? 'export' : undefined,
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
