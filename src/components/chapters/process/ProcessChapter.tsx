"use client";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { ChapterDivider } from "@/components/primitives";
import { ProcessSpine } from "./ProcessSpine";
import { ProcessStep } from "./ProcessStep";

interface Phase {
  num: string;
  name: string;     // italic emphasis word
  rest: string;     // "— discover the question"
  body: string;
  output: string;
}

const PHASES: Phase[] = [
  {
    num: "Phase 01",
    name: "Brief",
    rest: "— discover the question",
    body:
      "We don't start with a scope. We start with a workshop. One day, two days, sometimes three. We pull in the people who own the problem, the people who'd build it, and the people who'd live with it.",
    output: "Written brief · named risks · named assumptions",
  },
  {
    num: "Phase 02",
    name: "Define",
    rest: "— write the spec",
    body:
      "A short document with a single opinion. Architecture sketch. Cost envelope. Eval criteria. The decisions we'd defend later when the project ships.",
    output: "Spec doc · sequence diagram · cost model",
  },
  {
    num: "Phase 03",
    name: "Build",
    rest: "— ship in increments",
    body:
      "Two-week increments. Demo every Friday. We'd rather ship the simplest thing that's load-bearing than the complete thing that isn't real yet.",
    output: "Production system · eval harness · observability",
  },
  {
    num: "Phase 04",
    name: "Hand off",
    rest: "— transfer the room",
    body:
      "A working system in your hands, your repo, your accounts. Two weeks of paired support and a written runbook. Then you own it.",
    output: "Code transfer · runbook · on-call rotation",
  },
];

export function ProcessChapter() {
  const diagramRef = useRef<HTMLDivElement | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeFlags, setActiveFlags] = useState<boolean[]>(PHASES.map(() => false));

  useEffect(() => {
    function update() {
      const next = stepRefs.current.map((step) => {
        if (!step || !diagramRef.current) return false;
        const stepRect = step.getBoundingClientRect();
        // dot Y in viewport ≈ stepRect.top + 76
        return stepRect.top + 76 < window.innerHeight * 0.65;
      });
      setActiveFlags((prev) => {
        // shallow compare to avoid extra renders
        if (prev.length === next.length && prev.every((v, i) => v === next[i])) return prev;
        return next;
      });
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section
      style={{
        background: "var(--color-bg-deep)",
        padding: "140px 0 120px",
        borderTop: "1px solid rgba(200, 168, 78, 0.06)",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: 56,
        }}
      >
        {/* Aside */}
        <aside>
          <div style={{ position: "sticky", top: 120 }}>
            <div style={asideNumStyle}>04 / Process</div>
            <h3 style={asideTitleStyle}>How we work</h3>
            <ChapterDivider />
            <div style={asideTextStyle}>
              Four phases.<br />
              One engagement.<br />
              Six to twelve weeks.
            </div>
          </div>
        </aside>

        {/* Diagram */}
        <div ref={diagramRef} style={{ position: "relative", paddingLeft: 64 }}>
          <ProcessSpine diagramRef={diagramRef} />
          {PHASES.map((p, i) => (
            <div
              key={p.num}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
            >
              <ProcessStep num={p.num} active={activeFlags[i]}>
                <h3 style={phaseTitleStyle}>
                  <em style={phaseEmStyle}>{p.name}</em> {p.rest}
                </h3>
                <p style={bodyStyle}>{p.body}</p>
                <div style={metaStyle}>
                  <span style={metaLabelStyle}>Output</span>
                  {p.output}
                </div>
              </ProcessStep>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const asideNumStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.5em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 16,
};
const asideTitleStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontWeight: 300,
  fontSize: "1.6rem",
  letterSpacing: "-0.01em",
  color: "var(--color-text-primary)",
  lineHeight: 1.1,
  marginBottom: 20,
};
const asideTextStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.18em",
  color: "var(--color-text-subtle)",
  lineHeight: 1.7,
  textTransform: "uppercase",
};
const phaseTitleStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontWeight: 300,
  fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)",
  letterSpacing: "-0.015em",
  color: "var(--color-text-primary)",
  lineHeight: 1.1,
  marginBottom: 16,
};
const phaseEmStyle: CSSProperties = {
  fontStyle: "italic",
  color: "var(--color-gold-bright)",
};
const bodyStyle: CSSProperties = {
  color: "var(--color-text-body)",
  lineHeight: 1.75,
  fontWeight: 300,
  maxWidth: "56ch",
  marginBottom: 14,
  fontSize: "0.95rem",
};
const metaStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.18em",
  color: "var(--color-text-subtle)",
  textTransform: "uppercase",
  lineHeight: 1.7,
};
const metaLabelStyle: CSSProperties = {
  color: "var(--color-gold)",
  marginRight: 10,
};
