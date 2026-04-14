import { useEffect, type MutableRefObject } from "react";

import type { OrbMood } from "@/components/ai-buddy/orb-avatar";
import {
  CURSOR_COMMENTS,
  CURSOR_HOVER_DELAY,
  detectElementType,
  getContextualComment,
  getCvItemComment,
  getImpactProjectCardHoverComment,
  pickRandom,
} from "@/components/ai-buddy/orbo-data";
import type { CvReaderRole } from "@/constants/common";

type ShowComment = (text: string, mood?: OrbMood) => void;

/** Реплики по наведению курсора на типы элементов (и CV-айтемы). */
export function useOrboCursorHover(
  dismissed: boolean,
  isMobile: boolean,
  isCvPage: boolean,
  showComment: ShowComment,
  cvRoleRef: MutableRefObject<CvReaderRole>,
  orboSectionPipelineRef: MutableRefObject<boolean>,
  orboSuppressAmbientUntilRef: MutableRefObject<number>,
) {
  useEffect(() => {
    if (dismissed || isMobile) return;

    let hoverTimer: ReturnType<typeof setTimeout> | null = null;
    let lastTarget: Element | null = null;
    let cursorCommented = false;

    const handleMouseMove = (e: MouseEvent) => {
      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (!target || target === lastTarget) return;

      lastTarget = target;
      cursorCommented = false;
      if (hoverTimer) clearTimeout(hoverTimer);

      if (target.closest("[data-orbo]")) return;
      if (target.closest("[data-orbo-hero-greet]")) return;
      if (target.closest("[data-orbo-bubble-reply]")) return;
      if (target.closest("[data-orbo-max]")) return;

      hoverTimer = setTimeout(() => {
        if (cursorCommented) return;
        if (orboSectionPipelineRef.current || Date.now() < orboSuppressAmbientUntilRef.current) {
          return;
        }
        cursorCommented = true;

        if (isCvPage) {
          const cvItemComment = getCvItemComment(target, cvRoleRef.current);
          if (cvItemComment) {
            showComment(cvItemComment);
            return;
          }
        }

        if (target.closest("[data-orbo-impact-card]")) {
          showComment(getImpactProjectCardHoverComment());
          return;
        }

        const contextual = getContextualComment(target);
        if (contextual) {
          showComment(contextual);
          return;
        }

        const elType = detectElementType(target);
        const comments = CURSOR_COMMENTS[elType] ?? CURSOR_COMMENTS.generic;
        showComment(pickRandom(comments));
      }, CURSOR_HOVER_DELAY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (hoverTimer) clearTimeout(hoverTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ref-объекты стабильны
  }, [dismissed, isCvPage, isMobile, showComment]);
}
