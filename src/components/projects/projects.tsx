import { SECTIONS_IDS } from "@/constants/common";
import type { ProjectCardSlide } from "@/ui/project-card-media/project-card-media";
import { Section } from "@/ui/section/section";

import { ImpactProjectCard } from "./impact-project-card";
import { OpenProjectShowcase } from "./open-project-showcase";
import { ProjectsCarousel } from "./projects-carousel";

const IMPACT_PROJECTS = [
  {
    emoji: "📊",
    title: "EdTech-платформа для сотен тысяч пользователей",
    problem:
      "Расписание, оценки, домашние задания и контроль знаний в одном кроссплатформенном продукте с высокой нагрузкой.",
    stack: ["React Native", "TypeScript", "RxJS", "MobX", "iOS", "Android", "Web"],
    role: "Tech Lead & Frontend. Возглавлял разработку кросс-платформенного продукта: проектировал архитектуру общей кодовой базы iOS/Android/Web, принимал технические решения и менторил команду.",
  },
  {
    emoji: "🛍️",
    title: "E-commerce для рынка США с миллионами сессий",
    problem:
      "Высоконагруженная витрина и оформление заказа: конверсия, доверие к чек-ауту и стабильные Core Web Vitals в продакшене.",
    stack: ["React", "SSR", "Redux", "PayPal", "Klarna", "Apple Pay", "Performance"],
    role: "Tech Lead & Frontend. Отвечал за frontend-архитектуру и результат: платёжный флоу с PayPal/Klarna и Core Web Vitals в продакшене с миллионами сессий.",
  },
  {
    emoji: "🏦",
    title: "Микрофронтенды и клиентские сценарии в финтехе",
    problem:
      "Лендинги, подписание документов квалифицированной электронной подписью и динамические формы без ручной вёрстки под каждый запуск.",
    stack: ["React", "Module Federation", "Micro-frontends", "TypeScript", "CI/CD"],
    role: "Tech Lead & Frontend. Спроектировал микрофронтенд-архитектуру с нуля: Module Federation, автономный CI/CD на модуль, конструктор форм и интеграция с КЭП без ручной вёрстки под каждый сценарий.",
  },
] as const;

const TRENIKA_SLIDES: ProjectCardSlide[] = [
  {
    src: "/images/projects/trenika.png",
    alt: "Trenika — лендинг и превью приложения-дневника тренировок",
  },
];

/**
 * Мобилка: ширина слайда = ширина трека (flex-basis 100%), иначе calc(100vw−…) шире ленты
 * из‑за стрелок и вложенных px — карточки выглядели обрезанными.
 * sm+: фиксированная ширина как у карточек карусели.
 */
const impactSlideClass =
  "w-full min-w-0 max-w-full shrink-0 grow-0 basis-full snap-start sm:w-72 sm:max-w-none sm:basis-72";

const openProjectSlideClass =
  "w-full min-w-0 max-w-full shrink-0 grow-0 basis-full snap-start sm:w-80 sm:max-w-none sm:basis-80";

const OPEN_PROJECTS: Array<{
  title: string;
  summary: string;
  motivation: string;
  tags: string[];
  slides: ProjectCardSlide[];
  demoUrl: string;
  sourceLabel?: string;
}> = [
  {
    title: "Trenika",
    summary: "PWA-дневник тренировок: планы, подходы, замеры, offline-first и свой бэкенд.",
    motivation:
      "Нужен был один инструмент под план тренировок, офлайн в зале и синхронизацию между устройствами — без чужих подписок и ограничений.",
    tags: ["React", "TypeScript", "Fastify", "Prisma", "PWA", "Tailwind", "Docker"],
    slides: TRENIKA_SLIDES,
    demoUrl: "https://trenika.space",
    sourceLabel: "GitHub автора",
  },
];

export const Projects = () => {
  return (
    <Section id={SECTIONS_IDS.projects} title="Проекты">
      <div className="w-full max-w-5xl px-3 sm:px-4">
        <p className="mx-auto mb-8 max-w-3xl text-center text-sm leading-relaxed text-muted sm:text-base">
          В коммерции большинство проектов заказчики предпочитают сохранять анонимность из‑за NDA.
          Ниже — лишь часть направлений.
        </p>

        <h3 className="mb-3 w-full text-center text-lg font-bold text-foreground sm:text-xl">
          Коммерческий опыт
        </h3>

        <div className="mb-14 flex justify-center">
          <ProjectsCarousel
            ariaLabel="Коммерческий опыт: карточки без брендов и NDA"
            helperText="Масштаб, стек и роль — листайте свайпом или стрелками; новые проекты не удлиняют страницу."
            itemCount={IMPACT_PROJECTS.length}
          >
            {IMPACT_PROJECTS.map((p) => (
              <div key={p.title} className={impactSlideClass}>
                <ImpactProjectCard {...p} />
              </div>
            ))}
          </ProjectsCarousel>
        </div>

        <h3 className="mb-3 w-full text-center text-lg font-bold text-foreground sm:text-xl">
          Открытые проекты
        </h3>

        <div className="flex justify-center">
          <ProjectsCarousel
            ariaLabel="Открытые проекты с демо и ссылками на код"
            helperText="Смысл, стек, живое демо и репозиторий — листайте карточки, чтобы не копить блоки по вертикали."
            itemCount={OPEN_PROJECTS.length}
          >
            {OPEN_PROJECTS.map((p) => (
              <div key={p.title} className={openProjectSlideClass}>
                <OpenProjectShowcase variant="carousel" {...p} />
              </div>
            ))}
          </ProjectsCarousel>
        </div>
      </div>
    </Section>
  );
};
