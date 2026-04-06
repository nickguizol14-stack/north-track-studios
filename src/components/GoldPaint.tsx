"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// ─── Shared scroll-trigger hook ────────────────────────────────────────

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// ─���─ GoldBrushText ────────────────────��────────────────────────────────
//
// Headers paint themselves in from left to right with an organic brush
// edge. The clip-path is animated via JS for a jagged, hand-painted feel.
// Text starts hidden, then a brush sweep reveals it fast.
// Once painted, a radiate glow settles behind.

interface GoldBrushTextProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "span" | "p";
  className?: string;
  delay?: number;
  speed?: number; // ms for the paint sweep, default 1200
}

export function GoldBrushText({
  children,
  as: Tag = "h2",
  className = "",
  delay = 0,
  speed = 200,
}: GoldBrushTextProps) {
  const { ref, isVisible } = useScrollReveal(0.2);
  const textRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);
  const [settled, setSettled] = useState(false);
  const [clipPath, setClipPath] = useState("inset(0 100% 0 0)");

  // Generate a static jagged edge profile once
  const edgeRef = useRef<number[]>([]);
  if (edgeRef.current.length === 0) {
    const pts = 16;
    const raw = Array.from({ length: pts }, () => (Math.random() - 0.5) * 8);
    // Smooth
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 1; i < raw.length - 1; i++) {
        raw[i] = (raw[i - 1] + raw[i] + raw[i + 1]) / 3;
      }
    }
    edgeRef.current = raw;
  }

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;

    const timeout = setTimeout(() => {
      hasAnimated.current = true;
      const totalFrames = Math.ceil(speed / 16);
      const edge = edgeRef.current;
      let frame = 0;

      const animate = () => {
        frame++;
        const progress = Math.min(frame / totalFrames, 1);
        // Ease out — fast start, settling end
        const eased = 1 - Math.pow(1 - progress, 3);

        // Build polygon clip-path with organic right edge
        // Left side is straight, right side is the brush edge
        const revealPct = eased * 105; // go slightly past 100 to fully reveal
        const points: string[] = [];

        // Top-left
        points.push("0% 0%");

        // Top — straight to brush position
        points.push(`${Math.min(revealPct - 3, 100)}% 0%`);

        // Right brush edge — jagged points going down
        const numEdgePts = edge.length;
        for (let i = 0; i < numEdgePts; i++) {
          const t = i / (numEdgePts - 1);
          const y = t * 100;
          // Edge gets smoother as paint settles
          const jag = edge[i] * (1 - progress * 0.7);
          const x = Math.min(Math.max(revealPct + jag, 0), 105);
          points.push(`${x}% ${y}%`);
        }

        // Bottom — back to left
        points.push(`${Math.min(revealPct - 3, 100)}% 100%`);
        points.push("0% 100%");

        setClipPath(`polygon(${points.join(", ")})`);

        if (frame < totalFrames) {
          requestAnimationFrame(animate);
        } else {
          // Fully revealed
          setClipPath("none");
          setSettled(true);
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isVisible, delay, speed]);

  return (
    <div ref={ref} className="relative inline-block">
      {/* The painted text */}
      <Tag
        ref={textRef as React.Ref<never>}
        className={`relative z-10 ${className}`}
        style={{
          background:
            "linear-gradient(135deg, var(--gold-deep) 0%, var(--gold) 18%, var(--gold-bright) 35%, var(--gold-bright) 48%, var(--gold-warm) 55%, var(--gold) 72%, var(--gold-deep) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          clipPath,
          willChange: "clip-path",
        }}
      >
        {children}
      </Tag>

      {/* Radiate glow — settles after painting completes */}
      <div
        className="absolute -inset-x-8 -inset-y-4 z-0 rounded-xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--gold-glow) 0%, color-mix(in srgb, var(--gold) 5%, transparent) 40%, transparent 70%)",
          opacity: settled ? 1 : 0,
          transition: "opacity 1.2s ease-out",
        }}
      />

      {/* Gold underline — full text width */}
      <GoldBrushStroke width="100%" delay={delay + speed * 0.6} className="mt-3" />
    </div>
  );
}

// ─── GoldBrushStroke — solid gold underline with drifting particles ────

interface GoldBrushStrokeProps {
  className?: string;
  delay?: number;
  width?: string;
  brushIndex?: number;
}

export function GoldBrushStroke({
  className = "",
  delay = 0,
  width = "120px",
}: GoldBrushStrokeProps) {
  const { ref, isVisible } = useScrollReveal(0.3);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number; alpha: number }[]>([]);
  const animRef = useRef<number>(0);
  const spawnedRef = useRef(false);

  useEffect(() => {
    if (!isVisible || spawnedRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const timer = setTimeout(() => {
      spawnedRef.current = true;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const cw = rect.width;
      const ch = rect.height;
      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Spawn initial particles along the line
      const spawnBatch = () => {
        const count = Math.floor(cw / 12);
        for (let i = 0; i < count; i++) {
          particlesRef.current.push({
            x: Math.random() * cw,
            y: ch / 2 + (Math.random() - 0.5) * 2,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -Math.random() * 0.4 - 0.1,
            life: 0,
            maxLife: Math.random() * 80 + 40,
            size: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.5 + 0.2,
          });
        }
      };

      spawnBatch();

      // Ongoing slow spawn
      let frameCount = 0;
      const frame = () => {
        ctx.clearRect(0, 0, cw, ch);
        frameCount++;

        // Read current theme colors from CSS variables
        const cs = getComputedStyle(document.documentElement);
        const gr = parseInt(cs.getPropertyValue("--glow-r")) || 200;
        const gg = parseInt(cs.getPropertyValue("--glow-g")) || 168;
        const gb = parseInt(cs.getPropertyValue("--glow-b")) || 78;

        // Trickle new particles
        if (frameCount % 8 === 0 && particlesRef.current.length < 30) {
          particlesRef.current.push({
            x: Math.random() * cw,
            y: ch / 2 + (Math.random() - 0.5) * 2,
            vx: (Math.random() - 0.5) * 0.2,
            vy: -Math.random() * 0.3 - 0.05,
            life: 0,
            maxLife: Math.random() * 60 + 30,
            size: Math.random() * 1.2 + 0.4,
            alpha: Math.random() * 0.4 + 0.15,
          });
        }

        particlesRef.current = particlesRef.current.filter((p) => {
          p.life++;
          if (p.life > p.maxLife) return false;
          p.x += p.vx;
          p.y += p.vy;
          p.vy -= 0.002; // slight upward drift

          const lifeP = p.life / p.maxLife;
          let a: number;
          if (lifeP < 0.2) a = (lifeP / 0.2) * p.alpha;
          else if (lifeP > 0.6) a = ((1 - lifeP) / 0.4) * p.alpha;
          else a = p.alpha;

          // Tiny glow
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
          grad.addColorStop(0, `rgba(${Math.min(gr+18,255)},${Math.min(gg+22,255)},${Math.min(gb+32,255)},${a})`);
          grad.addColorStop(1, `rgba(${gr},${gg},${gb},0)`);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.fill();

          // Core dot
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${Math.min(gr+32,255)},${Math.min(gg+44,255)},${Math.min(gb+60,255)},${a * 1.2})`;
          ctx.fill();

          return true;
        });

        animRef.current = requestAnimationFrame(frame);
      };

      animRef.current = requestAnimationFrame(frame);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animRef.current);
    };
  }, [isVisible, delay]);

  return (
    <div ref={ref} className={`relative ${className}`} style={{ width }}>
      {/* The solid gold line */}
      <div
        className="relative"
        style={{
          height: "3px",
          background: "linear-gradient(90deg, transparent 0%, var(--gold) 15%, var(--gold-bright) 50%, var(--gold) 85%, transparent 100%)",
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scaleX(1)" : "scaleX(0)",
          transition: `opacity 0.4s ease ${delay}ms, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
          transformOrigin: "left center",
          boxShadow: "0 0 8px var(--gold-glow-strong), 0 0 20px var(--gold-glow)",
        }}
      />
      {/* Particle canvas — contained, no overflow */}
      <canvas
        ref={canvasRef}
        className="absolute pointer-events-none"
        style={{
          left: 0,
          top: "-12px",
          width: "100%",
          height: "28px",
        }}
      />
    </div>
  );
}

// ─── GoldReveal — scroll-triggered content reveal ──────────────────────

interface GoldRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "left" | "right" | "up";
}

export function GoldReveal({
  children,
  className = "",
  delay = 0,
  direction = "left",
}: GoldRevealProps) {
  const { ref, isVisible } = useScrollReveal(0.15);

  const transformMap = {
    left: "translateX(-40px)",
    right: "translateX(40px)",
    up: "translateY(30px)",
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translate(0)" : transformMap[direction],
          transition: `opacity 0.8s ease ${delay + 300}ms, transform 0.8s ease ${delay + 300}ms`,
        }}
      >
        {children}
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            direction === "up"
              ? "linear-gradient(to top, color-mix(in srgb, var(--gold) 15%, transparent), transparent)"
              : direction === "right"
                ? "linear-gradient(to left, color-mix(in srgb, var(--gold) 15%, transparent), transparent)"
                : "linear-gradient(to right, color-mix(in srgb, var(--gold) 15%, transparent), transparent)",
          opacity: isVisible ? 0 : 1,
          transition: `opacity 1.5s ease ${delay}ms`,
        }}
      />
    </div>
  );
}

// ─── ThunderShimmer ────────────────────────────────────────────────────
//
// Every ~10s a soft diffuse area glow illuminates gold accents.
// Like distant lightning behind clouds — not a bolt, but an area
// of warm light that swells and fades.

interface ThunderShimmerProps {
  children: ReactNode;
  className?: string;
  interval?: number;
  intensity?: number;
}

export function ThunderShimmer({
  children,
  className = "",
  interval = 10000,
  intensity = 0.4,
}: ThunderShimmerProps) {
  const [flash, setFlash] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const initialDelay = Math.random() * interval;

    const triggerFlash = () => {
      setFlash(true);
      setTimeout(() => setFlash(false), 1500);
      timeoutRef.current = setTimeout(
        triggerFlash,
        interval + (Math.random() - 0.5) * 3000
      );
    };

    timeoutRef.current = setTimeout(triggerFlash, initialDelay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [interval]);

  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <span
        className="absolute pointer-events-none rounded-3xl"
        style={{
          inset: "-8px -20px",
          background: `radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--gold) ${Math.round(intensity * 100)}%, transparent) 0%, color-mix(in srgb, var(--gold) ${Math.round(intensity * 25)}%, transparent) 35%, transparent 70%)`,
          opacity: flash ? 1 : 0,
          transition: flash
            ? "opacity 0.2s ease-in"
            : "opacity 1.3s ease-out",
          filter: "blur(10px)",
        }}
      />
    </span>
  );
}
