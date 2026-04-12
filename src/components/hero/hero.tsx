"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Rocket, Layers, Users, Target } from "lucide-react";

import photo from "./photo-main.png";
import { SECTIONS_IDS } from "@/constants/common";
import { AvatarFrame } from "./avatar-frame";

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
      id={SECTIONS_IDS.hero}
      className="relative flex min-h-[85vh] items-center justify-center py-16 md:py-24"
    >
      <div className="mx-auto flex max-w-screen-xl flex-col-reverse items-center gap-10 px-4 sm:px-6 md:flex-row md:gap-16">
        <motion.div
          className="flex flex-col items-center text-center md:flex-1 md:items-start md:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={itemVariants}
            className="text-sm font-semibold tracking-[0.2em] text-accent-secondary uppercase"
          >
            Привет! Меня зовут
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="glitch-text mt-3 bg-linear-to-r from-accent via-accent-light to-accent-secondary bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl lg:text-7xl"
          >
            Владимир Перов
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-3 text-2xl font-bold text-foreground sm:text-3xl"
          >
            Senior Frontend Developer
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="mt-4 max-w-lg text-base leading-relaxed text-muted sm:text-lg"
          >
            Создаю сложные веб-приложения и выстраиваю IT-процессы с&nbsp;нуля.
            Ведущий инженер в&nbsp;Газпромбанке.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-6 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2"
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

          <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-4">
            <a
              href={`#${SECTIONS_IDS.projects}`}
              className="neon-glow inline-flex items-center justify-center rounded-lg bg-linear-to-r from-accent to-accent-secondary px-7 py-3 text-base font-medium text-white transition-all"
            >
              Смотреть проекты
            </a>
            <a
              href="/cv"
              className="neon-glow inline-flex items-center justify-center rounded-lg border-2 border-accent/60 px-7 py-3 text-base font-medium text-accent transition-all hover:border-accent hover:bg-accent/10"
            >
              Открыть CV
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex-shrink-0"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" as const }}
        >
          <AvatarFrame>
            <Image
              data-orbo-avatar
              src={photo}
              alt="Владимир Перов — фотография"
              width={370}
              height={490}
              className="rounded-2xl"
              style={{ width: "370px", height: "auto" }}
              priority
            />
          </AvatarFrame>
        </motion.div>
      </div>
    </section>
  );
};
