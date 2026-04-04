"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * GoldPaint — Reusable gold brush-stroke reveal system.
 *
 * Wraps any content and reveals it with a painted gold brush stroke effect
 * as it scrolls into view. The gold "settles" with a radiate glow once visible.
 *
 * Variants:
 *  - "text"    → gold gradient text with brush-stroke mask reveal
 *  - "stroke"  → horizontal gold brush stroke divider
 *  - "reveal"  → paints content into view with gold wash overlay
 */

// ─── Brush stroke SVG paths (hand-drawn feel) ─────────────────────────

const brushPaths = [
  // Wide expressive stroke
  "M0,25 C30,5 60,40 100,20 C140,0 180,35 220,15 C260,-5 300,30 340,25 C380,20 420,10 460,28 C500,45 540,5 580,20 C620,35 660,8 700,25",
  // Tighter, more controlled
  "M0,20 Q80,0 160,22 Q240,44 320,18 Q400,-5 480,24 Q560,50 640,20 Q720,0 800,22",
  // Loose, organic
  "M0,30 C50,10 100,45 150,20 C200,-5 250,35 300,25 C350,15 400,40 450,18 C500,0 550,30 600,22 C650,14 700,38 750,20",
];

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

// ─── GoldBrushText ─────────────────────────────────────────────────────

interface GoldBrushTextProps {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "span" | "p";
  className?: string;
  delay?: number;
  brushIndex?: number;
}

export function GoldBrushText({
  children,
  as: Tag = "h2",
  className = "",
  delay = 0,
  brushIndex = 0,
}: GoldBrushTextProps) {
  const { ref, isVisible } = useScrollReveal(0.2);
  const path = brushPaths[brushIndex % brushPaths.length];

  return (
    <div ref={ref} className="relative inline-block">
      <Tag
        className={`relative z-10 ${className}`}
        style={{
          background:
            "linear-gradient(135deg, #c8a84e 0%, #e8d48a 30%, #dab856 50%, #c8a84e 70%, #a08535 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {children}
      </Tag>

      {/* Brush stroke underline that paints in */}
      <svg
        className="absolute -bottom-2 left-0 w-full h-4 overflow-visible"
        viewBox="0 0 700 50"
        preserveAspectRatio="none"
      >
        <path
          d={path}
          fill="none"
          stroke="url(#goldBrushGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          style={{
            strokeDasharray: 1200,
            strokeDashoffset: isVisible ? 0 : 1200,
            transition: `stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
            filter: "url(#brushTexture)",
          }}
        />
        <defs>
          <linearGradient id="goldBrushGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c8a84e" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#e8d48a" stopOpacity="1" />
            <stop offset="70%" stopColor="#dab856" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a08535" stopOpacity="0.6" />
          </linearGradient>
          <filter id="brushTexture">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="4"
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
          </filter>
        </defs>
      </svg>

      {/* Radiate glow once settled */}
      <div
        className="absolute inset-0 -inset-x-4 -inset-y-2 z-0 rounded-lg"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(200,168,78,0.12) 0%, transparent 70%)",
          opacity: isVisible ? 1 : 0,
          transition: `opacity 2s ease ${delay + 800}ms`,
        }}
      />
    </div>
  );
}

// ─── GoldBrushStroke — decorative divider ──────────────────────────────

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

  return (
    <div ref={ref} className={`relative ${className}`} style={{ width }}>
      <svg
        className="w-full h-3 overflow-visible"
        viewBox="0 0 700 50"
        preserveAspectRatio="none"
      >
        <path
          d={path}
          fill="none"
          stroke="url(#strokeGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          style={{
            strokeDasharray: 1200,
            strokeDashoffset: isVisible ? 0 : 1200,
            transition: `stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
            filter: "url(#brushTextureStroke)",
          }}
        />
        <defs>
          <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c8a84e" stopOpacity="0" />
            <stop offset="20%" stopColor="#c8a84e" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#e8d48a" stopOpacity="1" />
            <stop offset="80%" stopColor="#c8a84e" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#c8a84e" stopOpacity="0" />
          </linearGradient>
          <filter id="brushTextureStroke">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.03"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>
        </defs>
      </svg>
      {/* Glow beneath */}
      <div
        className="absolute inset-0 -inset-y-2"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(200,168,78,0.15) 0%, transparent 70%)",
          opacity: isVisible ? 1 : 0,
          transition: `opacity 1.5s ease ${delay + 600}ms`,
        }}
      />
    </div>
  );
}

// ─── GoldReveal — scroll-triggered paint wash over content ─────────────

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
      {/* Content */}
      <div
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translate(0)" : transformMap[direction],
          transition: `opacity 0.8s ease ${delay + 300}ms, transform 0.8s ease ${delay + 300}ms`,
        }}
      >
        {children}
      </div>

      {/* Gold wash overlay that sweeps across then fades */}
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
