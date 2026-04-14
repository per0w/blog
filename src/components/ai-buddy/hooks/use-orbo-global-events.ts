import { useEffect, type Dispatch, type SetStateAction } from "react";

import type { OrbMood } from "@/components/ai-buddy/orb-avatar";
import {
  CONTACT_FORM_SPAM_COMMENTS,
  COPY_TEXT_COMMENTS,
  EXPERIENCE_TOOLTIP_COMMENTS,
  getSelectionComment,
  MAX_ORBO_COMMENTS,
  pickRandom,
  RESIZE_WINDOW_COMMENTS,
  TAB_RETURN_COMMENTS,
  THEME_DARK_COMMENTS,
  THEME_LIGHT_COMMENTS,
} from "@/components/ai-buddy/orbo-data";
import {
  ORBO_CONTACT_SPAM_EVENT,
  ORBO_EASTER_EGG_HINT_EVENT,
  ORBO_HERO_GREETING_REPLY_EVENT,
  ORBO_MAX_HOVER_EVENT,
} from "@/constants/common";

type ShowComment = (text: string, mood?: OrbMood) => void;

/** Кастомные события, буфер, тема, вкладка, ресайз, выделение. */
export function useOrboGlobalEvents(
  dismissed: boolean,
  showComment: ShowComment,
  setDismissed: Dispatch<SetStateAction<boolean>>,
) {
  useEffect(() => {
    if (dismissed) return;

    const handleExperienceTooltip = () => {
      showComment(pickRandom(EXPERIENCE_TOOLTIP_COMMENTS));
    };

    window.addEventListener("orbo:experience-tooltip", handleExperienceTooltip);
    return () => {
      window.removeEventListener("orbo:experience-tooltip", handleExperienceTooltip);
    };
  }, [dismissed, showComment]);

  useEffect(() => {
    if (dismissed) return;

    const handleEasterEggHint = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string }>).detail;
      if (detail?.message) {
        showComment(detail.message, "easter");
      }
    };

    window.addEventListener(ORBO_EASTER_EGG_HINT_EVENT, handleEasterEggHint);
    return () => window.removeEventListener(ORBO_EASTER_EGG_HINT_EVENT, handleEasterEggHint);
  }, [dismissed, showComment]);

  useEffect(() => {
    const handleHeroGreetingReply = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string }>).detail;
      if (!detail?.message) return;
      setDismissed(false);
      showComment(detail.message, "easter");
    };

    window.addEventListener(ORBO_HERO_GREETING_REPLY_EVENT, handleHeroGreetingReply);
    return () =>
      window.removeEventListener(ORBO_HERO_GREETING_REPLY_EVENT, handleHeroGreetingReply);
  }, [showComment, setDismissed]);

  useEffect(() => {
    if (dismissed) return;

    let lastAt = 0;
    const cooldownMs = 14_000;

    const handleMaxHover = () => {
      const now = Date.now();
      if (now - lastAt < cooldownMs) return;
      lastAt = now;
      showComment(pickRandom(MAX_ORBO_COMMENTS));
    };

    window.addEventListener(ORBO_MAX_HOVER_EVENT, handleMaxHover);
    return () => window.removeEventListener(ORBO_MAX_HOVER_EVENT, handleMaxHover);
  }, [dismissed, showComment]);

  useEffect(() => {
    if (dismissed) return;

    const handleContactSpam = () => {
      showComment(pickRandom(CONTACT_FORM_SPAM_COMMENTS));
    };

    window.addEventListener(ORBO_CONTACT_SPAM_EVENT, handleContactSpam);
    return () => window.removeEventListener(ORBO_CONTACT_SPAM_EVENT, handleContactSpam);
  }, [dismissed, showComment]);

  useEffect(() => {
    if (dismissed) return;

    const handleCopy = () => showComment(pickRandom(COPY_TEXT_COMMENTS));

    document.addEventListener("copy", handleCopy);
    return () => document.removeEventListener("copy", handleCopy);
  }, [dismissed, showComment]);

  useEffect(() => {
    if (dismissed) return;

    const handleTheme = (e: Event) => {
      const detail = (e as CustomEvent<{ theme: string }>).detail;
      const comments = detail?.theme === "dark" ? THEME_DARK_COMMENTS : THEME_LIGHT_COMMENTS;
      showComment(pickRandom(comments));
    };

    window.addEventListener("orbo:theme-switch", handleTheme);
    return () => window.removeEventListener("orbo:theme-switch", handleTheme);
  }, [dismissed, showComment]);

  useEffect(() => {
    if (dismissed) return;

    let leftAt = 0;

    const handleVisibility = () => {
      if (document.hidden) {
        leftAt = Date.now();
      } else if (leftAt && Date.now() - leftAt > 3000) {
        showComment(pickRandom(TAB_RETURN_COMMENTS));
        leftAt = 0;
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [dismissed, showComment]);

  useEffect(() => {
    if (dismissed) return;

    let selectTimer: ReturnType<typeof setTimeout> | null = null;

    const handleSelect = () => {
      if (selectTimer) clearTimeout(selectTimer);
      selectTimer = setTimeout(() => {
        const sel = window.getSelection();
        const selected = sel?.toString().trim() ?? "";
        if (selected.length > 5) {
          showComment(getSelectionComment(selected));
        }
      }, 1200);
    };

    document.addEventListener("selectionchange", handleSelect);
    return () => {
      document.removeEventListener("selectionchange", handleSelect);
      if (selectTimer) clearTimeout(selectTimer);
    };
  }, [dismissed, showComment]);

  useEffect(() => {
    if (dismissed) return;

    const RESIZE_KEY = "orbo-resize-hint-once";
    let tid: number | null = null;

    const onResize = () => {
      if (tid !== null) window.clearTimeout(tid);
      tid = window.setTimeout(() => {
        tid = null;
        try {
          if (sessionStorage.getItem(RESIZE_KEY) === "1") return;
          sessionStorage.setItem(RESIZE_KEY, "1");
        } catch {
          return;
        }
        showComment(pickRandom(RESIZE_WINDOW_COMMENTS));
      }, 520);
    };

    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      if (tid !== null) window.clearTimeout(tid);
    };
  }, [dismissed, showComment]);
}
