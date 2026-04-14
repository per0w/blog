"use client";

import { useSyncExternalStore } from "react";

import { ALargeSmall } from "lucide-react";

import { useDisplayFont } from "@/components/display-font/display-font-context";

const emptySubscribe = () => () => {};

export function DisplayFontSwitcher() {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const { cycle, label } = useDisplayFont();

  if (!mounted) {
    return <span aria-hidden className="inline-block size-9 shrink-0" />;
  }

  return (
    <button
      aria-label={`Шрифт заголовков: ${label}. Нажмите, чтобы переключить`}
      className="focus-ring-accent flex size-9 shrink-0 items-center justify-center rounded-xl text-muted transition-all duration-200 hover:bg-accent/10 hover:text-foreground"
      title={`Шрифт заголовков: ${label}`}
      type="button"
      onClick={cycle}
    >
      <ALargeSmall aria-hidden className="size-[18px]" strokeWidth={2.25} />
    </button>
  );
}
