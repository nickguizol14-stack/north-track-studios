"use client";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { ScrollProgress } from "@/components/nav/ScrollProgress";
import { NavShell } from "@/components/nav/NavShell";
import { SubPageHero } from "@/components/sublayouts/SubPageHero";
import { ChapterDivider } from "@/components/primitives";
import { ProcessSpine } from "@/components/chapters/process/ProcessSpine";
import { ProcessStep } from "@/components/chapters/process/ProcessStep";
import { WeekAxis } from "@/components/subpages/WeekAxis";
import { ContactClosing } from "@/components/closing/ContactClosing";
import { FooterMini } from "@/components/closing/FooterMini";

const PHASES = [
  { num: "Phase 01", name: "Brief", rest: "— discover the question", weekRange: [0, 0] as [number, number], body: "We don't start with a scope. We start with a workshop. One day, two days, sometimes three. We pull in the people who own the problem, the people who'd build it, and the people who'd live with it.", deliverables: "Workshop · written brief · risks · assumptions", failure: "Skipping this phase. The brief saves three weeks of building the wrong thing later." },
  { num: "Phase 02", name: "Define", rest: "— write the spec", weekRange: [1, 2] as [number, number], body: "A short document with a single opinion. Architecture sketch. Cost envelope. Eval criteria.", deliverables: "Spec doc · sequence diagram · cost model", failure: "Specs that are too long are usually hiding indecision." },
  { num: "Phase 03", name: "Build", rest: "— ship in increments", weekRange: [3, 9] as [number, number], body: "Two-week increments. Demo every Friday. We'd rather ship the simplest thing that's load-bearing than the complete thing that isn't real yet.", deliverables: "Production system · eval harness · observability", failure: "Treating the spec as immutable. New information should change the build." },
  { num: "Phase 04", name: "Hand off", rest: "— transfer the room", weekRange: [10, 11] as [number, number], body: "A working system in your hands, your repo, your accounts. Two weeks of paired support and a written runbook. Then you own it.", deliverables: "Code transfer · runbook · on-call rotation", failure: "Hand-offs without runbooks. You'll be on the phone for months." },
];

const WEEKS = ["WK 01", "WK 02", "WK 03", "WK 04", "WK 05", "WK 06", "WK 07", "WK 08", "WK 09", "WK 10", "WK 11", "WK 12"];

export default function ProcessPage() {
  const diagramRef = useRef<HTMLDivElement | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    function update() {
      let best = 0;
      let bestDist = Infinity;
      const mid = window.innerHeight / 2;
      stepRefs.current.forEach((step, i) => {
        if (!step) return;
        const r = step.getBoundingClientRect();
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
    return () => window.removeEventListener("scroll", update);
  }, []);

  const activeRange = PHASES[activeIdx].weekRange;

  return (
    <>
      <ScrollProgress />
      <NavShell show />
      <SubPageHero slug="process" wordmark="Process" subtitle="A 6–12 week walk." />

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "60px 32px 100px" }}>
        <div ref={diagramRef} style={{ position: "relative", paddingLeft: 64, paddingRight: 120 }}>
          <ProcessSpine diagramRef={diagramRef} />
          <WeekAxis weeks={WEEKS} activeRange={activeRange} />
          {PHASES.map((p, i) => (
            <div
              key={p.num}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
            >
              <ProcessStep num={p.num} active={i <= activeIdx}>
                <h3 style={phaseTitleStyle}>
                  <em style={phaseEmStyle}>{p.name}</em> {p.rest}
                </h3>
                <p style={bodyStyle}>{p.body}</p>
                <ChapterDivider />
                <div style={metaStyle}>
                  <span style={metaLabelStyle}>Deliverables</span>{p.deliverables}
                </div>
                <p style={failStyle}>
                  <em>Common failure:</em> {p.failure}
                </p>
              </ProcessStep>
            </div>
          ))}
        </div>
      </main>

      <ContactClosing />
      <FooterMini />
    </>
  );
}

const phaseTitleStyle: CSSProperties = {
  fontFamily: "var(--font-serif)", fontWeight: 300,
  fontSize: "clamp(1.8rem, 3.2vw, 2.6rem)", letterSpacing: "-0.015em",
  color: "var(--color-text-primary)", lineHeight: 1.1, marginBottom: 16,
};
const phaseEmStyle: CSSProperties = { fontStyle: "italic", color: "var(--color-gold-bright)" };
const bodyStyle: CSSProperties = {
  color: "var(--color-text-body)", lineHeight: 1.78, fontWeight: 300,
  maxWidth: "60ch", marginBottom: 14, fontSize: "1rem",
};
const metaStyle: CSSProperties = {
  fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em",
  color: "var(--color-text-subtle)", textTransform: "uppercase", lineHeight: 1.7, marginBottom: 18,
};
const metaLabelStyle: CSSProperties = { color: "var(--color-gold)", marginRight: 10 };
const failStyle: CSSProperties = {
  fontFamily: "var(--font-serif)", fontStyle: "italic", fontWeight: 300,
  color: "var(--color-text-muted)", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "60ch",
};
