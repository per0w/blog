"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { OrbAvatar, type OrbMood } from "@/components/ai-buddy/orb-avatar";
import { CommentTooltip } from "@/components/ai-buddy/orbo-comment-tooltip";
import {
  AI_PROMPT_TEMPLATE,
  ANNOYED_COMMENTS,
  CONTACT_FORM_SPAM_COMMENTS,
  COPY_TEXT_COMMENTS,
  CURSOR_COMMENTS,
  CURSOR_HOVER_DELAY,
  CV_CLICK_COMMENTS,
  CV_ROLE_CHANGE_COMMENTS,
  CV_ROLE_CLICK_COMMENTS,
  CV_ROLE_DWELL_COMMENTS,
  CV_ROLE_FOCUS_SECTIONS,
  CV_ROLE_HIRE_NUDGES,
  CV_ROLE_SIGNAL_SECTIONS,
  detectElementType,
  EXPERIENCE_TOOLTIP_COMMENTS,
  FAST_SCROLL_COMMENTS,
  getContextualComment,
  getCvActionComment,
  getCvItemComment,
  getCvSectionComment,
  getImpactProjectCardHoverComment,
  getRandomComment,
  getSelectionComment,
  IDLE_COMMENTS,
  MAX_ORBO_COMMENTS,
  PAGE_BOTTOM_COMMENTS,
  pickRandom,
  RESIZE_WINDOW_COMMENTS,
  SCROLL_BACK_COMMENTS,
  SECTION_COMMENTS,
  SECTION_NAMES,
  TAB_RETURN_COMMENTS,
  THEME_DARK_COMMENTS,
  THEME_LIGHT_COMMENTS,
} from "@/components/ai-buddy/orbo-data";
import {
  CV_READER_ROLES,
  ORBO_CONTACT_SPAM_EVENT,
  ORBO_CV_ROLE_CHANGE_EVENT,
  ORBO_EASTER_EGG_HINT_EVENT,
  ORBO_HERO_GREETING_REPLY_EVENT,
  ORBO_MAX_HOVER_EVENT,
  SECTIONS_IDS,
  type CvReaderRole,
} from "@/constants/common";
import {
  getOpenRouterApiKey,
  ORBO_OPENROUTER_COOLDOWN_MS,
  ORBO_OPENROUTER_MAX_FALLBACK_ATTEMPTS,
} from "@/constants/contact-form";
import { HERO_GREETING_BUBBLE_REPLY_FOCUS_MS } from "@/constants/hero-greeting";
import { openRouterChatCompletion } from "@/utils/openrouter-client";

/** Сериализация вызовов OpenRouter из Орбо (один за другим, без «return null»). */
let orboOpenRouterLastAttemptAt = 0;
let orboOpenRouterMutexTail: Promise<void> = Promise.resolve();

async function withOrboOpenRouterSlot<T>(fn: () => Promise<T>): Promise<T> {
  const prev = orboOpenRouterMutexTail;
  let release!: () => void;
  orboOpenRouterMutexTail = new Promise<void>((resolve) => {
    release = resolve;
  });
  await prev;
  try {
    return await fn();
  } finally {
    release();
  }
}

const STORAGE_KEY = "ai-buddy-dismissed";
const DISPLAY_DURATION = 6000;
const ORBO_MIN_THINKING_MS = 850;
const SECTION_QUEUE_GAP_MS = DISPLAY_DURATION + 2800;
const AI_TIMEOUT = 3000;
const IDLE_DELAY = 30_000;
const TAP_COUNT_RESET_MS = 15_000;

async function getAiComment(sectionId: string): Promise<string | null> {
  const sectionName = SECTION_NAMES[sectionId] ?? sectionId;
  const prompt = AI_PROMPT_TEMPLATE(sectionName);

  if (getOpenRouterApiKey()) {
    const fromOpenRouter = await withOrboOpenRouterSlot(async () => {
      const now = Date.now();
      if (now - orboOpenRouterLastAttemptAt < ORBO_OPENROUTER_COOLDOWN_MS) {
        return null;
      }
      orboOpenRouterLastAttemptAt = Date.now();

      const ac = new AbortController();
      const t = window.setTimeout(() => ac.abort(), 12_000);
      try {
        const or = await openRouterChatCompletion({
          userContent: prompt,
          maxTokens: 120,
          temperature: 0.55,
          xTitle: "per0w.space - Orbo",
          signal: ac.signal,
          maxFallbackAttempts: ORBO_OPENROUTER_MAX_FALLBACK_ATTEMPTS,
        });
        if (or.ok) {
          const line = or.text.replace(/\s+/g, " ").trim().slice(0, 280);
          return line.length > 0 ? line : null;
        }
      } catch {
        /* падаем на встроенную модель Chrome */
      } finally {
        window.clearTimeout(t);
      }
      return null;
    });
    if (fromOpenRouter) return fromOpenRouter;
  }

  try {
    if (typeof LanguageModel === "undefined") return null;

    const availability = await LanguageModel.availability();
    if (availability === "unavailable") return null;

    const createPromise = LanguageModel.create();
    try {
      const session = await Promise.race([
        createPromise,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), AI_TIMEOUT),
        ),
      ]);
      try {
        const result = await session.prompt(prompt);
        return result?.trim() || null;
      } finally {
        session.destroy();
      }
    } catch {
      /* Таймаут гонки: create() всё равно может завершиться — обязательно destroy. */
      void createPromise
        .then((s) => {
          try {
            s.destroy();
          } catch {
            /* сессия уже закрыта */
          }
        })
        .catch(() => {});
      return null;
    }
  } catch {
    return null;
  }
}

function isCapableDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const cores = navigator.hardwareConcurrency ?? 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return false;
  if (cores < 4) return false;
  if (window.innerWidth < 768) return false;
  return true;
}

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
  const [comment, setComment] = useState<string | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [commentSlideKey, setCommentSlideKey] = useState(0);
  const [dismissed, setDismissed] = useState(true);
  const [enhanced, setEnhanced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCvPage, setIsCvPage] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [orbMood, setOrbMood] = useState<OrbMood>("neutral");
  const [orbIdleDrowsy, setOrbIdleDrowsy] = useState(false);
  const [lean, setLean] = useState({ x: 0, y: 0 });
  const [peekDismissed, setPeekDismissed] = useState(false);

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
  /** Пайплайн комментария по секции (OpenRouter / Chrome AI): не перебивать скроллом и ховером. */
  const orboSectionPipelineRef = useRef(false);
  /** После ответа по секции — короткая пауза, пока догорает инерция скролла. */
  const orboSuppressAmbientUntilRef = useRef(0);

  useEffect(() => {
    setPortalReady(true);
    try {
      setDismissed(sessionStorage.getItem(STORAGE_KEY) === "true");
    } catch {
      setDismissed(false);
    }

    const syncViewport = () => {
      setEnhanced(isCapableDevice());
      setIsMobile(window.innerWidth < 640);
      const path = window.location.pathname.replace(/\/+$/, "") || "/";
      const cvPath = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/cv`;
      setIsCvPage(path === cvPath || path.startsWith(`${cvPath}/`));
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
  }, [isCvPage]);

  useEffect(() => {
    if (!dismissed) return;
    const id = window.setInterval(() => {
      setPeekDismissed(true);
      window.setTimeout(() => setPeekDismissed(false), 700);
    }, 22_000);
    return () => clearInterval(id);
  }, [dismissed]);

  useEffect(() => {
    if (dismissed || isMobile) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    const pending = { x: 0, y: 0, dirty: false };

    const flush = () => {
      rafId = 0;
      if (!pending.dirty) return;
      pending.dirty = false;
      setLean({ x: pending.x, y: pending.y });
    };

    const onMove = (e: MouseEvent) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const nx = (e.clientX / vw - 0.5) * 2;
      const ny = (e.clientY / vh - 0.5) * 2;
      pending.x = Math.round(nx * 5);
      pending.y = Math.round(ny * 4);
      pending.dirty = true;
      if (rafId === 0) {
        rafId = window.requestAnimationFrame(flush);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafId !== 0) window.cancelAnimationFrame(rafId);
    };
  }, [dismissed, isMobile]);

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
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* private mode */
    }
  }, []);

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

      scheduleHideBubble(DISPLAY_DURATION);
    },
    [scheduleHideBubble],
  );

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
  }, [dismissed, isCvPage, showComment]);

  useEffect(() => {
    if (dismissed || !isCvPage) return;

    const seen = new Set<string>();
    const elements = document.querySelectorAll<HTMLElement>("[data-orbo-cv]");
    if (!elements.length) return;

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const key = (entry.target as HTMLElement).dataset.orboCv;
          if (!key || seen.has(key)) continue;

          seen.add(key);
          if (debounceTimer) clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            const c = getCvSectionComment(key, cvRoleRef.current);
            if (c) showComment(c);
          }, 800);
        }
      },
      { threshold: 0.4 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [dismissed, isCvPage, showComment]);

  useEffect(() => {
    if (dismissed || !isCvPage) return;

    const elements = document.querySelectorAll<HTMLElement>("[data-orbo-cv]");
    if (!elements.length) return;

    let activeSectionId: string | null = null;
    let dwellTimer: ReturnType<typeof setTimeout> | null = null;

    const scheduleDwell = (sectionId: string) => {
      if (dwellTimer) clearTimeout(dwellTimer);
      if (cvDwellShownRef.current.has(sectionId)) return;

      dwellTimer = setTimeout(() => {
        if (activeSectionId !== sectionId || cvDwellShownRef.current.has(sectionId)) return;

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
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;
        const sectionId = (visible.target as HTMLElement).dataset.orboCv;
        if (!sectionId) return;

        activeSectionId = sectionId;
        scheduleDwell(sectionId);
      },
      { threshold: [0.35, 0.5, 0.75] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      if (dwellTimer) clearTimeout(dwellTimer);
    };
  }, [dismissed, isCvPage, showComment]);

  useEffect(() => {
    if (dismissed || !isCvPage) return;

    const elements = document.querySelectorAll<HTMLElement>("[data-orbo-cv]");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const sectionId = (entry.target as HTMLElement).dataset.orboCv;
          const role = cvRoleRef.current;
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
      },
      { threshold: 0.55 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      if (hireNudgeTimerRef.current !== null) {
        window.clearTimeout(hireNudgeTimerRef.current);
        hireNudgeTimerRef.current = null;
      }
    };
  }, [dismissed, isCvPage, showComment]);

  const requestComment = useCallback(
    async (sectionId: string) => {
      if (displayTimerRef.current) clearTimeout(displayTimerRef.current);
      orboSectionPipelineRef.current = true;
      const t0 = Date.now();
      setIsThinking(true);
      setOrbMood("thinking");
      setComment(null);
      setTooltipVisible(true);
      setSpeaking(true);

      try {
        const aiComment = await getAiComment(sectionId);
        const text = aiComment ?? getRandomComment(sectionId);
        const elapsed = Date.now() - t0;
        /* Нейросеть уже ответила — не тянуть «Думаю…» до 850 мс, иначе после быстрого API выглядит как два шага. */
        const minThink = aiComment != null ? 400 : ORBO_MIN_THINKING_MS;
        const pad = Math.max(0, minThink - elapsed);
        if (pad > 0) await new Promise((r) => setTimeout(r, pad));
        showComment(text, "neutral");
      } finally {
        orboSectionPipelineRef.current = false;
        orboSuppressAmbientUntilRef.current = Date.now() + 2200;
      }
    },
    [showComment],
  );

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
      lastSectionRef.current = sectionId;
      idleFiredRef.current = false;
      tapCountRef.current = 0;
      setOrbIdleDrowsy(false);

      void (async () => {
        try {
          await requestComment(sectionId);
        } finally {
          if (cancelled) return;
          queueTimer = setTimeout(() => {
            processing = false;
            processQueue();
          }, SECTION_QUEUE_GAP_MS);
        }
      })();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          if (seen.has(id)) continue;
          seen.add(id);
          queue.push(id);
        }
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
  }, [dismissed, isCvPage, requestComment]);

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
      }, IDLE_DELAY);
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
  }, [dismissed, showComment]);

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
  }, [dismissed, isCvPage, isMobile, showComment]);

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
  }, [dismissed, isCvPage, showComment]);

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

  /** Привет в hero: показываем пузырь даже если Орбо свернули — пользователь явно позвал. */
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
  }, [showComment]);

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
    }, TAP_COUNT_RESET_MS);

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
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* private mode */
    }
    const section = lastSectionRef.current;
    if (section) void requestComment(section);
  }, [requestComment]);

  if (!portalReady) {
    return null;
  }

  if (dismissed) {
    return createPortal(
      <div data-orbo className={ORBO_FLOAT_CLASS}>
        <motion.button
          animate={peekDismissed ? { y: [0, -6, 0] } : { y: 0 }}
          aria-label="Вернуть Орбо"
          className="focus-ring-accent group flex size-8 items-center justify-center rounded-full border border-accent/20 bg-surface/80 shadow-elevation-card backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-accent/40 hover:shadow-[0_0_12px_color-mix(in_srgb,var(--color-accent)_25%,transparent)]"
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
            onReplyBlur: () => scheduleHideBubble(DISPLAY_DURATION),
            onReplyFocus: () => scheduleHideBubble(HERO_GREETING_BUBBLE_REPLY_FOCUS_MS),
          }}
          onDismiss={dismiss}
        />
      </div>
    </div>,
    document.body,
  );
}
