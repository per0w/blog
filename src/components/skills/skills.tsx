"use client";

import type { ComponentType } from "react";

import { motion } from "framer-motion";
import { Brain, Sparkles, Bot, Cpu, Workflow } from "lucide-react";

import {
  ReactJSIcon,
  TypeScriptIcon,
  JavaScriptIcon,
  NextjsIcon,
  ReduxIcon,
  TailwindIcon,
  CSS3Icon,
  HTML5Icon,
  SvelteIcon,
  SassIcon,
  AstroIcon,
  DockerIcon,
  KubernetesIcon,
  NGINXIcon,
  LinuxIcon,
  BashIcon,
  AnsibleIcon,
  NodejsIcon,
  DenoIcon,
  ViteIcon,
  WebpackIcon,
  BabelIcon,
  GulpIcon,
  MaterialUIIcon,
} from "@/ui/icons";

type Skill = {
  name: string;
  icon: ComponentType<{ className?: string }>;
};

type SkillRow = {
  items: Skill[];
  direction: "left" | "right";
  speed: number;
};

function lucideIcon(
  Icon: ComponentType<{ className?: string; size?: number }>,
): ComponentType<{ className?: string }> {
  function LucideIconWrapped({ className }: { className?: string }) {
    return <Icon className={className} size={20} />;
  }
  const iconLabel = Icon.displayName ?? Icon.name ?? "Icon";
  LucideIconWrapped.displayName = `LucideIcon(${iconLabel})`;
  return LucideIconWrapped;
}

const SKILL_ROWS: SkillRow[] = [
  {
    direction: "left",
    speed: 30,
    items: [
      { name: "React", icon: ReactJSIcon },
      { name: "TypeScript", icon: TypeScriptIcon },
      { name: "JavaScript", icon: JavaScriptIcon },
      { name: "Next.js", icon: NextjsIcon },
      { name: "Redux", icon: ReduxIcon },
      { name: "Tailwind", icon: TailwindIcon },
      { name: "Svelte", icon: SvelteIcon },
      { name: "Astro", icon: AstroIcon },
      { name: "HTML5", icon: HTML5Icon },
      { name: "CSS3", icon: CSS3Icon },
      { name: "Sass", icon: SassIcon },
      { name: "Material UI", icon: MaterialUIIcon },
    ],
  },
  {
    direction: "right",
    speed: 35,
    items: [
      { name: "Docker", icon: DockerIcon },
      { name: "Kubernetes", icon: KubernetesIcon },
      { name: "NGINX", icon: NGINXIcon },
      { name: "Linux", icon: LinuxIcon },
      { name: "Bash", icon: BashIcon },
      { name: "Ansible", icon: AnsibleIcon },
      { name: "Node.js", icon: NodejsIcon },
      { name: "Deno", icon: DenoIcon },
      { name: "Vite", icon: ViteIcon },
      { name: "Webpack", icon: WebpackIcon },
      { name: "Babel", icon: BabelIcon },
      { name: "Gulp", icon: GulpIcon },
    ],
  },
  {
    direction: "left",
    speed: 40,
    items: [
      { name: "AI / LLM", icon: lucideIcon(Brain) },
      { name: "Cursor AI", icon: lucideIcon(Sparkles) },
      { name: "ChatGPT", icon: lucideIcon(Bot) },
      { name: "Claude", icon: lucideIcon(Cpu) },
      { name: "Prompt Engineering", icon: lucideIcon(Workflow) },
      { name: "GitHub Copilot", icon: lucideIcon(Sparkles) },
      { name: "AI Agents", icon: lucideIcon(Bot) },
      { name: "RAG / Embeddings", icon: lucideIcon(Brain) },
    ],
  },
];

const SkillChip = ({ name, icon: Icon }: Skill) => (
  <div className="flex shrink-0 items-center gap-2.5 rounded-full border border-border/50 bg-surface/80 px-4 py-2 backdrop-blur-sm transition-colors hover:border-accent/40 hover:bg-surface-hover">
    <span className="flex h-5 w-5 items-center justify-center">
      <Icon />
    </span>
    <span className="text-sm font-medium whitespace-nowrap text-foreground/80">{name}</span>
  </div>
);

const MarqueeRow = ({ items, direction, speed }: SkillRow) => {
  const doubled = [...items, ...items];

  return (
    <div className="skill-marquee-mask relative overflow-hidden">
      <div
        className={`skill-marquee flex gap-3 ${direction === "right" ? "skill-marquee--reverse" : ""}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((skill, i) => (
          <SkillChip key={`${skill.name}-${i}`} {...skill} />
        ))}
      </div>
    </div>
  );
};

export const Skills = () => {
  return (
    <motion.div
      className="mx-auto mt-8 w-full max-w-3xl space-y-3"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeOut" as const }}
      viewport={{ once: true, margin: "-60px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {SKILL_ROWS.map((row, i) => (
        <MarqueeRow key={i} {...row} />
      ))}
    </motion.div>
  );
};
