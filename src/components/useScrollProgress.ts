"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Tracks how far an element has scrolled through the viewport.
 * Returns a value from 0 (element just entering bottom) to 1 (element exiting top).
 * Used by scroll-driven transition animations.
 */
export function useScrollProgress(offset = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const elH = rect.height;

    // 0 = element bottom edge at viewport bottom
    // 1 = element top edge at viewport top
    const raw = (vh - rect.top) / (vh + elH);
    const clamped = Math.max(0, Math.min(1, raw + offset));
    setProgress(clamped);
  }, [offset]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check if reduced motion is preferred
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setProgress(1);
      return;
    }

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [update]);

  return { ref, progress };
}
