/**
 * Один активный запрос OpenRouter для Орбо: параллельные вызовы не встают в хвост промисов,
 * а сразу получают null — дальше сработает Chrome AI или локальный fallback.
 */
let orboOpenRouterLocked = false;

export async function withOrboOpenRouterSlot<T>(fn: () => Promise<T | null>): Promise<T | null> {
  if (orboOpenRouterLocked) {
    return null;
  }
  orboOpenRouterLocked = true;
  try {
    return await fn();
  } finally {
    orboOpenRouterLocked = false;
  }
}
