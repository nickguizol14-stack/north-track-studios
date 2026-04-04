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

    // Phase 2: Two heartbeat pulses — slow fade in, slow fade out
    // Pulse 1
    t(() => {
      setPhase("thunder");
      setThunderFlash(1);
      burstParticles(50);
    }, 1800);
    t(() => setThunderFlash(0), 3200); // hold 1.4s then fade out

    // Pulse 2 — stronger, final
    t(() => {
      setThunderFlash(2);
      burstParticles(75);
    }, 4200);
    t(() => setThunderFlash(0), 5800); // hold 1.6s then fade out

    // Phase 3: Zoom + fade — slow and cinematic (3x longer)
    t(() => {
      setPhase("zoom");
      setLogoScale(3.2);
      setLogoOpacity(0);
    }, 6800);

    // Phase 4: Remove overlay — let zoom fully play out
    t(() => {
      setOverlayOpacity(0);
    }, 9500);

    t(() => {
      setPhase("done");
      onComplete();
    }, 10500);

    return () => timers.forEach(clearTimeout);
  }, [burstParticles, onComplete]);

  if (phase === "done") return null;

  // Heartbeat intensity — two pulses
  const pulseIntensity = thunderFlash === 0 ? 0 : thunderFlash === 1 ? 0.3 : 0.5;
  const isActive = thunderFlash > 0;

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

      {/* Heartbeat glow ring — surrounds the logo, not on top of it.
          Uses a hollow radial: transparent center, gold ring, fade out */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 46%, transparent 12%, rgba(200,168,78,${pulseIntensity * 0.6}) 18%, rgba(200,168,78,${pulseIntensity}) 28%, rgba(200,168,78,${pulseIntensity * 0.4}) 40%, rgba(200,168,78,${pulseIntensity * 0.08}) 55%, transparent 70%)`,
          opacity: isActive ? 1 : 0,
          transition: isActive
            ? "opacity 0.8s ease-in"
            : "opacity 1.4s ease-out",
        }}
      />

      {/* Wider ambient fill — subtle wash across the black */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 46%, transparent 20%, rgba(200,168,78,${pulseIntensity * 0.08}) 35%, rgba(200,168,78,${pulseIntensity * 0.04}) 55%, transparent 80%)`,
          opacity: isActive ? 1 : 0,
          transition: isActive
            ? "opacity 1s ease-in"
            : "opacity 1.6s ease-out",
          filter: "blur(30px)",
        }}
      />

      {/* Logo */}
      <div
        className="relative z-10"
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          transition: phase === "zoom"
            ? "transform 3s cubic-bezier(0.08, 0, 0.2, 1), opacity 2.5s ease-out"
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

        {/* Tight glow halo right around the logo edges — not center fill */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "-40px -50px",
            background: `radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(200,168,78,${isActive ? pulseIntensity * 0.3 : 0.03}) 50%, rgba(200,168,78,${isActive ? pulseIntensity * 0.15 : 0.01}) 65%, transparent 80%)`,
            transition: isActive
              ? "background 0.8s ease-in"
              : "background 1.4s ease-out",
          }}
        />
      </div>
    </div>
  );
}
