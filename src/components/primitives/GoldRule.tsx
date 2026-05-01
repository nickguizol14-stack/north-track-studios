import { CSSProperties } from "react";

export interface GoldRuleProps {
  /** Visual width of the rule. Defaults to "100%". */
  width?: string;
  /** Thickness in px. Defaults to 1. */
  thickness?: number;
  /** Render two drift particles above the rule (the v1 motif). */
  withParticles?: boolean;
  /** Additional className for layout. */
  className?: string;
  /** Inline style overrides. */
  style?: CSSProperties;
}

/**
 * Reusable gold rule. Solid by default; pass `withParticles` for the
 * elevated v1 underline-with-particles motif.
 */
export function GoldRule({
  width = "100%",
  thickness = 1,
  withParticles = false,
  className,
  style,
}: GoldRuleProps) {
  return (
    <div
      className={`gold-rule ${className ?? ""}`}
      style={{
        position: "relative",
        width,
        height: `${thickness}px`,
        background:
          "linear-gradient(90deg, transparent 0%, var(--color-gold) 18%, var(--color-gold-brightest) 50%, var(--color-gold) 82%, transparent 100%)",
        boxShadow: "0 0 6px var(--rule-glow)",
        borderRadius: "999px",
        ...style,
      }}
    >
      {withParticles && (
        <>
          <span
            className="gold-rule-particle"
            style={particleStyle}
            aria-hidden
          />
          <span
            className="gold-rule-particle"
            style={{ ...particleStyle, left: 32, animationDelay: "1.6s" }}
            aria-hidden
          />
        </>
      )}
    </div>
  );
}

const particleStyle: CSSProperties = {
  position: "absolute",
  left: 18,
  top: -8,
  width: 2,
  height: 2,
  borderRadius: "50%",
  background: "var(--color-gold-bright)",
  boxShadow: "0 0 4px var(--color-gold)",
  animation: "drift-up 3s ease-in-out infinite",
  animationDelay: "0s",
};
