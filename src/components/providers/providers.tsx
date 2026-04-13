"use client";

import { ThemeProvider } from "next-themes";

import { AiBuddyDeferred } from "@/components/ai-buddy/ai-buddy-deferred";
import { ParticlesBackground } from "@/components/particles/particles-background";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystem attribute="class" defaultTheme="system">
      <ParticlesBackground />
      <AiBuddyDeferred />
      {children}
    </ThemeProvider>
  );
}
