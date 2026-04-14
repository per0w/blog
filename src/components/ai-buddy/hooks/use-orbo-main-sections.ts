import { useEffect, type MutableRefObject } from "react";

import { ORBO_SECTION_QUEUE_GAP_MS } from "@/constants/ai-buddy";
import { SECTIONS_IDS } from "@/constants/common";
import { logOrboDebug } from "@/utils/orbo-debug";

type RequestComment = (sectionId: string) => Promise<boolean>;

/**
 * Главная (не CV): очередь секций по viewport + инкремент epoch для отмены устаревших ответов.
 */
export function useOrboMainSections(
  dismissed: boolean,
  isCvPage: boolean,
  requestComment: RequestComment,
  lastSectionRef: MutableRefObject<string | null>,
  idleFiredRef: MutableRefObject<boolean>,
  tapCountRef: MutableRefObject<number>,
  sectionCommentEpochRef: MutableRefObject<number>,
  setOrbIdleDrowsy: (v: boolean) => void,
) {
  useEffect(() => {
    if (dismissed || isCvPage) return;

    const sectionIds = Object.values(SECTIONS_IDS);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const seen = new Set<string>();
    const queue: string[] = [];
    let processing = false;
    let queueTimer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const processQueue = () => {
      if (cancelled || processing || !queue.length) return;
      processing = true;

      const sectionId = queue.shift()!;
      logOrboDebug("process queue", { sectionId, queueLeft: queue.length });
      lastSectionRef.current = sectionId;
      idleFiredRef.current = false;
      tapCountRef.current = 0;
      setOrbIdleDrowsy(false);

      void (async () => {
        let nextDelay = ORBO_SECTION_QUEUE_GAP_MS;
        try {
          const shown = await requestComment(sectionId);
          nextDelay = shown ? ORBO_SECTION_QUEUE_GAP_MS : 180;
          logOrboDebug("request done", { sectionId, shown, nextDelay });
        } finally {
          if (cancelled) return;
          queueTimer = setTimeout(() => {
            processing = false;
            processQueue();
          }, nextDelay);
        }
      })();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const newcomers = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => {
            const target = entry.target as HTMLElement;
            return { id: target.id, ratio: entry.intersectionRatio };
          })
          .filter((item) => item.id && !seen.has(item.id));

        if (!newcomers.length) {
          return;
        }

        const best = [...newcomers].sort((a, b) => b.ratio - a.ratio)[0]!;
        seen.add(best.id);
        sectionCommentEpochRef.current += 1;
        /* Хвост очереди всегда заменяем на последнюю релевантную секцию. */
        queue.length = 0;
        queue.push(best.id);
        logOrboDebug("enqueue best section", {
          sectionId: best.id,
          ratio: best.ratio,
          epoch: sectionCommentEpochRef.current,
        });
        processQueue();
      },
      { threshold: 0.3, rootMargin: "0px 0px -8% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => {
      cancelled = true;
      observer.disconnect();
      if (queueTimer) clearTimeout(queueTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ref-объекты стабильны
  }, [dismissed, isCvPage, requestComment]);
}
