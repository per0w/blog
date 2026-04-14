import { CONTACT_FORM_LIMITS } from "@/constants/contact-form";

/** Удаляем управляющие символы — мусор для почты и потенциальные сюрпризы в JSON. */
const CTRL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/**
 * Нормализует переносы строк и обрезает по лимиту после очистки.
 * Не «лечит» HTML: поля и так уходят как текст; XSS — на стороне клиента почты.
 */
export function sanitizeContactText(value: string, maxLen: number): string {
  const withNl = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return withNl.replace(CTRL_RE, "").slice(0, maxLen);
}

export function normalizeEmailInput(raw: string): string {
  const t = raw.trim();
  const at = t.lastIndexOf("@");
  if (at <= 0) return t;
  const local = t.slice(0, at);
  const domain = t.slice(at + 1).toLowerCase();
  return `${local}@${domain}`;
}

export function clampToLimits(
  name: string,
  contactDetail: string,
  subject: string,
  message: string,
  channelIsEmail: boolean,
): { name: string; contactDetail: string; subject: string; message: string } {
  const rawDetail = sanitizeContactText(
    contactDetail,
    channelIsEmail ? CONTACT_FORM_LIMITS.emailMax : CONTACT_FORM_LIMITS.contactDetailMax,
  ).trim();
  const detail = channelIsEmail ? normalizeEmailInput(rawDetail) : rawDetail;
  return {
    name: sanitizeContactText(name, CONTACT_FORM_LIMITS.nameMax).trim(),
    contactDetail: detail,
    subject: sanitizeContactText(subject, CONTACT_FORM_LIMITS.subjectMax).trim(),
    message: sanitizeContactText(message, CONTACT_FORM_LIMITS.messageMax).trim(),
  };
}
