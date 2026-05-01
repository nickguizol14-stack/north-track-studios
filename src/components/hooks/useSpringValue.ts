"use client";
import { useEffect, useRef, useState } from "react";

export interface SpringOptions {
  /** Pull strength toward target. Default 0.16. */
  stiffness?: number;
  /** Velocity decay per tick. Default 0.76. */
  damping?: number;
  /** Below this magnitude of motion, snap to target and stop. Default 0.05. */
  restThreshold?: number;
}

/**
 * Spring-driven reactive value. Reads `getTarget` each rAF and lerps toward it
 * with velocity. Returns the displayed value as React state (re-renders on change).
 */
export function useSpringValue(
  getTarget: () => number,
  { stiffness = 0.16, damping = 0.76, restThreshold = 0.05 }: SpringOptions = {},
): number {
  const [displayed, setDisplayed] = useState(0);
  const valueRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    function tick() {
      const target = getTarget();
      const force = (target - valueRef.current) * stiffness;
      velocityRef.current = velocityRef.current * damping + force;
      valueRef.current += velocityRef.current;
      // Update React state only when change is meaningful
      if (Math.abs(valueRef.current - displayed) > restThreshold) {
        setDisplayed(valueRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTarget, stiffness, damping, restThreshold]);

  return displayed;
}
