"use client";
import { forwardRef, useImperativeHandle, useRef } from "react";

export interface TypeParticlesHandle {
  spawn: (x: number, y: number) => void;
}

export interface TypeParticlesProps {
  className?: string;
}

export const TypeParticles = forwardRef<TypeParticlesHandle, TypeParticlesProps>(
  function TypeParticles({ className }, ref) {
    const hostRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      spawn: (x: number, y: number) => {
        const host = hostRef.current;
        if (!host) return;
        const p = document.createElement("span");
        p.className = "type-p";
        p.style.cssText = `
          position: absolute;
          left: ${x}px;
          top: ${y}px;
          width: 1.5px;
          height: 1.5px;
          border-radius: 50%;
          background: var(--color-gold-brightest);
          box-shadow: 0 0 4px var(--color-gold);
          pointer-events: none;
          animation: type-rise 1.2s ease-out forwards;
        `;
        host.appendChild(p);
        setTimeout(() => p.remove(), 1300);
      },
    }));

    return (
      <div
        ref={hostRef}
        className={`type-particles-host ${className ?? ""}`}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "visible",
        }}
        aria-hidden
      />
    );
  },
);
