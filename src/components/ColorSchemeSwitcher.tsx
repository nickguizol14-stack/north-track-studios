"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Metallic color palettes ──────────────────────────────────────────

interface ColorScheme {
  name: string;
  label: string;
  // CSS variable overrides
  gold: string;
  goldBright: string;
  goldDeep: string;
  goldWarm: string;
  goldDim: string;
  // For glow rgba values (used in animations, box-shadows, etc.)
  glowR: number;
  glowG: number;
  glowB: number;
  // Preview gradient for the swatch
  preview: string;
}

const schemes: ColorScheme[] = [
  {
    name: "gold",
    label: "Gold",
    gold: "#c8a84e",
    goldBright: "#e8d48a",
    goldDeep: "#a08535",
    goldWarm: "#dab856",
    goldDim: "#7a6428",
    glowR: 200,
    glowG: 168,
    glowB: 78,
    preview: "linear-gradient(135deg, #a08535 0%, #c8a84e 30%, #e8d48a 60%, #c8a84e 100%)",
  },
  {
    name: "silver",
    label: "Silver",
    gold: "#b0b8c8",
    goldBright: "#d8dde8",
    goldDeep: "#8890a0",
    goldWarm: "#c4cad8",
    goldDim: "#606878",
    glowR: 176,
    glowG: 184,
    glowB: 200,
    preview: "linear-gradient(135deg, #8890a0 0%, #b0b8c8 30%, #d8dde8 60%, #b0b8c8 100%)",
  },
  {
    name: "bronze",
    label: "Bronze",
    gold: "#c4854a",
    goldBright: "#e0b088",
    goldDeep: "#9a6530",
    goldWarm: "#d49560",
    goldDim: "#704820",
    glowR: 196,
    glowG: 133,
    glowB: 74,
    preview: "linear-gradient(135deg, #9a6530 0%, #c4854a 30%, #e0b088 60%, #c4854a 100%)",
  },
  {
    name: "blue",
    label: "Blue",
    gold: "#4a8ac8",
    goldBright: "#88b8e8",
    goldDeep: "#356aa0",
    goldWarm: "#5c9ad8",
    goldDim: "#284a70",
    glowR: 74,
    glowG: 138,
    glowB: 200,
    preview: "linear-gradient(135deg, #356aa0 0%, #4a8ac8 30%, #88b8e8 60%, #4a8ac8 100%)",
  },
];

// ─── Apply scheme to CSS variables ────────────────────────────────────

function applyScheme(scheme: ColorScheme) {
  const root = document.documentElement;
  root.style.setProperty("--gold", scheme.gold);
  root.style.setProperty("--gold-bright", scheme.goldBright);
  root.style.setProperty("--gold-deep", scheme.goldDeep);
  root.style.setProperty("--gold-warm", scheme.goldWarm);
  root.style.setProperty("--gold-dim", scheme.goldDim);
  root.style.setProperty("--gold-glow", `rgba(${scheme.glowR}, ${scheme.glowG}, ${scheme.glowB}, 0.12)`);
  root.style.setProperty("--gold-glow-strong", `rgba(${scheme.glowR}, ${scheme.glowG}, ${scheme.glowB}, 0.25)`);
  // Store glow RGB for components that read it
  root.style.setProperty("--glow-r", String(scheme.glowR));
  root.style.setProperty("--glow-g", String(scheme.glowG));
  root.style.setProperty("--glow-b", String(scheme.glowB));
}

// ─── Wave animation overlay ──────────────────────────────────────────

function WaveOverlay({
  active,
  color,
  originX,
  originY,
  onComplete,
}: {
  active: boolean;
  color: string;
  originX: number;
  originY: number;
  onComplete: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Calculate max distance from origin to any corner
    const maxDist = Math.sqrt(
      Math.max(originX, w - originX) ** 2 + Math.max(originY, h - originY) ** 2
    );

    const duration = 900; // ms
    const ringWidth = 120; // px — the wave band width
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const radius = eased * (maxDist + ringWidth);

      ctx.clearRect(0, 0, w, h);

      // Draw the wave ring
      const innerR = Math.max(0, radius - ringWidth);
      const outerR = radius;

      // Parse the hex color
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);

      // Radial gradient for the wave — fades at both edges
      const grad = ctx.createRadialGradient(originX, originY, innerR, originX, originY, outerR);
      const peakAlpha = 0.25 * (1 - progress * 0.6); // fades as it expands
      grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
      grad.addColorStop(0.2, `rgba(${r},${g},${b},${peakAlpha * 0.3})`);
      grad.addColorStop(0.45, `rgba(${r},${g},${b},${peakAlpha})`);
      grad.addColorStop(0.55, `rgba(${r},${g},${b},${peakAlpha})`);
      grad.addColorStop(0.8, `rgba(${r},${g},${b},${peakAlpha * 0.3})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

      ctx.beginPath();
      ctx.arc(originX, originY, outerR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      if (progress < 1) {
        animRef.current = requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, w, h);
        onComplete();
      }
    };

    animRef.current = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(animRef.current);
  }, [active, color, originX, originY, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9998 }}
    />
  );
}

// ─── Main switcher component ─────────────────────────────────────────

export function ColorSchemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState("gold");
  const [wave, setWave] = useState<{
    active: boolean;
    color: string;
    x: number;
    y: number;
  }>({ active: false, color: "#c8a84e", x: 0, y: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const handleSelect = useCallback(
    (scheme: ColorScheme) => {
      if (scheme.name === current) {
        setIsOpen(false);
        return;
      }

      // Get button position for wave origin
      const btn = buttonRef.current;
      const rect = btn?.getBoundingClientRect();
      const originX = rect ? rect.left + rect.width / 2 : window.innerWidth - 40;
      const originY = rect ? rect.top + rect.height / 2 : window.innerHeight - 40;

      // Fire wave
      setWave({
        active: true,
        color: scheme.gold,
        x: originX,
        y: originY,
      });

      // Apply new colors at the wave's midpoint for a seamless feel
      setTimeout(() => {
        applyScheme(scheme);
        setCurrent(scheme.name);
      }, 250);

      setIsOpen(false);
    },
    [current]
  );

  const handleWaveComplete = useCallback(() => {
    setWave((prev) => ({ ...prev, active: false }));
  }, []);

  const currentScheme = schemes.find((s) => s.name === current)!;

  return (
    <>
      {/* Wave overlay */}
      <WaveOverlay
        active={wave.active}
        color={wave.color}
        originX={wave.x}
        originY={wave.y}
        onComplete={handleWaveComplete}
      />

      {/* Fixed container */}
      <div className="fixed bottom-6 right-6" style={{ zIndex: 9999 }}>
        {/* Picker panel */}
        <div
          ref={panelRef}
          className="absolute bottom-16 right-0 overflow-hidden"
          style={{
            width: isOpen ? "200px" : "0px",
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateY(0) scale(1)" : "translateY(8px) scale(0.95)",
            transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            pointerEvents: isOpen ? "auto" : "none",
          }}
        >
          <div className="border border-[var(--gold)]/20 bg-[#0f0e12]/95 backdrop-blur-xl rounded-lg p-3 flex flex-col gap-2">
            <span className="text-[9px] tracking-[0.4em] uppercase font-mono px-2 pt-1 pb-0.5"
              style={{ color: "var(--gold-dim)" }}
            >
              Theme
            </span>
            {schemes.map((scheme) => {
              const isActive = scheme.name === current;
              return (
                <button
                  key={scheme.name}
                  onClick={() => handleSelect(scheme)}
                  className="flex items-center gap-3 px-2 py-2 rounded-md transition-all duration-300 group"
                  style={{
                    background: isActive ? "rgba(255,255,255,0.05)" : "transparent",
                  }}
                >
                  {/* Color swatch */}
                  <div
                    className="w-6 h-6 rounded-full shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: scheme.preview,
                      boxShadow: isActive
                        ? `0 0 12px rgba(${scheme.glowR},${scheme.glowG},${scheme.glowB},0.5)`
                        : `0 0 4px rgba(${scheme.glowR},${scheme.glowG},${scheme.glowB},0.2)`,
                      border: isActive
                        ? `2px solid ${scheme.gold}`
                        : "2px solid transparent",
                    }}
                  />
                  {/* Label */}
                  <span
                    className="text-xs tracking-wider font-light transition-colors duration-300"
                    style={{
                      color: isActive ? scheme.gold : "#8e8a9e",
                    }}
                  >
                    {scheme.label}
                  </span>
                  {/* Active indicator */}
                  {isActive && (
                    <div
                      className="ml-auto w-1.5 h-1.5 rounded-full"
                      style={{ background: scheme.gold }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggle button */}
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 group"
          style={{
            background: `linear-gradient(135deg, ${currentScheme.goldDeep}, ${currentScheme.gold})`,
            boxShadow: isOpen
              ? `0 0 24px rgba(${currentScheme.glowR},${currentScheme.glowG},${currentScheme.glowB},0.5), 0 0 48px rgba(${currentScheme.glowR},${currentScheme.glowG},${currentScheme.glowB},0.2)`
              : `0 0 12px rgba(${currentScheme.glowR},${currentScheme.glowG},${currentScheme.glowB},0.3)`,
          }}
          aria-label="Change color scheme"
        >
          {/* Inner icon — paint drop / diamond shape */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="transition-transform duration-500"
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <path
              d="M12 3C12 3 5 12 5 16C5 19.866 8.134 22 12 22C15.866 22 19 19.866 19 16C19 12 12 3 12 3Z"
              fill="#070709"
              fillOpacity="0.6"
              stroke="#070709"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 16.5C8.5 14.5 12 8 12 8"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>

          {/* Pulse ring */}
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: `rgba(${currentScheme.glowR},${currentScheme.glowG},${currentScheme.glowB},0.15)`,
              animationDuration: "3s",
            }}
          />
        </button>
      </div>
    </>
  );
}
