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

    // Preload logo image for pixel sampling during fizzle
    const logoImg = new window.Image();
    logoImg.crossOrigin = "anonymous";
    logoImg.src = "/logo.png";

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
      const heavy = motes.current.length > 200;
      motes.current = motes.current.filter((m) => {
        const age = now - m.born;
        if (age > m.lifespan) return false;

        m.x += m.vx;
        m.y += m.vy;
        m.vx *= 0.997;
        m.vy *= 0.997;

        const lifeP = age / m.lifespan;
        let alpha: number;
        if (lifeP < 0.1) alpha = (lifeP / 0.1) * m.peak;
        else if (lifeP > 0.5) alpha = ((1 - lifeP) / 0.5) * m.peak;
        else alpha = m.peak;

        const [r, g, b] = m.color;

        if (heavy) {
          // Fast path: simple filled circle, no gradients
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.fill();
        } else {
          // Full quality: glow halo + core gradient
          const haloR = m.size * 5;
          const halo = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, haloR);
          halo.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.2})`);
          halo.addColorStop(0.5, `rgba(${r},${g},${b},${alpha * 0.05})`);
          halo.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.beginPath();
          ctx.arc(m.x, m.y, haloR, 0, Math.PI * 2);
          ctx.fillStyle = halo;
          ctx.fill();

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

      // ── Logo poof: sample pixels, replace with exact-shape particle cloud ──
      if (t >= 2.4 && !fizzleDone) {
        fizzleDone = true;

        // Snap logo off instantly
        setLogoStyle({
          opacity: 0,
          scale: 1,
          transition: "opacity 0.01s linear",
        });

        // Start overlay fade
        setOverlayOpacity(0);

        // Sample the logo image pixels to spawn particles in its exact shape
        const cx = w / 2;
        const cy = h * 0.46;
        const displayW = 420;
        const displayH = 280;

        if (logoImg.complete && logoImg.naturalWidth > 0) {
          const offscreen = document.createElement("canvas");
          const sampleW = displayW;
          const sampleH = displayH;
          offscreen.width = sampleW;
          offscreen.height = sampleH;
          const offCtx = offscreen.getContext("2d");
          if (offCtx) {
            offCtx.drawImage(logoImg, 0, 0, sampleW, sampleH);
            const imageData = offCtx.getImageData(0, 0, sampleW, sampleH);
            const pixels = imageData.data;

            const step = 3;
            const originX = cx - displayW / 2;
            const originY = cy - displayH / 2;

            // 20 speed tiers × 8 lifespan sub-levels = 160 combos
            // Wind-blown: each particle gets a random direction (not radial)
            // with varying drift speeds from "barely floating" to "swept away"
            const TIERS = 20;
            const SUBS = 8;
            const minSpd = 0.1;
            const maxSpd = 18;  // fast enough to clear the screen
            const minLife = 100;
            const maxLife = 1500;

            for (let sy = 0; sy < sampleH; sy += step) {
              for (let sx = 0; sx < sampleW; sx += step) {
                const idx = (sy * sampleW + sx) * 4;
                const a = pixels[idx + 3];
                if (a < 40) continue;

                const px = originX + sx;
                const py = originY + sy;
                const peakAlpha = (a / 255) * 0.8 + 0.2;

                // Random tier and sub-level
                const tier = Math.floor(Math.random() * TIERS);
                const sub = Math.floor(Math.random() * SUBS);
                const tN = tier / (TIERS - 1); // 0..1
                const sN = sub / (SUBS - 1);   // 0..1

                // Wind direction: random for each particle, not radial from center
                const windAngle = Math.random() * Math.PI * 2;

                // Speed: exponential curve so low tiers cluster near still,
                // high tiers spread far apart — bigger gaps between fast layers
                const spd = minSpd + (maxSpd - minSpd) * (tN * tN);
                const jitteredSpd = spd * (0.8 + Math.random() * 0.4);

                // Life: slow particles die fast, fast ones live longer to travel far
                // Sub-levels spread within each tier
                const tierLife = minLife + (maxLife - minLife) * tN;
                const subSpread = 60 * tN; // more spread for faster tiers
                const life = tierLife + (sN - 0.5) * subSpread;

                // Perpendicular wobble for organic wind feel
                const perpAngle = windAngle + Math.PI / 2;
                const wobble = (Math.random() - 0.5) * 1.5 * tN;

                motes.current.push({
                  x: px,
                  y: py,
                  vx: Math.cos(windAngle) * jitteredSpd + Math.cos(perpAngle) * wobble,
                  vy: Math.sin(windAngle) * jitteredSpd + Math.sin(perpAngle) * wobble,
                  size: Math.random() * 1.4 + 0.6 + (1 - tN) * 0.8,
                  peak: peakAlpha * (0.5 + (1 - tN) * 0.5),
                  born: now,
                  lifespan: life,
                  color: GOLD[Math.floor(Math.random() * GOLD.length)],
                });
              }
            }
          }
        }
      }

      // ── Complete: t=4.5 ──
      if (t >= 4.5 && !completedRef.current) {
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
