"use client";

import { useEffect, useRef, useMemo } from "react";
import { useScrollProgress } from "./useScrollProgress";

// ─── Types ───────────────────────────────────────────────────────────────

type TransitionVariant =
  | "descent-grid"
  | "gold-convergence"
  | "ember-rise"
  | "compass-pulse"
  | "brush-sweep"
  | "settling-dust";

interface ScrollTransitionProps {
  variant: TransitionVariant;
  height?: string;
  className?: string;
}

// ─── Main component ──────────────────────────────────────────────────────

export function ScrollTransition({
  variant,
  height,
  className = "",
}: ScrollTransitionProps) {
  const defaultHeights: Record<TransitionVariant, string> = {
    "descent-grid": "80vh",
    "gold-convergence": "40vh",
    "ember-rise": "80vh",
    "compass-pulse": "40vh",
    "brush-sweep": "50vh",
    "settling-dust": "40vh",
  };

  const h = height || defaultHeights[variant];

  const renderers: Record<TransitionVariant, React.FC> = {
    "descent-grid": DescentGrid,
    "gold-convergence": GoldConvergence,
    "ember-rise": EmberRise,
    "compass-pulse": CompassPulse,
    "brush-sweep": BrushSweep,
    "settling-dust": SettlingDust,
  };

  const Renderer = renderers[variant];

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ height: h }}
    >
      <Renderer />
    </div>
  );
}

// ─── Shared: read theme colors from CSS vars ────────────────────────────

function getGoldColors() {
  const cs = getComputedStyle(document.documentElement);
  const r = parseInt(cs.getPropertyValue("--glow-r")) || 200;
  const g = parseInt(cs.getPropertyValue("--glow-g")) || 168;
  const b = parseInt(cs.getPropertyValue("--glow-b")) || 78;
  return { r, g, b };
}

// ─── Shared: ease functions ─────────────────────────────────────────────

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. DESCENT INTO THE GRID — Hero → Services
// ═══════════════════════════════════════════════════════════════════════════

function DescentGrid() {
  const { ref, progress } = useScrollProgress();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<{ x: number; y: number; vy: number; size: number; alpha: number; speed: number }[]>([]);
  const initRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = ref.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    if (!initRef.current) {
      initRef.current = true;
      const rect = container.getBoundingClientRect();
      for (let i = 0; i < 50; i++) {
        particlesRef.current.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vy: Math.random() * 0.5 + 0.2,
          size: Math.random() * 2.5 + 0.8,
          alpha: Math.random() * 0.6 + 0.2,
          speed: Math.random() * 0.3 + 0.1,
        });
      }
    }

    return () => window.removeEventListener("resize", resize);
  }, [ref]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = ref.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const { r, g, b } = getGoldColors();

    ctx.clearRect(0, 0, w, h);

    const p = progress;
    const gridAlpha = easeInOut(Math.max(0, Math.min(1, (p - 0.1) / 0.5)));
    const particleIntensity = easeOut(Math.min(1, p / 0.6));
    const glowPulse = p > 0.5 && p < 0.8 ? Math.sin((p - 0.5) / 0.3 * Math.PI) * 0.3 : 0;

    // Background gradient — transition from black to surface
    const bgAlpha = easeOut(Math.min(1, p / 0.8));
    ctx.fillStyle = `rgba(18, 17, 26, ${bgAlpha * 0.6})`;
    ctx.fillRect(0, 0, w, h);

    // Grid — expanding from center
    if (gridAlpha > 0.01) {
      const gridSize = 140;
      const cx = w / 2;
      const cy = h / 2;
      const maxRadius = Math.sqrt(cx * cx + cy * cy);
      const revealRadius = easeOut(Math.min(1, (p - 0.05) / 0.6)) * maxRadius;

      ctx.strokeStyle = `rgba(${r},${g},${b},${gridAlpha * 0.08 + glowPulse * 0.06})`;
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = cx % gridSize; x < w; x += gridSize) {
        const distFromCenter = Math.abs(x - cx);
        if (distFromCenter > revealRadius) continue;
        const lineAlpha = 1 - distFromCenter / revealRadius;
        ctx.globalAlpha = lineAlpha * gridAlpha;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = cy % gridSize; y < h; y += gridSize) {
        const distFromCenter = Math.abs(y - cy);
        if (distFromCenter > revealRadius) continue;
        const lineAlpha = 1 - distFromCenter / revealRadius;
        ctx.globalAlpha = lineAlpha * gridAlpha;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    }

    // Particles — drifting downward, increasing density
    for (const pt of particlesRef.current) {
      pt.y += pt.vy * particleIntensity;
      if (pt.y > h + 10) {
        pt.y = -10;
        pt.x = Math.random() * w;
      }

      const a = pt.alpha * particleIntensity;
      if (a < 0.01) continue;

      const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.size * 3);
      grad.addColorStop(0, `rgba(${r + 20},${g + 22},${b + 30},${a})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Center glow pulse
    if (glowPulse > 0.01) {
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.min(w, h) * 0.4);
      grad.addColorStop(0, `rgba(${r},${g},${b},${glowPulse * 0.15})`);
      grad.addColorStop(0.5, `rgba(${r},${g},${b},${glowPulse * 0.05})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  }, [progress, ref]);

  return (
    <div ref={ref} className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. GOLD LINE CONVERGENCE — Services → Work
// ═══════════════════════════════════════════════════════════════════════════

function GoldConvergence() {
  const { ref, progress } = useScrollProgress();

  const lines = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      fromLeft: i % 2 === 0,
      yOffset: (i - 3.5) * 12,
      speed: 0.7 + Math.random() * 0.3,
      delay: i * 0.06,
      thickness: Math.random() * 0.5 + 0.5,
    }));
  }, []);

  const p = progress;
  const flare = p > 0.6 && p < 0.85 ? Math.sin((p - 0.6) / 0.25 * Math.PI) : 0;
  const fadeOut = p > 0.85 ? 1 - (p - 0.85) / 0.15 : 1;

  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center">
      {/* Lines */}
      {lines.map((line, i) => {
        const lineProgress = easeOut(Math.max(0, Math.min(1, (p - line.delay) / line.speed)));
        const x = line.fromLeft
          ? `${-50 + lineProgress * 50}%`
          : `${150 - lineProgress * 50}%`;
        const width = `${lineProgress * 50}%`;

        return (
          <div
            key={i}
            className="absolute"
            style={{
              top: `calc(50% + ${line.yOffset}px)`,
              left: line.fromLeft ? "0" : undefined,
              right: line.fromLeft ? undefined : "0",
              width,
              height: `${line.thickness}px`,
              background: line.fromLeft
                ? `linear-gradient(90deg, transparent, rgba(var(--glow-r, 200), var(--glow-g, 168), var(--glow-b, 78), ${0.3 * fadeOut}))`
                : `linear-gradient(270deg, transparent, rgba(var(--glow-r, 200), var(--glow-g, 168), var(--glow-b, 78), ${0.3 * fadeOut}))`,
              opacity: lineProgress > 0.01 ? fadeOut : 0,
              transition: "none",
            }}
          />
        );
      })}

      {/* Center flare */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "200px",
          height: "4px",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse at center, var(--gold-glow-strong) 0%, transparent 70%)`,
          opacity: flare * fadeOut,
          boxShadow: flare > 0.1 ? `0 0 30px var(--gold-glow-strong), 0 0 60px var(--gold-glow)` : "none",
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. EMBER RISE — Work → About
// ═══════════════════════════════════════════════════════════════════════════

interface Ember {
  x: number;
  baseY: number;
  size: number;
  alpha: number;
  drift: number;
  speed: number;
  wobble: number;
}

function EmberRise() {
  const { ref, progress } = useScrollProgress();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const embersRef = useRef<Ember[]>([]);
  const initRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = ref.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    if (!initRef.current) {
      initRef.current = true;
      const rect = container.getBoundingClientRect();
      for (let i = 0; i < 80; i++) {
        embersRef.current.push({
          x: Math.random() * rect.width,
          baseY: Math.random(),
          size: Math.random() * 3 + 1,
          alpha: Math.random() * 0.7 + 0.2,
          drift: (Math.random() - 0.5) * 2,
          speed: Math.random() * 0.4 + 0.3,
          wobble: Math.random() * Math.PI * 2,
        });
      }
    }

    return () => window.removeEventListener("resize", resize);
  }, [ref]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = ref.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const { r, g, b } = getGoldColors();

    ctx.clearRect(0, 0, w, h);

    const p = progress;
    const density = easeOut(Math.min(1, p / 0.5));
    const glowBloom = p > 0.35 && p < 0.7
      ? Math.sin((p - 0.35) / 0.35 * Math.PI) : 0;
    const fadeEnd = p > 0.75 ? 1 - (p - 0.75) / 0.25 : 1;

    // Embers rising
    const visibleCount = Math.floor(embersRef.current.length * density);
    for (let i = 0; i < visibleCount; i++) {
      const em = embersRef.current[i];
      const rise = p * em.speed;
      const y = h * (1 - em.baseY) - rise * h * 0.8;
      const x = em.x + Math.sin(em.wobble + p * 4) * em.drift * 15;

      if (y < -20 || y > h + 20) continue;

      const a = em.alpha * fadeEnd;
      if (a < 0.01) continue;

      // Glow
      const glowR = em.size * 5;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, glowR);
      grad.addColorStop(0, `rgba(${Math.min(r + 40, 255)},${Math.min(g + 30, 255)},${Math.min(b + 20, 255)},${a * 0.4})`);
      grad.addColorStop(0.4, `rgba(${r},${g},${b},${a * 0.15})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(x, y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(x, y, em.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${Math.min(r + 50, 255)},${Math.min(g + 50, 255)},${Math.min(b + 40, 255)},${a})`;
      ctx.fill();
    }

    // Center radial bloom
    if (glowBloom > 0.01) {
      const bloomR = Math.min(w, h) * 0.5;
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, bloomR);
      grad.addColorStop(0, `rgba(${r},${g},${b},${glowBloom * 0.2 * fadeEnd})`);
      grad.addColorStop(0.3, `rgba(${r},${g},${b},${glowBloom * 0.08 * fadeEnd})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  }, [progress, ref]);

  return (
    <div ref={ref} className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. COMPASS PULSE — About → Process
// ═══════════════════════════════════════════════════════════════════════════

function CompassPulse() {
  const { ref, progress } = useScrollProgress();

  const p = progress;
  const compassAlpha = easeInOut(Math.min(1, p / 0.4)) * (p > 0.8 ? (1 - p) / 0.2 : 1);
  const rotation = p * 45;
  const ringProgress = Math.max(0, Math.min(1, (p - 0.4) / 0.4));
  const ringScale = easeOut(ringProgress);
  const ringAlpha = ringProgress > 0 ? (1 - ringProgress) * 0.4 : 0;

  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center">
      {/* Compass rose */}
      <div
        className="pointer-events-none"
        style={{
          opacity: compassAlpha * 0.04,
          transform: `rotate(${rotation}deg)`,
        }}
      >
        <svg width="300" height="300" viewBox="0 0 200 200" fill="none">
          {/* Outer ring */}
          <circle cx="100" cy="100" r="90" stroke="var(--gold)" strokeWidth="0.5" opacity="0.6" />
          <circle cx="100" cy="100" r="70" stroke="var(--gold)" strokeWidth="0.3" opacity="0.3" />
          {/* Cardinal points */}
          <path d="M100 10 L104 100 L100 95 L96 100 Z" fill="var(--gold)" opacity="0.8" />
          <path d="M100 190 L96 100 L100 105 L104 100 Z" fill="var(--gold)" opacity="0.4" />
          <path d="M10 100 L100 96 L95 100 L100 104 Z" fill="var(--gold)" opacity="0.4" />
          <path d="M190 100 L100 104 L105 100 L100 96 Z" fill="var(--gold)" opacity="0.4" />
          {/* Intercardinals */}
          <path d="M30 30 L98 96 L96 98 Z" fill="var(--gold)" opacity="0.2" />
          <path d="M170 30 L104 96 L102 98 Z" fill="var(--gold)" opacity="0.2" />
          <path d="M30 170 L96 104 L98 102 Z" fill="var(--gold)" opacity="0.2" />
          <path d="M170 170 L104 104 L102 102 Z" fill="var(--gold)" opacity="0.2" />
          {/* Center dot */}
          <circle cx="100" cy="100" r="3" fill="var(--gold)" opacity="0.6" />
          {/* Tick marks */}
          {Array.from({ length: 36 }, (_, i) => {
            const angle = (i * 10 * Math.PI) / 180;
            const r1 = i % 9 === 0 ? 82 : 86;
            const r2 = 90;
            return (
              <line
                key={i}
                x1={100 + r1 * Math.sin(angle)}
                y1={100 - r1 * Math.cos(angle)}
                x2={100 + r2 * Math.sin(angle)}
                y2={100 - r2 * Math.cos(angle)}
                stroke="var(--gold)"
                strokeWidth={i % 9 === 0 ? "1" : "0.3"}
                opacity={i % 9 === 0 ? "0.5" : "0.2"}
              />
            );
          })}
        </svg>
      </div>

      {/* Sonar ring */}
      {ringProgress > 0 && (
        <div
          className="absolute rounded-full border pointer-events-none"
          style={{
            width: `${80 + ringScale * 400}px`,
            height: `${80 + ringScale * 400}px`,
            borderColor: `rgba(var(--glow-r, 200), var(--glow-g, 168), var(--glow-b, 78), ${ringAlpha})`,
            borderWidth: "1px",
            boxShadow: ringAlpha > 0.05
              ? `0 0 ${20 * ringAlpha}px var(--gold-glow), inset 0 0 ${10 * ringAlpha}px var(--gold-glow)`
              : "none",
          }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. BRUSH SWEEP — Process → Survey
// ═══════════════════════════════════════════════════════════════════════════

function BrushSweep() {
  const { ref, progress } = useScrollProgress();

  const p = progress;
  const sweepProgress = easeOut(Math.max(0, Math.min(1, (p - 0.1) / 0.6)));
  const fadeOut = p > 0.75 ? (1 - (p - 0.75) / 0.25) : 1;

  // Generate a jagged brush edge similar to GoldBrushText
  const edgePoints = useMemo(() => {
    const pts = 20;
    const raw = Array.from({ length: pts }, () => (Math.random() - 0.5) * 6);
    for (let pass = 0; pass < 3; pass++) {
      for (let i = 1; i < raw.length - 1; i++) {
        raw[i] = (raw[i - 1] + raw[i] + raw[i + 1]) / 3;
      }
    }
    return raw;
  }, []);

  // Build clip-path polygon
  const buildClipPath = () => {
    if (sweepProgress < 0.01) return "inset(0 100% 0 0)";
    if (sweepProgress > 0.99) return "none";

    const revealPct = sweepProgress * 105;
    const points: string[] = ["0% 0%"];

    points.push(`${Math.min(revealPct - 2, 100)}% 0%`);

    for (let i = 0; i < edgePoints.length; i++) {
      const t = i / (edgePoints.length - 1);
      const y = t * 100;
      const jag = edgePoints[i] * (1 - sweepProgress * 0.6);
      const x = Math.min(Math.max(revealPct + jag, 0), 105);
      points.push(`${x}% ${y}%`);
    }

    points.push(`${Math.min(revealPct - 2, 100)}% 100%`);
    points.push("0% 100%");

    return `polygon(${points.join(", ")})`;
  };

  return (
    <div ref={ref} className="absolute inset-0 flex items-center">
      {/* Brush stroke band */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "40%",
          height: "20%",
          background: "linear-gradient(180deg, transparent 0%, var(--gold-glow) 30%, var(--gold-glow-strong) 50%, var(--gold-glow) 70%, transparent 100%)",
          clipPath: buildClipPath(),
          opacity: fadeOut * 0.7,
        }}
      />

      {/* Bright center line within the stroke */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "49.5%",
          height: "1%",
          background: "linear-gradient(90deg, transparent 0%, var(--gold) 15%, var(--gold-bright) 50%, var(--gold) 85%, transparent 100%)",
          clipPath: buildClipPath(),
          opacity: fadeOut * 0.4,
          boxShadow: sweepProgress > 0.1 ? "0 0 12px var(--gold-glow), 0 0 30px var(--gold-glow)" : "none",
        }}
      />

      {/* Residual wash — stays behind after the sweep */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, transparent 20%, var(--gold-glow) 50%, transparent 80%)",
          opacity: sweepProgress > 0.5 ? (sweepProgress - 0.5) * 0.3 * fadeOut : 0,
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. SETTLING DUST — Survey → Contact
// ═══════════════════════════════════════════════════════════════════════════

interface Dust {
  x: number;
  startY: number;
  size: number;
  alpha: number;
  drift: number;
}

function SettlingDust() {
  const { ref, progress } = useScrollProgress();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dustRef = useRef<Dust[]>([]);
  const initRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = ref.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    if (!initRef.current) {
      initRef.current = true;
      const rect = container.getBoundingClientRect();
      for (let i = 0; i < 40; i++) {
        dustRef.current.push({
          x: Math.random() * rect.width,
          startY: Math.random() * 0.3,
          size: Math.random() * 2 + 0.8,
          alpha: Math.random() * 0.5 + 0.15,
          drift: (Math.random() - 0.5) * 30,
        });
      }
    }

    return () => window.removeEventListener("resize", resize);
  }, [ref]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = ref.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const { r, g, b } = getGoldColors();

    ctx.clearRect(0, 0, w, h);

    const p = progress;
    const settleEase = easeOut(p);
    // Particles decelerate — they move fast early, slow down later
    const decel = p < 0.5 ? p * 1.5 : 0.75 + (p - 0.5) * 0.3;

    // Darkening overlay
    ctx.fillStyle = `rgba(7, 7, 9, ${p * 0.3})`;
    ctx.fillRect(0, 0, w, h);

    // Dust particles settling
    for (const d of dustRef.current) {
      const y = h * (d.startY + decel * 0.6);
      const x = d.x + d.drift * settleEase;

      if (y > h + 10) continue;

      const a = d.alpha * (1 - p * 0.3);
      if (a < 0.01) continue;

      const glowR = d.size * 4;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, glowR);
      grad.addColorStop(0, `rgba(${r + 20},${g + 20},${b + 20},${a * 0.35})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(x, y, glowR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, d.size * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r + 30},${g + 30},${b + 20},${a})`;
      ctx.fill();
    }

    // Center-outward gold line
    const lineProgress = easeOut(Math.max(0, Math.min(1, (p - 0.3) / 0.5)));
    if (lineProgress > 0.01) {
      const lineWidth = w * 0.4 * lineProgress;
      const cx = w / 2;
      const cy = h * 0.8;
      const lineAlpha = lineProgress * (p > 0.85 ? (1 - p) / 0.15 : 1) * 0.5;

      const grad = ctx.createLinearGradient(cx - lineWidth, cy, cx + lineWidth, cy);
      grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
      grad.addColorStop(0.2, `rgba(${r},${g},${b},${lineAlpha})`);
      grad.addColorStop(0.5, `rgba(${r + 30},${g + 30},${b + 20},${lineAlpha * 1.3})`);
      grad.addColorStop(0.8, `rgba(${r},${g},${b},${lineAlpha})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

      ctx.fillStyle = grad;
      ctx.fillRect(cx - lineWidth, cy - 1, lineWidth * 2, 2);

      // Glow around the line
      if (lineAlpha > 0.1) {
        const glowGrad = ctx.createLinearGradient(cx - lineWidth, cy, cx + lineWidth, cy);
        glowGrad.addColorStop(0, `rgba(${r},${g},${b},0)`);
        glowGrad.addColorStop(0.3, `rgba(${r},${g},${b},${lineAlpha * 0.15})`);
        glowGrad.addColorStop(0.7, `rgba(${r},${g},${b},${lineAlpha * 0.15})`);
        glowGrad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = glowGrad;
        ctx.fillRect(cx - lineWidth, cy - 15, lineWidth * 2, 30);
      }
    }
  }, [progress, ref]);

  return (
    <div ref={ref} className="absolute inset-0">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}
