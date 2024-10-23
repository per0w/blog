import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import { Header } from "@/components/header/header";
import { Footer } from "@/components/footer/footer";

import "./globals.css";
import icon from "./favicon.ico";

export const metadata: Metadata = {
  title: "perovdev",
  description: "Perovs personal site",
  icons: [{ rel: 'icon', url: icon.src }],
};

const cx = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={cx(
        "text-black bg-white dark:text-white dark:bg-black",
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <body
        className={`antialiased mx-auto max-w-screen-xl bg-white px-5 dark:text-white dark:bg-black xs:text-[16px] md:text-[18px]`}
      >
        <Header />
        <NextTopLoader showSpinner={false} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
