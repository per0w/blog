"use client";

import { useEffect, useRef } from "react";

export type OrbMood = "neutral" | "annoyed" | "thinking" | "easter";

const ORB_SIZE = 64;
const ORB_PARTICLE_COUNT = 36;
const ORB_BASE_RADIUS = 18;
const ORB_LINE_NEAR = 38;
const ORB_LINE_FAR = 52;

/** ~0.011 на кадр при 60 Hz → скорость «времени» в секунду. */
const TIME_SCALE_PER_SEC = 0.66;
const MAX_FRAME_DELTA_SEC = 0.064;

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").slice(0, 6);
  if (clean.length !== 6) return [124, 58, 237];
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return [Number.isFinite(r) ? r : 124, Number.isFinite(g) ? g : 58, Number.isFinite(b) ? b : 237];
}

function mixRgb(
  a: [number, number, number],
  b: [number, number, number],
  t: number,
): [number, number, number] {
  const k = Math.min(1, Math.max(0, t));
  return [
    Math.round(a[0] + (b[0] - a[0]) * k),
    Math.round(a[1] + (b[1] - a[1]) * k),
    Math.round(a[2] + (b[2] - a[2]) * k),
  ];
}

function rgba(rgb: [number, number, number], alpha: number): string {
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
}

function applyMoodTint(
  accent: [number, number, number],
  secondary: [number, number, number],
  mood: OrbMood,
): { accent: [number, number, number]; secondary: [number, number, number] } {
  if (mood === "annoyed") {
    const rTint: [number, number, number] = [210, 72, 88];
    return {
      accent: mixRgb(accent, rTint, 0.38),
      secondary: mixRgb(secondary, rTint, 0.22),
    };
  }
  if (mood === "thinking") {
    const cTint: [number, number, number] = [72, 150, 195];
    return {
      accent: mixRgb(accent, cTint, 0.28),
      secondary: mixRgb(secondary, cTint, 0.35),
    };
  }
  if (mood === "easter") {
    const gTint: [number, number, number] = [255, 210, 96];
    return {
      accent: mixRgb(accent, gTint, 0.25),
      secondary: mixRgb(secondary, gTint, 0.18),
    };
  }
  return { accent, secondary };
}

type OrbParticle = {
  angle: number;
  orbitRadius: number;
  speed: number;
  radius: number;
  phase: number;
  type: "accent" | "secondary";
};

type OrbAvatarProps = {
  speaking: boolean;
  /** После idle-реплики — замедлить частицы, «дремлет». */
  idleDrowsy?: boolean;
  mood?: OrbMood;
};

export function OrbAvatar({ speaking, idleDrowsy = false, mood = "neutral" }: OrbAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<OrbParticle[]>([]);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const speakingRef = useRef(speaking);
  const speakBlendRef = useRef(0);
  const mouseRef = useRef({ x: -1, y: -1 });
  const idleDrowsyRef = useRef(idleDrowsy);
  const moodRef = useRef<OrbMood>(mood);
  const lastFrameTsRef = useRef<number | null>(null);

  useEffect(() => {
    speakingRef.current = speaking;
  }, [speaking]);

  useEffect(() => {
    idleDrowsyRef.current = idleDrowsy;
  }, [idleDrowsy]);

  useEffect(() => {
    moodRef.current = mood;
  }, [mood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = ORB_SIZE * dpr;
      canvas.height = ORB_SIZE * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
    };

    resizeCanvas();
    const ro = new ResizeObserver(resizeCanvas);
    ro.observe(canvas);

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

    const observer = new MutationObserver(() => {
      colors = getColors();
      accentRgb = hexToRgb(colors.accent);
      secondaryRgb = hexToRgb(colors.secondary);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    particlesRef.current = Array.from({ length: ORB_PARTICLE_COUNT }, () => ({
      angle: Math.random() * Math.PI * 2,
      orbitRadius: ORB_BASE_RADIUS * (0.35 + Math.random() * 0.65),
      speed: 0.3 + Math.random() * 0.75,
      radius: 0.7 + Math.random() * 1.45,
      phase: Math.random() * Math.PI * 2,
      type: Math.random() > 0.48 ? "secondary" : ("accent" as const),
    }));

    const cx = ORB_SIZE / 2;
    const cy = ORB_SIZE / 2;
    const R = ORB_SIZE / 2 - 2;

    const draw = (ts: number) => {
      const prev = lastFrameTsRef.current;
      lastFrameTsRef.current = ts;
      const dtSec =
        prev === null ? 1 / 60 : Math.min(MAX_FRAME_DELTA_SEC, Math.max(0, (ts - prev) / 1000));
      timeRef.current += dtSec * TIME_SCALE_PER_SEC;

      const t = timeRef.current;
      const isSpeaking = speakingRef.current;
      const mouse = mouseRef.current;
      const drowsy = idleDrowsyRef.current && !isSpeaking;
      const currentMood = moodRef.current;

      const speakTarget = isSpeaking ? 1 : 0;
      speakBlendRef.current += (speakTarget - speakBlendRef.current) * 0.07;
      const sb = speakBlendRef.current;

      const breathe = 1 + Math.sin(t * 1.5) * 0.08;
      const speakMult = 1 + sb * 0.38;
      const speedMult = (1 + sb * 0.55) * (drowsy ? 0.32 : 1);
      const cloudShimmer = sb * (0.55 + 0.45 * Math.sin(t * 6.2));
      const easterPulse = currentMood === "easter" ? 0.12 * Math.sin(t * 8) : 0;

      ctx.clearRect(0, 0, ORB_SIZE, ORB_SIZE);

      const tinted = applyMoodTint(accentRgb, secondaryRgb, currentMood);
      const useAccent = mixRgb(tinted.accent, [255, 255, 255], easterPulse);
      const useSecondary = mixRgb(tinted.secondary, [255, 255, 255], easterPulse * 0.6);
      const midRgb = mixRgb(useAccent, useSecondary, 0.5);

      const particles = particlesRef.current;
      const positions: { x: number; y: number; p: OrbParticle }[] = [];

      for (const p of particles) {
        p.angle += p.speed * 0.015 * speedMult;
        const r = p.orbitRadius * breathe * speakMult;
        let px = cx + Math.cos(p.angle) * r;
        let py = cy + Math.sin(p.angle) * r;

        if (mouse.x >= 0) {
          const dx = mouse.x - px;
          const dy = mouse.y - py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 32 && dist > 0) {
            const pull = (32 - dist) / 32;
            px += dx * pull * 0.16;
            py += dy * pull * 0.16;
          }
        }

        positions.push({ x: px, y: py, p });
      }

      for (let pass = 0; pass < 2; pass++) {
        const farPass = pass === 0;
        for (let i = 0; i < positions.length; i++) {
          for (let j = i + 1; j < positions.length; j++) {
            const a = positions[i];
            const b = positions[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= 0) continue;

            const rgbA = a.p.type === "accent" ? useAccent : useSecondary;
            const rgbB = b.p.type === "accent" ? useAccent : useSecondary;
            const lineRgb = a.p.type === b.p.type ? rgbA : mixRgb(rgbA, rgbB, 0.5);

            if (farPass) {
              if (dist >= ORB_LINE_NEAR && dist < ORB_LINE_FAR) {
                const f = 1 - (dist - ORB_LINE_NEAR) / (ORB_LINE_FAR - ORB_LINE_NEAR);
                const opacity = f * f * (0.1 + sb * 0.14 + cloudShimmer * 0.12);
                ctx.beginPath();
                ctx.strokeStyle = rgba(lineRgb, opacity);
                ctx.lineWidth = 0.4;
                ctx.lineCap = "round";
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
              }
            } else if (dist < ORB_LINE_NEAR) {
              const f = 1 - dist / ORB_LINE_NEAR;
              const opacity =
                f *
                f *
                (0.38 + sb * 0.22 + cloudShimmer * 0.18 + Math.sin(t * 3 + i + j) * 0.04 * sb);
              ctx.beginPath();
              ctx.strokeStyle = rgba(lineRgb, Math.min(0.95, opacity));
              ctx.lineWidth = 0.45 + f * 0.45;
              ctx.lineCap = "round";
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      for (const { x, y, p } of positions) {
        const rgb = p.type === "accent" ? useAccent : useSecondary;
        const pulseR = p.radius * (1 + Math.sin(t * 3 + p.phase) * 0.28);
        const baseA = 0.48 + 0.32 * Math.sin(t * 2 + p.phase);
        const speakTwinkle = sb * 0.35 * Math.sin(t * 7.5 + p.phase * 2.1);
        const alpha = Math.min(0.92, Math.max(0.22, baseA + speakTwinkle + cloudShimmer * 0.15));
        const glow = (2.2 + Math.sin(t * 2 + p.phase) * 1.8) * (1 + sb * 2.4 + cloudShimmer * 0.8);

        ctx.beginPath();
        ctx.arc(x, y, pulseR, 0, Math.PI * 2);
        ctx.fillStyle = rgba(rgb, alpha);
        ctx.shadowColor = rgba(rgb, Math.min(0.95, alpha + 0.25));
        ctx.shadowBlur = glow;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (sb > 0.06) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const cg = 0.07 * sb * (0.5 + 0.5 * Math.sin(t * 5.5));
        const cloudGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.88);
        cloudGlow.addColorStop(0, rgba(midRgb, cg));
        cloudGlow.addColorStop(1, "transparent");
        ctx.fillStyle = cloudGlow;
        ctx.fillRect(0, 0, ORB_SIZE, ORB_SIZE);
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
      ro.disconnect();
      lastFrameTsRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="size-16 bg-transparent"
      height={ORB_SIZE}
      style={{ width: ORB_SIZE, height: ORB_SIZE }}
      width={ORB_SIZE}
      onMouseLeave={() => {
        mouseRef.current = { x: -1, y: -1 };
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }}
    />
  );
}
