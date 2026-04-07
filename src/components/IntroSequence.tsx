"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

/**
 * IntroSequence v3 — Breath-of-the-Wild shrine explosion
 *
 * Logo fades in, gentle glow pulse builds, then at the climax:
 * a blinding core flash and hundreds of elongated gold streaks
 * explode radially outward from center. Streaks are velocity-
 * proportional — fast ones are long bright lines, slow ones are
 * short sparks. Friction decelerates them into a slow fizzle,
 * streaks shorten as speed drops, and lingering embers fade out.
 */

const GOLD = [
  [200, 168, 78],
  [218, 190, 110],
  [232, 212, 138],
  [180, 148, 58],
  [245, 225, 160],
];

const GOLD_BRIGHT = [
  [255, 240, 200],
  [255, 230, 180],
  [250, 225, 170],
  [255, 245, 210],
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
  // Streak explosion properties
  streak: boolean;
  friction: number;
  initialSpeed: number;
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

  // Flash state for the core explosion
  const flashRef = useRef(0); // 0-1 intensity

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

    // ─── Spawn ambient drifters (gentle atmosphere) ─────────────────────
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
          streak: false,
          friction: 0.999,
          initialSpeed: 0,
        });
      }
    };

    // ─── BotW-style radial streak explosion ─────────────────────────────
    const spawnExplosion = (now: number) => {
      const cx = w / 2;
      const cy = h * 0.46;

      // === Layer 1: Ultra-fast long streaks (the "boom" lines) ===
      for (let i = 0; i < 120; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 12 + Math.random() * 20; // very fast
        const jitter = (Math.random() - 0.5) * 2;
        motes.current.push({
          x: cx + (Math.random() - 0.5) * 10,
          y: cy + (Math.random() - 0.5) * 10,
          vx: Math.cos(angle) * speed + jitter,
          vy: Math.sin(angle) * speed + jitter,
          size: Math.random() * 2 + 1.5,
          peak: Math.random() * 0.5 + 0.5,
          born: now,
          lifespan: 600 + Math.random() * 500,
          color: GOLD_BRIGHT[Math.floor(Math.random() * GOLD_BRIGHT.length)],
          streak: true,
          friction: 0.955 + Math.random() * 0.02,
          initialSpeed: speed,
        });
      }

      // === Layer 2: Fast streaks (medium range) ===
      for (let i = 0; i < 200; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 5 + Math.random() * 12;
        motes.current.push({
          x: cx + (Math.random() - 0.5) * 15,
          y: cy + (Math.random() - 0.5) * 15,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 1.5,
          vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 1.5,
          size: Math.random() * 1.8 + 1,
          peak: Math.random() * 0.6 + 0.3,
          born: now,
          lifespan: 800 + Math.random() * 700,
          color: GOLD[Math.floor(Math.random() * GOLD.length)],
          streak: true,
          friction: 0.965 + Math.random() * 0.015,
          initialSpeed: speed,
        });
      }

      // === Layer 3: Slow sparks (the fizzle / lingerers) ===
      for (let i = 0; i < 150; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 5;
        motes.current.push({
          x: cx + (Math.random() - 0.5) * 20,
          y: cy + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.8,
          vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 0.8,
          size: Math.random() * 1.5 + 0.5,
          peak: Math.random() * 0.4 + 0.2,
          born: now,
          lifespan: 1200 + Math.random() * 1200,
          color: GOLD[Math.floor(Math.random() * GOLD.length)],
          streak: true,
          friction: 0.975 + Math.random() * 0.015,
          initialSpeed: speed,
        });
      }

      // === Layer 4: Tiny ember dust (stays near center, fades slowly) ===
      for (let i = 0; i < 80; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.2 + Math.random() * 1.5;
        motes.current.push({
          x: cx + (Math.random() - 0.5) * 30,
          y: cy + (Math.random() - 0.5) * 30,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.3,
          vy: Math.sin(angle) * speed - Math.random() * 0.2,
          size: Math.random() * 1.2 + 0.4,
          peak: Math.random() * 0.35 + 0.15,
          born: now,
          lifespan: 1800 + Math.random() * 1500,
          color: GOLD[Math.floor(Math.random() * GOLD.length)],
          streak: false, // embers are dots, not streaks
          friction: 0.992,
          initialSpeed: speed,
        });
      }
    };

    let ambientDone = false;
    let explosionDone = false;
    let explosionTime = 0;

    // ─── The animation loop ─────────────────────────────────────────────

    const frame = (now: number) => {
      const elapsed = now - startTime.current;
      const t = elapsed / 1000;

      ctx.clearRect(0, 0, w, h);

      // ── Logo fade-in ──
      if (t >= 0.2 && t < 0.25) {
        setLogoStyle({
          opacity: 1,
          scale: 1,
          transition: "opacity 0.7s ease-out, transform 0.14s ease",
        });
      }

      // ── Building glow pulse: stronger and longer, building tension ──
      let glow = 0;
      if (t >= 0.6 && t <= 2.3) {
        const p = (t - 0.6) / 1.7;
        // Builds up steadily, peaks right before explosion
        glow = Math.pow(Math.sin(p * Math.PI * 0.5), 0.7) * 0.65;
      }
      // Intensity spike right before explosion
      if (t >= 2.0 && t < 2.4) {
        const ramp = (t - 2.0) / 0.4;
        glow = Math.max(glow, 0.65 + ramp * 0.35);
      }

      // ── Spawn ambient particles ──
      if (t >= 0.8 && !ambientDone) {
        ambientDone = true;
        spawnAmbient(now, 35);
      }

      // ── Backlight glow behind logo ──
      if (glow > 0.01) {
        const cx = w / 2;
        const cy = h * 0.46;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1.5, 1);

        const core = ctx.createRadialGradient(0, 0, 0, 0, 0, 180);
        core.addColorStop(0, `rgba(200,168,78,${glow * 0.5})`);
        core.addColorStop(0.4, `rgba(200,168,78,${glow * 0.3})`);
        core.addColorStop(0.7, `rgba(200,168,78,${glow * 0.1})`);
        core.addColorStop(1, `rgba(200,168,78,0)`);
        ctx.fillStyle = core;
        ctx.fillRect(-300, -300, 600, 600);

        const bloom = ctx.createRadialGradient(0, 0, 80, 0, 0, 350);
        bloom.addColorStop(0, `rgba(200,168,78,${glow * 0.15})`);
        bloom.addColorStop(0.5, `rgba(200,168,78,${glow * 0.05})`);
        bloom.addColorStop(1, `rgba(200,168,78,0)`);
        ctx.fillStyle = bloom;
        ctx.fillRect(-500, -500, 1000, 1000);

        ctx.restore();
      }

      // ── THE EXPLOSION ──
      if (t >= 2.4 && !explosionDone) {
        explosionDone = true;
        explosionTime = now;
        flashRef.current = 1.0;

        // Kill logo instantly
        setLogoStyle({
          opacity: 0,
          scale: 1.05,
          transition: "opacity 0.01s linear, transform 0.01s linear",
        });

        // Start overlay fade (delayed slightly so explosion is visible)
        setTimeout(() => setOverlayOpacity(0), 600);

        // Spawn the BotW streak explosion
        spawnExplosion(now);
      }

      // ── Core flash — bright white-gold blast that fades ──
      if (flashRef.current > 0.01) {
        const cx = w / 2;
        const cy = h * 0.46;
        const fi = flashRef.current;

        // Decay flash
        flashRef.current *= 0.92;

        // White-hot center
        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        // Inner core — almost white
        const inner = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100 * fi);
        inner.addColorStop(0, `rgba(255,250,230,${fi * 0.9})`);
        inner.addColorStop(0.3, `rgba(255,235,180,${fi * 0.6})`);
        inner.addColorStop(0.6, `rgba(200,168,78,${fi * 0.3})`);
        inner.addColorStop(1, `rgba(200,168,78,0)`);
        ctx.fillStyle = inner;
        ctx.fillRect(cx - 200, cy - 200, 400, 400);

        // Wide bloom
        const wide = ctx.createRadialGradient(cx, cy, 0, cx, cy, 400 * fi);
        wide.addColorStop(0, `rgba(200,168,78,${fi * 0.25})`);
        wide.addColorStop(0.5, `rgba(200,168,78,${fi * 0.08})`);
        wide.addColorStop(1, `rgba(200,168,78,0)`);
        ctx.fillStyle = wide;
        ctx.fillRect(cx - 500, cy - 500, 1000, 1000);

        ctx.restore();
      }

      // ── Draw particles ──
      motes.current = motes.current.filter((m) => {
        const age = now - m.born;
        if (age > m.lifespan) return false;

        // Apply friction
        m.vx *= m.friction;
        m.vy *= m.friction;

        // Slight gravity for embers
        if (!m.streak) {
          m.vy += 0.003;
        }

        m.x += m.vx;
        m.y += m.vy;

        // Alpha: fade in fast, sustain, fade out slow
        const lifeP = age / m.lifespan;
        let alpha: number;
        if (lifeP < 0.05) alpha = (lifeP / 0.05) * m.peak;
        else if (lifeP > 0.4) alpha = ((1 - lifeP) / 0.6) * m.peak;
        else alpha = m.peak;

        const [r, g, b] = m.color;

        if (m.streak) {
          // ── Draw as elongated streak ──
          const speed = Math.sqrt(m.vx * m.vx + m.vy * m.vy);
          // Streak length proportional to current speed
          const streakLen = Math.min(speed * 4, 60);

          if (streakLen < 0.5) {
            // Slowed to a crawl — draw as dot
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.size * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.7})`;
            ctx.fill();
            return true;
          }

          // Direction of travel (normalized)
          const nx = m.vx / speed;
          const ny = m.vy / speed;

          // Tail position (behind the head)
          const tailX = m.x - nx * streakLen;
          const tailY = m.y - ny * streakLen;

          // Draw streak as a tapered line
          ctx.save();
          ctx.lineCap = "round";

          // Glow halo around the streak
          if (speed > 3) {
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.08})`;
            ctx.lineWidth = m.size * 6;
            ctx.stroke();
          }

          // Main streak body — gradient from dim tail to bright head
          const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
          grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
          grad.addColorStop(0.3, `rgba(${r},${g},${b},${alpha * 0.3})`);
          grad.addColorStop(0.7, `rgba(${r},${g},${b},${alpha * 0.7})`);
          grad.addColorStop(1, `rgba(${Math.min(r + 40, 255)},${Math.min(g + 40, 255)},${Math.min(b + 30, 255)},${alpha})`);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(m.x, m.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = m.size;
          ctx.stroke();

          // Bright head dot
          if (alpha > 0.2) {
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.size * 0.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${Math.min(r + 50, 255)},${Math.min(g + 50, 255)},${Math.min(b + 40, 255)},${alpha * 0.9})`;
            ctx.fill();
          }

          ctx.restore();
        } else {
          // ── Draw as regular particle (embers / ambient) ──
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
        }

        return true;
      });

      // ── Complete after explosion has fizzled ──
      if (explosionDone) {
        const timeSinceExplosion = (now - explosionTime) / 1000;
        if (timeSinceExplosion >= 2.5 && !completedRef.current) {
          completedRef.current = true;
          setDone(true);
          onCompleteCb();
          return;
        }
      }

      // Fallback timeout
      if (t >= 6 && !completedRef.current) {
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
        transition: "opacity 1.4s ease-out",
        pointerEvents: overlayOpacity === 0 ? "none" : "all",
      }}
    >
      {/* Canvas: glow + particles + flash */}
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
