// src/app/capabilities/page.tsx
"use client";
import { useState } from "react";
import { CSSProperties } from "react";
import { ScrollProgress } from "@/components/nav/ScrollProgress";
import { NavShell } from "@/components/nav/NavShell";
import { SubPageHero } from "@/components/sublayouts/SubPageHero";
import { RightMarginIndex } from "@/components/subpages/RightMarginIndex";
import { ContactClosing } from "@/components/closing/ContactClosing";
import { FooterMini } from "@/components/closing/FooterMini";
import { BluePanel, ChapterDivider, GoldRule } from "@/components/primitives";

const CAPS = [
  {
    id: "intelligence",
    num: "01",
    concept: "Intelligence",
    formal: "AI Systems",
    paras: [
      "We design and ship the reasoning layer — retrieval pipelines, agent graphs, evaluation harnesses, and the boring infrastructure that makes any of it stand up under traffic. The work is half model orchestration, half operational discipline.",
      "Most of what we build here is invisible by the time it works. A model that retrieves the right context, an agent that knows when not to act, an eval that catches drift before users do. The interface above it is a separate practice (Surface). The throughput beneath it is a separate practice (Throughput). This one is the brain.",
    ],
    kit: "Claude · OpenAI · Modal · LangGraph · pgvector · LiteLLM",
  },
  {
    id: "surface",
    num: "02",
    concept: "Surface",
    formal: "Interface Design",
    paras: [
      "Marketing surfaces, product UI, internal tools. Built with the typography and motion of a high-end editorial property and the discipline of a production engineer. We spend as much time on a hover state as some agencies spend on a brand guideline.",
      "Reductive when it serves the user; expressive when the moment earns it. We reject the standard component library aesthetic. Every section is composed deliberately.",
    ],
    kit: "Next.js 16 · React 19 · Tailwind 4 · Lenis · GSAP · Figma",
  },
  {
    id: "throughput",
    num: "03",
    concept: "Throughput",
    formal: "Production Engineering",
    paras: [
      "Once it works in a notebook, we make it work at four nines. Queues, caching, fan-out, observability, the cost curve. The unglamorous part that decides whether the project ships.",
      "Engagements here are usually a follow-on — we built the system, now we harden it. Or we audit and intervene on a system someone else built that's bleeding latency or budget.",
    ],
    kit: "Vercel · Inngest · Postgres · Redis · OpenTelemetry · Sentry",
  },
  {
    id: "direction",
    num: "04",
    concept: "Direction",
    formal: "Strategy & Audit",
    paras: [
      "Two-week engagements that produce a single document and a single opinion. For when the question is \"what should we even be building\" and not \"build us this.\"",
      "Workshop-led. Stakeholder interviews, architecture review, a written brief. Sometimes we recommend you don't build at all. Often we recommend a smaller thing than you came in asking for. Always with our reasoning written down so you can argue with it.",
    ],
    kit: "Workshops · Stakeholder interviews · Architecture review · Written brief",
  },
];

export default function CapabilitiesPage() {
  const [handedOff, setHandedOff] = useState(true); // Sub-pages: nav always visible
  void setHandedOff;

  return (
    <>
      <ScrollProgress />
      <NavShell show={handedOff} />

      <SubPageHero
        slug="capabilities"
        wordmark="Capabilities"
        subtitle="Four practices, deepened."
      />

      <RightMarginIndex
        items={CAPS.map((c) => ({ id: c.id, label: `${c.num} / ${c.concept}` }))}
      />

      {CAPS.map((c) => (
        <section
          key={c.id}
          id={c.id}
          style={{
            position: "relative",
            overflow: "clip",
            padding: "120px 0",
            borderTop: "1px solid rgba(200, 168, 78, 0.06)",
          }}
        >
          <BluePanel />
          <div
            style={{
              maxWidth: 1080,
              margin: "0 auto",
              padding: "0 32px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div style={numStyle}>{c.num} / {c.concept}</div>
            <h2 style={titleStyle}>
              <em style={emStyle}>{c.concept}</em>{" "}
              <span style={formalStyle}>{c.formal}</span>
            </h2>
            <div style={{ margin: "28px 0" }}>
              <GoldRule withParticles thickness={1} width="100%" />
            </div>
            {c.paras.map((p, i) => (
              <p key={i} style={bodyStyle}>{p}</p>
            ))}
            <ChapterDivider />
            <div style={kitStyle}>
              <span style={kitLabelStyle}>Kit</span>{c.kit}
            </div>
          </div>
        </section>
      ))}

      <ContactClosing />
      <FooterMini />
    </>
  );
}

const numStyle: CSSProperties = {
  fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.5em",
  color: "var(--color-gold)", textTransform: "uppercase", marginBottom: 16,
};
const titleStyle: CSSProperties = {
  fontFamily: "var(--font-serif)", fontWeight: 300,
  fontSize: "clamp(2.4rem, 5vw, 4rem)", letterSpacing: "-0.025em",
  color: "var(--color-text-primary)", lineHeight: 1.05, marginBottom: 8,
  display: "flex", alignItems: "baseline", gap: 24, flexWrap: "wrap",
};
const emStyle: CSSProperties = { fontStyle: "italic", color: "var(--color-gold-bright)", fontWeight: 300 };
const formalStyle: CSSProperties = {
  fontFamily: "var(--font-mono)", fontStyle: "normal", fontSize: 12,
  letterSpacing: "0.4em", color: "var(--color-text-muted)", textTransform: "uppercase",
};
const bodyStyle: CSSProperties = {
  fontSize: "1.05rem", color: "var(--color-text-body)", lineHeight: 1.78,
  fontWeight: 300, maxWidth: "62ch", marginBottom: 22,
};
const kitStyle: CSSProperties = {
  fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em",
  color: "var(--color-text-subtle)", textTransform: "uppercase", lineHeight: 1.7,
};
const kitLabelStyle: CSSProperties = { color: "var(--color-gold)", marginRight: 10 };
