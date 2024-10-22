import { SECTIONS_IDS } from "@/constants/common";
import { Card } from "@/ui/card/card";
import { Section } from "@/ui/section/section";

const DEFAULT_PROJECTS = Array(3).fill({
  link: "#",
  title: "Project title",
  description: "Project description",
  img_alt: "project image alt text",
  tags: ["React", "CSS", "Typescript"],
});

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
          />
        ))}
      </div>
    </Section>
  );
};
