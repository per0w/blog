import React, {
  type AnchorHTMLAttributes,
  type DetailedHTMLProps,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import Image, { type ImageProps } from "next/image";
import Link from "next/link";

import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { highlight } from "sugar-high";

import { LivePlayground } from "@/components/mdx/live-playground";

type TablProps = {
  data: {
    headers: string[];
    rows: string[][];
  };
};

function Table({ data }: TablProps) {
  const headers = data.headers.map((header, index) => <th key={index}>{header}</th>);
  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function CustomLink(
  props: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
): ReactNode {
  const href = props.href;

  if (href?.startsWith("/")) {
    return (
      <Link {...props} href={href}>
        {props.children}
      </Link>
    );
  }

  if (href?.startsWith("#")) {
    return <a {...props} />;
  }

  return <a rel="noopener noreferrer" target="_blank" {...props} />;
}

type RoundedImageProps = {
  alt: string;
} & ImageProps;

function RoundedImage(props: RoundedImageProps) {
  return <Image className="rounded-lg" {...props} alt={props.alt} />;
}

function Code({
  children,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>): ReactNode {
  const codeHTML = highlight(String(children));
  return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />;
}

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(level: number) {
  const Heading = ({
    children,
  }: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>): ReactNode => {
    const slug = slugify(String(children));
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor",
        }),
      ],
      children,
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  code: Code,
  LivePlayground,
  Table,
} as const;

export function CustomMDX(props: MDXRemoteProps) {
  const { options, components: overrideComponents, ...rest } = props;
  return (
    <MDXRemote
      {...rest}
      components={{ ...components, ...overrideComponents }}
      options={{
        ...options,
        mdxOptions: {
          ...options?.mdxOptions,
          // GFM: таблицы, зачёркивание и т.д. — без этого pipe-таблицы остаются сырой строкой
          remarkPlugins: [remarkGfm, ...(options?.mdxOptions?.remarkPlugins ?? [])],
        },
      }}
    />
  );
}
