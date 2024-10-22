export interface PropsTags {
  tags?: string[];
}

export const Tags = ({ tags }: PropsTags) => {
  return (
    tags && (
      <div className="mt-2 flex w-2/3 flex-row flex-wrap justify-between">
        {tags.map((tag) => (
          <span key={tag} className="inline-block rounded py-2 text-xs text-black  lg:py-1">
            #{tag}
          </span>
        ))}
      </div>
    )
  );
};
