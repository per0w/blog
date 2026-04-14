import { useEffect, type MutableRefObject } from "react";

import type { OrbMood } from "@/components/ai-buddy/orb-avatar";
import {
  FAST_SCROLL_COMMENTS,
  IDLE_COMMENTS,
  PAGE_BOTTOM_COMMENTS,
  pickRandom,
  SCROLL_BACK_COMMENTS,
} from "@/components/ai-buddy/orbo-data";
import { ORBO_IDLE_DELAY_MS } from "@/constants/ai-buddy";

type ShowComment = (text: string, mood?: OrbMood) => void;

/** Idle после скролла, быстрый скролл, откат вверх, низ страницы. */
export function useOrboScroll(
  dismissed: boolean,
  showComment: ShowComment,
  setOrbIdleDrowsy: (v: boolean) => void,
  lastSectionRef: MutableRefObject<string | null>,
  idleTimerRef: MutableRefObject<ReturnType<typeof setTimeout> | null>,
  idleFiredRef: MutableRefObject<boolean>,
  orboSectionPipelineRef: MutableRefObject<boolean>,
  orboSuppressAmbientUntilRef: MutableRefObject<number>,
) {
  useEffect(() => {
    if (dismissed) return;

    let lastScrollY = window.scrollY;
    let lastScrollTime = Date.now();
    let fastFired = false;
    let maxY = window.scrollY;
    let firedBack = false;
    let firedBottom = false;

    const ambientOrboOk = () =>
      !orboSectionPipelineRef.current && Date.now() >= orboSuppressAmbientUntilRef.current;

    const resetIdle = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (idleFiredRef.current || !lastSectionRef.current) return;
        if (!ambientOrboOk()) return;
        idleFiredRef.current = true;
        setOrbIdleDrowsy(true);
        showComment(pickRandom(IDLE_COMMENTS));
      }, ORBO_IDLE_DELAY_MS);
    };

    const onScroll = () => {
      resetIdle();
      setOrbIdleDrowsy(false);

      const now = Date.now();
      const y = window.scrollY;

      const delta = Math.abs(y - lastScrollY);
      const elapsed = now - lastScrollTime;
      if (elapsed > 800) {
        const speed = delta / (elapsed / 1000);
        if (speed > 3000 && !fastFired) {
          if (ambientOrboOk()) {
            fastFired = true;
            showComment(pickRandom(FAST_SCROLL_COMMENTS));
            window.setTimeout(() => {
              fastFired = false;
            }, 8000);
          }
        }
        lastScrollY = y;
        lastScrollTime = now;
      }

      if (y > maxY) {
        maxY = y;
        firedBack = false;
      } else if (maxY - y > 400 && !firedBack) {
        if (ambientOrboOk()) {
          firedBack = true;
          showComment(pickRandom(SCROLL_BACK_COMMENTS));
          window.setTimeout(() => {
            maxY = window.scrollY;
            firedBack = false;
          }, 10000);
        }
      }

      if (!firedBottom && window.innerHeight + y >= document.body.scrollHeight - 100) {
        if (ambientOrboOk()) {
          firedBottom = true;
          showComment(pickRandom(PAGE_BOTTOM_COMMENTS));
        }
      }
    };

    resetIdle();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
    // ref-объекты стабильны — не включаем в deps, чтобы не дублировать подписки
    // eslint-disable-next-line react-hooks/exhaustive-deps -- см. выше
  }, [dismissed, showComment, setOrbIdleDrowsy]);
}
