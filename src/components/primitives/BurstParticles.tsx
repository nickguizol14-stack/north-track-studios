"use client";
import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";

export interface BurstParticlesHandle {
  fire: () => void;
}

export interface BurstParticlesProps {
  count?: number;
  spread?: number;
  className?: string;
}

export const BurstParticles = forwardRef<BurstParticlesHandle, BurstParticlesProps>(
  function BurstParticles({ count = 14, spread = 660, className }, ref) {
    const hostRef = useRef<HTMLDivElement>(null);

    const particles = useMemo(() => {
      const half = spread / 2;
      return Array.from({ length: count }, (_, i) => {
        const t = count === 1 ? 0.5 : i / (count - 1);
        const x = -half + t * spread;
        const xd = (Math.random() - 0.5) * 14;
        const delay = Math.random() * 0.2;
        return { x, xd, delay };
      });
    }, [count, spread]);

    useImperativeHandle(ref, () => ({
      fire: () => {
        const host = hostRef.current;
        if (!host) return;
        host.classList.remove("fire");
        void host.offsetWidth;
        host.classList.add("fire");
      },
    }));

    return (
      <div
        ref={hostRef}
        className={`burst-host ${className ?? ""}`}
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          pointerEvents: "none",
        }}
        aria-hidden
      >
        {particles.map((p, i) => (
          <span
            key={i}
            className="burst-p"
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: 2,
              height: 2,
              borderRadius: "50%",
              background: "var(--color-gold-brightest)",
              boxShadow: "0 0 5px var(--color-gold-bright), 0 0 10px var(--gold-glow-strong)",
              opacity: 0,
              ["--x" as string]: `${p.x}px`,
              ["--xd" as string]: `${p.xd}px`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
    );
  },
);
