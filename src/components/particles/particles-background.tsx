"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  phase: number;
  speed: number;
  depth: number;
  type: "accent" | "secondary";
};

const DESKTOP_COUNT = 80;
/** Меньше связей на маленьких экранах — стабильнее FPS. */
const MOBILE_COUNT = 22;
const LINE_DISTANCE = 150;
const MOUSE_RADIUS = 150;
const MOUSE_FORCE = 1.2;
const PARALLAX_STRENGTH = 0.15;

/** Светлая тема: сетка и «узлы» на холсте заметнее; в `.dark` значения как раньше. */
const LIGHT_LINE_OPACITY_MULT = 1.68;
const LIGHT_LINE_THIN = 0.58;
const LIGHT_LINE_THICK = 1.08;
const LIGHT_DOT_ALPHA_BASE = 0.4;
const LIGHT_DOT_ALPHA_DEPTH = 0.48;
const LIGHT_GLOW_MULT = 1.38;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  return [
    parseInt(clean.slice(0, 2), 16),
    parseInt(clean.slice(2, 4), 16),
    parseInt(clean.slice(4, 6), 16),
  ];
}

export const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? MOBILE_COUNT : DESKTOP_COUNT;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const getColors = () => {
      const style = getComputedStyle(document.documentElement);
      return {
        accent: style.getPropertyValue("--color-accent").trim(),
        secondary: style.getPropertyValue("--color-accent-secondary").trim(),
      };
    };

    let colors = getColors();
    let accentRgb = hexToRgb(colors.accent);
    let secondaryRgb = hexToRgb(colors.secondary);
    let isDarkTheme = document.documentElement.classList.contains("dark");

    const syncFromDocument = () => {
      colors = getColors();
      accentRgb = hexToRgb(colors.accent);
      secondaryRgb = hexToRgb(colors.secondary);
      isDarkTheme = document.documentElement.classList.contains("dark");
    };

    const observer = new MutationObserver(() => {
      syncFromDocument();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const initParticles = () => {
      particlesRef.current = Array.from({ length: count }, () => {
        const isSecondary = Math.random() > 0.6;
        const depth = 0.2 + Math.random() * 0.8;
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: (Math.random() * 1.8 + 0.5) * depth,
          baseRadius: (Math.random() * 1.8 + 0.5) * depth,
          phase: Math.random() * Math.PI * 2,
          speed: (0.3 + Math.random() * 0.4) * depth,
          depth,
          type: isSecondary ? "secondary" : "accent",
        };
      });
    };

    const draw = () => {
      timeRef.current += 0.008;
      const t = timeRef.current;
      const scrollY = scrollRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
          p.vx += (dx / dist) * force * MOUSE_FORCE;
          p.vy += (dy / dist) * force * MOUSE_FORCE;
        }

        p.vx += Math.sin(t + p.phase) * 0.003;
        p.vy += Math.cos(t * 0.7 + p.phase) * 0.003;

        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx * p.speed;
        p.y += p.vy * p.speed;

        p.radius = p.baseRadius * (1 + Math.sin(t * 2 + p.phase) * 0.3);

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const pi = particles[i];
          const pj = particles[j];
          const parallaxYi = -scrollY * PARALLAX_STRENGTH * (1 - pi.depth);
          const parallaxYj = -scrollY * PARALLAX_STRENGTH * (1 - pj.depth);
          const drawYi = pi.y + parallaxYi;
          const drawYj = pj.y + parallaxYj;

          const dx = pi.x - pj.x;
          const dy = drawYi - drawYj;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < LINE_DISTANCE) {
            const avgDepth = (pi.depth + pj.depth) / 2;
            const lightBoost = isDarkTheme ? 1 : LIGHT_LINE_OPACITY_MULT;
            const opacity = Math.min(
              1,
              (1 - dist / LINE_DISTANCE) * 0.35 * avgDepth * lightBoost,
            );
            const isMixed = pi.type !== pj.type;
            let rgb: [number, number, number];
            if (isMixed) {
              rgb = secondaryRgb;
            } else if (pi.type === "accent") {
              rgb = accentRgb;
            } else {
              rgb = secondaryRgb;
            }

            ctx.beginPath();
            ctx.strokeStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${opacity})`;
            let lineW = 0.4;
            if (isDarkTheme) {
              lineW = isMixed ? 0.8 : 0.4;
            } else {
              lineW = isMixed ? LIGHT_LINE_THICK : LIGHT_LINE_THIN;
            }
            ctx.lineWidth = lineW;
            ctx.moveTo(pi.x, drawYi);
            ctx.lineTo(pj.x, drawYj);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const rgb = p.type === "accent" ? accentRgb : secondaryRgb;
        const glowMult = isDarkTheme ? 1 : LIGHT_GLOW_MULT;
        const glowIntensity = (4 + Math.sin(t * 3 + p.phase) * 3) * p.depth * glowMult;
        const parallaxY = -scrollY * PARALLAX_STRENGTH * (1 - p.depth);
        const drawY = p.y + parallaxY;
        const alpha = isDarkTheme
          ? 0.3 + 0.4 * p.depth
          : LIGHT_DOT_ALPHA_BASE + LIGHT_DOT_ALPHA_DEPTH * p.depth;
        const shadowAlpha = Math.min(1, alpha + (isDarkTheme ? 0.2 : 0.28));

        ctx.beginPath();
        ctx.arc(p.x, drawY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
        ctx.shadowColor = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${shadowAlpha})`;
        ctx.shadowBlur = glowIntensity;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    resize();
    initParticles();
    handleScroll();
    draw();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0" />
  );
};
