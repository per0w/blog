import { useEffect, type Dispatch, type SetStateAction } from "react";

/** Лёгкий наклон аватора за курсором (только десктоп, виджет развёрнут). */
export function useOrboLean(
  dismissed: boolean,
  isMobile: boolean,
  setLean: Dispatch<SetStateAction<{ x: number; y: number }>>,
) {
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
  }, [dismissed, isMobile, setLean]);
}
