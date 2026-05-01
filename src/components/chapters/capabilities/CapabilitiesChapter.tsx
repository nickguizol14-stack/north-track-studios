// src/components/chapters/capabilities/CapabilitiesChapter.tsx
"use client";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { CapabilityRow } from "./CapabilityRow";
import { ChapterDivider, BluePanel } from "@/components/primitives";

interface Capability {
  index: string;
  concept: string;
  formal: string;
  body: string;
  kit: string;
  asideMantra: string; // 3 lines for the aside, separated by " / "
}

const CAPABILITIES: Capability[] = [
  {
    index: "01",
    concept: "Intelligence",
    formal: "AI Systems",
    body:
      "We design and ship the reasoning layer — retrieval pipelines, agent graphs, evaluation harnesses, and the boring infrastructure that makes any of it stand up under traffic.",
    kit: "Claude · OpenAI · Modal · LangGraph · pgvector · LiteLLM",
    asideMantra: "Models that reason. / Pipelines that retrieve. / Agents that act.",
  },
  {
    index: "02",
    concept: "Surface",
    formal: "Interface Design",
    body:
      "Marketing surfaces, product UI, internal tools. Built with the typography and motion of a high-end editorial property and the discipline of a production engineer.",
    kit: "Next.js 16 · React 19 · Tailwind 4 · Lenis · GSAP · Figma",
    asideMantra: "Interfaces with weight. / Motion with intent. / Type that performs.",
  },
  {
    index: "03",
    concept: "Throughput",
    formal: "Production Engineering",
    body:
      "Once it works in a notebook, we make it work at four nines. Queues, caching, fan-out, observability, the cost curve. The unglamorous part that decides whether the project ships.",
    kit: "Vercel · Inngest · Postgres · Redis · OpenTelemetry · Sentry",
    asideMantra: "Systems that scale. / Costs that don't. / Pipelines that hold.",
  },
  {
    index: "04",
    concept: "Direction",
    formal: "Strategy & Audit",
    body:
      "Two-week engagements that produce a single document and a single opinion. For when the question is \"what should we even be building\" and not \"build us this.\"",
    kit: "Workshops · Stakeholder interviews · Architecture review · Written brief",
    asideMantra: "One question at a time. / One opinion at a time. / Then build.",
  },
];

const DEFAULT_TITLE = "What we make";
const DEFAULT_MANTRA = "Four practices. / One studio. / Each scoped tight.";
const DEFAULT_LABEL = "overview";

function mantraToLines(s: string): string[] {
  return s.split("/").map((x) => x.trim());
}

export function CapabilitiesChapter() {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    function update() {
      const mid = window.innerHeight / 2;
      let best: number | null = null;
      let bestDist = Infinity;
      rowRefs.current.forEach((row, idx) => {
        if (!row) return;
        const r = row.getBoundingClientRect();
        const m = (r.top + r.bottom) / 2;
        const d = Math.abs(m - mid);
        if (r.bottom > 0 && r.top < window.innerHeight && d < bestDist) {
          bestDist = d;
          best = idx;
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
  }, []);

  const activeCap = activeIdx !== null ? CAPABILITIES[activeIdx] : null;
  const title = activeCap ? activeCap.concept : DEFAULT_TITLE;
  const mantra = activeCap ? activeCap.asideMantra : DEFAULT_MANTRA;
  const activeLabel = activeCap
    ? `reading · ${String(activeIdx! + 1).padStart(2, "0")}`
    : DEFAULT_LABEL;

  return (
    <section
      style={{
        padding: "140px 0 80px",
        position: "relative",
        overflow: "clip",
      }}
    >
      <BluePanel />

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: 56,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Aside */}
        <aside style={{ position: "relative" }}>
          <div style={{ position: "sticky", top: 130, minHeight: 280 }}>
            <div style={asideNumStyle}>02 / Capabilities</div>
            <div style={asideActiveLabelStyle}>{activeLabel}</div>
            <h3 style={asideTitleStyle}>
              {activeCap ? <em style={emStyle}>{title}</em> : title}
            </h3>
            <ChapterDivider />
            <div style={asideTextStyle}>
              {mantraToLines(mantra).map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </div>

            <div style={progressWrapStyle}>
              {CAPABILITIES.map((cap, i) => {
                const isActive = activeIdx === i;
                return (
                  <div
                    key={cap.index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      color: isActive ? "var(--color-text-primary)" : "var(--color-text-faint)",
                      textTransform: "uppercase",
                      transition: "color 0.45s ease",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: isActive ? 36 : 18,
                        height: 1,
                        background: isActive ? "var(--color-gold)" : "var(--color-text-faint)",
                        boxShadow: isActive ? "0 0 6px rgba(200, 168, 78, 0.6)" : "none",
                        transition: "all 0.45s ease",
                      }}
                    />
                    <span>
                      {cap.index} / {cap.concept}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Body — capability list */}
        <div>
          {CAPABILITIES.map((cap, i) => (
            <CapabilityRow
              key={cap.index}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              index={cap.index}
              concept={cap.concept}
              formal={cap.formal}
              body={cap.body}
              kit={cap.kit}
            />
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
const asideActiveLabelStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.5em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 6,
  opacity: 0.6,
};
const asideTitleStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontWeight: 300,
  fontSize: "1.6rem",
  letterSpacing: "-0.01em",
  color: "var(--color-text-primary)",
  lineHeight: 1.1,
  marginBottom: 20,
  transition: "opacity 0.45s ease",
};
const asideTextStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.18em",
  color: "var(--color-text-subtle)",
  lineHeight: 1.7,
  textTransform: "uppercase",
};
const emStyle: CSSProperties = {
  fontStyle: "italic",
  color: "var(--color-gold-bright)",
};
const progressWrapStyle: CSSProperties = {
  marginTop: 24,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};
