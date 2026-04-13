import { SECTIONS_IDS } from "@/constants/common";
import { Card } from "@/ui/card/card";
import type { ProjectCardSlide } from "@/ui/project-card-media/project-card-media";
import { Section } from "@/ui/section/section";

import { ProjectsCarousel } from "./projects-carousel";

type ProjectSlideInput = {
  src: ProjectCardSlide["src"];
  alt?: string;
};

type ProjectEntry = {
  link: string;
  title: string;
  description: string;
  /** Суть в 1–2 строки для быстрого сканирования (эйчары) */
  hook: string;
  tags: string[];
  /** Alt по умолчанию для слайдов без своего alt */
  img_alt: string;
  slides: ProjectSlideInput[];
  imageClassName?: string;
};

function toSlides(project: ProjectEntry): ProjectCardSlide[] {
  return project.slides.map((s) => ({
    src: s.src,
    alt: s.alt ?? project.img_alt,
  }));
}

const PROJECTS: ProjectEntry[] = [
  {
    link: "https://neyron163.github.io/service24/dashboard",
    title: "Сервис24 — мобильные акты",
    hook: "PWA для полевых сервис-инженеров: акты, синхронизация с 1С, офлайн-очередь, Ionic/React.",
    description:
      "В разработке: PWA для сервисных инженеров ООО «Сервис24» — многошаговое оформление актов выполненных работ (контрагент, техника, моточасы, комментарии), синхронизация с 1С, офлайн-очередь документов и работа без сети в заданном окне. Быстрые действия, журнал, запчасти. Демо-интерфейс на GitHub Pages.",
    img_alt: "Сервис24 — интерфейс приложения",
    tags: ["React", "TypeScript", "Ionic", "Vite", "TanStack Query", "Dexie", "PWA"],
    slides: [
      {
        src: "/images/projects/service24-dashboard.png",
        alt: "Сервис24 — главный экран: синхронизация с 1С и быстрые действия",
      },
      {
        src: "/images/projects/service24-acts.png",
        alt: "Сервис24 — мастер оформления нового акта",
      },
    ],
    imageClassName: "object-top",
  },
  {
    link: "https://trenika.space",
    title: "Trenika",
    hook: "PWA-дневник тренировок: офлайн-first, свой бэкенд (Fastify, Prisma), полный цикл от дизайна до Docker.",
    description:
      "PWA-дневник тренировок. Планирование, логирование подходов, замеры тела, offline-first синхронизация. Полный стек: дизайн → фронт → бэкенд → деплой.",
    img_alt: "Trenika — дневник тренировок",
    tags: ["React", "TypeScript", "Fastify", "Prisma", "PWA", "Tailwind", "Docker"],
    slides: [{ src: "/images/projects/trenika.png" }],
  },
  {
    link: "https://cosysoft.org/portfolio/lms-digital-diary",
    title: "МЭШ — Электронный дневник",
    hook: "Масштаб: миллионы пользователей. React Native + RxJS, одна кодовая база — iOS, Android, Web.",
    description:
      "Электронный дневник Московской электронной школы для миллионов учеников и родителей. Расписание, оценки, домашние задания, посещаемость, тестирование — кроссплатформенно из одной кодовой базы.",
    img_alt: "МЭШ — электронный дневник",
    tags: ["React Native", "RxJS", "TypeScript", "MobX", "iOS", "Android", "Web"],
    slides: [{ src: "/images/projects/mesh.png" }],
  },
  {
    link: "https://www.glassesusa.com",
    title: "GlassesUSA",
    hook: "E-commerce США: React, SSR, платежи PayPal / Klarna / Apple Pay, упор на конверсию и Core Web Vitals.",
    description:
      "E-commerce платформа для крупнейшего онлайн-ритейлера очков в США. SSR, интеграция PayPal/Klarna/Apple Pay, оптимизация конверсии.",
    img_alt: "GlassesUSA — e-commerce",
    tags: ["React", "SSR", "Redux", "PayPal", "Klarna", "Performance"],
    slides: [{ src: "/images/projects/glassesusa.png" }],
  },
];

export const Projects = () => {
  return (
    <Section id={SECTIONS_IDS.projects} title="Проекты">
      <ProjectsCarousel itemCount={PROJECTS.length}>
        {PROJECTS.map((project) => (
          <Card
            key={project.title}
            description={project.description}
            hook={project.hook}
            imageClassName={project.imageClassName}
            slides={toSlides(project)}
            tags={project.tags}
            title={project.title}
            url={project.link}
            variant="carousel"
          />
        ))}
      </ProjectsCarousel>
    </Section>
  );
};
