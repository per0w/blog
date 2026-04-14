const ORBO_DEBUG_KEY = "orbo:debug";

function isOrboDebugEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ORBO_DEBUG_KEY) === "1";
}

/**
 * Локальный debug для Орбо: включается только вручную через localStorage.
 * Пример:
 * localStorage.setItem("orbo:debug", "1")
 */
export function logOrboDebug(message: string, meta?: Record<string, unknown>) {
  if (!isOrboDebugEnabled()) return;
  if (meta) {
    console.info(`[Orbo] ${message}`, meta);
    return;
  }
  console.info(`[Orbo] ${message}`);
}
