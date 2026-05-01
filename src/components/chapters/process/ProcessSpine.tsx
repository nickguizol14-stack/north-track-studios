"use client";
import { CSSProperties, useCallback, useRef } from "react";
import { useSpringValue } from "@/components/hooks/useSpringValue";

export interface ProcessSpineProps {
  /** Diagram element to track (used for boundsRect). */
  diagramRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Spring-driven gold spine + glowing tip particle. Tracker is at viewport
 * center; progress = (tracker - diagram.top) / diagram.height.
 */
export function ProcessSpine({ diagramRef }: ProcessSpineProps) {
  const lastHeightRef = useRef(0);

  const getTarget = useCallback(() => {
    const el = diagramRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    if (rect.height <= 0) return 0;
    const tracker = window.innerHeight * 0.5;
    const offset = tracker - rect.top;
    const progress = Math.max(0, Math.min(1, offset / rect.height));
    lastHeightRef.current = rect.height;
    return progress * rect.height;
  }, [diagramRef]);

  const displayed = useSpringValue(getTarget, { stiffness: 0.16, damping: 0.76 });

  const showTip =
    lastHeightRef.current > 0 &&
    displayed > lastHeightRef.current * 0.005 &&
    displayed < lastHeightRef.current * 0.995;

  return (
    <>
      {/* Background hairline */}
      <div style={spineBgStyle} aria-hidden />
      {/* Filled portion */}
      <div
        style={{
          ...spineFillStyle,
          height: `${displayed}px`,
        }}
        aria-hidden
      />
      {/* Tip particle */}
      <div
        style={{
          ...spineTipStyle,
          top: `${displayed}px`,
          opacity: showTip ? 1 : 0,
        }}
        aria-hidden
      />
    </>
  );
}

const spineBgStyle: CSSProperties = {
  position: "absolute",
  left: 24,
  top: 0,
  bottom: 0,
  width: 1,
  background: "rgba(200, 168, 78, 0.08)",
};
const spineFillStyle: CSSProperties = {
  position: "absolute",
  left: 24,
  top: 0,
  width: 2,
  marginLeft: -0.5,
  background:
    "linear-gradient(to bottom, rgba(200, 168, 78, 0.9) 0%, var(--color-gold) 100%)",
  boxShadow: "0 0 8px rgba(200, 168, 78, 0.6)",
  willChange: "height",
};
const spineTipStyle: CSSProperties = {
  position: "absolute",
  left: 24,
  transform: "translate(-50%, -50%)",
  width: 10,
  height: 10,
  borderRadius: "50%",
  background:
    "radial-gradient(circle, #fff5d8 0%, var(--color-gold-brightest) 30%, var(--color-gold) 50%, transparent 75%)",
  boxShadow: "0 0 14px rgba(232, 200, 120, 0.85), 0 0 28px rgba(200, 168, 78, 0.5)",
  pointerEvents: "none",
  transition: "opacity 0.3s ease",
  willChange: "top",
};
