"use client";

import { useEffect } from "react";

import { usePathname } from "next/navigation";

/**
 * Next.js Link при переходе на тот же pathname с другим hash не вызывает hashchange
 * и не прокручивает к элементу — типичная проблема на статическом экспорте (GitHub Pages + basePath).
 * Перехватываем такие клики и синхронизируем scroll + history вручную.
 */

/** Sticky header h-16 (64px) + небольшой зазор под фокус/тень секции */
const HEADER_SCROLL_OFFSET_PX = 72;

export function scrollToSectionById(id: string) {
  const el = document.getElementById(id);
  if (!el) {
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_SCROLL_OFFSET_PX;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

function normalizePath(path: string) {
  const t = path.replace(/\/$/, "");
  return t === "" ? "/" : t;
}

export function HashNavigation() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      return;
    }
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => scrollToSectionById(hash));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [pathname]);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        requestAnimationFrame(() => scrollToSectionById(hash));
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const onClickCapture = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a?.href) {
        return;
      }
      let url: URL;
      try {
        url = new URL(a.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) {
        return;
      }
      const hash = url.hash.slice(1);
      if (!hash) {
        return;
      }
      const here = normalizePath(window.location.pathname);
      const there = normalizePath(url.pathname);
      if (here !== there) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      const next = `${url.pathname}${url.search}#${hash}`;
      window.history.pushState(null, "", next);
      scrollToSectionById(hash);
    };

    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, []);

  return null;
}
