/**
 * Ответ на приветствие в hero: только клиент, текст уходит в OpenRouter как промпт.
 * Лимиты снижают злоупотребления и размер промпта (prompt injection / стоимость).
 *
 * Распределённый спам и обход лимитов sessionStorage возможны: в кабинете OpenRouter
 * задайте лимиты расхода и ограничение ключа по HTTP-Referer (см. комментарий у ключа).
 */
export const HERO_GREETING_MAX_CHARS = 120;

/** Минимум осмысленной реплики после очистки. */
export const HERO_GREETING_MIN_CHARS = 2;

/** Между отправками с одной вкладки. */
export const HERO_GREETING_COOLDOWN_MS = 14_000;

/** Защита от двойного Enter / двойного клика до ре-рендера. */
export const HERO_GREETING_DOUBLE_SUBMIT_GUARD_MS = 220;

/** Окно подсчёта частых попыток отправки (даже с ошибками валидации). */
export const HERO_GREETING_FLOOD_WINDOW_MS = 12_000;

/** Сколько попыток за окно считаем флудом — без запроса к API. */
export const HERO_GREETING_FLOOD_THRESHOLD = 6;

/** Подряд один и тот же символ — типичный мусор / обход фильтров. */
export const HERO_GREETING_MAX_REPEATED_CHAR_RUN = 14;

/** Много ссылок в короткой реплике — спам; в промпт не пускаем. */
export const HERO_GREETING_MAX_HTTP_LINKS = 2;

/** Максимум успешных «диалогов» за сессию. */
export const HERO_GREETING_SESSION_MAX = 12;

/** Пока пользователь пишет ответ в пузыре Орбо — не гасить карточку через 6 с. */
export const HERO_GREETING_BUBBLE_REPLY_FOCUS_MS = 90_000;

export const HERO_GREETING_REPLY_MAX_CHARS = 260;

const SESSION_KEY = "per0w-hero-greet-count";

export function getHeroGreetingSessionCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    const n = parseInt(raw ?? "0", 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function bumpHeroGreetingSessionCount(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_KEY, String(getHeroGreetingSessionCount() + 1));
  } catch {
    /* приватный режим */
  }
}

/** Сообщения при слишком частых попытках отправки с одной вкладки. */
export const HERO_GREETING_FLOOD_MESSAGES = [
  "Слишком часто. Подождите немного и попробуйте снова.",
  "Орбо просит передышку между репликами — буквально несколько секунд.",
  "Кнопку не на стресс-тест: чуть медленнее, и всё получится.",
] as const;

/** Если OpenRouter недоступен — нейтральные шутки без персонализации. */
export const HERO_GREETING_ORBO_FALLBACKS = [
  "О, живой привет! Орбо фиксирует: вежливость на месте, можно листать дальше.",
  "Принято! Я бы ответил длиннее, но сеть решила, что и так сойдёт.",
  "Привет зачтён. Теперь ты официально не невидимка для этого сайта.",
  "Хороший заход. Орбо одобряет и предлагает не останавливаться на приветствии.",
] as const;
