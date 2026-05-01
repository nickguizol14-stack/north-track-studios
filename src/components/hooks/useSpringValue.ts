"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

export interface SpringOptions {
  stiffness?: number;
  damping?: number;
  restThreshold?: number;
}

export function useSpringValue(
  getTarget: () => number,
  { stiffness = 0.16, damping = 0.76, restThreshold = 0.05 }: SpringOptions = {},
): number {
  const [displayed, setDisplayed] = useState(0);
  const valueRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      function snap() {
        const t = getTarget();
        valueRef.current = t;
        setDisplayed(t);
      }
      snap();
      window.addEventListener("scroll", snap, { passive: true });
      window.addEventListener("resize", snap);
      return () => {
        window.removeEventListener("scroll", snap);
        window.removeEventListener("resize", snap);
      };
    }

    function tick() {
      const target = getTarget();
      const force = (target - valueRef.current) * stiffness;
      velocityRef.current = velocityRef.current * damping + force;
      valueRef.current += velocityRef.current;
      if (Math.abs(valueRef.current - displayed) > restThreshold) {
        setDisplayed(valueRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTarget, stiffness, damping, restThreshold, reduced]);

  return displayed;
}
