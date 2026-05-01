// src/components/subpages/RightMarginIndex.tsx
"use client";
import { CSSProperties, useEffect, useState } from "react";

export interface IndexItem {
  id: string;        // matches an element id on the page
  label: string;     // e.g. "01 / Intelligence"
}

export interface RightMarginIndexProps {
  items: IndexItem[];
}

export function RightMarginIndex({ items }: RightMarginIndexProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    function update() {
      const mid = window.innerHeight / 2;
      let best: string | null = null;
      let bestDist = Infinity;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const m = (r.top + r.bottom) / 2;
        const d = Math.abs(m - mid);
        if (r.bottom > 0 && r.top < window.innerHeight && d < bestDist) {
          bestDist = d;
          best = it.id;
        }
      }
      setActiveId(best);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  return (
    <nav style={navStyle} aria-label="Capability index">
      {items.map((it) => {
        const active = it.id === activeId;
        return (
          <a
            key={it.id}
            href={`#${it.id}`}
            style={{
              ...itemStyle,
              color: active ? "var(--color-gold)" : "var(--color-text-faint)",
              borderLeft: active
                ? "1px solid var(--color-gold)"
                : "1px solid rgba(200, 168, 78, 0.12)",
              boxShadow: active ? "-1px 0 6px rgba(200, 168, 78, 0.5)" : "none",
            }}
          >
            {it.label}
          </a>
        );
      })}
    </nav>
  );
}

const navStyle: CSSProperties = {
  position: "fixed",
  top: "30vh",
  right: 32,
  display: "flex",
  flexDirection: "column",
  gap: 14,
  zIndex: 50,
  pointerEvents: "auto",
};
const itemStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  textDecoration: "none",
  paddingLeft: 14,
  transition: "color 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease",
};
