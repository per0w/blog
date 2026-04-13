"use client";

import { useEffect, useState } from "react";

import dynamic from "next/dynamic";

const AiBuddy = dynamic(
  () =>
    import("@/components/ai-buddy/ai-buddy").then((mod) => ({
      default: mod.AiBuddy,
    })),
  { ssr: false, loading: () => null },
);

/**
 * Орбо и `orbo-data` — отдельный чанк; монтирование после idle, чтобы не бить по LCP и первому кадру.
 */
export function AiBuddyDeferred() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (!cancelled) setShow(true);
    };

    if (typeof window.requestIdleCallback === "function") {
      const idleId = window.requestIdleCallback(run, { timeout: 2500 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timeoutId = window.setTimeout(run, 1);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  if (!show) return null;
  return <AiBuddy />;
}
