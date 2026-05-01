# NorthTrack v2 Redesign — Plan 4 of 4: Sub-pages + Polish + Cleanup

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the five sub-pages (`/capabilities`, `/work`, `/work/[slug]`, `/about`, `/process`, `/contact`), each with its own signature gesture; do a final pass on mobile breakpoints and reduced-motion fallbacks; and delete the v1 components that are no longer in use.

**Architecture:** Each sub-page reuses the home tokens + primitives + chapter shell, but introduces its own signature gesture component (`RightMarginIndex` for /capabilities, `CascadeReveal` for /work, `TimelineGutter` for /about, `WeekAxis` for /process). The /contact page reuses Plan 3's `EditorialField` + `EditorialButton` — no new form primitives.

**Tech Stack:** Same as Plans 1–3. No new runtime deps.

**Spec reference:** `docs/superpowers/specs/2026-04-30-redesign-v2-atelier-design.md` §7, §10.

**Depends on:** Plans 1, 2, 3 complete.

---

## File structure

**Created:**
- `src/components/subpages/RightMarginIndex.tsx` — pinned right-edge capability index
- `src/components/subpages/CascadeReveal.tsx` — cascade reveal wrapper for /work entries
- `src/components/subpages/TimelineGutter.tsx` — left-edge timeline for /about
- `src/components/subpages/WeekAxis.tsx` — secondary week axis for /process
- Tests for each in matching `__tests__/`
- `src/app/capabilities/page.tsx` — replace v1
- `src/app/work/page.tsx` — replace v1
- `src/app/work/[slug]/page.tsx` — new dynamic route
- `src/app/about/page.tsx` — replace v1
- `src/app/process/page.tsx` — replace v1
- `src/app/contact/page.tsx` — replace v1
- `src/components/sublayouts/SubPageHero.tsx` — italic Fraunces page wordmark + subtitle (shared)
- `src/components/sublayouts/__tests__/SubPageHero.test.tsx`

**Modified:**
- All five sub-page routes (rewritten from v1)
- `src/app/globals.css` — small additions for cascade reveal keyframe

**Deleted (in cleanup task at end):**
- `src/components/Hero.tsx`
- `src/components/Services.tsx`
- `src/components/Survey.tsx`
- `src/components/IntroSequence.tsx`
- `src/components/PageWithIntro.tsx`
- `src/components/ScrollTransitions.tsx`
- `src/components/ConstellationBackground.tsx`
- `src/components/GoldPaint.tsx`
- `src/components/GoldParticles.tsx`
- `src/components/CompassLogo.tsx` (unless we keep the faint intro mark — see open questions)
- `src/components/ColorSchemeSwitcher.tsx`
- `src/components/StyleSwitcher.tsx`
- `src/components/About.tsx`
- `src/components/Contact.tsx`
- `src/components/Footer.tsx`
- `src/components/Process.tsx`
- `src/components/Work.tsx`
- `src/components/Navigation.tsx`
- `src/components/useScrollProgress.ts` (replaced by `src/components/hooks/useScrollProgress.ts` from Plan 1)

---

## Phase 7 — Sub-pages

### Task 7.1: Build SubPageHero

**Files:**
- Create: `src/components/sublayouts/SubPageHero.tsx`
- Create: `src/components/sublayouts/__tests__/SubPageHero.test.tsx`

Shared italic-Fraunces page wordmark + one-line subtitle, used as the top of every sub-page.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/sublayouts/__tests__/SubPageHero.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { SubPageHero } from "../SubPageHero";

describe("SubPageHero", () => {
  it("renders the wordmark and subtitle", () => {
    render(<SubPageHero slug="capabilities" wordmark="Capabilities" subtitle="Four practices, deepened." />);
    expect(screen.getByText("Capabilities")).toBeInTheDocument();
    expect(screen.getByText(/Four practices/)).toBeInTheDocument();
    expect(screen.getByText(/\/ Capabilities/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- SubPageHero
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/sublayouts/SubPageHero.tsx
import { CSSProperties } from "react";

export interface SubPageHeroProps {
  /** URL slug, displayed in the small mono tag (e.g. "capabilities" → "/ Capabilities"). */
  slug: string;
  /** Italic Fraunces wordmark, displayed as the page title. */
  wordmark: string;
  /** One-line italic subtitle below. */
  subtitle: string;
}

export function SubPageHero({ slug, wordmark, subtitle }: SubPageHeroProps) {
  const cap = slug.charAt(0).toUpperCase() + slug.slice(1);
  return (
    <div style={wrapStyle}>
      <div style={tagStyle}>/ {cap}</div>
      <h1 style={wordmarkStyle}>{wordmark}</h1>
      <p style={subtitleStyle}>{subtitle}</p>
    </div>
  );
}

const wrapStyle: CSSProperties = {
  maxWidth: 1280,
  margin: "0 auto",
  padding: "180px 32px 80px",
};
const tagStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.5em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 18,
};
const wordmarkStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "clamp(3rem, 7vw, 6rem)",
  letterSpacing: "-0.03em",
  color: "var(--color-gold-brightest)",
  lineHeight: 0.95,
  textShadow: "0 0 30px rgba(232, 200, 120, 0.18)",
  marginBottom: 18,
};
const subtitleStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "1.1rem",
  color: "var(--color-text-muted)",
  lineHeight: 1.5,
};
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- SubPageHero
```

Expected: 1 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/sublayouts/
git commit -m "feat(sublayouts): add SubPageHero (shared sub-page top)"
```

---

### Task 7.2: Build RightMarginIndex

**Files:**
- Create: `src/components/subpages/RightMarginIndex.tsx`
- Create: `src/components/subpages/__tests__/RightMarginIndex.test.tsx`

Pinned right-edge capability index for /capabilities. Active item ticks gold based on the closest section to viewport center.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/subpages/__tests__/RightMarginIndex.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { RightMarginIndex } from "../RightMarginIndex";

describe("RightMarginIndex", () => {
  it("renders all index items", () => {
    render(
      <RightMarginIndex
        items={[
          { id: "intelligence", label: "01 / Intelligence" },
          { id: "surface", label: "02 / Surface" },
        ]}
      />,
    );
    expect(screen.getByText(/01 \/ Intelligence/)).toBeInTheDocument();
    expect(screen.getByText(/02 \/ Surface/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- RightMarginIndex
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/subpages/RightMarginIndex.tsx
"use client";
import { CSSProperties, useEffect, useState } from "react";

export interface IndexItem {
  id: string;        // matches an element id on the page
  label: string;     // e.g. "01 / Intelligence"
}

export interface RightMarginIndexProps {
  items: IndexItem[];
}

export function RightMarginIndex({ items }: RightMarginIndexProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    function update() {
      const mid = window.innerHeight / 2;
      let best: string | null = null;
      let bestDist = Infinity;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const m = (r.top + r.bottom) / 2;
        const d = Math.abs(m - mid);
        if (r.bottom > 0 && r.top < window.innerHeight && d < bestDist) {
          bestDist = d;
          best = it.id;
        }
      }
      setActiveId(best);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  return (
    <nav style={navStyle} aria-label="Capability index">
      {items.map((it) => {
        const active = it.id === activeId;
        return (
          <a
            key={it.id}
            href={`#${it.id}`}
            style={{
              ...itemStyle,
              color: active ? "var(--color-gold)" : "var(--color-text-faint)",
              borderLeft: active
                ? "1px solid var(--color-gold)"
                : "1px solid rgba(200, 168, 78, 0.12)",
              boxShadow: active ? "-1px 0 6px rgba(200, 168, 78, 0.5)" : "none",
            }}
          >
            {it.label}
          </a>
        );
      })}
    </nav>
  );
}

const navStyle: CSSProperties = {
  position: "fixed",
  top: "30vh",
  right: 32,
  display: "flex",
  flexDirection: "column",
  gap: 14,
  zIndex: 50,
  pointerEvents: "auto",
};
const itemStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  textDecoration: "none",
  paddingLeft: 14,
  transition: "color 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease",
};
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- RightMarginIndex
```

Expected: 1 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/subpages/RightMarginIndex.tsx src/components/subpages/__tests__/RightMarginIndex.test.tsx
git commit -m "feat(subpages): add RightMarginIndex (sticky capability index)"
```

---

### Task 7.3: Wire /capabilities page

**Files:**
- Modify: `src/app/capabilities/page.tsx`

A long-form chapter book — each capability gets its own section with the BluePanel aura and the right-margin index ticks gold as you scroll.

- [ ] **Step 1: Replace the page**

```tsx
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
```

- [ ] **Step 2: Manual verification**

```bash
npm run dev
```

Visit http://localhost:3000/capabilities. Each capability section renders with the BluePanel aura. Right-margin index sticks; active item ticks gold as you scroll past sections. Click any: anchor jump.

Stop dev.

- [ ] **Step 3: Commit**

```bash
git add src/app/capabilities/page.tsx
git commit -m "feat(capabilities): rebuild /capabilities with full chapter book + right-margin index"
```

---

### Task 7.4: Build CascadeReveal + /work page

**Files:**
- Create: `src/components/subpages/CascadeReveal.tsx`
- Create: `src/components/subpages/__tests__/CascadeReveal.test.tsx`
- Modify: `src/app/work/page.tsx`

CascadeReveal wraps each project entry; each name italic-fades in from a 4° skew + 16px translate as it enters viewport, with stagger delay set per entry.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/subpages/__tests__/CascadeReveal.test.tsx
import { describe, it, expect } from "vitest";
import { render } from "@/test-utils/render";
import { CascadeReveal } from "../CascadeReveal";

describe("CascadeReveal", () => {
  it("renders children", () => {
    const { getByText } = render(
      <CascadeReveal index={0}>
        <span>hello</span>
      </CascadeReveal>,
    );
    expect(getByText("hello")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- CascadeReveal
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/subpages/CascadeReveal.tsx
"use client";
import { CSSProperties, ReactNode } from "react";
import { useScrollReveal } from "@/components/hooks/useScrollReveal";

export interface CascadeRevealProps {
  /** Stagger order — used to compute transition delay. */
  index: number;
  children: ReactNode;
}

export function CascadeReveal({ index, children }: CascadeRevealProps) {
  const { ref, isVisible } = useScrollReveal(0.2);

  const style: CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? "translateY(0) skewY(0deg)"
      : "translateY(16px) skewY(-4deg)",
    transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms`,
    transformOrigin: "left center",
  };

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} style={style}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- CascadeReveal
```

Expected: 1 passed.

- [ ] **Step 5: Replace /work page**

```tsx
// src/app/work/page.tsx
"use client";
import { useState } from "react";
import { CSSProperties } from "react";
import { ScrollProgress } from "@/components/nav/ScrollProgress";
import { NavShell } from "@/components/nav/NavShell";
import { SubPageHero } from "@/components/sublayouts/SubPageHero";
import { WorkStackRow } from "@/components/chapters/work/WorkStackRow";
import { WorkStackDivider } from "@/components/chapters/work/WorkStackDivider";
import { CascadeReveal } from "@/components/subpages/CascadeReveal";
import { ContactClosing } from "@/components/closing/ContactClosing";
import { FooterMini } from "@/components/closing/FooterMini";

interface Project {
  slug: string;
  num: string;
  year: string;
  name: string;
  client: string;
  body: string;
  tags: string;
}

const PROJECTS: Project[] = [
  { slug: "synapse",   num: "Project 01", year: "2025", name: "Synapse",   client: "Private · Lead",         body: "An internal research workbench. Analysts query the firm's full corpus through a single conversational surface; the system retrieves, cites, and reasons across structured and unstructured sources.", tags: "RAG · Multi-agent · Eval harness · Internal tooling" },
  { slug: "lumen",     num: "Project 02", year: "2024", name: "Lumen",     client: "The New Atlas · Lead",   body: "A public-facing AI search experience built on a publication's 12-year archive. Reads like an editorial — structured answers with cited paragraphs, related stories, and a timeline of how a story evolved.", tags: "Editorial UX · Hybrid retrieval · Citation architecture" },
  { slug: "threshold", num: "Project 03", year: "2025", name: "Threshold", client: "Block Eleven · Lead",    body: "An agent-driven incident response system for a security firm. Triages alerts, writes the first draft of the runbook execution, and routes humans only when the system isn't confident.", tags: "Agent orchestration · Tool use · Confidence routing" },
];

export default function WorkPage() {
  const [filter, setFilter] = useState<"all" | "2024" | "2025">("all");
  const filtered = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.year === filter);

  return (
    <>
      <ScrollProgress />
      <NavShell show />
      <SubPageHero slug="work" wordmark="Work" subtitle={`${PROJECTS.length} pieces, 2024–2025.`} />

      {/* Filter row */}
      <div style={filterRowStyle}>
        {["all", "2025", "2024"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as "all" | "2024" | "2025")}
            style={{
              ...filterPillStyle,
              color: filter === f ? "var(--color-gold)" : "var(--color-text-muted)",
              borderColor: filter === f ? "var(--color-gold)" : "rgba(200, 168, 78, 0.2)",
            }}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      <main
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: "60px 32px 100px",
        }}
      >
        {filtered.map((p, i) => (
          <CascadeReveal key={p.slug} index={i}>
            <WorkStackRow
              name={p.name}
              meta={`${p.num} · ${p.year}`}
              client={p.client}
              body={p.body}
              tags={p.tags}
            />
            {i < filtered.length - 1 && <WorkStackDivider />}
          </CascadeReveal>
        ))}
      </main>

      <ContactClosing />
      <FooterMini />
    </>
  );
}

const filterRowStyle: CSSProperties = {
  maxWidth: 1080,
  margin: "0 auto",
  padding: "0 32px",
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};
const filterPillStyle: CSSProperties = {
  padding: "10px 22px",
  borderRadius: 999,
  background: "transparent",
  border: "1px solid",
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.4em",
  textTransform: "uppercase",
  cursor: "pointer",
  transition: "color 0.3s ease, border-color 0.3s ease",
};
```

- [ ] **Step 6: Manual verification**

```bash
npm run dev
```

Visit /work. Three project entries cascade-reveal as you scroll. Click "2024" filter — only Lumen remains. Click "All" — all three return.

Stop dev.

- [ ] **Step 7: Commit**

```bash
git add src/components/subpages/CascadeReveal.tsx src/components/subpages/__tests__/CascadeReveal.test.tsx src/app/work/page.tsx
git commit -m "feat(work): add CascadeReveal + rebuild /work archive page with filter"
```

---

### Task 7.5: Build /work/[slug] case page

**Files:**
- Create: `src/app/work/[slug]/page.tsx`

Template-driven case page: uses the home's pinned-italic-name layout for the lead project. Three projects keyed by slug; 404 for unknowns.

- [ ] **Step 1: Create the dynamic route**

```tsx
// src/app/work/[slug]/page.tsx
import { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { ScrollProgress } from "@/components/nav/ScrollProgress";
import { NavShell } from "@/components/nav/NavShell";
import { WorkPinnedName } from "@/components/chapters/work/WorkPinnedName";
import { ContactClosing } from "@/components/closing/ContactClosing";
import { FooterMini } from "@/components/closing/FooterMini";

interface Beat {
  tag: string;
  body: string;
  tags?: string;
}

interface Case {
  num: string;
  year: string;
  client: string;
  name: string;
  sub: string;
  beats: Beat[];
}

const CASES: Record<string, Case> = {
  synapse: {
    num: "Project 01",
    year: "2025",
    client: "Private · Lead",
    name: "Synapse",
    sub: "An internal research workbench for a hedge fund (private).",
    beats: [
      { tag: "Beat 01 · The piece", body: "Analysts query the firm's full corpus through a single conversational surface. The system retrieves, cites, and reasons across structured and unstructured sources — and tells you when it doesn't know." },
      { tag: "Beat 02 · The challenge", body: "Six different research silos. Twenty-eight analysts asking the same questions across them in slightly different ways. The fix wasn't another search box — it was a system that knew which silo to ask, in what order, with what authority." },
      { tag: "Beat 03 · What shipped", body: "A multi-agent retrieval graph with a single interface, source-cited responses, an evaluation harness scoring every answer against analyst-curated gold, and a custom dashboard for the head of research to monitor query patterns and flag drift.", tags: "Claude · LangGraph · pgvector · Modal · Next.js" },
    ],
  },
  lumen: {
    num: "Project 02",
    year: "2024",
    client: "The New Atlas · Lead",
    name: "Lumen",
    sub: "A public-facing AI search experience for a publication's 12-year archive.",
    beats: [
      { tag: "Beat 01 · The piece", body: "Reads like an editorial — structured answers with cited paragraphs, related stories, and a timeline of how a story evolved over a decade." },
      { tag: "Beat 02 · What shipped", body: "Hybrid retrieval over the archive, citation architecture that links every paragraph back to the source, and an editor-facing dashboard for surfacing under-cited pieces.", tags: "Editorial UX · Hybrid retrieval · Citation" },
    ],
  },
  threshold: {
    num: "Project 03",
    year: "2025",
    client: "Block Eleven · Lead",
    name: "Threshold",
    sub: "Agent-driven incident response system for a security firm.",
    beats: [
      { tag: "Beat 01 · The piece", body: "Triages alerts, writes the first draft of the runbook execution, and routes humans only when the system's confidence drops below threshold." },
      { tag: "Beat 02 · What shipped", body: "An agent orchestration layer wired to existing security tooling, a confidence-routing policy engine, and a paired runbook editor for the SOC team.", tags: "Agent orchestration · Tool use · Confidence routing" },
    ],
  },
};

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = CASES[slug];
  if (!c) notFound();

  return (
    <>
      <ScrollProgress />
      <NavShell show />

      <main style={{ paddingTop: 120 }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "100px 32px 100px",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
            gap: 80,
            alignItems: "start",
            minHeight: "240vh",
          }}
        >
          <WorkPinnedName meta={`${c.num} · ${c.year} · ${c.client}`} name={c.name} sub={c.sub} />
          <div style={{ paddingTop: 100, display: "flex", flexDirection: "column", gap: 110, maxWidth: "56ch" }}>
            {c.beats.map((b, i) => (
              <div key={i}>
                <div style={beatTagStyle}>{b.tag}</div>
                <p style={beatBodyStyle}>{b.body}</p>
                {b.tags && <div style={beatTagsStyle}>{b.tags}</div>}
              </div>
            ))}
          </div>
        </div>
      </main>

      <ContactClosing />
      <FooterMini />
    </>
  );
}

const beatTagStyle: CSSProperties = {
  fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.4em",
  color: "var(--color-gold)", textTransform: "uppercase", marginBottom: 14,
};
const beatBodyStyle: CSSProperties = {
  fontSize: "1.02rem", color: "var(--color-text-body)",
  lineHeight: 1.78, fontWeight: 300,
};
const beatTagsStyle: CSSProperties = {
  marginTop: 16, fontFamily: "var(--font-mono)", fontSize: 9,
  letterSpacing: "0.32em", color: "var(--color-text-subtle)", textTransform: "uppercase",
};
```

- [ ] **Step 2: Manual verification**

```bash
npm run dev
```

Visit:
- http://localhost:3000/work/synapse — full case page renders
- http://localhost:3000/work/lumen — same layout, different content
- http://localhost:3000/work/unknown — Next.js 404 page

Stop dev.

- [ ] **Step 3: Commit**

```bash
git add src/app/work/[slug]/page.tsx
git commit -m "feat(work): add /work/[slug] case page template"
```

---

### Task 7.6: Build TimelineGutter + /about page

**Files:**
- Create: `src/components/subpages/TimelineGutter.tsx`
- Create: `src/components/subpages/__tests__/TimelineGutter.test.tsx`
- Modify: `src/app/about/page.tsx`

Left-edge vertical timeline with year markers; the active year ticks gold as the relevant section enters viewport.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/subpages/__tests__/TimelineGutter.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { TimelineGutter } from "../TimelineGutter";

describe("TimelineGutter", () => {
  it("renders all years", () => {
    render(<TimelineGutter years={["2024", "2025", "now"]} />);
    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(screen.getByText("now")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- TimelineGutter
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/subpages/TimelineGutter.tsx
"use client";
import { CSSProperties, useEffect, useState } from "react";

export interface TimelineGutterProps {
  /** Year/milestone labels, in order top → bottom. */
  years: string[];
  /** Element ids matching `years` (for active-year detection). Optional. */
  ids?: string[];
}

export function TimelineGutter({ years, ids }: TimelineGutterProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!ids) return;
    function update() {
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      ids!.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const r = el.getBoundingClientRect();
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
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ids]);

  return (
    <nav style={navStyle} aria-label="Timeline">
      <span style={spineStyle} aria-hidden />
      {years.map((y, i) => (
        <div
          key={i}
          style={{
            ...itemStyle,
            color: i === activeIdx ? "var(--color-gold)" : "var(--color-text-faint)",
          }}
        >
          {y}
        </div>
      ))}
    </nav>
  );
}

const navStyle: CSSProperties = {
  position: "fixed",
  left: 32,
  top: "30vh",
  display: "flex",
  flexDirection: "column",
  gap: 24,
  zIndex: 50,
};
const spineStyle: CSSProperties = {
  position: "absolute",
  left: 4,
  top: 4,
  bottom: 4,
  width: 1,
  background: "rgba(200, 168, 78, 0.15)",
};
const itemStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  paddingLeft: 18,
  transition: "color 0.45s ease",
};
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- TimelineGutter
```

Expected: 1 passed.

- [ ] **Step 5: Replace /about page**

```tsx
// src/app/about/page.tsx
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
            actually get hold of when something's wrong on a Sunday.
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
```

- [ ] **Step 6: Manual verification**

```bash
npm run dev
```

Visit /about. Timeline gutter on the left; year ticks gold as you scroll past Story → People → Beliefs.

Stop dev.

- [ ] **Step 7: Commit**

```bash
git add src/components/subpages/TimelineGutter.tsx src/components/subpages/__tests__/TimelineGutter.test.tsx src/app/about/page.tsx
git commit -m "feat(about): add TimelineGutter + rebuild /about (Story / People / Beliefs)"
```

---

### Task 7.7: Build WeekAxis + /process page

**Files:**
- Create: `src/components/subpages/WeekAxis.tsx`
- Create: `src/components/subpages/__tests__/WeekAxis.test.tsx`
- Modify: `src/app/process/page.tsx`

A secondary mono week-axis next to the spring spine. Active week range highlights gold with each phase.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/subpages/__tests__/WeekAxis.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { WeekAxis } from "../WeekAxis";

describe("WeekAxis", () => {
  it("renders the week labels", () => {
    render(<WeekAxis weeks={["WK 01", "WK 02", "WK 12"]} activeRange={[0, 0]} />);
    expect(screen.getByText("WK 01")).toBeInTheDocument();
    expect(screen.getByText("WK 12")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- WeekAxis
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/subpages/WeekAxis.tsx
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
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- WeekAxis
```

Expected: 1 passed.

- [ ] **Step 5: Replace /process page**

```tsx
// src/app/process/page.tsx
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
```

- [ ] **Step 6: Manual verification**

```bash
npm run dev
```

Visit /process. Spring spine grows as you scroll. Week axis on the right highlights the active range as each phase activates.

Stop dev.

- [ ] **Step 7: Commit**

```bash
git add src/components/subpages/WeekAxis.tsx src/components/subpages/__tests__/WeekAxis.test.tsx src/app/process/page.tsx
git commit -m "feat(process): rebuild /process with deep walk + WeekAxis"
```

---

### Task 7.8: Replace /contact page

**Files:**
- Modify: `src/app/contact/page.tsx`

Editorial form using the existing `EditorialField` + `EditorialButton`.

- [ ] **Step 1: Replace the page**

```tsx
// src/app/contact/page.tsx
"use client";
import { CSSProperties, useState } from "react";
import { ScrollProgress } from "@/components/nav/ScrollProgress";
import { NavShell } from "@/components/nav/NavShell";
import { SubPageHero } from "@/components/sublayouts/SubPageHero";
import { EditorialField } from "@/components/brief/EditorialField";
import { EditorialButton } from "@/components/brief/EditorialButton";
import { FooterMini } from "@/components/closing/FooterMini";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState("");
  const [question, setQuestion] = useState("");
  const ready = name.trim() && email.trim() && question.trim();

  function send() {
    fetch("/api/brief", {
      method: "POST",
      body: JSON.stringify({ contact_name: name, contact_email: email, company, type, question }),
    }).then(() => alert("Sent. We'll be in touch within 48 hours."));
  }

  return (
    <>
      <ScrollProgress />
      <NavShell show />
      <SubPageHero slug="contact" wordmark="Begin" subtitle="A short conversation, privately." />

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "20px 32px 100px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 80,
            alignItems: "start",
          }}
        >
          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            <EditorialField label="Your name" placeholder="Jane Smith" value={name} onChange={setName} autoFocus />
            <EditorialField label="Your email" placeholder="you@company.com" value={email} onChange={setEmail} type="email" />
            <EditorialField label="Company (optional)" placeholder="" value={company} onChange={setCompany} />
            <EditorialField label="Type of work" placeholder="Agent, knowledge experience, internal tool…" value={type} onChange={setType} />
            <EditorialField label="The question you're turning over" placeholder="How do we…" value={question} onChange={setQuestion} multiline />
            <div>
              <EditorialButton ready={!!ready} onClick={send}>
                Send · begin a brief
              </EditorialButton>
            </div>
          </div>

          {/* Direct details */}
          <aside style={detailsStyle}>
            <DetailRow label="Direct" value={<a href="mailto:hello@northtrack.studio" style={linkStyle}>hello@northtrack.studio</a>} />
            <DetailRow label="Calendar" value="30 min, no agenda" />
            <DetailRow label="Location" value="40.7128° N · 74.0060° W" />
            <DetailRow label="Response" value="Within 48 hours" />
          </aside>
        </div>
      </main>

      <FooterMini />
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={detailRowStyle}>
      <div style={detailLabelStyle}>{label}</div>
      <div style={detailValueStyle}>{value}</div>
    </div>
  );
}

const detailsStyle: CSSProperties = {
  paddingTop: 26,
  display: "flex",
  flexDirection: "column",
  gap: 24,
  borderLeft: "1px solid rgba(200, 168, 78, 0.1)",
  paddingLeft: 32,
};
const detailRowStyle: CSSProperties = {};
const detailLabelStyle: CSSProperties = {
  fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.4em",
  color: "var(--color-gold)", textTransform: "uppercase", marginBottom: 6,
};
const detailValueStyle: CSSProperties = {
  fontFamily: "var(--font-serif)", fontStyle: "italic",
  fontWeight: 300, fontSize: "1rem", color: "var(--color-text-body)",
};
const linkStyle: CSSProperties = {
  color: "var(--color-text-body-soft)", textDecoration: "none", borderBottom: "1px solid var(--color-gold)",
};
```

- [ ] **Step 2: Manual verification**

```bash
npm run dev
```

Visit /contact. Editorial form on left, details on right. Type in fields — gold rule brightens as content appears. Click Send when all required fields filled — alert + console log.

Stop dev.

- [ ] **Step 3: Commit**

```bash
git add src/app/contact/page.tsx
git commit -m "feat(contact): rebuild /contact with EditorialField + EditorialButton"
```

---

## Phase 8 — Polish + cleanup

### Task 8.1: Mobile breakpoints audit

**Files:**
- Modify: any component whose layout breaks below 700px

- [ ] **Step 1: Audit at 375px and 700px viewports**

```bash
npm run dev
```

Open Chrome DevTools → toggle device toolbar. Walk through every page at 375px and 700px:
- `/` (home): IntroStage, all 5 chapters, closing, footer
- `/capabilities`
- `/work`
- `/work/synapse`
- `/about`
- `/process`
- `/contact`
- `/brief`

Note any layout that breaks (overflow, text overlap, sticky elements obscuring content). Fix in the component file using a `@media (max-width: 900px)` (or appropriate threshold) media query in inline `<style>` or by adding to `globals.css`.

Common fixes expected:
- ChapterShell grid → `1fr` single column
- Work pinned project → name un-pins, scrolls inline with text beats
- Process spine → narrower padding, week axis hidden or repositioned
- Brief option-rows → larger touch targets, optional hidden detail line on small screens
- Contact form → form on top, details below

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "fix(responsive): mobile breakpoints across home + all sub-pages"
```

---

### Task 8.2: Reduced-motion fallbacks audit

**Files:**
- Various

- [ ] **Step 1: Test prefers-reduced-motion: reduce**

```bash
npm run dev
```

In Chrome DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`. Walk through every page:

- Lenis should be disabled (Plan 1's LenisProvider already does this — verify scroll is native)
- Intro animation should snap to settled state (WordmarkAnimated `reducedMotion` prop already wired — verify wordmark + rule + esp visible immediately on load with no animation)
- Particles (drift, burst, type) should be invisible or static — Plan 1's `globals.css` has the global `prefers-reduced-motion` rule that sets all animation/transition durations to 0.01ms; verify nothing animates
- Spring spine should jump to current scroll position (no smoothing) — `useSpringValue` doesn't currently honor reduced motion; if the spine still bounces, update `useSpringValue` to set displayed = target instantly when reduced motion is on

- [ ] **Step 2: Patch `useSpringValue` to honor reduced motion**

If the spring still bounces in reduced-motion mode, edit `src/components/hooks/useSpringValue.ts`:

```ts
// src/components/hooks/useSpringValue.ts
"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

export interface SpringOptions {
  stiffness?: number;
  damping?: number;
  restThreshold?: number;
}

export function useSpringValue(
  getTarget: () => number,
  { stiffness = 0.16, damping = 0.76, restThreshold = 0.05 }: SpringOptions = {},
): number {
  const [displayed, setDisplayed] = useState(0);
  const valueRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      // Snap to target each scroll/resize event
      function snap() {
        const t = getTarget();
        valueRef.current = t;
        setDisplayed(t);
      }
      snap();
      window.addEventListener("scroll", snap, { passive: true });
      window.addEventListener("resize", snap);
      return () => {
        window.removeEventListener("scroll", snap);
        window.removeEventListener("resize", snap);
      };
    }

    function tick() {
      const target = getTarget();
      const force = (target - valueRef.current) * stiffness;
      velocityRef.current = velocityRef.current * damping + force;
      valueRef.current += velocityRef.current;
      if (Math.abs(valueRef.current - displayed) > restThreshold) {
        setDisplayed(valueRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTarget, stiffness, damping, restThreshold, reduced]);

  return displayed;
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "fix(a11y): reduced-motion fallbacks for spring spine + intro + particles"
```

---

### Task 8.3: Performance audit

**Files:**
- Performance pass; usually no code changes needed

- [ ] **Step 1: Run Lighthouse**

```bash
npm run build && npm run start
```

Open http://localhost:3000 in an incognito window with throttling 4x CPU. Run Lighthouse → Performance + Accessibility.

Target:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+

If any metric is below target:
- LCP > 2.5s: check font loading (consider `font-display: optional` for Fraunces if needed)
- CLS > 0.1: ensure all images have explicit dimensions; verify no late-loading content shifts layout
- TBT > 200ms: profile the intro animation; if Lenis or GSAP is causing issues, defer to dynamic import

- [ ] **Step 2: Profile FPS during scroll**

Chrome DevTools → Performance tab. Start recording. Scroll the home page top to bottom. Stop recording.

Expected: 60fps throughout. If frames drop:
- Check Process spine — `useSpringValue` should not re-render the whole tree. If it does, memoize the children of `ProcessSpine`.
- Check DriftParticles — if particle count is too high in any zone, reduce.

Stop the dev/start server.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "perf: tune particle counts + spring re-render scope"
```

---

### Task 8.4: Delete unused v1 components

**Files:**
- Delete: many files in `src/components/`

- [ ] **Step 1: Verify nothing in `src/app/` still imports v1 components**

```bash
cd "/Users/nickguizol/.claude/projects/North Track/north-track-studios"
grep -rEn "from \"@/components/(Hero|Services|Survey|IntroSequence|PageWithIntro|ScrollTransitions|ConstellationBackground|GoldPaint|GoldParticles|CompassLogo|ColorSchemeSwitcher|StyleSwitcher|About|Contact|Footer|Process|Work|Navigation|useScrollProgress)\"" src/app
```

Expected: no output.

If anything matches, fix the import before deletion.

- [ ] **Step 2: Delete the files**

```bash
cd "/Users/nickguizol/.claude/projects/North Track/north-track-studios"
rm -f src/components/Hero.tsx \
      src/components/Services.tsx \
      src/components/Survey.tsx \
      src/components/IntroSequence.tsx \
      src/components/PageWithIntro.tsx \
      src/components/ScrollTransitions.tsx \
      src/components/ConstellationBackground.tsx \
      src/components/GoldPaint.tsx \
      src/components/GoldParticles.tsx \
      src/components/CompassLogo.tsx \
      src/components/ColorSchemeSwitcher.tsx \
      src/components/StyleSwitcher.tsx \
      src/components/About.tsx \
      src/components/Contact.tsx \
      src/components/Footer.tsx \
      src/components/Process.tsx \
      src/components/Work.tsx \
      src/components/Navigation.tsx \
      src/components/useScrollProgress.ts
```

- [ ] **Step 3: Verify build still passes**

```bash
npm run build
```

Expected: clean build, no missing-module errors.

- [ ] **Step 4: Run full test suite**

```bash
npm run test:run
```

Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove v1 components superseded by v2 architecture"
```

---

## Verification — end of Plan 4

- [ ] **Test suite**

```bash
npm run test:run
```

Expected: all green.

- [ ] **Lint + build**

```bash
npm run lint && npm run build
```

Expected: clean.

- [ ] **Production sanity check**

```bash
npm run build && npm run start
```

Walk through every page at production speed:
- `/` — full home with intro animation, all chapters, closing, footer
- `/capabilities` — long-form chapter book + right-margin index
- `/work` — archive with cascade reveal + filter
- `/work/synapse` — case page
- `/about` — with timeline gutter
- `/process` — with week axis
- `/contact` — editorial form
- `/brief` — full questionnaire

Confirm: no console errors, no missing-asset 404s, transitions smooth, scroll behavior consistent.

Stop the server.

- [ ] **Final commit if any cleanup**

```bash
git add -A
git commit -m "chore: final polish after Plan 4 verification"
```

---

## All four plans complete

After Plan 4 ships, the v2 redesign is feature-complete. Open items from the spec's §11 (project case images, real project content, brief data store, /about people count, compass mark fate, ColorSchemeSwitcher fate, calendar service) are tracked separately and can each become their own small follow-up.
