"use client";
import { CSSProperties, useEffect, useState } from "react";

export interface TimelineGutterProps {
  /** Year/milestone labels, in order top → bottom. */
  years: string[];
  /** Element ids matching `years` (for active-year detection). Optional. */
  ids?: string[];
}

export function TimelineGutter({ years, ids }: TimelineGutterProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!ids) return;
    function update() {
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      ids!.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const m = (r.top + r.bottom) / 2;
        const d = Math.abs(m - mid);
        if (r.bottom > 0 && r.top < window.innerHeight && d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActiveIdx(best);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ids]);

  return (
    <nav style={navStyle} aria-label="Timeline">
      <span style={spineStyle} aria-hidden />
      {years.map((y, i) => (
        <div
          key={i}
          style={{
            ...itemStyle,
            color: i === activeIdx ? "var(--color-gold)" : "var(--color-text-faint)",
          }}
        >
          {y}
        </div>
      ))}
    </nav>
  );
}

const navStyle: CSSProperties = {
  position: "fixed",
  left: 32,
  top: "30vh",
  display: "flex",
  flexDirection: "column",
  gap: 24,
  zIndex: 50,
};
const spineStyle: CSSProperties = {
  position: "absolute",
  left: 4,
  top: 4,
  bottom: 4,
  width: 1,
  background: "rgba(200, 168, 78, 0.15)",
};
const itemStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  paddingLeft: 18,
  transition: "color 0.45s ease",
};
