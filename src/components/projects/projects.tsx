import { SECTIONS_IDS } from "@/constants/common";
import { Card } from "@/ui/card/card";
import { Section } from "@/ui/section/section";

import projectImage from "./blog-post-preview.png";

const DEFAULT_PROJECTS = [{
  link: "https://github.com/per0w/blog",
  title: "Мой блог",
  description: "Моя личная страница",
  img_alt: "Превью сайта визитки",
  image: projectImage,
  tags: ["Next.JS", "Tailwind", "Typescript"],
}];

export const Projects = ({ projects = DEFAULT_PROJECTS }) => {
  return (
    <Section id={SECTIONS_IDS.projects} title="Посмотреть на код:">
      <div className="mb-10 flex w-full flex-col flex-wrap items-center md:flex-row">
        {projects.map((project) => (
          <Card
            key={project.title}
            url={project.link}
            title={project.title}
            description={project.description}
            alt={project.img_alt}
            tags={project.tags}
            image={project.image}
          />
        ))}
      </div>
    </Section>
  );
};
