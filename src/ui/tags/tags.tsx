export interface TagsProps {
  tags?: string[];
}

export const Tags = ({ tags }: TagsProps) => {
  if (!tags?.length) return null;

  return (
    <div className="mt-2 flex flex-row flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-block rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-medium text-accent dark:bg-accent/15 dark:text-accent-light"
        >
          #{tag}
        </span>
      ))}
    </div>
  );
};
