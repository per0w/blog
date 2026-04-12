"use client";

import { useEffect, useRef, useState } from "react";
import { SECTIONS_IDS } from "@/constants/common";

const SECTION_IDS_LIST = Object.values(SECTIONS_IDS);
const DEBOUNCE_MS = 300;

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const pendingRef = useRef<string | null>(null);

  useEffect(() => {
    const elements = SECTION_IDS_LIST.map((id) => document.getElementById(id)).filter(
      Boolean,
    ) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            pendingRef.current = entry.target.id;
          }
        }

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          if (pendingRef.current) {
            setActiveSection(pendingRef.current);
          }
        }, DEBOUNCE_MS);
      },
      { threshold: 0.3 },
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return activeSection;
}
