import { SECTIONS_IDS } from "@/constants/common";
import { Card } from "@/ui/card/card";
import { Section } from "@/ui/section/section";

const PROJECTS = [
  {
    link: "https://trenika.space",
    title: "Trenika",
    description:
      "PWA-дневник тренировок. Планирование, логирование подходов, замеры тела, offline-first синхронизация. Полный стек: дизайн → фронт → бэкенд → деплой.",
    img_alt: "Trenika — дневник тренировок",
    tags: ["React", "TypeScript", "Fastify", "Prisma", "PWA", "Tailwind", "Docker"],
    image: "/images/projects/trenika.png",
  },
  {
    link: "https://cosysoft.org/portfolio/lms-digital-diary",
    title: "МЭШ — Электронный дневник",
    description:
      "Электронный дневник Московской электронной школы для миллионов учеников и родителей. Расписание, оценки, домашние задания, посещаемость, тестирование — кроссплатформенно из одной кодовой базы.",
    img_alt: "МЭШ — электронный дневник",
    tags: ["React Native", "RxJS", "TypeScript", "MobX", "iOS", "Android", "Web"],
    image: "/images/projects/mesh.png",
  },
  {
    link: "https://www.glassesusa.com",
    title: "GlassesUSA",
    description:
      "E-commerce платформа для крупнейшего онлайн-ритейлера очков в США. SSR, интеграция PayPal/Klarna/Apple Pay, оптимизация конверсии.",
    img_alt: "GlassesUSA — e-commerce",
    tags: ["React", "SSR", "Redux", "PayPal", "Klarna", "Performance"],
    image: "/images/projects/glassesusa.png",
  },
];

export const Projects = () => {
  return (
    <Section id={SECTIONS_IDS.projects} title="Проекты">
      <div className="mb-10 flex w-full flex-wrap justify-center">
        {PROJECTS.map((project) => (
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
