import { CSSProperties } from "react";

export interface BluePanelProps {
  bleed?: number;
  gridSize?: number;
  className?: string;
}

export function BluePanel({ bleed = 40, gridSize = 56, className }: BluePanelProps) {
  const mask = `linear-gradient(to right,
    transparent 0%,
    transparent 14%,
    rgba(0, 0, 0, 0.18) 24%,
    rgba(0, 0, 0, 0.55) 36%,
    black 50%,
    black 70%,
    rgba(0, 0, 0, 0.55) 84%,
    rgba(0, 0, 0, 0.18) 94%,
    transparent 100%)`;

  const style: CSSProperties = {
    position: "absolute",
    top: -bleed,
    bottom: -bleed,
    left: 0,
    right: 0,
    pointerEvents: "none",
    zIndex: 0,
    backgroundImage: `
      linear-gradient(var(--grid-line-strong) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid-line-strong) 1px, transparent 1px),
      radial-gradient(ellipse 65% 95% at 60% 42%,
        var(--blue-aura) 0%,
        var(--blue-aura-mid) 32%,
        var(--blue-aura-far) 58%,
        transparent 82%)
    `,
    backgroundSize: `${gridSize}px ${gridSize}px, ${gridSize}px ${gridSize}px, 100% 100%`,
    backgroundPosition: "0 0, 0 0, 0 0",
    WebkitMaskImage: mask,
    maskImage: mask,
  };

  return <div className={`blue-panel ${className ?? ""}`} style={style} aria-hidden />;
}
