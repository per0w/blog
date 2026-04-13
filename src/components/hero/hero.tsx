"use client";

import { Exo_2 } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight, FileText, Layers, Rocket, Target, Users } from "lucide-react";

import { SECTIONS_IDS } from "@/constants/common";
import { ScrambleRevealText } from "@/ui/scramble-reveal/scramble-reveal";

import { AvatarFrame } from "./avatar-frame";
import photo from "./photo-main.png";

/** Дисплейный шрифт с кириллицей — «игровой» HUD, без смены палитры сайта */
const heroDisplay = Exo_2({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["700", "800"],
  display: "swap",
});

const USP_ITEMS = [
  {
    icon: Rocket,
    title: "Полная автономность",
    description: "От идеи до продакшена, включая найм команды и процессы",
  },
  {
    icon: Layers,
    title: "Любой стек",
    description: "Фронтенд, бэкенд, DevOps, инфраструктура — полный цикл IT",
  },
  {
    icon: Users,
    title: "Управление командами",
    description: "Лидерство, менторинг, выстраивание процессов с нуля",
  },
  {
    icon: Target,
    title: "Бизнес-фокус",
    description: "Не просто код, а решение задач бизнеса под ключ",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export const Hero = () => {
  return (
    <section
      className="relative flex min-h-[85vh] items-center justify-center overflow-hidden py-16 md:py-24"
      id={SECTIONS_IDS.hero}
    >
      {/* Мягкие неон-пятна за контентом hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,color-mix(in_srgb,var(--color-accent)_18%,transparent),transparent_55%),radial-gradient(ellipse_60%_40%_at_100%_50%,color-mix(in_srgb,var(--color-accent-secondary)_12%,transparent),transparent_50%),radial-gradient(ellipse_50%_35%_at_0%_80%,color-mix(in_srgb,var(--color-accent-light)_10%,transparent),transparent_45%)]"
      />

      <div className="mx-auto flex max-w-screen-xl flex-col-reverse items-center gap-8 px-4 sm:px-6 md:flex-row md:items-center md:gap-12 lg:gap-14">
        <motion.div
          animate="visible"
          className="flex flex-col items-center text-center md:flex-1 md:items-start md:text-left"
          initial="hidden"
          variants={containerVariants}
        >
          <motion.p
            className="text-sm font-semibold tracking-[0.2em] text-accent-secondary uppercase"
            variants={itemVariants}
          >
            Привет! Меня зовут
          </motion.p>

          <motion.h1
            className={`mt-3 w-full text-center text-5xl font-extrabold tracking-[0.04em] sm:text-6xl md:w-auto md:text-left lg:text-7xl ${heroDisplay.className}`}
            variants={itemVariants}
          >
            <span className="hero-cyber-title-wrap">
              <span aria-hidden className="hero-cyber-hud" />
              <span aria-hidden className="hero-cyber-title-r">
                Владимир Перов
              </span>
              <span aria-hidden className="hero-cyber-title-c">
                Владимир Перов
              </span>
              <span aria-hidden className="hero-cyber-scan" />
              <span className="hero-cyber-title-main bg-linear-to-r from-accent via-accent-light to-accent-secondary bg-clip-text text-transparent">
                Владимир Перов
              </span>
            </span>
          </motion.h1>

          <motion.div className="mt-3 min-h-[2rem] sm:min-h-[2.25rem]" variants={itemVariants}>
            <ScrambleRevealText
              immediate
              className="font-mono text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl"
              text="Senior Frontend Developer"
            />
          </motion.div>

          <motion.p
            className="mt-4 max-w-lg text-base leading-relaxed text-muted sm:text-lg"
            variants={itemVariants}
          >
            Создаю сложные веб-приложения и выстраиваю IT-процессы с&nbsp;нуля. Ведущий инженер
            в&nbsp;Газпромбанке.
          </motion.p>

          <motion.div
            className="mt-6 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2"
            variants={itemVariants}
          >
            {USP_ITEMS.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-xl border border-accent/10 bg-surface/50 px-4 py-3 backdrop-blur-sm"
              >
                <item.icon className="mt-0.5 size-4 shrink-0 text-accent" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div className="mt-8 flex flex-wrap gap-4" variants={itemVariants}>
            <a
              className="neon-glow inline-flex items-center justify-center rounded-lg bg-linear-to-r from-accent to-accent-secondary px-7 py-3 text-base font-medium text-white transition-all"
              href={`#${SECTIONS_IDS.projects}`}
            >
              Смотреть проекты
            </a>
            <motion.span
              className="inline-flex"
              transition={{ damping: 22, stiffness: 420, type: "spring" }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                className="hero-cv-cta group/cv relative inline-flex items-center justify-center gap-2 rounded-lg border-2 border-accent/65 px-6 py-3 text-base font-semibold text-accent transition-colors hover:bg-accent/12 sm:px-7"
                href="/cv"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  <FileText
                    aria-hidden
                    className="size-[1.1rem] shrink-0 text-accent transition-transform duration-300 group-hover/cv:rotate-[-6deg]"
                  />
                  Открыть CV
                  <ArrowRight
                    aria-hidden
                    className="hero-cv-arrow size-[1.05rem] shrink-0 transition-transform duration-300 group-hover/cv:translate-x-1"
                  />
                </span>
              </Link>
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="flex w-full max-w-[240px] shrink-0 justify-center sm:max-w-[268px] md:w-auto md:max-w-[min(100%,288px)] lg:max-w-[300px]"
          initial={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.55, ease: "easeOut" as const }}
        >
          <AvatarFrame>
            <Image
              data-orbo-avatar
              priority
              alt="Владимир Перов — фотография"
              className="hero-photo-img aspect-[37/49] w-full rounded-xl object-cover object-center"
              height={490}
              sizes="(max-width: 640px) 240px, (max-width: 1024px) 288px, 300px"
              src={photo}
              width={370}
            />
          </AvatarFrame>
        </motion.div>
      </div>
    </section>
  );
};
