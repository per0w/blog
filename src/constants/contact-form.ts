/**
 * Форма «Связаться»: отправка через Web3Forms (статический сайт без своего API).
 * Ключ создаётся на https://web3forms.com — в кабинете указать получателя per0w@yandex.ru.
 * NEXT_PUBLIC_* попадает в бандл; это не пароль от почты, а идентификатор формы на стороне сервиса.
 */
export const WEB3FORMS_SUBMIT_URL = "https://api.web3forms.com/submit" as const;

/** Модель Gemini для черновика письма (бесплатный tier — в Google AI Studio). */
export const CONTACT_FORM_GEMINI_MODEL = "gemini-2.0-flash" as const;

export const CONTACT_FORM_LIMITS = {
  nameMax: 120,
  emailMax: 254,
  subjectMax: 180,
  messageMin: 12,
  messageMax: 4000,
} as const;

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
 * Ключ Gemini в бандле — виден в DevTools. В Google Cloud задайте ограничения по referrer / IP.
 * Без ключа кнопка «AI» не показывается.
 */
export function getGeminiApiKey(): string {
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim() ?? "";
}
