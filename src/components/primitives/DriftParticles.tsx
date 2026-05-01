import { useMemo } from "react";

export interface DriftParticlesProps {
  count?: number;
  className?: string;
}

export function DriftParticles({ count = 30, className }: DriftParticlesProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 1.5,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 2,
      })),
    [count],
  );

  return (
    <div
      className={`drift-host ${className ?? ""}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}
      aria-hidden
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="drift-p"
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: "var(--color-gold-bright)",
            boxShadow: "0 0 4px var(--color-gold)",
            opacity: 0,
            animation: `drift-up ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
