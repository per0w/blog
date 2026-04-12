"use client";

import { ThemeProvider } from "next-themes";

import { ParticlesBackground } from "@/components/particles/particles-background";
import { AiBuddy } from "@/components/ai-buddy/ai-buddy";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ParticlesBackground />
      <AiBuddy />
      {children}
    </ThemeProvider>
  );
}
