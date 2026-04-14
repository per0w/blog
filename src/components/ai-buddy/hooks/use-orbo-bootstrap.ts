import { useEffect, useMemo, useState } from "react";

import { usePathname } from "next/navigation";

import { ORBO_DISMISSED_STORAGE_KEY } from "@/constants/ai-buddy";
import { isCvPathname } from "@/utils/cv-path";

function isCapableDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const cores = navigator.hardwareConcurrency ?? 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return false;
  if (cores < 4) return false;
  if (window.innerWidth < 768) return false;
  return true;
}

/**
 * Портал, sessionStorage «свёрнут», флаги вьюпорта (CV / мобилка / «тяжёлый» аватар).
 */
export function useOrboBootstrap() {
  const pathname = usePathname();
  const [portalReady, setPortalReady] = useState(false);
  const [dismissed, setDismissed] = useState(true);
  const [enhanced, setEnhanced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  /** Клиентская навигация не триггерит resize — путь берём из App Router. */
  const isCvPage = useMemo(() => isCvPathname(pathname), [pathname]);

  useEffect(() => {
    /* sessionStorage и портал недоступны при SSR; обновление после гидратации намеренное */
    /* eslint-disable react-hooks/set-state-in-effect -- см. комментарий выше */
    setPortalReady(true);
    try {
      setDismissed(sessionStorage.getItem(ORBO_DISMISSED_STORAGE_KEY) === "true");
    } catch {
      setDismissed(false);
    }
    /* eslint-enable react-hooks/set-state-in-effect */

    const syncViewport = () => {
      setEnhanced(isCapableDevice());
      setIsMobile(window.innerWidth < 640);
    };

    syncViewport();
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    mqReduce.addEventListener("change", syncViewport);
    window.addEventListener("resize", syncViewport, { passive: true });
    return () => {
      mqReduce.removeEventListener("change", syncViewport);
      window.removeEventListener("resize", syncViewport);
    };
  }, []);

  return {
    portalReady,
    dismissed,
    setDismissed,
    enhanced,
    isMobile,
    isCvPage,
  };
}
