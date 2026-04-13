/** Якорь для skip-link и программного фокуса основного содержимого страницы. */
export const MAIN_CONTENT_ID = "main-content";

/**
 * Публичный базовый URL (origin или origin + basePath), без завершающего слэша.
 * Оферты, OG: `${SITE_ORIGIN}/…`. Для деплоя под префиксом (GitHub Pages) задайте полный префикс,
 * например `https://user.github.io/blog`.
 */
export const SITE_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "") || "https://per0w.space";

/** Hostname для текстов метаданных при кривом `NEXT_PUBLIC_SITE_URL`. */
export function getSiteHostname(): string {
  try {
    return new URL(SITE_ORIGIN).hostname;
  } catch {
    return "per0w.space";
  }
}

export const SECTIONS_IDS = {
  hero: "hero",
  about: "about",
  experience: "experience",
  projects: "projects",
  services: "services",
  mentorship: "mentorship",
  lastArticles: "lastArticles",
  contactUs: "contactUs",
};

/** Событие для Орбо: наведение на контакт MAX (шутка в пузыре) */
export const ORBO_MAX_HOVER_EVENT = "orbo:max-hover";

/** Орбо реагирует на «ддос» кнопки отправки формы контактов */
export const ORBO_CONTACT_SPAM_EVENT = "orbo:contact-spam";

/** Пасхалки в опыте: Орбо подсказывает, сколько кликов осталось до открытия */
export const ORBO_EASTER_EGG_HINT_EVENT = "orbo:easter-egg-hint";

/** Переключение ролевого режима Орбо на CV-странице */
export const ORBO_CV_ROLE_CHANGE_EVENT = "orbo:cv-role-change";

export const CV_READER_ROLES = {
  hr: "hr",
  frontendLead: "frontendLead",
  cto: "cto",
} as const;

export type CvReaderRole = (typeof CV_READER_ROLES)[keyof typeof CV_READER_ROLES];

/** Публичный профиль в мессенджере MAX */
export const MAX_MESSENGER_PROFILE_URL =
  "https://max.ru/u/f9LHodD0cOL7i5NSja9oJ3w-HkovyYoLppvRvtqOwaV01IvQnpd6FVFEACM";

/** Публичные контакты (шапка, CV, футер) */
export const PROFILE_EMAIL = "per0w@yandex.ru";
export const PROFILE_TELEGRAM_URL = "https://t.me/per0w/";
export const PROFILE_GITHUB_URL = "https://github.com/per0w";
export const PROFILE_VK_URL = "https://vk.com/per0w";
