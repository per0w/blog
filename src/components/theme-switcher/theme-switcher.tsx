"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { DarkModeIcon, LightModeIcon } from "@/ui/icons";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`cursor-pointer theme ${
        resolvedTheme === "light" ? "light-theme" : "dark-theme"
      }`}
    >
      {resolvedTheme === "light" ? (
        <DarkModeIcon onClick={() => setTheme("dark")} />
      ) : (
        <LightModeIcon onClick={() => setTheme("light")} />
      )}
    </div>
  );
}
