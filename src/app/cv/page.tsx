import { CvContent } from "@/components/cv/cv-content";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV — Владимир Перов | Senior / Lead Frontend Developer",
  description:
    "Резюме Владимира Перова: Senior / Lead Frontend Developer, 9+ лет опыта. React, TypeScript, Next.js, fintech, e-commerce, DevOps.",
};

export default function CvPage() {
  return <CvContent />;
}
