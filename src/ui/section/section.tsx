import { ReactElement } from "react";

type SectionProps = {
  id: string;
  children: ReactElement | ReactElement[];
  title?: string;
};

export const Section = ({ id, children, title }: SectionProps) => {
  return (
    <section
      id={id}
      className="mb-10 flex flex-col items-center justify-center md:mb-24"
    >
      {title && (
        <h2 className="font-monospace text-2xl lg:text-4xl py-4">{title}</h2>
      )}
      {children}
    </section>
  );
};
