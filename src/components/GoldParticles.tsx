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

// Derive particle colors from CSS variables at runtime
function getThemeColors(): number[][] {
  const cs = getComputedStyle(document.documentElement);
  const r = parseInt(cs.getPropertyValue("--glow-r")) || 200;
  const g = parseInt(cs.getPropertyValue("--glow-g")) || 168;
  const b = parseInt(cs.getPropertyValue("--glow-b")) || 78;
  return [
    [r, g, b],                                               // base
    [Math.min(r + 18, 255), Math.min(g + 22, 255), Math.min(b + 32, 255)], // warm light
    [Math.min(r + 32, 255), Math.min(g + 44, 255), Math.min(b + 60, 255)], // bright
    [Math.max(r - 20, 0), Math.max(g - 20, 0), Math.max(b - 20, 0)],       // deeper
    [Math.max(r - 40, 0), Math.max(g - 35, 0), Math.max(b - 25, 0)],       // dark
  ];
}

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
      colorIndex: Math.floor(Math.random() * 5),
      wobbleSpeed: Math.random() * 0.02 + 0.005,
      wobbleAmp: Math.random() * 1.5 + 0.5,
    });

    let themeColors = getThemeColors();
    let colorRefreshCounter = 0;

    particlesRef.current = Array.from({ length: density }, () => {
      const p = createParticle();
      p.life = Math.random() * p.maxLife;
      return p;
    });

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Refresh theme colors every 30 frames (~0.5s) for smooth transitions
      colorRefreshCounter++;
      if (colorRefreshCounter >= 30) {
        themeColors = getThemeColors();
        colorRefreshCounter = 0;
      }

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

        // Edge fade — particles near borders fade out smoothly
        const edgeZone = 60;
        let edgeFade = 1;
        if (p.y < edgeZone) edgeFade = Math.min(edgeFade, p.y / edgeZone);
        if (p.y > h - edgeZone) edgeFade = Math.min(edgeFade, (h - p.y) / edgeZone);
        if (p.x < edgeZone) edgeFade = Math.min(edgeFade, p.x / edgeZone);
        if (p.x > w - edgeZone) edgeFade = Math.min(edgeFade, (w - p.x) / edgeZone);
        edgeFade = Math.max(0, edgeFade);
        p.opacity *= edgeFade;

        // Reset
        if (p.life >= p.maxLife || p.y < -20 || p.x < -20 || p.x > w + 20) {
          Object.assign(p, createParticle());
          p.y = h + 10;
          p.life = 0;
        }

        const [r, g, b] = themeColors[p.colorIndex % themeColors.length];

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

    // Only animate when canvas is visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!animRef.current) animate();
        } else {
          cancelAnimationFrame(animRef.current);
          animRef.current = 0;
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animRef.current);
      animRef.current = 0;
      observer.disconnect();
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
