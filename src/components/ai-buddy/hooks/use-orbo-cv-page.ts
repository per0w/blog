import { useEffect, type MutableRefObject } from "react";

import type { OrbMood } from "@/components/ai-buddy/orb-avatar";
import {
  CV_ROLE_CHANGE_COMMENTS,
  CV_ROLE_DWELL_COMMENTS,
  CV_ROLE_FOCUS_SECTIONS,
  CV_ROLE_HIRE_NUDGES,
  CV_ROLE_SIGNAL_SECTIONS,
  getCvActionComment,
  getCvSectionComment,
  pickRandom,
} from "@/components/ai-buddy/orbo-data";
import { CV_READER_ROLES, ORBO_CV_ROLE_CHANGE_EVENT, type CvReaderRole } from "@/constants/common";
import {
  getSectionVerticalVisibilityRatio,
  MIN_SECTION_VISIBILITY_RATIO,
} from "@/utils/orbo-visibility";

type ShowComment = (text: string, mood?: OrbMood) => void;

/**
 * CV: смена роли, клики по действиям, один IntersectionObserver на [data-orbo-cv]
 * (первичный комментарий, dwell, hire-nudge).
 */
export function useOrboCvPage(
  dismissed: boolean,
  isCvPage: boolean,
  showComment: ShowComment,
  cvRoleRef: MutableRefObject<CvReaderRole>,
  cvSeenSignalsRef: MutableRefObject<Set<string>>,
  cvHireNudgeShownRef: MutableRefObject<boolean>,
  cvDwellShownRef: MutableRefObject<Set<string>>,
  hireNudgeTimerRef: MutableRefObject<number | null>,
) {
  useEffect(() => {
    if (!isCvPage) {
      cvRoleRef.current = CV_READER_ROLES.hr;
      cvSeenSignalsRef.current.clear();
      cvDwellShownRef.current.clear();
      cvHireNudgeShownRef.current = false;
      return;
    }

    cvSeenSignalsRef.current.clear();
    cvDwellShownRef.current.clear();
    cvHireNudgeShownRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ref-мутации при смене маршрута
  }, [isCvPage]);

  useEffect(() => {
    if (!isCvPage) return;

    const handleCvRoleChange = (event: Event) => {
      const detail = (event as CustomEvent<{ role?: CvReaderRole }>).detail;
      const nextRole = detail?.role;
      if (!nextRole) return;

      cvRoleRef.current = nextRole;
      cvSeenSignalsRef.current.clear();
      cvDwellShownRef.current.clear();
      cvHireNudgeShownRef.current = false;

      if (!dismissed) {
        showComment(pickRandom(CV_ROLE_CHANGE_COMMENTS[nextRole]));
      }
    };

    window.addEventListener(ORBO_CV_ROLE_CHANGE_EVENT, handleCvRoleChange);
    return () => window.removeEventListener(ORBO_CV_ROLE_CHANGE_EVENT, handleCvRoleChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ref-объекты стабильны
  }, [dismissed, isCvPage, showComment]);

  useEffect(() => {
    if (dismissed || !isCvPage) return;

    const elements = document.querySelectorAll<HTMLElement>("[data-orbo-cv]");
    if (!elements.length) return;

    const seen = new Set<string>();
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    let activeSectionId: string | null = null;
    let dwellTimer: ReturnType<typeof setTimeout> | null = null;

    const scheduleDwell = (sectionId: string, targetEl: HTMLElement) => {
      if (dwellTimer) clearTimeout(dwellTimer);
      if (cvDwellShownRef.current.has(sectionId)) return;

      dwellTimer = setTimeout(() => {
        if (activeSectionId !== sectionId || cvDwellShownRef.current.has(sectionId)) return;

        if (getSectionVerticalVisibilityRatio(targetEl) < MIN_SECTION_VISIBILITY_RATIO) {
          return;
        }

        const role = cvRoleRef.current;
        const focusSections = CV_ROLE_FOCUS_SECTIONS[role];
        const comments = focusSections.has(sectionId) ? CV_ROLE_DWELL_COMMENTS[role] : null;

        if (!comments?.length) return;
        cvDwellShownRef.current.add(sectionId);
        showComment(pickRandom(comments));
      }, 9000);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (!intersecting.length) return;

        const role = cvRoleRef.current;

        for (const entry of intersecting) {
          if (entry.intersectionRatio < 0.55) continue;
          const sectionId = (entry.target as HTMLElement).dataset.orboCv;
          if (!sectionId || !CV_ROLE_SIGNAL_SECTIONS[role].has(sectionId)) continue;

          cvSeenSignalsRef.current.add(sectionId);
          if (cvHireNudgeShownRef.current || cvSeenSignalsRef.current.size < 3) continue;

          cvHireNudgeShownRef.current = true;
          if (hireNudgeTimerRef.current !== null) window.clearTimeout(hireNudgeTimerRef.current);
          hireNudgeTimerRef.current = window.setTimeout(() => {
            hireNudgeTimerRef.current = null;
            showComment(pickRandom(CV_ROLE_HIRE_NUDGES[role]));
          }, 1400);
          break;
        }

        const visible = [...intersecting].sort(
          (a, b) => b.intersectionRatio - a.intersectionRatio,
        )[0];
        if (visible) {
          const sectionId = (visible.target as HTMLElement).dataset.orboCv;
          if (sectionId) {
            activeSectionId = sectionId;
            scheduleDwell(sectionId, visible.target as HTMLElement);
          }
        }

        for (const entry of intersecting) {
          if (entry.intersectionRatio < 0.4) continue;
          const el = entry.target as HTMLElement;
          const key = el.dataset.orboCv;
          if (!key || seen.has(key)) continue;

          seen.add(key);
          if (debounceTimer) clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            if (getSectionVerticalVisibilityRatio(el) < MIN_SECTION_VISIBILITY_RATIO) {
              return;
            }
            const c = getCvSectionComment(key, cvRoleRef.current);
            if (c) showComment(c);
          }, 800);
        }
      },
      { threshold: [0.35, 0.4, 0.5, 0.55, 0.75] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      if (debounceTimer) clearTimeout(debounceTimer);
      if (dwellTimer) clearTimeout(dwellTimer);
      if (hireNudgeTimerRef.current !== null) {
        window.clearTimeout(hireNudgeTimerRef.current);
        hireNudgeTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ref-объекты стабильны
  }, [dismissed, isCvPage, showComment]);

  useEffect(() => {
    if (dismissed || !isCvPage) return;

    let lastAt = 0;
    const cooldownMs = 5000;

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const c = getCvActionComment(target, cvRoleRef.current);
      if (!c) return;

      const now = Date.now();
      if (now - lastAt < cooldownMs) return;
      lastAt = now;
      showComment(c);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- cvRoleRef стабилен
  }, [dismissed, isCvPage, showComment]);
}
