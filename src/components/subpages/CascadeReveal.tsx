// src/components/subpages/CascadeReveal.tsx
"use client";
import { CSSProperties, ReactNode } from "react";
import { useScrollReveal } from "@/components/hooks/useScrollReveal";

export interface CascadeRevealProps {
  /** Stagger order — used to compute transition delay. */
  index: number;
  children: ReactNode;
}

export function CascadeReveal({ index, children }: CascadeRevealProps) {
  const { ref, isVisible } = useScrollReveal(0.2);

  const style: CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? "translateY(0) skewY(0deg)"
      : "translateY(16px) skewY(-4deg)",
    transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms`,
    transformOrigin: "left center",
  };

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} style={style}>
      {children}
    </div>
  );
}
