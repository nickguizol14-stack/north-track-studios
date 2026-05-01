"use client";
import { useEffect, useRef } from "react";
import { BurstParticles, BurstParticlesHandle } from "@/components/primitives";

export interface WordmarkAnimatedProps {
  /** When true, show the settled state with no animation. */
  reducedMotion?: boolean;
}

/**
 * The hero intro animation:
 *   t=0–1.5s   mono wipe of "northtrack  studios"
 *   t=1.6s     stage bloom + rule bloom appear
 *   t=1.9s     gold rule grows from center; burst particles fire
 *   t=3.5s     italic Fraunces esp line fades in
 *
 * One-shot on mount. With `reducedMotion` true: jump to settled state instantly.
 */
export function WordmarkAnimated({ reducedMotion = false }: WordmarkAnimatedProps) {
  const burstRef = useRef<BurstParticlesHandle>(null);

  // Fire the burst at the moment the rule arrives (~1.9s into the cycle)
  useEffect(() => {
    if (reducedMotion) return;
    const t = setTimeout(() => burstRef.current?.fire(), 1900);
    return () => clearTimeout(t);
  }, [reducedMotion]);

  const animMode = (anim: string) =>
    reducedMotion ? "none" : `${anim} forwards`;

  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      {/* Stage bloom — a wide warm wash behind the wordmark */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 1100,
          maxWidth: "90vw",
          height: 380,
          background:
            "radial-gradient(ellipse 800px 380px at 50% 50%, rgba(200,168,78,0.12) 0%, rgba(200,168,78,0.04) 35%, transparent 70%)",
          opacity: reducedMotion ? 0.5 : 0,
          pointerEvents: "none",
          filter: "blur(18px)",
          animation: animMode("stage-bloom 4.5s ease-in-out"),
        }}
        aria-hidden
      />

      {/* Wordmark line */}
      <div
        style={{
          position: "relative",
          zIndex: 4,
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(20px, 2.8vw, 32px)",
          letterSpacing: "0.42em",
          color: "var(--color-text-primary)",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          overflow: "hidden",
          clipPath: reducedMotion ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
          animation: animMode("a-typewipe 4.5s ease-in-out"),
        }}
      >
        northtrack&nbsp;&nbsp;studios
      </div>

      {/* Rule zone */}
      <div
        style={{
          position: "relative",
          margin: "18px auto 0",
          width: 720,
          maxWidth: "80vw",
          height: 4,
        }}
      >
        {/* Rule bloom (radial behind rule) */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            maxWidth: "80vw",
            height: 100,
            background:
              "radial-gradient(ellipse at center, rgba(232,200,120,0.25) 0%, rgba(200,168,78,0.08) 35%, transparent 70%)",
            filter: "blur(12px)",
            opacity: reducedMotion ? 0.6 : 0,
            pointerEvents: "none",
            animation: animMode("rule-bloom 4.5s ease-in-out"),
          }}
          aria-hidden
        />

        {/* The gold rule itself */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            height: 2,
            width: reducedMotion ? "100%" : 0,
            background:
              "linear-gradient(90deg, transparent 0%, var(--color-gold) 18%, var(--color-gold-brightest) 50%, var(--color-gold) 82%, transparent 100%)",
            boxShadow:
              "0 0 12px var(--gold-glow-strong), 0 0 28px rgba(200,168,78,0.4)",
            borderRadius: "999px",
            opacity: reducedMotion ? 1 : 0,
            animation: animMode("a-rule-grow 4.5s ease-in-out"),
          }}
          aria-hidden
        />

        {/* Burst particles fire at rule arrival (~1.9s) */}
        <BurstParticles ref={burstRef} count={14} spread={660} />
      </div>

      {/* Esp line */}
      <p
        style={{
          marginTop: 40,
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "clamp(14px, 1.4vw, 18px)",
          letterSpacing: "0.02em",
          color: "#d4cdb6",
          opacity: reducedMotion ? 1 : 0,
          transform: reducedMotion ? "translateY(0)" : "translateY(6px)",
          animation: animMode("esp-fade-in 4.5s ease-in-out"),
        }}
      >
        A studio for applied{" "}
        <em
          style={{
            color: "var(--color-gold-brightest)",
            fontStyle: "italic",
            fontWeight: 400,
            textShadow: "0 0 18px rgba(232, 200, 120, 0.4)",
          }}
        >
          intelligence
        </em>
      </p>
    </div>
  );
}
