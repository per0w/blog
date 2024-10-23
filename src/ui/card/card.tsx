import Image, { StaticImageData } from "next/image";

import { Tags } from "../tags/tags";

interface Props {
  url?: string;
  alt?: string;
  title?: string;
  description: string;
  tags: string[];
  children?: HTMLElement | HTMLElement[];
  image: StaticImageData;
}

export const Card = ({ url, alt = "", description, title, tags, image }: Props) => {
  return (
    <section className="w-full p-4 md:w-1/2 lg:w-1/3">
      <article

        className="rounded-xl bg-white p-3 shadow-lg duration-100 hover:scale-105 hover:transform hover:shadow-xl"
      >
        <a href={url} aria-label="link to project" target="_blank">
          <div className="relative flex items-end overflow-hidden rounded-xl">
            <Image
              src={image}
              alt={alt}
              width={400}
              height={400}
              loading="eager"
            />
          </div>
          <div className="mt-1 p-2">
            <h3 className="text-xl text-orange lg:text-2xl">{title}</h3>
            <p className="text-s text-black">{description}</p>
            <Tags tags={tags} />
          </div>
        </a>
      </article>
    </section>
  );
};
