import type { ReactNode } from "react";

import { Source_Serif_4 } from "next/font/google";

/**
 * Отдельная типографика резюме: сериф удобнее для длинных абзацев и печати,
 * шрифт подгружается только для маршрута /cv.
 */
const cvSerif = Source_Serif_4({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-cv-serif",
});

export default function CvLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className={`${cvSerif.variable} cv-page-root text-[15px] leading-[1.65] text-foreground antialiased md:text-[17px] md:leading-[1.68]`}
    >
      {children}
    </div>
  );
}
