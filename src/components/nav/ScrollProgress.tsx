"use client";
import { useScrollProgress } from "@/components/hooks/useScrollProgress";

export function ScrollProgress() {
  const progress = useScrollProgress();
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        zIndex: 201,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      <div
        className="scroll-progress-fill"
        style={{
          height: 1,
          width: `${progress * 100}%`,
          background: "var(--color-gold)",
          boxShadow: "0 0 6px rgba(200, 168, 78, 0.7)",
          transition: "width 0.05s linear",
        }}
      />
    </div>
  );
}
