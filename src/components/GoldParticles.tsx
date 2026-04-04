"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  fadeSpeed: number;
  life: number;
  maxLife: number;
}

interface GoldParticlesProps {
  density?: number;
  className?: string;
  speed?: number;
  glow?: boolean;
}

export function GoldParticles({
  density = 40,
  className = "",
  speed = 0.3,
  glow = true,
}: GoldParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();

    const createParticle = (): Particle => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      const w = rect?.width ?? 800;
      const h = rect?.height ?? 600;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * speed,
        vy: -Math.random() * speed * 0.5 - 0.1,
        size: Math.random() * 2.5 + 0.5,
        opacity: 0,
        fadeSpeed: Math.random() * 0.008 + 0.003,
        life: 0,
        maxLife: Math.random() * 300 + 150,
      };
    };

    particlesRef.current = Array.from({ length: density }, createParticle);
    // Stagger initial life so they don't all appear at once
    particlesRef.current.forEach((p, i) => {
      p.life = Math.random() * p.maxLife;
      p.opacity = Math.sin((p.life / p.maxLife) * Math.PI) * 0.6;
    });

    const goldColors = [
      "200, 168, 78",   // base gold
      "218, 190, 110",  // lighter gold
      "180, 148, 58",   // deeper gold
      "232, 212, 138",  // highlight gold
    ];

    const animate = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      const w = rect?.width ?? 800;
      const h = rect?.height ?? 600;

      ctx.clearRect(0, 0, w, h);

      particlesRef.current.forEach((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        // Fade in/out based on life cycle
        const lifeRatio = p.life / p.maxLife;
        p.opacity = Math.sin(lifeRatio * Math.PI) * 0.6;

        // Reset when dead
        if (p.life >= p.maxLife) {
          Object.assign(p, createParticle());
          p.life = 0;
        }

        // Wrap around edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const color = goldColors[Math.floor(Math.random() * 1000) % goldColors.length];

        if (glow && p.opacity > 0.2) {
          ctx.save();
          ctx.globalAlpha = p.opacity * 0.3;
          ctx.shadowColor = `rgba(${color}, 0.8)`;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color}, ${p.opacity * 0.15})`;
          ctx.fill();
          ctx.restore();
        }

        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [density, speed, glow]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
    />
  );
}
