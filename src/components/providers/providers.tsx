"use client";

import { ThemeProvider } from "next-themes";

import { AiBuddyDeferred } from "@/components/ai-buddy/ai-buddy-deferred";
import { HashNavigation } from "@/components/hash-navigation/hash-navigation";
import { ParticlesBackground } from "@/components/particles/particles-background";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider enableSystem attribute="class" defaultTheme="dark">
      <HashNavigation />
      <ParticlesBackground />
      <AiBuddyDeferred />
      {children}
    </ThemeProvider>
  );
}
