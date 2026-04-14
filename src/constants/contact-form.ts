/**
 * Форма «Связаться»: отправка через Web3Forms (статический сайт без своего API).
 * Ключ создаётся на https://web3forms.com — в кабинете указать получателя per0w@yandex.ru.
 * NEXT_PUBLIC_* попадает в бандл; это не пароль от почты, а идентификатор формы на стороне сервиса.
 */
export const WEB3FORMS_SUBMIT_URL = "https://api.web3forms.com/submit" as const;

/** Chat Completions API OpenRouter (OpenAI-совместимый). */
export const CONTACT_FORM_OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions" as const;

/**
 * Несколько `:free` моделей с разными провайдерами: при 429 клиент перебирает список,
 * пока не задан явный `NEXT_PUBLIC_OPENROUTER_MODEL`. Порядок — сначала менее «забитые» upstream
 * (Google Gemma часто в 429 — ниже в списке).
 */
export const CONTACT_FORM_OPENROUTER_FREE_FALLBACK_MODELS = [
  "openai/gpt-oss-120b:free",
  "liquid/lfm-2.5-1.2b-instruct:free",
  "z-ai/glm-4.5-air:free",
] as const;

/** Первая из цепочки — для документации и `getOpenRouterModel()`. */
export const CONTACT_FORM_OPENROUTER_MODEL_DEFAULT =
  CONTACT_FORM_OPENROUTER_FREE_FALLBACK_MODELS[0];

/**
 * Орбо использует ту же цепочку `getOpenRouterModelsToTry()`, но с лимитом попыток и паузой —
 * иначе при скролле уходит пачка запросов к OpenRouter (см. `maxFallbackAttempts` в клиенте).
 */
/** Три разных провайдера подряд — чаще обходим 429 на первых free-моделях. */
export const ORBO_OPENROUTER_MAX_FALLBACK_ATTEMPTS = 3;

/**
 * Минимальный интервал между **стартами** запросов OpenRouter из Орбо (мс).
 * Должен быть меньше паузы между секциями в `ai-buddy` (~8800 мс после ответа),
 * иначе вторая и следующие секции почти всегда получают заготовку без API.
 */
export const ORBO_OPENROUTER_COOLDOWN_MS = 3_500;

export const CONTACT_FORM_LIMITS = {
  nameMax: 120,
  emailMax: 254,
  /** Ник, @username или ссылка на профиль (не email). */
  contactDetailMax: 500,
  subjectMax: 180,
  messageMin: 12,
  messageMax: 4000,
} as const;

/** Способ обратной связи: уходит в письмо как отдельное поле (Web3Forms). */
export const CONTACT_FORM_CHANNEL_IDS = ["email", "telegram", "max", "vk", "github"] as const;

export type ContactFormChannelId = (typeof CONTACT_FORM_CHANNEL_IDS)[number];

export const CONTACT_FORM_CHANNELS: ReadonlyArray<{
  id: ContactFormChannelId;
  label: string;
}> = [
  { id: "email", label: "Почта" },
  { id: "telegram", label: "Telegram" },
  { id: "max", label: "MAX" },
  { id: "vk", label: "ВКонтакте" },
  { id: "github", label: "GitHub" },
];

/** Минимальный интервал между успешными попытками POST с одной вкладки. */
export const CONTACT_FORM_CLIENT_COOLDOWN_MS = 8_000;

/**
 * Игнорировать второй submit с тем же формой в коротком окне (двойной Enter / двойной клик до ре-рендера).
 */
export const CONTACT_FORM_DOUBLE_SUBMIT_GUARD_MS = 180;

/** Окно для подсчёта «панического» жмаканья отправки. */
export const CONTACT_FORM_FLOOD_WINDOW_MS = 14_000;

/** Сколько попыток отправки за окно считаем флудом (валидация может ругаться — всё равно считаем). */
export const CONTACT_FORM_FLOOD_THRESHOLD = 5;

/** Не дёргать Орбо чаще, даже если табун кликов. */
export const CONTACT_FORM_ORBO_SPAM_COOLDOWN_MS = 12_000;

/** Максимум успешных отправок за сессию браузера (sessionStorage). */
export const CONTACT_FORM_SESSION_MAX_SENDS = 8;

const SESSION_SEND_COUNT_KEY = "per0w-contact-form-ok-count";

export function getContactFormSessionSendCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = sessionStorage.getItem(SESSION_SEND_COUNT_KEY);
    const n = parseInt(raw ?? "0", 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function bumpContactFormSessionSendCount(): void {
  if (typeof window === "undefined") return;
  try {
    const next = getContactFormSessionSendCount() + 1;
    sessionStorage.setItem(SESSION_SEND_COUNT_KEY, String(next));
  } catch {
    /* приватный режим / запрет storage */
  }
}

export function getWeb3FormsAccessKey(): string {
  return process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim() ?? "";
}

/**
 * Ключ OpenRouter в бандле — виден в DevTools. В кабинете OpenRouter ограничьте ключ по referrer / лимитам.
 * Без ключа кнопка «AI» не показывается.
 */
export function getOpenRouterApiKey(): string {
  return process.env.NEXT_PUBLIC_OPENROUTER_API_KEY?.trim() ?? "";
}

/** Одна модель из env или первая из бесплатной цепочки. */
export function getOpenRouterModel(): string {
  const models = getOpenRouterModelsToTry();
  return models[0] ?? CONTACT_FORM_OPENROUTER_MODEL_DEFAULT;
}

/**
 * Список моделей для запроса: либо только из `NEXT_PUBLIC_OPENROUTER_MODEL`,
 * либо вся цепочка `CONTACT_FORM_OPENROUTER_FREE_FALLBACK_MODELS` (перебор при 429).
 */
export function getOpenRouterModelsToTry(): readonly string[] {
  const manual = process.env.NEXT_PUBLIC_OPENROUTER_MODEL?.trim();
  if (manual && manual.length > 0) return [manual];
  return [...CONTACT_FORM_OPENROUTER_FREE_FALLBACK_MODELS];
}
