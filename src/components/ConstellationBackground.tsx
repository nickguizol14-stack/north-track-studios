"use client";

import { useEffect, useRef } from "react";

/**
 * A background canvas that renders ambient gold particles blended with
 * constellation-style connections. Designed to sit behind the Process
 * section as a continuation of the Star Chart transition above.
 *
 * Combines the existing GoldParticles aesthetic (drifting, glowing dots)
 * with persistent constellation lines that slowly shift over time.
 */

interface ConstellationStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  brightness: number;
  twinkleOffset: number;
  twinkleSpeed: number;
  wobbleAmp: number;
  wobbleSpeed: number;
  isConstellation: boolean;
}

function getGoldColors() {
  const cs = getComputedStyle(document.documentElement);
  const r = parseInt(cs.getPropertyValue("--glow-r")) || 200;
  const g = parseInt(cs.getPropertyValue("--glow-g")) || 168;
  const b = parseInt(cs.getPropertyValue("--glow-b")) || 78;
  return { r, g, b };
}

export function ConstellationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<ConstellationStar[]>([]);
  const initRef = useRef(false);
  const animRef = useRef<number>(0);
  const frameRef = useRef(0);
  const colorsRef = useRef({ r: 200, g: 168, b: 78 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reduced motion check
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
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

    if (!initRef.current) {
      initRef.current = true;

      // Ambient drifting particles — like GoldParticles but sparser
      for (let i = 0; i < 35; i++) {
        starsRef.current.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.15,
          vy: -Math.random() * 0.2 - 0.05,
          size: Math.random() * 2.5 + 0.8,
          brightness: Math.random() * 0.4 + 0.15,
          twinkleOffset: Math.random() * Math.PI * 2,
          twinkleSpeed: Math.random() * 0.04 + 0.008,
          wobbleAmp: Math.random() * 1 + 0.3,
          wobbleSpeed: Math.random() * 0.015 + 0.003,
          isConstellation: false,
        });
      }

      // Constellation anchor points — these move very slowly and form connections
      // Spread across the section in a loose organic grid
      const cols = 6;
      const rows = 4;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Skip some positions for organic feel
          if (Math.random() < 0.3) continue;

          starsRef.current.push({
            x: (col + 0.5) / cols * w + (Math.random() - 0.5) * (w / cols) * 0.5,
            y: (row + 0.5) / rows * h + (Math.random() - 0.5) * (h / rows) * 0.5,
            vx: (Math.random() - 0.5) * 0.08,
            vy: (Math.random() - 0.5) * 0.06,
            size: Math.random() * 2 + 1.5,
            brightness: Math.random() * 0.3 + 0.35,
            twinkleOffset: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.025 + 0.008,
            wobbleAmp: Math.random() * 0.8 + 0.2,
            wobbleSpeed: Math.random() * 0.008 + 0.002,
            isConstellation: true,
          });
        }
      }
    }

    let colorRefresh = 0;

    const animate = () => {
      frameRef.current++;
      const frame = frameRef.current;

      // Refresh colors periodically
      colorRefresh++;
      if (colorRefresh >= 60) {
        colorsRef.current = getGoldColors();
        colorRefresh = 0;
      }

      const { r, g, b } = colorsRef.current;

      ctx.clearRect(0, 0, w, h);

      const stars = starsRef.current;
      const constStars = stars.filter((s) => s.isConstellation);

      // Update positions
      for (const star of stars) {
        star.x += star.vx + Math.sin(frame * star.wobbleSpeed) * star.wobbleAmp * 0.15;
        star.y += star.vy;

        // Wrap particles
        if (star.isConstellation) {
          // Constellation stars bounce gently
          if (star.x < 20 || star.x > w - 20) star.vx *= -1;
          if (star.y < 20 || star.y > h - 20) star.vy *= -1;
        } else {
          // Ambient particles recycle
          if (star.y < -15) {
            star.y = h + 10;
            star.x = Math.random() * w;
          }
          if (star.x < -15) star.x = w + 10;
          if (star.x > w + 15) star.x = -10;
        }
      }

      // Draw constellation connections between nearby constellation stars
      const maxDist = Math.min(w, h) * 0.28;
      const drawnPairs = new Set<string>();

      for (let i = 0; i < constStars.length; i++) {
        const a = constStars[i];
        // Find 2-3 nearest constellation neighbors
        const neighbors: { star: ConstellationStar; dist: number }[] = [];

        for (let j = 0; j < constStars.length; j++) {
          if (i === j) continue;
          const bStar = constStars[j];
          const dx = a.x - bStar.x;
          const dy = a.y - bStar.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            neighbors.push({ star: bStar, dist });
          }
        }

        neighbors.sort((n1, n2) => n1.dist - n2.dist);
        const connectTo = neighbors.slice(0, 2);

        for (const neighbor of connectTo) {
          const key = `${Math.min(a.x, neighbor.star.x).toFixed(0)}-${Math.min(a.y, neighbor.star.y).toFixed(0)}`;
          if (drawnPairs.has(key)) continue;
          drawnPairs.add(key);

          const distRatio = neighbor.dist / maxDist;
          const lineAlpha = (1 - distRatio) * 0.12;

          if (lineAlpha < 0.01) continue;

          ctx.strokeStyle = `rgba(${r},${g},${b},${lineAlpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(neighbor.star.x, neighbor.star.y);
          ctx.stroke();
        }
      }

      // Draw all stars
      for (const star of stars) {
        const twinkle = (Math.sin(frame * star.twinkleSpeed + star.twinkleOffset) + 1) / 2;
        const a = star.brightness * (0.5 + twinkle * 0.5);

        // Outer glow
        const glowR = star.size * (star.isConstellation ? 5 : 4);
        const grad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowR);
        grad.addColorStop(0, `rgba(${r},${g},${b},${a * 0.25})`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},${a * 0.06})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(star.x, star.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core
        const coreGrad = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size);
        coreGrad.addColorStop(0, `rgba(${Math.min(r + 40, 255)},${Math.min(g + 40, 255)},${Math.min(b + 30, 255)},${a})`);
        coreGrad.addColorStop(0.6, `rgba(${r},${g},${b},${a * 0.6})`);
        coreGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();

        // Cross flare on brighter constellation stars
        if (star.isConstellation && star.brightness > 0.45) {
          const flareLen = star.size * 5 * twinkle;
          ctx.strokeStyle = `rgba(${r},${g},${b},${a * 0.1})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(star.x - flareLen, star.y);
          ctx.lineTo(star.x + flareLen, star.y);
          ctx.moveTo(star.x, star.y - flareLen);
          ctx.lineTo(star.x, star.y + flareLen);
          ctx.stroke();
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
      style={{ zIndex: 0 }}
    />
  );
}
