import { CSSProperties } from "react";

export interface WeekAxisProps {
  weeks: string[];
  /** Inclusive [start, end] index range that should be highlighted gold. */
  activeRange: [number, number];
}

export function WeekAxis({ weeks, activeRange }: WeekAxisProps) {
  const [start, end] = activeRange;
  return (
    <div style={wrapStyle} aria-hidden>
      {weeks.map((w, i) => {
        const active = i >= start && i <= end;
        return (
          <div
            key={i}
            style={{
              ...itemStyle,
              color: active ? "var(--color-gold)" : "var(--color-text-faint)",
            }}
          >
            {w}
          </div>
        );
      })}
    </div>
  );
}

const wrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  position: "absolute",
  right: -100,
  top: 0,
};
const itemStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 8,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  transition: "color 0.45s ease",
};
