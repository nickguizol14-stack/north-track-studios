import { CSSProperties, ReactNode } from "react";

export interface ProcessStepProps {
  num: string;          // e.g. "Phase 01"
  active: boolean;      // when true, full opacity + lit dot
  children: ReactNode;
}

export function ProcessStep({ num, active, children }: ProcessStepProps) {
  return (
    <div
      style={{
        position: "relative",
        padding: "60px 0",
        opacity: active ? 1 : 0.25,
        transition: "opacity 0.5s ease",
      }}
    >
      {/* Dot */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: -47,
          top: 76,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: active ? "var(--color-gold)" : "var(--color-bg-deep)",
          border: `1px solid ${active ? "var(--color-gold-brightest)" : "rgba(200,168,78,0.4)"}`,
          boxShadow: active ? "0 0 14px var(--gold-glow-strong)" : "none",
          transition: "all 0.45s ease",
        }}
      />
      {/* Connector to spine */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: -41,
          top: 89,
          width: 24,
          height: 1,
          background: active ? "var(--color-gold)" : "rgba(200, 168, 78, 0.3)",
          transition: "background 0.45s ease",
        }}
      />
      <div style={numStyle}>{num}</div>
      {children}
    </div>
  );
}

const numStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.5em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 12,
};
