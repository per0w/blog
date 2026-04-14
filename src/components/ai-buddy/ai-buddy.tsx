"use client";

import { useCallback, useRef, useState } from "react";

import { createPortal } from "react-dom";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { useOrboBootstrap } from "@/components/ai-buddy/hooks/use-orbo-bootstrap";
import { useOrboCursorHover } from "@/components/ai-buddy/hooks/use-orbo-cursor-hover";
import { useOrboCvPage } from "@/components/ai-buddy/hooks/use-orbo-cv-page";
import { useOrboGlobalEvents } from "@/components/ai-buddy/hooks/use-orbo-global-events";
import { useOrboLean } from "@/components/ai-buddy/hooks/use-orbo-lean";
import { useOrboMainSections } from "@/components/ai-buddy/hooks/use-orbo-main-sections";
import { useOrboPeek } from "@/components/ai-buddy/hooks/use-orbo-peek";
import { useOrboScroll } from "@/components/ai-buddy/hooks/use-orbo-scroll";
import { OrbAvatar, type OrbMood } from "@/components/ai-buddy/orb-avatar";
import { CommentTooltip } from "@/components/ai-buddy/orbo-comment-tooltip";
import {
  ANNOYED_COMMENTS,
  CV_CLICK_COMMENTS,
  CV_ROLE_CHANGE_COMMENTS,
  CV_ROLE_CLICK_COMMENTS,
  getRandomComment,
  pickRandom,
  SECTION_COMMENTS,
} from "@/components/ai-buddy/orbo-data";
import { runOrboThinkingShowPipeline } from "@/components/ai-buddy/run-orbo-thinking-pipeline";
import {
  ORBO_DISMISSED_STORAGE_KEY,
  ORBO_DISPLAY_DURATION_MS,
  ORBO_MIN_THINKING_MS,
  ORBO_TAP_COUNT_RESET_MS,
} from "@/constants/ai-buddy";
import { CV_READER_ROLES, type CvReaderRole } from "@/constants/common";
import { HERO_GREETING_BUBBLE_REPLY_FOCUS_MS } from "@/constants/hero-greeting";
import { getOrboAiComment, getOrboCvRoleSwitchComment } from "@/utils/orbo-ai-comment";
import { logOrboDebug } from "@/utils/orbo-debug";
import {
  getSectionVerticalVisibilityRatio,
  MIN_SECTION_VISIBILITY_RATIO,
} from "@/utils/orbo-visibility";

function SimpleAvatar({ speaking, compact }: { speaking: boolean; compact?: boolean }) {
  const size = compact ? "size-10" : "size-12";
  const iconSize = compact ? "size-4" : "size-5";
  return (
    <div
      className={`flex ${size} items-center justify-center bg-transparent transition-transform duration-300 ${speaking ? "scale-110 motion-safe:animate-pulse" : ""}`}
    >
      <Sparkles
        className={`${iconSize} text-accent drop-shadow-[0_0_10px_color-mix(in_srgb,var(--color-accent)_45%,transparent)]`}
      />
    </div>
  );
}

/**
 * Мобилка: по центру снизу — не перекрывает основной текст у правого края.
 * Десктоп: правый нижний угол.
 */
const ORBO_FLOAT_CLASS =
  "fixed z-[100] [contain:layout] max-sm:right-0 max-sm:bottom-[max(1rem,env(safe-area-inset-bottom,0px))] max-sm:left-0 max-sm:flex max-sm:justify-center sm:bottom-[max(1.5rem,env(safe-area-inset-bottom,0px))] sm:right-[max(1.5rem,env(safe-area-inset-right,0px))] sm:left-auto";

export function AiBuddy() {
  const { portalReady, dismissed, setDismissed, enhanced, isMobile, isCvPage } = useOrboBootstrap();

  const [comment, setComment] = useState<string | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [commentSlideKey, setCommentSlideKey] = useState(0);
  const [orbMood, setOrbMood] = useState<OrbMood>("neutral");
  const [orbIdleDrowsy, setOrbIdleDrowsy] = useState(false);
  const [lean, setLean] = useState({ x: 0, y: 0 });

  const peekDismissed = useOrboPeek(dismissed);

  const lastSectionRef = useRef<string | null>(null);
  const displayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleFiredRef = useRef(false);
  const tapCountRef = useRef(0);
  const tapResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCommentRef = useRef<string | null>(null);
  const cvRoleRef = useRef<CvReaderRole>(CV_READER_ROLES.hr);
  const cvSeenSignalsRef = useRef<Set<string>>(new Set());
  const cvHireNudgeShownRef = useRef(false);
  const cvDwellShownRef = useRef<Set<string>>(new Set());
  const hireNudgeTimerRef = useRef<number | null>(null);
  const orboSectionPipelineRef = useRef(false);
  const orboSuppressAmbientUntilRef = useRef(0);
  const sectionCommentEpochRef = useRef(0);

  useOrboLean(dismissed, isMobile, setLean);

  const scheduleHideBubble = useCallback((ms: number) => {
    if (displayTimerRef.current) clearTimeout(displayTimerRef.current);
    displayTimerRef.current = setTimeout(() => {
      setTooltipVisible(false);
      setSpeaking(false);
      setOrbMood("neutral");
    }, ms);
  }, []);

  const dismiss = useCallback(() => {
    if (displayTimerRef.current) clearTimeout(displayTimerRef.current);
    if (tapResetTimerRef.current) {
      clearTimeout(tapResetTimerRef.current);
      tapResetTimerRef.current = null;
    }
    setDismissed(true);
    setTooltipVisible(false);
    setSpeaking(false);
    setIsThinking(false);
    setOrbMood("neutral");
    setOrbIdleDrowsy(false);
    try {
      sessionStorage.setItem(ORBO_DISMISSED_STORAGE_KEY, "true");
    } catch {
      /* private mode */
    }
  }, [setDismissed]);

  const showComment = useCallback(
    (text: string, mood: OrbMood = "neutral") => {
      if (displayTimerRef.current) clearTimeout(displayTimerRef.current);

      lastCommentRef.current = text;
      setIsThinking(false);
      setCommentSlideKey((k) => k + 1);
      setComment(text);
      setTooltipVisible(true);
      setSpeaking(true);
      setOrbMood(mood);

      scheduleHideBubble(ORBO_DISPLAY_DURATION_MS);
    },
    [scheduleHideBubble],
  );

  const reactToCvReaderRole = useCallback(
    async (role: CvReaderRole) => {
      if (dismissed) return;

      await runOrboThinkingShowPipeline(
        {
          displayTimerRef,
          orboSectionPipelineRef,
          orboSuppressAmbientUntilRef,
        },
        {
          setIsThinking,
          setOrbMood,
          setComment,
          setTooltipVisible,
          setSpeaking,
        },
        async () => {
          const t0 = Date.now();
          const aiLine = await getOrboCvRoleSwitchComment(role);
          const cleaned = aiLine?.replace(/\s+/g, " ").trim() ?? "";
          const text =
            cleaned.length > 0 ? cleaned.slice(0, 280) : pickRandom(CV_ROLE_CHANGE_COMMENTS[role]);

          const elapsed = Date.now() - t0;
          const pad = Math.max(0, 400 - elapsed);
          if (pad > 0) await new Promise((r) => setTimeout(r, pad));

          showComment(text, "neutral");
          return true;
        },
      );
    },
    [dismissed, showComment],
  );

  const requestComment = useCallback(
    async (sectionId: string, options?: { bypassVisibility?: boolean }) => {
      const bypassVisibility = options?.bypassVisibility ?? false;
      const epochAtStart = sectionCommentEpochRef.current;
      const el = document.getElementById(sectionId);

      if (!el) {
        logOrboDebug("drop: section element missing", { sectionId });
        return false;
      }

      const initialVisibility = getSectionVerticalVisibilityRatio(el);
      if (
        !bypassVisibility &&
        initialVisibility < MIN_SECTION_VISIBILITY_RATIO
      ) {
        logOrboDebug("drop: low visibility before request", {
          sectionId,
          visibility: initialVisibility,
          min: MIN_SECTION_VISIBILITY_RATIO,
        });
        return false;
      }

      return runOrboThinkingShowPipeline(
        {
          displayTimerRef,
          orboSectionPipelineRef,
          orboSuppressAmbientUntilRef,
        },
        {
          setIsThinking,
          setOrbMood,
          setComment,
          setTooltipVisible,
          setSpeaking,
        },
        async () => {
          const t0 = Date.now();
          const aiComment = await getOrboAiComment(sectionId);

          if (sectionCommentEpochRef.current !== epochAtStart) {
            logOrboDebug("drop: epoch changed after ai", {
              sectionId,
              epochAtStart,
              epochNow: sectionCommentEpochRef.current,
            });
            return false;
          }
          const visibilityAfterAi = getSectionVerticalVisibilityRatio(el);
          if (
            !bypassVisibility &&
            visibilityAfterAi < MIN_SECTION_VISIBILITY_RATIO
          ) {
            logOrboDebug("drop: low visibility after ai", {
              sectionId,
              visibility: visibilityAfterAi,
              min: MIN_SECTION_VISIBILITY_RATIO,
            });
            return false;
          }

          const text = aiComment ?? getRandomComment(sectionId);
          const elapsed = Date.now() - t0;
          const minThink = aiComment != null ? 400 : ORBO_MIN_THINKING_MS;
          const pad = Math.max(0, minThink - elapsed);
          if (pad > 0) await new Promise((r) => setTimeout(r, pad));

          if (sectionCommentEpochRef.current !== epochAtStart) {
            logOrboDebug("drop: epoch changed after think pad", {
              sectionId,
              epochAtStart,
              epochNow: sectionCommentEpochRef.current,
            });
            return false;
          }
          const visibilityBeforeShow = getSectionVerticalVisibilityRatio(el);
          if (
            !bypassVisibility &&
            visibilityBeforeShow < MIN_SECTION_VISIBILITY_RATIO
          ) {
            logOrboDebug("drop: low visibility before show", {
              sectionId,
              visibility: visibilityBeforeShow,
              min: MIN_SECTION_VISIBILITY_RATIO,
            });
            return false;
          }

          showComment(text, "neutral");
          logOrboDebug("show section comment", {
            sectionId,
            ai: aiComment != null,
            elapsedMs: elapsed,
          });
          return true;
        },
      );
    },
    [showComment],
  );

  useOrboMainSections(
    dismissed,
    isCvPage,
    requestComment,
    lastSectionRef,
    idleFiredRef,
    tapCountRef,
    sectionCommentEpochRef,
    setOrbIdleDrowsy,
  );

  useOrboCvPage(
    dismissed,
    isCvPage,
    showComment,
    cvRoleRef,
    cvSeenSignalsRef,
    cvHireNudgeShownRef,
    cvDwellShownRef,
    hireNudgeTimerRef,
    reactToCvReaderRole,
  );

  useOrboScroll(
    dismissed,
    showComment,
    setOrbIdleDrowsy,
    lastSectionRef,
    idleTimerRef,
    idleFiredRef,
    orboSectionPipelineRef,
    orboSuppressAmbientUntilRef,
  );

  useOrboCursorHover(
    dismissed,
    isMobile,
    isCvPage,
    showComment,
    cvRoleRef,
    orboSectionPipelineRef,
    orboSuppressAmbientUntilRef,
  );

  useOrboGlobalEvents(dismissed, showComment, setDismissed);

  const getUniqueComment = useCallback((sectionId: string): string => {
    const comments = SECTION_COMMENTS[sectionId] ?? [];
    const available = comments.filter((c) => c !== lastCommentRef.current);
    const picked = available.length > 0 ? pickRandom(available) : pickRandom(comments);
    lastCommentRef.current = picked;
    return picked;
  }, []);

  const handleOrbClick = useCallback(() => {
    if (tapResetTimerRef.current) clearTimeout(tapResetTimerRef.current);
    tapResetTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
      tapResetTimerRef.current = null;
    }, ORBO_TAP_COUNT_RESET_MS);

    tapCountRef.current += 1;
    const taps = tapCountRef.current;

    if (taps >= 4) {
      const annoyed = pickRandom(ANNOYED_COMMENTS);
      lastCommentRef.current = annoyed;
      showComment(annoyed, "annoyed");
      return;
    }

    if (isCvPage) {
      const role = cvRoleRef.current;
      const roleComments = CV_ROLE_CLICK_COMMENTS[role];
      showComment(pickRandom(roleComments.length ? roleComments : CV_CLICK_COMMENTS));
      return;
    }

    const section = lastSectionRef.current;
    if (section) {
      showComment(getUniqueComment(section));
    }
  }, [showComment, getUniqueComment, isCvPage]);

  const revive = useCallback(() => {
    setDismissed(false);
    idleFiredRef.current = false;
    try {
      sessionStorage.removeItem(ORBO_DISMISSED_STORAGE_KEY);
    } catch {
      /* private mode */
    }
    const section = lastSectionRef.current;
    if (section) void requestComment(section, { bypassVisibility: true });
  }, [requestComment, setDismissed]);

  if (!portalReady) {
    return null;
  }

  if (dismissed) {
    return createPortal(
      <div data-orbo className={ORBO_FLOAT_CLASS}>
        <motion.button
          animate={peekDismissed ? { y: [0, -6, 0] } : { y: 0 }}
          aria-label="Вернуть Орбо"
          className="focus-ring-accent group shadow-elevation-card flex size-8 items-center justify-center rounded-full border border-accent/20 bg-surface/80 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-accent/40 hover:shadow-[0_0_12px_color-mix(in_srgb,var(--color-accent)_25%,transparent)]"
          transition={{ duration: 0.55, ease: "easeOut" }}
          type="button"
          onClick={revive}
        >
          <Sparkles className="size-3.5 text-accent/60 transition-colors group-hover:text-accent" />
        </motion.button>
      </div>,
      document.body,
    );
  }

  const orbSpeaking = speaking || isThinking;
  const visualMood: OrbMood = isThinking ? "thinking" : orbMood;

  return createPortal(
    <div data-orbo className={`pointer-events-none ${ORBO_FLOAT_CLASS}`}>
      <div className="flex max-w-[calc(100vw-1rem)] flex-col-reverse items-center gap-2.5 sm:relative sm:h-16 sm:w-16 sm:max-w-none sm:items-end sm:gap-0">
        <div className="orbo-ambient-float pointer-events-none motion-reduce:animate-none">
          <div
            className="pointer-events-auto will-change-transform"
            style={{ transform: `translate3d(${lean.x}px, ${lean.y}px, 0)` }}
          >
            <motion.button
              aria-label="Орбо — нажми для комментария"
              className="focus-ring-accent shrink-0 cursor-pointer rounded-md border-0 bg-transparent p-0.5 shadow-none"
              transition={{ type: "spring", stiffness: 520, damping: 18 }}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleOrbClick}
            >
              {enhanced ? (
                <OrbAvatar idleDrowsy={orbIdleDrowsy} mood={visualMood} speaking={orbSpeaking} />
              ) : (
                <SimpleAvatar compact={isMobile} speaking={orbSpeaking} />
              )}
            </motion.button>
          </div>
        </div>

        <CommentTooltip
          comment={comment}
          commentKey={commentSlideKey}
          speaking={speaking && !isThinking}
          thinking={isThinking && tooltipVisible}
          visible={tooltipVisible}
          bubbleReply={{
            onOrboLine: (line) => showComment(line, "easter"),
            onReplyBlur: () => scheduleHideBubble(ORBO_DISPLAY_DURATION_MS),
            onReplyFocus: () => scheduleHideBubble(HERO_GREETING_BUBBLE_REPLY_FOCUS_MS),
          }}
          onDismiss={dismiss}
        />
      </div>
    </div>,
    document.body,
  );
}
