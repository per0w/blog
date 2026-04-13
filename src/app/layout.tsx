import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import NextTopLoader from "nextjs-toploader";

import { Footer } from "@/components/footer/footer";
import { Header } from "@/components/header/header";
import { Providers } from "@/components/providers/providers";
import { MAIN_CONTENT_ID } from "@/constants/common";

import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://per0w.space"),
  title: "Владимир Перов — Senior Frontend Developer | React, TypeScript, DevOps",
  description:
    "Senior Frontend Developer с 8+ годами опыта. React, TypeScript, Next.js, Redux, Docker, Kubernetes. Главный инженер разработки в Газпромбанке. Доступен для найма.",
  icons: [{ rel: "icon", url: "/icon.svg", type: "image/svg+xml" }],
  keywords: [
    "frontend developer",
    "senior frontend developer",
    "react developer",
    "typescript",
    "next.js",
    "redux",
    "docker",
    "kubernetes",
    "devops",
    "hire frontend developer",
    "фронтенд разработчик",
    "react разработчик",
    "Владимир Перов",
  ],
  openGraph: {
    title: "Владимир Перов — Senior Frontend Developer",
    description:
      "8+ лет опыта. React, TypeScript, Next.js, Redux, Docker, K8s. Главный инженер в Газпромбанке. Портфолио и заметки.",
    url: "https://per0w.space",
    siteName: "per0w.space",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Владимир Перов — Senior Frontend Developer",
    description: "8+ лет опыта. React, TypeScript, Next.js, Redux, Docker, K8s. Портфолио и заметки.",
  },
  alternates: {
    canonical: "https://per0w.space",
  },
};

const cx = (...classes: string[]) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cx(GeistSans.variable, GeistMono.variable)}
      data-scroll-behavior="smooth"
      lang="ru"
      suppressHydrationWarning={true}
    >
      <body className="xs:text-[16px] mx-auto max-w-screen-xl px-5 antialiased md:text-[18px]">
        <a className="skip-to-content" href={`#${MAIN_CONTENT_ID}`}>
          Перейти к содержимому
        </a>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Владимир Перов",
              alternateName: "Vladimir Perov",
              url: "https://per0w.space",
              jobTitle: "Senior Frontend Developer",
              worksFor: {
                "@type": "Organization",
                name: "Газпромбанк",
              },
              knowsAbout: [
                "React",
                "TypeScript",
                "JavaScript",
                "Next.js",
                "Redux",
                "Tailwind CSS",
                "Docker",
                "Kubernetes",
                "Node.js",
                "DevOps",
                "CI/CD",
                "AI/LLM",
                "Prompt Engineering",
              ],
              sameAs: ["https://github.com/per0w", "https://t.me/per0w"],
              email: "per0w@yandex.ru",
              description:
                "Senior Frontend Developer с 8+ годами опыта. Главный инженер разработки в Газпромбанке. Экспертиза: React, TypeScript, Next.js, Redux, DevOps (Docker, Kubernetes, CI/CD). Путь от системного администратора и DevOps-инженера до Frontend Team Lead.",
            }),
          }}
          suppressHydrationWarning
          type="application/ld+json"
        />
        <Providers>
          <div className="relative z-10">
            <Header />
            <NextTopLoader showSpinner={false} />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
