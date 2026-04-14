export interface TagsProps {
  tags?: readonly string[];
  /** Компактные чипы для карусели проектов */
  size?: "default" | "sm";
}

export const Tags = ({ tags, size = "default" }: TagsProps) => {
  if (!tags?.length) return null;

  const chip = size === "sm" ? "px-2 py-0.5 text-[10px] leading-tight" : "px-3 py-1 text-xs";

  return (
    <ul
      aria-label="Теги"
      className={`mt-2 flex list-none flex-row flex-wrap p-0 ${size === "sm" ? "gap-1.5" : "gap-2"}`}
    >
      {tags.map((tag) => (
        <li key={tag}>
          <span
            className={`inline-block rounded-full border border-accent/20 bg-accent/10 font-medium text-accent dark:bg-accent/15 dark:text-accent-light ${chip}`}
          >
            #{tag}
          </span>
        </li>
      ))}
    </ul>
  );
};
