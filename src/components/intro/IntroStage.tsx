"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/hooks/useReducedMotion";
import { WordmarkAnimated } from "./WordmarkAnimated";
import { CornerGlyphs } from "./CornerGlyphs";
import { ScrollCue } from "./ScrollCue";
import { WordmarkMini } from "./WordmarkMini";

export interface IntroStageProps {
  /** Fired when scroll passes the handoff threshold (true) and back (false). */
  onHandoffChange: (handedOff: boolean) => void;
}

/**
 * 200vh outer zone with a 100vh sticky inner stage. As the user scrolls
 * past 60% of the first viewport, the wordmark scales + migrates to the
 * top-left as a persistent mini mark, and the rest of the stage fades.
 */
export function IntroStage({ onHandoffChange }: IntroStageProps) {
  const reducedMotion = useReducedMotion();
  const [handedOff, setHandedOff] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const threshold = window.innerHeight * 0.6;
    function onScroll() {
      const next = window.scrollY > threshold;
      setHandedOff((prev) => {
        if (prev !== next) onHandoffChange(next);
        return next;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHandoffChange]);

  const handoffTransform = handedOff
    ? "translate(calc(-50vw + 140px), calc(-50vh + 32px)) scale(0.32)"
    : "translate(0, 0) scale(1)";

  return (
    <div className="intro-zone" style={{ height: "200vh", position: "relative" }}>
      <section
        ref={stageRef}
        className="intro-stage"
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(ellipse at 50% 55%, var(--color-bg-radial) 0%, var(--color-bg-deep) 75%)",
          overflow: "hidden",
        }}
      >
        <div className="grid-overlay" aria-hidden />

        <CornerGlyphs hidden={handedOff} />

        {/* Wordmark wrapper — transforms during handoff */}
        <div
          style={{
            position: "relative",
            transformOrigin: "center center",
            transition:
              "transform 0.9s cubic-bezier(0.65, 0, 0.35, 1), opacity 0.7s ease",
            transform: handoffTransform,
            opacity: handedOff ? 0.95 : 1,
          }}
        >
          {handedOff ? (
            <WordmarkMini />
          ) : (
            <WordmarkAnimated reducedMotion={reducedMotion} />
          )}
        </div>

        <ScrollCue hidden={handedOff} />
      </section>
    </div>
  );
}
