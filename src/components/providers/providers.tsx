"use client";

import { ThemeProvider } from "next-themes";

import { AiBuddy } from "@/components/ai-buddy/ai-buddy";
import { ParticlesBackground } from "@/components/particles/particles-background";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystem attribute="class" defaultTheme="system">
      <ParticlesBackground />
      <AiBuddy />
      {children}
    </ThemeProvider>
  );
}
