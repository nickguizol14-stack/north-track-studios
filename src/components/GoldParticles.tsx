"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  colorIndex: number;
  wobbleSpeed: number;
  wobbleAmp: number;
}

interface GoldParticlesProps {
  density?: number;
  className?: string;
  speed?: number;
}

const GOLD_COLORS = [
  [200, 168, 78],   // base gold
  [218, 190, 110],  // warm light gold
  [232, 212, 138],  // bright highlight
  [180, 148, 58],   // deeper amber
  [160, 133, 53],   // rich dark gold
];

export function GoldParticles({
  density = 60,
  className = "",
  speed = 0.4,
}: GoldParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const dpr = window.devicePixelRatio || 1;
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const createParticle = (): Particle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * speed,
      vy: -Math.random() * speed * 0.8 - 0.15,
      size: Math.random() * 3.5 + 1,
      opacity: 0,
      life: 0,
      maxLife: Math.random() * 250 + 120,
      colorIndex: Math.floor(Math.random() * GOLD_COLORS.length),
      wobbleSpeed: Math.random() * 0.02 + 0.005,
      wobbleAmp: Math.random() * 1.5 + 0.5,
    });

    particlesRef.current = Array.from({ length: density }, () => {
      const p = createParticle();
      p.life = Math.random() * p.maxLife;
      return p;
    });

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of particlesRef.current) {
        p.life++;

        // Wobble motion
        p.x += p.vx + Math.sin(p.life * p.wobbleSpeed) * p.wobbleAmp * 0.3;
        p.y += p.vy;

        // Fade in/out — sharper peak
        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.15) {
          p.opacity = (lifeRatio / 0.15) * 0.85;
        } else if (lifeRatio > 0.7) {
          p.opacity = ((1 - lifeRatio) / 0.3) * 0.85;
        } else {
          p.opacity = 0.85;
        }

        // Reset
        if (p.life >= p.maxLife || p.y < -20 || p.x < -20 || p.x > w + 20) {
          Object.assign(p, createParticle());
          p.y = h + 10;
          p.life = 0;
        }

        const [r, g, b] = GOLD_COLORS[p.colorIndex];

        // Outer glow halo
        const glowRadius = p.size * 4;
        const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
        glowGrad.addColorStop(0, `rgba(${r},${g},${b},${p.opacity * 0.25})`);
        glowGrad.addColorStop(0.5, `rgba(${r},${g},${b},${p.opacity * 0.08})`);
        glowGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Bright core
        const coreGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        coreGrad.addColorStop(0, `rgba(${Math.min(r + 40, 255)},${Math.min(g + 40, 255)},${Math.min(b + 30, 255)},${p.opacity})`);
        coreGrad.addColorStop(0.6, `rgba(${r},${g},${b},${p.opacity * 0.7})`);
        coreGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [density, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  );
}
