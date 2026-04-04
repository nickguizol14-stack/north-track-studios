"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

/**
 * IntroSequence v2 — single continuous animation, no choppy state toggles.
 *
 * Everything is driven by one requestAnimationFrame loop that calculates
 * smooth glow, particles, and timing as a fluid motion. Two warm pulses
 * breathe outward from behind the logo, particles drift with them, then
 * the logo drifts toward the viewer and the page fades in underneath.
 */

const GOLD = [
  [200, 168, 78],
  [218, 190, 110],
  [232, 212, 138],
  [180, 148, 58],
  [245, 225, 160],
];

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  peak: number;
  born: number;
  lifespan: number;
  color: number[];
}

export function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startTime = useRef(0);
  const motes = useRef<Mote[]>([]);
  const animRef = useRef<number>(0);
  const completedRef = useRef(false);

  const [logoStyle, setLogoStyle] = useState({
    opacity: 0,
    scale: 1,
    transition: "opacity 0.7s ease-out, transform 0.14s ease",
  });
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [done, setDone] = useState(false);

  const onCompleteCb = useCallback(onComplete, [onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    startTime.current = performance.now();

    // Spawn a cluster of particles
    const spawnBurst = (now: number, count: number, spread: number, speed: number) => {
      const cx = w / 2;
      const cy = h * 0.46;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * spread + 30;
        const spd = Math.random() * speed + 0.2;
        motes.current.push({
          x: cx + Math.cos(angle) * dist,
          y: cy + Math.sin(angle) * dist,
          vx: Math.cos(angle) * spd + (Math.random() - 0.5) * 0.3,
          vy: Math.sin(angle) * spd - Math.random() * 0.3,
          size: Math.random() * 3 + 1,
          peak: Math.random() * 0.6 + 0.3,
          born: now,
          lifespan: Math.random() * 980 + 735,
          color: GOLD[Math.floor(Math.random() * GOLD.length)],
        });
      }
    };

    // Ambient drifters across the whole screen
    const spawnAmbient = (now: number, count: number) => {
      for (let i = 0; i < count; i++) {
        motes.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -Math.random() * 0.3 - 0.05,
          size: Math.random() * 2 + 0.5,
          peak: Math.random() * 0.4 + 0.15,
          born: now,
          lifespan: Math.random() * 1225 + 735,
          color: GOLD[Math.floor(Math.random() * GOLD.length)],
        });
      }
    };

    let burst1Done = false;
    let fizzleDone = false;

    // ─── The single animation loop ────────────────────────────────────

    const frame = (now: number) => {
      const elapsed = now - startTime.current;
      const t = elapsed / 1000; // seconds

      ctx.clearRect(0, 0, w, h);

      // ── Logo fade-in ──
      if (t >= 0.2 && t < 0.25) {
        setLogoStyle({
          opacity: 1,
          scale: 1,
          transition: "opacity 0.7s ease-out, transform 0.14s ease",
        });
      }

      let glow = 0;

      // Single pulse: t=0.74 to t=2.06
      if (t >= 0.74 && t <= 2.06) {
        const p = (t - 0.74) / 1.32;
        glow = Math.sin(p * Math.PI) * 0.55;
      }

      // ── Spawn particles with pulse ──
      if (t >= 0.88 && !burst1Done) {
        burst1Done = true;
        spawnBurst(now, 60, 120, 1.4);
        spawnAmbient(now, 40);
      }

      // ── Backlight glow behind logo ──
      if (glow > 0.01) {
        const cx = w / 2;
        const cy = h * 0.46;

        // Elliptical backlight — scale context to stretch a circle into logo proportions
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1.5, 1); // wider than tall, matching logo shape

        // Core backlight — tight, bright center sitting right behind the logo
        const core = ctx.createRadialGradient(0, 0, 0, 0, 0, 180);
        core.addColorStop(0, `rgba(200,168,78,${glow * 0.45})`);
        core.addColorStop(0.4, `rgba(200,168,78,${glow * 0.25})`);
        core.addColorStop(0.7, `rgba(200,168,78,${glow * 0.08})`);
        core.addColorStop(1, `rgba(200,168,78,0)`);
        ctx.fillStyle = core;
        ctx.fillRect(-300, -300, 600, 600);

        // Wider bloom that spills past the logo edges
        const bloom = ctx.createRadialGradient(0, 0, 80, 0, 0, 350);
        bloom.addColorStop(0, `rgba(200,168,78,${glow * 0.12})`);
        bloom.addColorStop(0.5, `rgba(200,168,78,${glow * 0.04})`);
        bloom.addColorStop(1, `rgba(200,168,78,0)`);
        ctx.fillStyle = bloom;
        ctx.fillRect(-500, -500, 1000, 1000);

        ctx.restore();
      }

      // ── Draw particles ──
      motes.current = motes.current.filter((m) => {
        const age = now - m.born;
        if (age > m.lifespan) return false;

        m.x += m.vx;
        m.y += m.vy;
        // Gentle drift deceleration
        m.vx *= 0.998;
        m.vy *= 0.998;

        const lifeP = age / m.lifespan;
        // Smooth fade in/out
        let alpha: number;
        if (lifeP < 0.2) alpha = (lifeP / 0.2) * m.peak;
        else if (lifeP > 0.65) alpha = ((1 - lifeP) / 0.35) * m.peak;
        else alpha = m.peak;

        const [r, g, b] = m.color;

        // Glow halo
        const haloR = m.size * 5;
        const halo = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, haloR);
        halo.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.2})`);
        halo.addColorStop(0.5, `rgba(${r},${g},${b},${alpha * 0.05})`);
        halo.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(m.x, m.y, haloR, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // Core
        const core = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.size);
        core.addColorStop(0, `rgba(${Math.min(r + 50, 255)},${Math.min(g + 50, 255)},${Math.min(b + 40, 255)},${alpha})`);
        core.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fillStyle = core;
        ctx.fill();

        return true;
      });

      // ── Logo poof: instantly hide logo, replace with dense particle cloud ──
      if (t >= 2.4 && !fizzleDone) {
        fizzleDone = true;

        // Snap logo off — no transition
        setLogoStyle({
          opacity: 0,
          scale: 1,
          transition: "opacity 0.05s linear",
        });

        // Start overlay fade
        setOverlayOpacity(0);

        // Dense particle cloud filling the logo's footprint
        const cx = w / 2;
        const cy = h * 0.46;
        const logoW = 400;
        const logoH = 260;
        const count = 300;
        const baseLife = 700; // all within 250ms of each other (700-950ms)

        for (let i = 0; i < count; i++) {
          const px = cx + (Math.random() - 0.5) * logoW;
          const py = cy + (Math.random() - 0.5) * logoH;
          const angle = Math.atan2(py - cy, px - cx) + (Math.random() - 0.5) * 0.4;
          const dist = Math.hypot(px - cx, py - cy);
          // Particles further from center move faster outward
          const spd = (dist / 200) * 1.8 + Math.random() * 1.2 + 0.3;
          motes.current.push({
            x: px,
            y: py,
            vx: Math.cos(angle) * spd + (Math.random() - 0.5) * 0.4,
            vy: Math.sin(angle) * spd - Math.random() * 0.4,
            size: Math.random() * 2.2 + 0.6,
            peak: Math.random() * 0.6 + 0.4,
            born: now,
            lifespan: baseLife + Math.random() * 250, // 700-950ms spread
            color: GOLD[Math.floor(Math.random() * GOLD.length)],
          });
        }
      }

      // ── Complete: t=3.8 ──
      if (t >= 3.8 && !completedRef.current) {
        completedRef.current = true;
        setDone(true);
        onCompleteCb();
        return;
      }

      animRef.current = requestAnimationFrame(frame);
    };

    animRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [onCompleteCb]);

  if (done) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{
        backgroundColor: "#070709",
        opacity: overlayOpacity,
        transition: "opacity 1.2s ease-out",
        pointerEvents: overlayOpacity === 0 ? "none" : "all",
      }}
    >
      {/* Canvas: glow + particles — all in one */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Logo */}
      <div
        className="relative z-10"
        style={{
          opacity: logoStyle.opacity,
          transform: `scale(${logoStyle.scale})`,
          transition: logoStyle.transition,
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
          style={{ filter: "drop-shadow(0 0 20px rgba(200,168,78,0.1))" }}
        />
      </div>
    </div>
  );
}
