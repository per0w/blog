/**
 * Декоративная иллюстрация для карточки поста: палитра и «HUD» в духе hero-секции.
 * Только var(--color-*), без градиентных id — безопасно при нескольких карточках на странице.
 */
export function BlogPostPreviewArt({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Мягкое свечение фона */}
      <circle
        cx="52"
        cy="48"
        fill="color-mix(in srgb, var(--color-accent) 14%, transparent)"
        r="38"
      />
      <circle
        cx="52"
        cy="48"
        fill="none"
        opacity="0.45"
        r="34"
        stroke="var(--color-accent-light)"
        strokeWidth="0.6"
      />
      <circle
        cx="52"
        cy="48"
        fill="none"
        opacity="0.3"
        r="28"
        stroke="var(--color-accent-secondary)"
        strokeWidth="0.5"
      />

      {/* «Лист» статьи */}
      <rect
        fill="color-mix(in srgb, var(--color-surface) 88%, transparent)"
        height="58"
        rx="5"
        stroke="var(--color-accent)"
        strokeWidth="1.4"
        width="44"
        x="18"
        y="22"
      />
      <line
        opacity="0.55"
        stroke="var(--color-accent-secondary)"
        strokeLinecap="round"
        strokeWidth="1.8"
        x1="26"
        x2="54"
        y1="34"
        y2="34"
      />
      <line
        opacity="0.4"
        stroke="var(--color-muted)"
        strokeLinecap="round"
        strokeWidth="1.2"
        x1="26"
        x2="50"
        y1="44"
        y2="44"
      />
      <line
        opacity="0.4"
        stroke="var(--color-muted)"
        strokeLinecap="round"
        strokeWidth="1.2"
        x1="26"
        x2="46"
        y1="54"
        y2="54"
      />
      <line
        opacity="0.35"
        stroke="var(--color-muted)"
        strokeLinecap="round"
        strokeWidth="1.2"
        x1="26"
        x2="52"
        y1="64"
        y2="64"
      />

      {/* Акцент: «узел» как в схемах */}
      <circle
        cx="74"
        cy="58"
        fill="color-mix(in srgb, var(--color-accent-secondary) 22%, transparent)"
        r="10"
        stroke="var(--color-accent-secondary)"
        strokeWidth="1.2"
      />
      <path
        d="M 62 48 L 74 58 L 62 68"
        fill="none"
        opacity="0.7"
        stroke="var(--color-accent-light)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
    </svg>
  );
}
