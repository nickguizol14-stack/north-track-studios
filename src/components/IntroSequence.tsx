"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

/**
 * IntroSequence — cinematic logo reveal on first load / refresh.
 *
 * Timeline (~4.5s total):
 *  0.0s  — Black screen, logo invisible
 *  0.3s  — Logo fades in over ~1s
 *  1.5s  — Thunder shimmer #1 + particles burst
 *  2.3s  — Thunder shimmer #2 + particles burst
 *  3.1s  — Thunder shimmer #3 + particles burst (final)
 *  3.6s  — Logo zooms toward viewer + fades out
 *  4.3s  — Intro overlay removed, home page visible
 */

// ─── Particle system for the intro ─────────────────────────────────────

interface IntroParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  maxOpacity: number;
  life: number;
  maxLife: number;
  color: number[];
}

const GOLD_PALETTE = [
  [200, 168, 78],
  [218, 190, 110],
  [232, 212, 138],
  [180, 148, 58],
  [160, 133, 53],
];

function createBurstParticle(cx: number, cy: number, w: number, h: number): IntroParticle {
  // Particles spawn around the logo area and spread outward
  const angle = Math.random() * Math.PI * 2;
  const dist = Math.random() * 120 + 40;
  const speed = Math.random() * 2.5 + 0.5;

  return {
    x: cx + Math.cos(angle) * dist,
    y: cy + Math.sin(angle) * dist,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    size: Math.random() * 3.5 + 1,
    opacity: 0,
    maxOpacity: Math.random() * 0.7 + 0.3,
    life: 0,
    maxLife: Math.random() * 60 + 40,
    color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
  };
}

function createAmbientParticle(w: number, h: number): IntroParticle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.5,
    vy: -Math.random() * 0.4 - 0.1,
    size: Math.random() * 2.5 + 0.5,
    opacity: 0,
    maxOpacity: Math.random() * 0.5 + 0.2,
    life: 0,
    maxLife: Math.random() * 80 + 50,
    color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
  };
}

export function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<IntroParticle[]>([]);
  const animRef = useRef<number>(0);

  const [logoOpacity, setLogoOpacity] = useState(0);
  const [logoScale, setLogoScale] = useState(1);
  const [thunderFlash, setThunderFlash] = useState(0); // 0 = off, 1-3 = which flash
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [phase, setPhase] = useState<"waiting" | "fadein" | "thunder" | "zoom" | "done">("waiting");

  // Burst particles around logo center
  const burstParticles = useCallback((count: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    const cx = w / 2;
    const cy = h / 2;

    const burst = Array.from({ length: count }, () => createBurstParticle(cx, cy, w, h));
    // Also add ambient particles across the screen
    const ambient = Array.from({ length: Math.floor(count * 0.6) }, () => createAmbientParticle(w, h));
    particlesRef.current.push(...burst, ...ambient);
  }, []);

  // Canvas particle rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        const lifeRatio = p.life / p.maxLife;
        if (lifeRatio < 0.2) {
          p.opacity = (lifeRatio / 0.2) * p.maxOpacity;
        } else if (lifeRatio > 0.6) {
          p.opacity = ((1 - lifeRatio) / 0.4) * p.maxOpacity;
        } else {
          p.opacity = p.maxOpacity;
        }

        if (p.life >= p.maxLife) return false;

        const [r, g, b] = p.color;

        // Glow
        const glowR = p.size * 4;
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        glow.addColorStop(0, `rgba(${r},${g},${b},${p.opacity * 0.3})`);
        glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core
        const core = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        core.addColorStop(0, `rgba(${Math.min(r + 40, 255)},${Math.min(g + 40, 255)},${Math.min(b + 30, 255)},${p.opacity})`);
        core.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = core;
        ctx.fill();

        return true;
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ─── Timeline orchestration ──────────────────────────────────────────

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => {
      timers.push(setTimeout(fn, ms));
    };

    // Phase 1: Logo fades in
    t(() => {
      setPhase("fadein");
      setLogoOpacity(1);
    }, 300);

    // Phase 2: Thunder shimmer #1
    t(() => {
      setPhase("thunder");
      setThunderFlash(1);
      burstParticles(50);
    }, 1500);
    t(() => setThunderFlash(0), 1800); // flash off after 300ms

    // Thunder shimmer #2
    t(() => {
      setThunderFlash(2);
      burstParticles(65);
    }, 2300);
    t(() => setThunderFlash(0), 2600);

    // Thunder shimmer #3 — biggest
    t(() => {
      setThunderFlash(3);
      burstParticles(80);
    }, 3100);
    t(() => setThunderFlash(0), 3450);

    // Phase 3: Zoom + fade — slower, more cinematic
    t(() => {
      setPhase("zoom");
      setLogoScale(3.2);
      setLogoOpacity(0);
    }, 3700);

    // Phase 4: Remove overlay — give zoom time to breathe
    t(() => {
      setOverlayOpacity(0);
    }, 4800);

    t(() => {
      setPhase("done");
      onComplete();
    }, 5600);

    return () => timers.forEach(clearTimeout);
  }, [burstParticles, onComplete]);

  if (phase === "done") return null;

  // Thunder glow intensity increases with each flash
  const thunderIntensity = thunderFlash === 0 ? 0 : thunderFlash === 1 ? 0.3 : thunderFlash === 2 ? 0.45 : 0.6;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        backgroundColor: "#070709",
        opacity: overlayOpacity,
        transition: "opacity 0.8s ease-out",
        pointerEvents: overlayOpacity === 0 ? "none" : "all",
      }}
    >
      {/* Particle canvas — behind everything */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Thunder area glow — full screen diffuse radial from center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 45%, rgba(200,168,78,${thunderIntensity}) 0%, rgba(200,168,78,${thunderIntensity * 0.2}) 25%, rgba(200,168,78,${thunderIntensity * 0.05}) 50%, transparent 70%)`,
          opacity: thunderFlash > 0 ? 1 : 0,
          transition: thunderFlash > 0
            ? "opacity 0.08s ease-in"
            : "opacity 0.6s ease-out",
        }}
      />

      {/* Secondary thunder glow — bigger, softer, fills unused black */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(200,168,78,${thunderIntensity * 0.15}) 0%, rgba(200,168,78,${thunderIntensity * 0.05}) 40%, transparent 80%)`,
          opacity: thunderFlash > 0 ? 1 : 0,
          transition: thunderFlash > 0
            ? "opacity 0.1s ease-in"
            : "opacity 0.8s ease-out",
          filter: "blur(40px)",
        }}
      />

      {/* Logo */}
      <div
        className="relative z-10"
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          transition: phase === "zoom"
            ? "transform 1s cubic-bezier(0.15, 0, 0.2, 1), opacity 0.9s ease-out"
            : "opacity 1s ease-out, transform 0.3s ease",
          willChange: "transform, opacity",
        }}
      >
        <Image
          src="/logo.png"
          alt="North Track Studios"
          width={420}
          height={280}
          priority
          className="select-none"
          style={{ filter: "drop-shadow(0 0 30px rgba(200,168,78,0.15))" }}
        />

        {/* Logo glow ring that pulses with thunder */}
        <div
          className="absolute inset-0 -inset-x-16 -inset-y-12 pointer-events-none rounded-full"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, rgba(200,168,78,${thunderFlash > 0 ? 0.2 : 0.05}) 0%, transparent 60%)`,
            transition: thunderFlash > 0
              ? "background 0.1s ease-in"
              : "background 0.8s ease-out",
          }}
        />
      </div>
    </div>
  );
}
