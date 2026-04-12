import { Metadata } from "next";

import { CvContent } from "@/components/cv/cv-content";

export const metadata: Metadata = {
  title: "CV — Владимир Перов | Senior Frontend Developer",
  description:
    "Резюме: Senior Frontend Developer, 8+ лет в IT. React, TypeScript, DevOps. Газпромбанк, Optimax Dev, CosySoft.",
};

export default function CvPage() {
  return <CvContent />;
}
