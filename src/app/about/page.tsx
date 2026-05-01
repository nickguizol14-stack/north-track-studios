import { CSSProperties } from "react";
import { ScrollProgress } from "@/components/nav/ScrollProgress";
import { NavShell } from "@/components/nav/NavShell";
import { SubPageHero } from "@/components/sublayouts/SubPageHero";
import { TimelineGutter } from "@/components/subpages/TimelineGutter";
import { ContactClosing } from "@/components/closing/ContactClosing";
import { FooterMini } from "@/components/closing/FooterMini";
import { ChapterDivider } from "@/components/primitives";

const BELIEFS = [
  "The interface becomes the brand.",
  "Ship the smallest thing that's load-bearing.",
  "Write down the reasoning so you can argue with it later.",
  "Most software needs less, not more.",
  "Eval before you scale.",
  "Hand off the code, the runbook, and the on-call.",
];

export default function AboutPage() {
  return (
    <>
      <ScrollProgress />
      <NavShell show />
      <SubPageHero slug="about" wordmark="About" subtitle="A small studio, a long view." />

      <TimelineGutter years={["2024", "2025", "now"]} ids={["story", "people", "beliefs"]} />

      <main style={{ maxWidth: 820, margin: "0 auto", padding: "60px 32px 100px" }}>
        <section id="story" style={{ marginBottom: 100 }}>
          <div style={tagStyle}>01 — Story</div>
          <h2 style={h2Style}>How we started</h2>
          <ChapterDivider />
          <p style={pStyle}>
            NorthTrack was founded in 2024 by engineers who&rsquo;d spent a decade
            shipping AI systems inside larger companies and wanted to do the work
            with fewer layers between the question and the build.
          </p>
          <p style={pStyle}>
            We started small on purpose. Four to six engagements a year. One person
            full-time, named contributors per project. The kind of studio you can
            actually get hold of when something&rsquo;s wrong on a Sunday.
          </p>
        </section>

        <section id="people" style={{ marginBottom: 100 }}>
          <div style={tagStyle}>02 — People</div>
          <h2 style={h2Style}>Who&rsquo;s here</h2>
          <ChapterDivider />
          <div style={personStyle}>
            <div style={personHeadStyle}>
              <span style={personNameStyle}>Nick Guizol</span>
              <span style={personRoleStyle}>Founder · Engineering Lead</span>
            </div>
            <p style={personBioStyle}>
              Nick founded NorthTrack in 2024 after ten years building AI systems and
              tools for finance and media. Previously at firms designing retrieval
              pipelines, agent systems, and the editorial surfaces above them.
            </p>
          </div>
        </section>

        <section id="beliefs">
          <div style={tagStyle}>03 — Beliefs</div>
          <h2 style={h2Style}>Six principles</h2>
          <ChapterDivider />
          {BELIEFS.map((b, i) => (
            <div key={i} style={beliefStyle}>
              <span style={beliefNumStyle}>{String(i + 1).padStart(2, "0")} /</span>
              <span style={beliefTextStyle}>{b}</span>
            </div>
          ))}
        </section>
      </main>

      <ContactClosing />
      <FooterMini />
    </>
  );
}

const tagStyle: CSSProperties = {
  fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.5em",
  color: "var(--color-gold)", textTransform: "uppercase", marginBottom: 16,
};
const h2Style: CSSProperties = {
  fontFamily: "var(--font-serif)", fontWeight: 300,
  fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.02em",
  color: "var(--color-text-primary)", lineHeight: 1.1, marginBottom: 22,
};
const pStyle: CSSProperties = {
  fontSize: "1.05rem", color: "var(--color-text-body)",
  lineHeight: 1.78, fontWeight: 300, maxWidth: "60ch", marginBottom: 22,
};
const personStyle: CSSProperties = { marginBottom: 22 };
const personHeadStyle: CSSProperties = {
  display: "flex", gap: 18, alignItems: "baseline",
  fontFamily: "var(--font-mono)", marginBottom: 14,
  fontSize: 10, letterSpacing: "0.32em", textTransform: "uppercase",
};
const personNameStyle: CSSProperties = { color: "var(--color-text-primary)" };
const personRoleStyle: CSSProperties = { color: "var(--color-gold)" };
const personBioStyle: CSSProperties = {
  fontFamily: "var(--font-serif)", fontStyle: "italic",
  fontWeight: 300, fontSize: "1rem",
  color: "var(--color-text-body)", lineHeight: 1.7,
};
const beliefStyle: CSSProperties = {
  display: "flex", gap: 24, alignItems: "baseline", marginBottom: 22,
};
const beliefNumStyle: CSSProperties = {
  fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.4em",
  color: "var(--color-gold)", textTransform: "uppercase", flexShrink: 0,
};
const beliefTextStyle: CSSProperties = {
  fontFamily: "var(--font-serif)", fontStyle: "italic",
  fontWeight: 300, fontSize: "clamp(1.4rem, 2.6vw, 2rem)",
  color: "var(--color-gold-bright)", letterSpacing: "-0.015em", lineHeight: 1.2,
};
