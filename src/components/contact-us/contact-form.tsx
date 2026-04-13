"use client";

import { useId, useRef, useState } from "react";

import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, Send, X } from "lucide-react";

import { ORBO_CONTACT_SPAM_EVENT, PROFILE_EMAIL } from "@/constants/common";
import {
  CONTACT_FORM_CLIENT_COOLDOWN_MS,
  CONTACT_FORM_DOUBLE_SUBMIT_GUARD_MS,
  CONTACT_FORM_FLOOD_THRESHOLD,
  CONTACT_FORM_FLOOD_WINDOW_MS,
  CONTACT_FORM_LIMITS,
  CONTACT_FORM_ORBO_SPAM_COOLDOWN_MS,
  CONTACT_FORM_SESSION_MAX_SENDS,
  WEB3FORMS_SUBMIT_URL,
  bumpContactFormSessionSendCount,
  getContactFormSessionSendCount,
  getWeb3FormsAccessKey,
} from "@/constants/contact-form";
import { clampToLimits, normalizeEmailInput } from "@/utils/contact-form";

import { ContactFormAiAssist } from "./contact-form-ai-assist";

type FieldErrors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

type FormFeedback = { kind: "success" | "error"; text: string };

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/** Короткие реплики при «ддосе» кнопки — дублируют настроение Орбо. */
const FLOOD_BANTER = [
  "Орбо смотрит: ты чё, кнопку на стресс-тест берёшь?",
  "Кнопка «Отправить» не PDP-11. Одного нажатия обычно хватает.",
  "Мамкин хацкер? Тут даже своего бэкенда нет, только честный Web3Forms.",
  "Ты чё не нормальный, спамишь форму? У хозяина и так почта горит.",
  "Форма не казино, ставки не принимаются. Заполни поля и один раз — бац.",
  "Спокойствие. Соберись. Одна отправка — как один билет в цирк, не пачка.",
] as const;

function pickRandom(arr: readonly string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function normalizeLine(s: string) {
  return s.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

function validate(name: string, email: string, subject: string, message: string): FieldErrors {
  const e: FieldErrors = {};
  const n = normalizeLine(name);
  if (n.length < 2) {
    e.name = "Укажите имя (от 2 символов).";
  } else if (n.length > CONTACT_FORM_LIMITS.nameMax) {
    e.name = `Не длиннее ${CONTACT_FORM_LIMITS.nameMax} символов.`;
  }

  const em = email.trim();
  if (!em) e.email = "Укажите email.";
  else if (em.length > CONTACT_FORM_LIMITS.emailMax) e.email = "Слишком длинный email.";
  else if (!EMAIL_RE.test(em)) e.email = "Похоже на неверный формат email.";

  const sub = normalizeLine(subject);
  if (sub.length > CONTACT_FORM_LIMITS.subjectMax) {
    e.subject = `Тема не длиннее ${CONTACT_FORM_LIMITS.subjectMax} символов.`;
  }

  const msg = message.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  if (msg.length < CONTACT_FORM_LIMITS.messageMin) {
    e.message = `Сообщение от ${CONTACT_FORM_LIMITS.messageMin} символов.`;
  } else if (msg.length > CONTACT_FORM_LIMITS.messageMax) {
    e.message = `Не длиннее ${CONTACT_FORM_LIMITS.messageMax} символов.`;
  }

  return e;
}

export const ContactForm = () => {
  const reduceMotion = useReducedMotion();
  const accessKey = getWeb3FormsAccessKey();
  const formEnabled = Boolean(accessKey);

  const baseId = useId();
  const nameId = `${baseId}-name`;
  const emailId = `${baseId}-email`;
  const subjectId = `${baseId}-subject`;
  const messageId = `${baseId}-message`;
  const nameErrId = `${baseId}-err-name`;
  const emailErrId = `${baseId}-err-email`;
  const subjectErrId = `${baseId}-err-subject`;
  const messageErrId = `${baseId}-err-message`;
  const messageLenId = `${baseId}-msg-length`;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  /** Honeypot: заполняют боты — не отправляем и не показываем ошибку (тишина). */
  const [trapCompany, setTrapCompany] = useState("");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FormFeedback | null>(null);
  const [floodWarning, setFloodWarning] = useState<string | null>(null);

  const lastSubmitRef = useRef(0);
  const submitInFlightRef = useRef(false);
  const lastSubmitAttemptAtRef = useRef(0);
  const floodTimestampsRef = useRef<number[]>([]);
  const lastOrboFloodRef = useRef(0);

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (submitting || submitInFlightRef.current) return;

    const now = Date.now();
    if (now - lastSubmitAttemptAtRef.current < CONTACT_FORM_DOUBLE_SUBMIT_GUARD_MS) {
      return;
    }
    lastSubmitAttemptAtRef.current = now;

    setFeedback(null);

    if (trapCompany.trim() !== "") {
      return;
    }

    const floodSlice = floodTimestampsRef.current.filter(
      (t) => now - t < CONTACT_FORM_FLOOD_WINDOW_MS,
    );
    floodSlice.push(now);
    floodTimestampsRef.current = floodSlice;
    if (floodSlice.length >= CONTACT_FORM_FLOOD_THRESHOLD) {
      setFloodWarning(pickRandom(FLOOD_BANTER));
      if (now - lastOrboFloodRef.current >= CONTACT_FORM_ORBO_SPAM_COOLDOWN_MS) {
        lastOrboFloodRef.current = now;
        window.dispatchEvent(new CustomEvent(ORBO_CONTACT_SPAM_EVENT, { detail: {} }));
      }
    }

    const cleaned = clampToLimits(name, email, subject, message);
    if (
      cleaned.name !== name ||
      cleaned.email !== email ||
      cleaned.subject !== subject ||
      cleaned.message !== message
    ) {
      setName(cleaned.name);
      setEmail(cleaned.email);
      setSubject(cleaned.subject);
      setMessage(cleaned.message);
    }

    const v = validate(cleaned.name, cleaned.email, cleaned.subject, cleaned.message);
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    setErrors({});

    if (getContactFormSessionSendCount() >= CONTACT_FORM_SESSION_MAX_SENDS) {
      setFeedback({
        kind: "error",
        text: "С этой вкладки уже отправлено много сообщений. Откройте сайт заново или напишите на почту.",
      });
      return;
    }

    if (!formEnabled) {
      setFeedback({
        kind: "error",
        text: `Форма не настроена. Напишите на ${PROFILE_EMAIL} или используйте ссылки ниже.`,
      });
      return;
    }

    if (now - lastSubmitRef.current < CONTACT_FORM_CLIENT_COOLDOWN_MS) {
      setFeedback({ kind: "error", text: "Подождите несколько секунд перед повторной отправкой." });
      return;
    }

    submitInFlightRef.current = true;
    lastSubmitRef.current = now;
    setSubmitting(true);

    const payload = {
      access_key: accessKey,
      botcheck: false,
      subject: normalizeLine(cleaned.subject)
        ? `[per0w.space] ${normalizeLine(cleaned.subject)}`
        : `[per0w.space] Сообщение от ${normalizeLine(cleaned.name)}`,
      from_name: normalizeLine(cleaned.name),
      email: cleaned.email.trim(),
      message: cleaned.message.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim(),
    };

    try {
      const res = await fetch(WEB3FORMS_SUBMIT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: unknown = await res.json().catch(() => null);
      const ok =
        res.ok &&
        typeof data === "object" &&
        data !== null &&
        "success" in data &&
        (data as { success?: boolean }).success === true;

      if (ok) {
        bumpContactFormSessionSendCount();
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        setFloodWarning(null);
        setFeedback({ kind: "success", text: "Сообщение отправлено. Отвечу на указанный email." });
      } else {
        setFeedback({
          kind: "error",
          text: "Не удалось отправить. Попробуйте позже или напишите на почту.",
        });
      }
    } catch {
      setFeedback({
        kind: "error",
        text: "Сеть недоступна. Проверьте подключение или напишите на почту.",
      });
    } finally {
      submitInFlightRef.current = false;
      setSubmitting(false);
    }
  };

  const inputClass =
    "rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 shadow-sm outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-slate-400 focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-[var(--color-accent-light)]";

  return (
    <div className="mx-auto w-full max-w-2xl text-left">
      <motion.form
        noValidate
        aria-label="Форма обратной связи"
        className="relative rounded-2xl border border-white/40 bg-white/98 p-5 text-foreground shadow-2xl ring-1 shadow-black/20 ring-black/5 sm:p-6 dark:border-white/15 dark:bg-[var(--color-surface)] dark:ring-white/10"
        onSubmit={onSubmit}
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, y: 14 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.45, ease: "easeOut" as const },
            })}
      >
        <div className="mb-5 flex items-start justify-between gap-3 border-b border-slate-200 pb-4 dark:border-border">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-foreground">
              Связаться со мной
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-muted">
              Я получу письмо на{" "}
              <span className="font-medium text-slate-800 dark:text-foreground">
                {PROFILE_EMAIL}
              </span>{" "}
              и отвечу вам на указанный email.
            </p>
          </div>
          <ContactFormAiAssist
            disabled={submitting}
            draft={message}
            onApply={(text) => {
              setMessage(text);
              setErrors((prev) => ({ ...prev, message: undefined }));
            }}
          />
        </div>

        {!formEnabled ? (
          <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-950 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-100">
            Для отправки с сайта добавьте в{" "}
            <code className="rounded bg-slate-200 px-1 dark:bg-white/15">.env.local</code> ключ{" "}
            <code className="rounded bg-slate-200 px-1 dark:bg-white/15">
              NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
            </code>{" "}
            (см.{" "}
            <a
              className="text-[var(--color-accent)] underline decoration-[var(--color-accent)]/50 underline-offset-2 hover:decoration-[var(--color-accent)]"
              href="https://web3forms.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              web3forms.com
            </a>
            ). Пока можно написать на почту или в мессенджеры ниже.
          </p>
        ) : null}

        {floodWarning ? (
          <div
            className="contact-form-flood-banner mb-4 flex items-start gap-2 rounded-xl border border-fuchsia-500/45 bg-linear-to-r from-fuchsia-950/15 via-cyan-950/10 to-violet-950/15 px-3 py-2.5 text-sm text-slate-800 shadow-[0_0_24px_color-mix(in_srgb,var(--color-accent-secondary)_22%,transparent)] dark:border-fuchsia-400/35 dark:from-fuchsia-500/12 dark:via-cyan-500/8 dark:to-violet-500/12 dark:text-fuchsia-100/95"
            role="status"
          >
            <p className="min-w-0 flex-1 leading-snug">{floodWarning}</p>
            <button
              aria-label="Скрыть подсказку"
              className="shrink-0 rounded-md p-1 text-slate-500 transition-colors hover:bg-white/20 hover:text-slate-800 dark:text-fuchsia-200/80 dark:hover:text-white"
              type="button"
              onClick={() => setFloodWarning(null)}
            >
              <X aria-hidden className="size-4" />
            </button>
          </div>
        ) : null}

        {feedback ? (
          <p
            aria-live="polite"
            role="status"
            className={`mb-4 flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${
              feedback.kind === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-50"
                : "border-red-300 bg-red-50 text-red-900 dark:border-red-500/40 dark:bg-red-500/15 dark:text-red-50"
            }`}
          >
            {feedback.kind === "success" ? (
              <CheckCircle2 aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            {feedback.text}
          </p>
        ) : null}

        <div aria-hidden="true" className="contact-form-honeypot-text">
          <label htmlFor={`${baseId}-company`}>Компания</label>
          <input
            autoComplete="off"
            id={`${baseId}-company`}
            name="company_website"
            tabIndex={-1}
            type="text"
            value={trapCompany}
            onChange={(e) => setTrapCompany(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="min-w-0">
            <label
              className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-muted"
              htmlFor={nameId}
            >
              Имя
            </label>
            <input
              required
              aria-describedby={errors.name ? nameErrId : undefined}
              aria-invalid={Boolean(errors.name)}
              autoComplete="name"
              className={`${inputClass} w-full`}
              id={nameId}
              maxLength={CONTACT_FORM_LIMITS.nameMax}
              name="name"
              placeholder="Как к вам обращаться"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name ? (
              <p
                className="mt-1.5 text-xs text-red-600 dark:text-red-300"
                id={nameErrId}
                role="alert"
              >
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="min-w-0">
            <label
              className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-muted"
              htmlFor={emailId}
            >
              Email
            </label>
            <input
              required
              aria-describedby={errors.email ? emailErrId : undefined}
              aria-invalid={Boolean(errors.email)}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className={`${inputClass} w-full`}
              id={emailId}
              inputMode="email"
              maxLength={CONTACT_FORM_LIMITS.emailMax}
              name="email"
              placeholder="you@example.com"
              spellCheck={false}
              type="email"
              value={email}
              onBlur={() => setEmail((prev) => normalizeEmailInput(prev))}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email ? (
              <p
                className="mt-1.5 text-xs text-red-600 dark:text-red-300"
                id={emailErrId}
                role="alert"
              >
                {errors.email}
              </p>
            ) : null}
          </div>

          <div className="min-w-0 md:col-span-2">
            <label
              className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-muted"
              htmlFor={subjectId}
            >
              Тема{" "}
              <span className="font-normal text-slate-400 normal-case dark:text-muted">
                (необязательно)
              </span>
            </label>
            <input
              aria-describedby={errors.subject ? subjectErrId : undefined}
              aria-invalid={Boolean(errors.subject)}
              className={`${inputClass} w-full`}
              id={subjectId}
              maxLength={CONTACT_FORM_LIMITS.subjectMax}
              name="subject"
              placeholder="Например: вакансия, проект, консультация"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            {errors.subject ? (
              <p
                className="mt-1.5 text-xs text-red-600 dark:text-red-300"
                id={subjectErrId}
                role="alert"
              >
                {errors.subject}
              </p>
            ) : null}
          </div>

          <div className="relative min-w-0 md:col-span-2">
            <label
              className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-muted"
              htmlFor={messageId}
            >
              Сообщение
            </label>
            <textarea
              required
              aria-invalid={Boolean(errors.message)}
              className={`${inputClass} min-h-[112px] w-full resize-y md:min-h-[104px]`}
              id={messageId}
              maxLength={CONTACT_FORM_LIMITS.messageMax}
              name="message"
              placeholder="Кратко опишите задачу или вопрос"
              rows={4}
              spellCheck={true}
              value={message}
              aria-describedby={
                [messageLenId, errors.message ? messageErrId : null].filter(Boolean).join(" ") ||
                undefined
              }
              onChange={(e) => setMessage(e.target.value)}
            />
            <p
              className="mt-1 text-right font-mono text-[11px] text-slate-400 dark:text-muted"
              id={messageLenId}
            >
              {message.length}/{CONTACT_FORM_LIMITS.messageMax}
            </p>
            {errors.message ? (
              <p
                className="mt-1.5 text-xs text-red-600 dark:text-red-300"
                id={messageErrId}
                role="alert"
              >
                {errors.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <motion.button
            className="contact-form-submit-cyber group/submit inline-flex items-center justify-center gap-2 rounded-xl border-2 border-accent/60 bg-linear-to-r from-[var(--color-accent)] to-[var(--color-accent-secondary)] px-6 py-3 text-sm font-semibold text-white transition-[filter] disabled:cursor-not-allowed disabled:opacity-55"
            disabled={submitting}
            type="submit"
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          >
            <span className="relative z-10 inline-flex items-center gap-2">
              {submitting ? (
                <>
                  <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                  Отправка…
                </>
              ) : (
                <>
                  <Send
                    aria-hidden
                    className="h-4 w-4 transition-transform duration-300 group-hover/submit:translate-x-0.5 group-hover/submit:-translate-y-px"
                  />
                  Отправить
                </>
              )}
            </span>
          </motion.button>
          <a
            className="text-center text-sm text-slate-600 underline decoration-slate-300 underline-offset-2 transition-colors hover:text-[var(--color-accent)] hover:decoration-[var(--color-accent)] sm:text-right dark:text-muted dark:decoration-border dark:hover:text-accent"
            href={`mailto:${PROFILE_EMAIL}`}
          >
            Открыть почтовый клиент
          </a>
        </div>
      </motion.form>
    </div>
  );
};
