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
  speed = 700,
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
            "linear-gradient(135deg, #c8a84e 0%, #e8d48a 25%, #dab856 50%, #c8a84e 70%, #a08535 100%)",
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
            "radial-gradient(ellipse at center, rgba(200,168,78,0.12) 0%, rgba(200,168,78,0.05) 40%, transparent 70%)",
          opacity: settled ? 1 : 0,
          transition: "opacity 1.2s ease-out",
        }}
      />
    </div>
  );
}

// ─── GoldBrushStroke — decorative painted divider ──────────────────────

const brushPaths = [
  "M0,25 C30,5 60,40 100,20 C140,0 180,35 220,15 C260,-5 300,30 340,25 C380,20 420,10 460,28 C500,45 540,5 580,20 C620,35 660,8 700,25",
  "M0,20 Q80,0 160,22 Q240,44 320,18 Q400,-5 480,24 Q560,50 640,20 Q720,0 800,22",
  "M0,30 C50,10 100,45 150,20 C200,-5 250,35 300,25 C350,15 400,40 450,18 C500,0 550,30 600,22 C650,14 700,38 750,20",
];

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
  brushIndex = 1,
}: GoldBrushStrokeProps) {
  const { ref, isVisible } = useScrollReveal(0.3);
  const path = brushPaths[brushIndex % brushPaths.length];
  const filterId = useRef(`brush-${Math.random().toString(36).slice(2, 8)}`).current;

  return (
    <div ref={ref} className={`relative ${className}`} style={{ width }}>
      <svg
        className="w-full h-3 overflow-visible"
        viewBox="0 0 700 50"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`${filterId}-g`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c8a84e" stopOpacity="0" />
            <stop offset="20%" stopColor="#c8a84e" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#e8d48a" stopOpacity="1" />
            <stop offset="80%" stopColor="#c8a84e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#c8a84e" stopOpacity="0" />
          </linearGradient>
          <filter id={`${filterId}-f`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2" />
          </filter>
        </defs>
        <path
          d={path}
          fill="none"
          stroke={`url(#${filterId}-g)`}
          strokeWidth="6"
          strokeLinecap="round"
          style={{
            strokeDasharray: 1200,
            strokeDashoffset: isVisible ? 0 : 1200,
            transition: `stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
            filter: `url(#${filterId}-f)`,
          }}
        />
      </svg>
      <div
        className="absolute inset-0 -inset-y-3 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(200,168,78,0.15) 0%, transparent 70%)",
          opacity: isVisible ? 1 : 0,
          transition: `opacity 1.5s ease ${delay + 600}ms`,
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
              ? "linear-gradient(to top, rgba(200,168,78,0.15), transparent)"
              : direction === "right"
                ? "linear-gradient(to left, rgba(200,168,78,0.15), transparent)"
                : "linear-gradient(to right, rgba(200,168,78,0.15), transparent)",
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
          background: `radial-gradient(ellipse at 50% 50%, rgba(200,168,78,${intensity}) 0%, rgba(200,168,78,${intensity * 0.25}) 35%, transparent 70%)`,
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
