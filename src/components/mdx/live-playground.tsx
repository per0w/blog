"use client";

import { useId, useState } from "react";

type LivePlaygroundProps = {
  /** URL встраивания: CodeSandbox Embed или StackBlitz с `embed=1` */
  src: string;
  /** Заголовок блока и `title` у iframe (доступность) */
  title?: string;
  /** Полная ссылка «открыть в редакторе» в новой вкладке */
  editorUrl?: string;
  /** Высота iframe, px */
  height?: number;
};

/**
 * Живой пример через внешнюю песочницу: iframe не грузится, пока читатель не нажмёт кнопку.
 * Так не платим LCP и десятки мегабайт JS на каждой странице заметки.
 */
export function LivePlayground({
  src,
  title = "Интерактивный пример кода",
  editorUrl,
  height = 480,
}: LivePlaygroundProps) {
  const [loaded, setLoaded] = useState(false);
  const hintId = useId();

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 text-sm">
        <span className="font-medium text-foreground">{title}</span>
        {editorUrl ? (
          <a
            className="shrink-0 text-accent underline-offset-2 transition-colors hover:underline"
            href={editorUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Открыть в редакторе ↗
          </a>
        ) : null}
      </figcaption>

      {!loaded ? (
        <div className="flex flex-col items-center justify-center gap-4 px-4 py-10">
          <p className="max-w-md text-center text-sm text-pretty text-muted" id={hintId}>
            Ниже подгрузится внешний редактор (CodeSandbox, StackBlitz и т.п.). Это отдельный сайт:
            пойдёт сетевой трафик и выполнение сторонних скриптов — только если вы согласны.
          </p>
          <button
            aria-describedby={hintId}
            className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-[opacity,transform] hover:opacity-95 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)] focus-visible:outline-none active:scale-[0.99] dark:focus-visible:ring-offset-[var(--color-surface)]"
            type="button"
            onClick={() => setLoaded(true)}
          >
            Показать живой пример
          </button>
        </div>
      ) : (
        <iframe
          allow="fullscreen"
          className="block w-full bg-[var(--color-background)]"
          height={height}
          loading="lazy"
          // Минимум, который обычно нужен песочницам для превью и запуска
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-downloads"
          src={src}
          title={title}
        />
      )}
    </figure>
  );
}
