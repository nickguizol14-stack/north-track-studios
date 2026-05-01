# NorthTrack v2 Redesign — Plan 2 of 4: Intro + Home Page

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete v2 home page — intro stage with the wordmark animation + scroll-driven handoff into a persistent mini-nav, all five chapters (Practice, Capabilities, Work, Process, Brief teaser) each with their signature scroll gestures, and the Closing/Footer.

**Architecture:** Each chapter is a self-contained component composed from the primitives shipped in Plan 1. The intro is a 200vh sticky stage that hands off to a fixed mini nav at scroll-threshold. Chapter 02 (Capabilities) uses an intersection-driven morphing aside. Chapter 03 (Work) uses a sticky giant italic name with scrolling text. Chapter 04 (Process) uses spring physics (vanilla rAF lerp) for the gold spine. Layout primitives (`ChapterShell`, `ChapterHeadline`) carry the chapter language so it stays consistent.

**Tech Stack:** Same as Plan 1 (Next 16, React 19, TS, Tailwind 4, Lenis, GSAP). No new runtime deps. GSAP ScrollTrigger is used for handoff and a small number of choreography points; spring physics for the Process spine is plain vanilla JS.

**Out of scope:** Brief questionnaire interactive flow (Plan 3 — only the home teaser is here). Sub-pages (Plan 4). Cleanup of old v1 components (Plan 4).

**Spec reference:** `docs/superpowers/specs/2026-04-30-redesign-v2-atelier-design.md` §5 (intro), §6 (home assembly).

**Depends on:** Plan 1 complete (all primitives, hooks, Lenis, tokens in place).

---

## ⚠ Pre-flight

Re-read `node_modules/next/dist/docs/` for App Router patterns before editing pages. GSAP ScrollTrigger setup in React 19 / Next 16 — see https://gsap.com/resources/React. Use `useGSAP` from `@gsap/react` if available, otherwise plain `useEffect` with cleanup.

---

## File structure (created or modified by this plan)

**Created:**
- `src/components/intro/IntroStage.tsx` — 200vh sticky stage host
- `src/components/intro/WordmarkAnimated.tsx` — the hero wordmark animation
- `src/components/intro/WordmarkMini.tsx` — `N·T/S` post-handoff mark
- `src/components/intro/CornerGlyphs.tsx` — 4 mono journal-edge labels
- `src/components/intro/ScrollCue.tsx` — "begin" + stem at bottom
- `src/components/nav/NavShell.tsx` — fixed mini nav, fades in post-handoff
- `src/components/nav/ScrollProgress.tsx` — top hairline progress bar
- `src/components/chapters/ChapterShell.tsx` — generic chapter wrapper
- `src/components/chapters/ChapterHeadline.tsx` — italic-emphasis Fraunces headline
- `src/components/chapters/PracticeChapter.tsx` — Chapter 01
- `src/components/chapters/capabilities/CapabilityRow.tsx`
- `src/components/chapters/capabilities/CapabilitiesChapter.tsx` — Chapter 02
- `src/components/chapters/work/WorkPinnedName.tsx`
- `src/components/chapters/work/WorkStackRow.tsx`
- `src/components/chapters/work/WorkStackDivider.tsx`
- `src/components/chapters/work/WorkChapter.tsx` — Chapter 03
- `src/components/chapters/process/ProcessStep.tsx`
- `src/components/chapters/process/ProcessSpine.tsx` — spring-driven spine
- `src/components/chapters/process/ProcessChapter.tsx` — Chapter 04
- `src/components/chapters/BriefTeaser.tsx` — Chapter 05 (one-question CTA)
- `src/components/closing/ContactClosing.tsx`
- `src/components/closing/FooterMini.tsx`
- `src/components/hooks/useSpringValue.ts` — reusable spring physics for the process spine
- Tests for each new component / hook in matching `__tests__/` folders

**Modified:**
- `src/app/page.tsx` — full rewrite: assemble IntroStage + 5 chapters + ContactClosing + FooterMini
- `src/app/globals.css` — add a few section-specific keyframes used by intro animation

**Untouched (yet):**
- v1 components (`Hero.tsx`, `Services.tsx`, etc.) still on disk; their imports will be removed from `page.tsx` but the files remain until Plan 4 cleanup.
- All sub-page routes (`/about`, `/work`, `/capabilities`, etc.) still render v1 content. Plan 4 rebuilds them.

---

## Phase 3 — Intro stage + handoff

### Task 3.1: Add intro animation keyframes to globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Append intro keyframes**

Open `src/app/globals.css` and append at the bottom:

```css
/* ─── Intro stage animations ─── */
@keyframes a-typewipe {
  0% { clip-path: inset(0 100% 0 0); }
  25%, 100% { clip-path: inset(0 0 0 0); }
}

@keyframes a-rule-grow {
  0%, 28% { width: 0; opacity: 0; }
  36% { width: 0; opacity: 1; }
  44%, 100% { width: 100%; opacity: 1; }
}

@keyframes rule-bloom {
  0%, 38% { opacity: 0; }
  46% { opacity: 1; }
  62%, 100% { opacity: 0.6; }
}

@keyframes stage-bloom {
  0%, 35% { opacity: 0; }
  44% { opacity: 1; }
  62%, 100% { opacity: 0.5; }
}

@keyframes esp-fade-in {
  0%, 52% { opacity: 0; transform: translateY(6px); }
  66%, 100% { opacity: 1; transform: translateY(0); }
}

@keyframes scroll-cue-stem-pulse {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.4); }
}

/* For first-load (one-shot) the parent JS sets animation-iteration-count: 1.
   The brainstorm demos used infinite loops to show the moment repeatedly. */
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(intro): add intro stage keyframes (typewipe, rule grow, blooms, esp fade)"
```

---

### Task 3.2: Build CornerGlyphs

**Files:**
- Create: `src/components/intro/CornerGlyphs.tsx`
- Create: `src/components/intro/__tests__/CornerGlyphs.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/intro/__tests__/CornerGlyphs.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { CornerGlyphs } from "../CornerGlyphs";

describe("CornerGlyphs", () => {
  it("renders all four corner labels", () => {
    render(<CornerGlyphs />);
    expect(screen.getByText(/NTS · vol\. 02/i)).toBeInTheDocument();
    expect(screen.getByText(/est\. 2024/i)).toBeInTheDocument();
    expect(screen.getByText(/Index · 00/i)).toBeInTheDocument();
    expect(screen.getByText(/Issue 01 · Spring/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- CornerGlyphs
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/intro/CornerGlyphs.tsx
import { CSSProperties } from "react";

const baseStyle: CSSProperties = {
  position: "absolute",
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.4em",
  color: "#4a4a4a",
  textTransform: "uppercase",
  transition: "opacity 0.6s ease",
};

export interface CornerGlyphsProps {
  /** When true, fade out (for handoff state). */
  hidden?: boolean;
}

export function CornerGlyphs({ hidden = false }: CornerGlyphsProps) {
  const opacity = hidden ? 0 : 1;
  return (
    <>
      <div style={{ ...baseStyle, top: 70, left: 32, opacity }}>NTS · vol. 02</div>
      <div style={{ ...baseStyle, top: 70, right: 32, textAlign: "right", opacity }}>
        est. 2024
        <br />
        40.7128° N · 74.0060° W
      </div>
      <div style={{ ...baseStyle, bottom: 70, left: 32, opacity }}>Index · 00</div>
      <div style={{ ...baseStyle, bottom: 70, right: 32, textAlign: "right", opacity }}>
        Issue 01 · Spring
      </div>
    </>
  );
}
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- CornerGlyphs
```

Expected: 1 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/intro/CornerGlyphs.tsx src/components/intro/__tests__/CornerGlyphs.test.tsx
git commit -m "feat(intro): add CornerGlyphs (4 mono journal-edge labels)"
```

---

### Task 3.3: Build ScrollCue

**Files:**
- Create: `src/components/intro/ScrollCue.tsx`
- Create: `src/components/intro/__tests__/ScrollCue.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/intro/__tests__/ScrollCue.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { ScrollCue } from "../ScrollCue";

describe("ScrollCue", () => {
  it("renders the begin label", () => {
    render(<ScrollCue />);
    expect(screen.getByText(/begin/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- ScrollCue
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/intro/ScrollCue.tsx
export interface ScrollCueProps {
  /** When true, hide the cue. */
  hidden?: boolean;
}

export function ScrollCue({ hidden = false }: ScrollCueProps) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 64,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        opacity: hidden ? 0 : 0.7,
        transition: "opacity 0.4s ease",
      }}
      aria-hidden
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.5em",
          color: "var(--color-text-subtle)",
          textTransform: "uppercase",
        }}
      >
        begin
      </span>
      <div
        style={{
          width: 1,
          height: 32,
          background:
            "linear-gradient(to bottom, rgba(200, 168, 78, 0.5), transparent)",
          animation: "scroll-cue-stem-pulse 1.6s ease-in-out infinite",
        }}
      />
    </div>
  );
}
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- ScrollCue
```

Expected: 1 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/intro/ScrollCue.tsx src/components/intro/__tests__/ScrollCue.test.tsx
git commit -m "feat(intro): add ScrollCue ('begin' + pulsing stem)"
```

---

### Task 3.4: Build WordmarkAnimated

**Files:**
- Create: `src/components/intro/WordmarkAnimated.tsx`
- Create: `src/components/intro/__tests__/WordmarkAnimated.test.tsx`

This is the centerpiece animation: mono wipe → gold rule grow with bloom → burst → italic esp line. One-shot on mount; respects reduced motion.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/intro/__tests__/WordmarkAnimated.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { WordmarkAnimated } from "../WordmarkAnimated";

describe("WordmarkAnimated", () => {
  it("renders the wordmark text", () => {
    render(<WordmarkAnimated />);
    expect(screen.getByText(/northtrack\s+studios/i)).toBeInTheDocument();
  });

  it("renders the esp line with italic emphasis on intelligence", () => {
    render(<WordmarkAnimated />);
    expect(screen.getByText(/A studio for applied/i)).toBeInTheDocument();
    expect(screen.getByText(/intelligence/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- WordmarkAnimated
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/intro/WordmarkAnimated.tsx
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
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- WordmarkAnimated
```

Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/intro/WordmarkAnimated.tsx src/components/intro/__tests__/WordmarkAnimated.test.tsx
git commit -m "feat(intro): add WordmarkAnimated (mono wipe + rule grow + burst + esp line)"
```

---

### Task 3.5: Build WordmarkMini

**Files:**
- Create: `src/components/intro/WordmarkMini.tsx`
- Create: `src/components/intro/__tests__/WordmarkMini.test.tsx`

The shrunk `N·T/S` mark that appears in the top-left of the nav after the handoff.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/intro/__tests__/WordmarkMini.test.tsx
import { describe, it, expect } from "vitest";
import { render } from "@/test-utils/render";
import { WordmarkMini } from "../WordmarkMini";

describe("WordmarkMini", () => {
  it("renders the abbreviated wordmark", () => {
    const { container } = render(<WordmarkMini />);
    expect(container.textContent?.replace(/\s+/g, "")).toContain("N·T/S");
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- WordmarkMini
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/intro/WordmarkMini.tsx
export function WordmarkMini() {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        letterSpacing: "0.3em",
        color: "var(--color-text-primary)",
        textTransform: "uppercase",
      }}
    >
      N
      <span style={{ color: "var(--color-gold)", margin: "0 4px" }}>·</span>
      T
      <span style={{ color: "var(--color-gold)", margin: "0 4px" }}>/</span>
      S
    </div>
  );
}
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- WordmarkMini
```

Expected: 1 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/intro/WordmarkMini.tsx src/components/intro/__tests__/WordmarkMini.test.tsx
git commit -m "feat(intro): add WordmarkMini (post-handoff N·T/S nav mark)"
```

---

### Task 3.6: Build ScrollProgress

**Files:**
- Create: `src/components/nav/ScrollProgress.tsx`
- Create: `src/components/nav/__tests__/ScrollProgress.test.tsx`

A 1px gold bar at the very top of the viewport whose width = useScrollProgress.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/nav/__tests__/ScrollProgress.test.tsx
import { describe, it, expect } from "vitest";
import { render } from "@/test-utils/render";
import { ScrollProgress } from "../ScrollProgress";

describe("ScrollProgress", () => {
  it("renders a fill bar", () => {
    const { container } = render(<ScrollProgress />);
    expect(container.querySelector(".scroll-progress-fill")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- ScrollProgress
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/nav/ScrollProgress.tsx
"use client";
import { useScrollProgress } from "@/components/hooks/useScrollProgress";

export function ScrollProgress() {
  const progress = useScrollProgress();
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 1,
        zIndex: 201,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      <div
        className="scroll-progress-fill"
        style={{
          height: 1,
          width: `${progress * 100}%`,
          background: "var(--color-gold)",
          boxShadow: "0 0 6px rgba(200, 168, 78, 0.7)",
          transition: "width 0.05s linear",
        }}
      />
    </div>
  );
}
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- ScrollProgress
```

Expected: 1 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/nav/ScrollProgress.tsx src/components/nav/__tests__/ScrollProgress.test.tsx
git commit -m "feat(nav): add ScrollProgress top hairline bar"
```

---

### Task 3.7: Build NavShell

**Files:**
- Create: `src/components/nav/NavShell.tsx`
- Create: `src/components/nav/__tests__/NavShell.test.tsx`

The fixed mini nav. Mounted always but hidden until `show` prop is true (driven by intro handoff threshold).

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/nav/__tests__/NavShell.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { NavShell } from "../NavShell";

describe("NavShell", () => {
  it("renders all five nav links", () => {
    render(<NavShell show />);
    ["About", "Capabilities", "Work", "Process", "Contact"].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("renders hidden by default (opacity 0)", () => {
    const { container } = render(<NavShell show={false} />);
    const shell = container.querySelector(".nav-shell") as HTMLElement;
    expect(shell.style.opacity).toBe("0");
  });

  it("becomes visible when show=true", () => {
    const { container } = render(<NavShell show />);
    const shell = container.querySelector(".nav-shell") as HTMLElement;
    expect(shell.style.opacity).toBe("1");
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- NavShell
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/nav/NavShell.tsx
import Link from "next/link";
import { WordmarkMini } from "@/components/intro/WordmarkMini";

export interface NavShellProps {
  /** Whether the nav is visible (driven by intro handoff). */
  show: boolean;
}

const links = [
  { href: "/about", label: "About" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/work", label: "Work" },
  { href: "/process", label: "Process" },
  { href: "/contact", label: "Contact" },
];

export function NavShell({ show }: NavShellProps) {
  return (
    <nav
      className="nav-shell"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        zIndex: 100,
        pointerEvents: show ? "auto" : "none",
        padding: "18px 32px 0",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        opacity: show ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      <Link href="/" aria-label="NorthTrack Studios home" style={{ textDecoration: "none" }}>
        <WordmarkMini />
      </Link>

      <div
        style={{
          display: "flex",
          gap: 28,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
        }}
      >
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{
              color: "var(--color-text-muted)",
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 32,
          right: 32,
          bottom: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(200, 168, 78, 0.3), transparent)",
        }}
        aria-hidden
      />
    </nav>
  );
}
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- NavShell
```

Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/nav/NavShell.tsx src/components/nav/__tests__/NavShell.test.tsx
git commit -m "feat(nav): add NavShell mini nav (fades in post-handoff)"
```

---

### Task 3.8: Build IntroStage with handoff

**Files:**
- Create: `src/components/intro/IntroStage.tsx`
- Create: `src/components/intro/__tests__/IntroStage.test.tsx`

The 200vh sticky stage that contains the wordmark animation, corner glyphs, and scroll cue. Owns the handoff threshold logic and notifies the parent when handoff fires.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/intro/__tests__/IntroStage.test.tsx
import { describe, it, expect } from "vitest";
import { render } from "@/test-utils/render";
import { IntroStage } from "../IntroStage";

describe("IntroStage", () => {
  it("renders the stage", () => {
    const { container } = render(<IntroStage onHandoffChange={() => {}} />);
    expect(container.querySelector(".intro-zone")).toBeInTheDocument();
    expect(container.querySelector(".intro-stage")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- IntroStage
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/intro/IntroStage.tsx
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
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- IntroStage
```

Expected: 1 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/intro/IntroStage.tsx src/components/intro/__tests__/IntroStage.test.tsx
git commit -m "feat(intro): add IntroStage (sticky 200vh + handoff threshold)"
```

---

## Phase 4 — Chapter primitives

### Task 4.1: Build ChapterShell

**Files:**
- Create: `src/components/chapters/ChapterShell.tsx`
- Create: `src/components/chapters/__tests__/ChapterShell.test.tsx`

Generic chapter wrapper: `aside | body | margin notes` grid with sticky aside support.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/chapters/__tests__/ChapterShell.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { ChapterShell } from "../ChapterShell";

describe("ChapterShell", () => {
  it("renders aside, body, and margin slots", () => {
    render(
      <ChapterShell
        aside={<div>aside-content</div>}
        body={<div>body-content</div>}
        margin={<div>margin-content</div>}
      />,
    );
    expect(screen.getByText("aside-content")).toBeInTheDocument();
    expect(screen.getByText("body-content")).toBeInTheDocument();
    expect(screen.getByText("margin-content")).toBeInTheDocument();
  });

  it("accepts custom grid template", () => {
    const { container } = render(
      <ChapterShell
        aside={<div>a</div>}
        body={<div>b</div>}
        gridTemplate="280px 1fr"
      />,
    );
    const inner = container.querySelector(".chapter-inner") as HTMLElement;
    expect(inner.style.gridTemplateColumns).toBe("280px 1fr");
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- ChapterShell
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/chapters/ChapterShell.tsx
import { CSSProperties, ReactNode } from "react";

export interface ChapterShellProps {
  aside: ReactNode;
  body: ReactNode;
  /** Optional right-side margin notes column. */
  margin?: ReactNode;
  /** CSS grid-template-columns. Defaults to "240px 1fr 1fr". */
  gridTemplate?: string;
  /** Section padding (top/bottom). Defaults to "140px 0 120px". */
  padding?: string;
  /** Additional className on the section. */
  className?: string;
  /** Additional style on the section. */
  style?: CSSProperties;
}

export function ChapterShell({
  aside,
  body,
  margin,
  gridTemplate = "240px 1fr 1fr",
  padding = "140px 0 120px",
  className,
  style,
}: ChapterShellProps) {
  return (
    <section
      className={`chapter ${className ?? ""}`}
      style={{
        position: "relative",
        background: "var(--color-bg-deep)",
        padding,
        borderTop: "1px solid rgba(200, 168, 78, 0.06)",
        ...style,
      }}
    >
      <div
        className="chapter-inner"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          display: "grid",
          gridTemplateColumns: gridTemplate,
          gap: 56,
          position: "relative",
          zIndex: 1,
        }}
      >
        <aside style={{ position: "relative" }}>
          <div style={{ position: "sticky", top: 120 }}>{aside}</div>
        </aside>
        <div className="chapter-body">{body}</div>
        {margin && <div className="chapter-margin">{margin}</div>}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- ChapterShell
```

Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/chapters/ChapterShell.tsx src/components/chapters/__tests__/ChapterShell.test.tsx
git commit -m "feat(chapters): add ChapterShell layout wrapper"
```

---

### Task 4.2: Build ChapterHeadline

**Files:**
- Create: `src/components/chapters/ChapterHeadline.tsx`
- Create: `src/components/chapters/__tests__/ChapterHeadline.test.tsx`

Italic-emphasis Fraunces headline. Accepts inline `<em>` for the gold emphasis words.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/chapters/__tests__/ChapterHeadline.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { ChapterHeadline } from "../ChapterHeadline";

describe("ChapterHeadline", () => {
  it("renders provided children", () => {
    render(
      <ChapterHeadline>
        We build <em>intelligent</em> systems
      </ChapterHeadline>,
    );
    expect(screen.getByText(/We build/i)).toBeInTheDocument();
    expect(screen.getByText("intelligent")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- ChapterHeadline
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/chapters/ChapterHeadline.tsx
import { ReactNode } from "react";

export interface ChapterHeadlineProps {
  children: ReactNode;
  /** Tag to render. Defaults to h2. */
  as?: "h1" | "h2" | "h3";
  className?: string;
}

export function ChapterHeadline({ children, as: Tag = "h2", className }: ChapterHeadlineProps) {
  return (
    <Tag
      className={className}
      style={{
        fontFamily: "var(--font-serif)",
        fontWeight: 300,
        fontSize: "clamp(2.6rem, 5vw, 4.4rem)",
        letterSpacing: "-0.025em",
        color: "var(--color-text-primary)",
        lineHeight: 1.02,
        marginBottom: 36,
      }}
    >
      <style>{`
        .chapter-headline-em em {
          font-style: italic;
          color: var(--color-gold-bright);
          font-weight: 300;
        }
      `}</style>
      <span className="chapter-headline-em">{children}</span>
    </Tag>
  );
}
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- ChapterHeadline
```

Expected: 1 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/chapters/ChapterHeadline.tsx src/components/chapters/__tests__/ChapterHeadline.test.tsx
git commit -m "feat(chapters): add ChapterHeadline (italic-emphasis Fraunces)"
```

---

## Phase 5 — Home page chapters

### Task 5.1: Build PracticeChapter (Chapter 01)

**Files:**
- Create: `src/components/chapters/PracticeChapter.tsx`
- Create: `src/components/chapters/__tests__/PracticeChapter.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/chapters/__tests__/PracticeChapter.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { PracticeChapter } from "../PracticeChapter";

describe("PracticeChapter", () => {
  it("renders chapter number and title", () => {
    render(<PracticeChapter />);
    expect(screen.getByText(/01 \/ Practice/i)).toBeInTheDocument();
    expect(screen.getByText(/What we are/i)).toBeInTheDocument();
  });

  it("renders the headline copy", () => {
    render(<PracticeChapter />);
    expect(screen.getByText(/We build/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- PracticeChapter
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/chapters/PracticeChapter.tsx
import { ChapterShell } from "./ChapterShell";
import { ChapterHeadline } from "./ChapterHeadline";
import { ChapterDivider } from "@/components/primitives";

export function PracticeChapter() {
  return (
    <ChapterShell
      aside={
        <>
          <div style={asideNumStyle}>01 / Practice</div>
          <h3 style={asideTitleStyle}>What we are</h3>
          <ChapterDivider />
          <div style={asideTextStyle}>
            A small studio.<br />
            Applied AI.<br />
            Interfaces.<br />
            Engineered systems.
          </div>
        </>
      }
      body={
        <div style={{ gridColumn: "1 / -1", maxWidth: 700 }}>
          <ChapterHeadline>
            We build <em>intelligent</em> systems and the <em>interfaces</em> they live in.
          </ChapterHeadline>
          <p style={leadStyle}>
            NorthTrack Studios is a small workshop working at the intersection of
            applied AI and the surfaces that carry it. We design quietly and ship
            deliberately.
          </p>
          <p style={bodyStyle}>
            Most of what we make is invisible by the time it works —{" "}
            <b style={bodyEmStyle}>retrieval pipelines, agent graphs, decision systems</b>{" "}
            humming beneath an interface that someone elsewhere is trying to use without
            thinking about us.
          </p>
          <p style={bodyStyle}>
            That&rsquo;s the goal. The interface becomes the brand; the brand recedes
            into the work.
          </p>
        </div>
      }
      margin={
        <div style={marginNotesStyle}>
          <div style={marginNoteStyle}>
            <span style={marginLabelStyle}>Founded</span>
            2024 · Brooklyn
          </div>
          <div style={marginNoteStyle}>
            <span style={marginLabelStyle}>Practice</span>
            AI systems · Interface design · Production engineering
          </div>
          <div style={marginNoteStyle}>
            <span style={marginLabelStyle}>Annual capacity</span>
            4–6 named engagements
          </div>
        </div>
      }
    />
  );
}

const asideNumStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.5em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 16,
};
const asideTitleStyle: React.CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontWeight: 300,
  fontSize: "1.6rem",
  letterSpacing: "-0.01em",
  color: "var(--color-text-primary)",
  lineHeight: 1.1,
  marginBottom: 20,
};
const asideTextStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.18em",
  color: "var(--color-text-subtle)",
  lineHeight: 1.7,
  textTransform: "uppercase",
};
const leadStyle: React.CSSProperties = {
  fontSize: "1.05rem",
  color: "var(--color-text-body)",
  lineHeight: 1.75,
  fontWeight: 300,
  maxWidth: "56ch",
  marginBottom: 28,
};
const bodyStyle: React.CSSProperties = {
  color: "var(--color-text-muted)",
  lineHeight: 1.85,
  fontWeight: 300,
  maxWidth: "60ch",
  marginBottom: 18,
  fontSize: "0.95rem",
};
const bodyEmStyle: React.CSSProperties = {
  color: "var(--color-text-body-soft)",
  fontWeight: 400,
};
const marginNotesStyle: React.CSSProperties = {
  paddingTop: 80,
  paddingLeft: 24,
  borderLeft: "1px solid rgba(200, 168, 78, 0.1)",
};
const marginNoteStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.18em",
  color: "var(--color-text-muted)",
  lineHeight: 1.7,
  marginBottom: 24,
  textTransform: "uppercase",
};
const marginLabelStyle: React.CSSProperties = {
  color: "var(--color-gold)",
  display: "block",
  marginBottom: 4,
};
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- PracticeChapter
```

Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/chapters/PracticeChapter.tsx src/components/chapters/__tests__/PracticeChapter.test.tsx
git commit -m "feat(chapters): add Chapter 01 / Practice"
```

---

### Task 5.2: Build CapabilityRow

**Files:**
- Create: `src/components/chapters/capabilities/CapabilityRow.tsx`
- Create: `src/components/chapters/capabilities/__tests__/CapabilityRow.test.tsx`

A single capability entry with mono index, italic concept word + mono formal label, gold rule with drift particles, body, and kit line.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/chapters/capabilities/__tests__/CapabilityRow.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { CapabilityRow } from "../CapabilityRow";

describe("CapabilityRow", () => {
  it("renders the index, concept word, and formal label", () => {
    render(
      <CapabilityRow
        index="01"
        concept="Intelligence"
        formal="AI Systems"
        body="We design and ship reasoning."
        kit="Claude · OpenAI"
      />,
    );
    expect(screen.getByText(/01 \/ Intelligence/i)).toBeInTheDocument();
    expect(screen.getByText("Intelligence")).toBeInTheDocument();
    expect(screen.getByText("AI Systems")).toBeInTheDocument();
    expect(screen.getByText(/We design and ship/i)).toBeInTheDocument();
    expect(screen.getByText(/Claude · OpenAI/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- CapabilityRow
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/chapters/capabilities/CapabilityRow.tsx
import { CSSProperties, forwardRef } from "react";
import { GoldRule } from "@/components/primitives";

export interface CapabilityRowProps {
  index: string;        // e.g. "01"
  concept: string;      // italic Fraunces, e.g. "Intelligence"
  formal: string;       // mono caps, e.g. "AI Systems"
  body: string;
  kit: string;
}

export const CapabilityRow = forwardRef<HTMLDivElement, CapabilityRowProps>(
  function CapabilityRow({ index, concept, formal, body, kit }, ref) {
    return (
      <div
        ref={ref}
        data-cap-index={index}
        data-cap-concept={concept}
        style={{
          padding: "50px 0 60px",
          borderTop: "1px solid rgba(200, 168, 78, 0.08)",
          position: "relative",
        }}
      >
        <div style={indexStyle}>
          {index} / {concept}
        </div>
        <h3 style={titleStyle}>
          <em style={emStyle}>{concept}</em>
          <span style={formalStyle}>{formal}</span>
        </h3>
        <div style={{ margin: "22px 0" }}>
          <GoldRule withParticles thickness={1} />
        </div>
        <p style={bodyStyle}>{body}</p>
        <div style={kitStyle}>
          <span style={kitLabelStyle}>Kit</span>
          {kit}
        </div>
      </div>
    );
  },
);

const indexStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.5em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 14,
};
const titleStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontWeight: 300,
  fontSize: "clamp(2.2rem, 4vw, 3.4rem)",
  letterSpacing: "-0.02em",
  color: "var(--color-text-primary)",
  lineHeight: 1.05,
  marginBottom: 8,
  display: "flex",
  alignItems: "baseline",
  gap: 24,
  flexWrap: "wrap",
};
const emStyle: CSSProperties = {
  fontStyle: "italic",
  color: "var(--color-gold-bright)",
  fontWeight: 300,
};
const formalStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontStyle: "normal",
  fontSize: 11,
  letterSpacing: "0.4em",
  color: "var(--color-text-muted)",
  textTransform: "uppercase",
};
const bodyStyle: CSSProperties = {
  fontSize: "1rem",
  color: "var(--color-text-body)",
  lineHeight: 1.75,
  fontWeight: 300,
  maxWidth: "60ch",
  marginBottom: 18,
};
const kitStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.18em",
  color: "var(--color-text-subtle)",
  textTransform: "uppercase",
  lineHeight: 1.7,
};
const kitLabelStyle: CSSProperties = {
  color: "var(--color-gold)",
  marginRight: 10,
};
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- CapabilityRow
```

Expected: 1 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/chapters/capabilities/CapabilityRow.tsx src/components/chapters/capabilities/__tests__/CapabilityRow.test.tsx
git commit -m "feat(capabilities): add CapabilityRow"
```

---

### Task 5.3: Build CapabilitiesChapter with morphing aside + BluePanel

**Files:**
- Create: `src/components/chapters/capabilities/CapabilitiesChapter.tsx`
- Create: `src/components/chapters/capabilities/__tests__/CapabilitiesChapter.test.tsx`

The big one. Pinned aside that morphs based on which `CapabilityRow` is closest to viewport center; the section uses the `BluePanel` aura.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/chapters/capabilities/__tests__/CapabilitiesChapter.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { CapabilitiesChapter } from "../CapabilitiesChapter";

describe("CapabilitiesChapter", () => {
  it("renders chapter number and default title", () => {
    render(<CapabilitiesChapter />);
    expect(screen.getByText(/02 \/ Capabilities/i)).toBeInTheDocument();
    expect(screen.getByText(/What we make/i)).toBeInTheDocument();
  });

  it("renders all four capability rows", () => {
    render(<CapabilitiesChapter />);
    ["Intelligence", "Surface", "Throughput", "Direction"].forEach((concept) => {
      // appears at least once (in row title); morphing aside also surfaces it
      expect(screen.getAllByText(concept).length).toBeGreaterThan(0);
    });
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- CapabilitiesChapter
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
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
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- CapabilitiesChapter
```

Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/chapters/capabilities/CapabilitiesChapter.tsx src/components/chapters/capabilities/__tests__/CapabilitiesChapter.test.tsx
git commit -m "feat(capabilities): add Chapter 02 with morphing aside + BluePanel"
```

---

### Task 5.4: Build WorkPinnedName

**Files:**
- Create: `src/components/chapters/work/WorkPinnedName.tsx`
- Create: `src/components/chapters/work/__tests__/WorkPinnedName.test.tsx`

The sticky giant italic project name + mono meta + sub + small gold rule.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/chapters/work/__tests__/WorkPinnedName.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { WorkPinnedName } from "../WorkPinnedName";

describe("WorkPinnedName", () => {
  it("renders meta, name, and sub", () => {
    render(
      <WorkPinnedName
        meta="Project 01 · 2025 · Lead"
        name="Synapse"
        sub="An internal research workbench."
      />,
    );
    expect(screen.getByText("Project 01 · 2025 · Lead")).toBeInTheDocument();
    expect(screen.getByText("Synapse")).toBeInTheDocument();
    expect(screen.getByText(/An internal research/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- WorkPinnedName
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/chapters/work/WorkPinnedName.tsx
import { CSSProperties } from "react";
import { GoldRule } from "@/components/primitives";

export interface WorkPinnedNameProps {
  meta: string;
  name: string;
  sub: string;
}

export function WorkPinnedName({ meta, name, sub }: WorkPinnedNameProps) {
  return (
    <div style={{ position: "sticky", top: "18vh", alignSelf: "start" }}>
      <div style={metaStyle}>{meta}</div>
      <div style={nameStyle}>{name}</div>
      <div style={subStyle}>{sub}</div>
      <div style={{ marginTop: 24, width: 96 }}>
        <GoldRule withParticles thickness={1} width="96px" />
      </div>
    </div>
  );
}

const metaStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.5em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 22,
};
const nameStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "clamp(4rem, 9vw, 8rem)",
  letterSpacing: "-0.04em",
  color: "var(--color-gold-brightest)",
  lineHeight: 0.92,
  textShadow: "0 0 40px rgba(232, 200, 120, 0.18)",
};
const subStyle: CSSProperties = {
  marginTop: 24,
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "1.05rem",
  color: "var(--color-text-muted)",
  lineHeight: 1.6,
  maxWidth: "28ch",
};
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- WorkPinnedName
```

Expected: 1 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/chapters/work/WorkPinnedName.tsx src/components/chapters/work/__tests__/WorkPinnedName.test.tsx
git commit -m "feat(work): add WorkPinnedName (sticky giant italic project name)"
```

---

### Task 5.5: Build WorkStackRow + WorkStackDivider

**Files:**
- Create: `src/components/chapters/work/WorkStackDivider.tsx`
- Create: `src/components/chapters/work/WorkStackRow.tsx`
- Create: `src/components/chapters/work/__tests__/WorkStackRow.test.tsx`

- [ ] **Step 1: Write the divider component**

```tsx
// src/components/chapters/work/WorkStackDivider.tsx
import { CSSProperties } from "react";

export function WorkStackDivider() {
  return (
    <div
      style={{
        margin: "90px 0",
        height: 1,
        background:
          "linear-gradient(90deg, transparent, rgba(200, 168, 78, 0.4) 30%, rgba(200, 168, 78, 0.4) 70%, transparent)",
        boxShadow: "0 0 8px rgba(200, 168, 78, 0.3)",
        position: "relative",
      }}
      aria-hidden
    >
      <span style={{ ...particleStyle, left: "30%", animationDelay: "0s" }} />
      <span style={{ ...particleStyle, left: "32%", animationDelay: "1.6s" }} />
    </div>
  );
}

const particleStyle: CSSProperties = {
  position: "absolute",
  width: 2,
  height: 2,
  borderRadius: "50%",
  background: "var(--color-gold-bright)",
  boxShadow: "0 0 4px var(--color-gold)",
  top: -8,
  opacity: 0,
  animation: "drift-up 4s ease-in-out infinite",
};
```

- [ ] **Step 2: Write the failing row test**

```tsx
// src/components/chapters/work/__tests__/WorkStackRow.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { WorkStackRow } from "../WorkStackRow";

describe("WorkStackRow", () => {
  it("renders the project name, meta, body, tags", () => {
    render(
      <WorkStackRow
        name="Lumen"
        meta="Project 02 · 2024"
        client="The New Atlas · Lead"
        body="A public-facing AI search experience."
        tags="Editorial UX · Hybrid retrieval"
      />,
    );
    expect(screen.getByText("Lumen")).toBeInTheDocument();
    expect(screen.getByText("Project 02 · 2024")).toBeInTheDocument();
    expect(screen.getByText("The New Atlas · Lead")).toBeInTheDocument();
    expect(screen.getByText(/AI search/)).toBeInTheDocument();
    expect(screen.getByText(/Editorial UX/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run, verify fail**

```bash
npm run test:run -- WorkStackRow
```

Expected: FAIL — module missing.

- [ ] **Step 4: Write the row component**

```tsx
// src/components/chapters/work/WorkStackRow.tsx
import { CSSProperties } from "react";

export interface WorkStackRowProps {
  name: string;
  meta: string;
  client: string;
  body: string;
  tags: string;
}

export function WorkStackRow({ name, meta, client, body, tags }: WorkStackRowProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 48,
        alignItems: "baseline",
      }}
    >
      <div style={nameStyle}>{name}</div>
      <div style={metaStyle}>
        {meta}
        <span style={metaLineStyle}>{client}</span>
      </div>
      <p style={bodyStyle}>{body}</p>
      <div style={tagsStyle}>
        <span style={kitLabelStyle}>Tags</span>
        {tags}
      </div>
    </div>
  );
}

const nameStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "clamp(2.4rem, 4.8vw, 4.2rem)",
  letterSpacing: "-0.025em",
  color: "var(--color-gold-brightest)",
  lineHeight: 1,
  textShadow: "0 0 30px rgba(232, 200, 120, 0.12)",
};
const metaStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.4em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  lineHeight: 1.7,
};
const metaLineStyle: CSSProperties = {
  color: "var(--color-text-muted)",
  display: "block",
  marginTop: 4,
};
const bodyStyle: CSSProperties = {
  gridColumn: "1 / -1",
  marginTop: 22,
  fontSize: "1rem",
  color: "var(--color-text-body)",
  lineHeight: 1.78,
  fontWeight: 300,
  maxWidth: "70ch",
};
const tagsStyle: CSSProperties = {
  gridColumn: "1 / -1",
  marginTop: 14,
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.32em",
  color: "var(--color-text-subtle)",
  textTransform: "uppercase",
};
const kitLabelStyle: CSSProperties = {
  color: "var(--color-gold)",
  marginRight: 10,
};
```

- [ ] **Step 5: Run, verify pass**

```bash
npm run test:run -- WorkStackRow
```

Expected: 1 passed.

- [ ] **Step 6: Commit**

```bash
git add src/components/chapters/work/
git commit -m "feat(work): add WorkStackRow + WorkStackDivider"
```

---

### Task 5.6: Build WorkChapter (Chapter 03)

**Files:**
- Create: `src/components/chapters/work/WorkChapter.tsx`
- Create: `src/components/chapters/work/__tests__/WorkChapter.test.tsx`

Assembles the pinned project (Synapse with 3 text beats) + 2 stacked rows (Lumen, Threshold) with dividers.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/chapters/work/__tests__/WorkChapter.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { WorkChapter } from "../WorkChapter";

describe("WorkChapter", () => {
  it("renders the chapter aside title", () => {
    render(<WorkChapter />);
    expect(screen.getByText(/03 \/ Work/i)).toBeInTheDocument();
    expect(screen.getByText("Selected")).toBeInTheDocument();
  });

  it("renders all three project names", () => {
    render(<WorkChapter />);
    ["Synapse", "Lumen", "Threshold"].forEach((n) => {
      expect(screen.getByText(n)).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- WorkChapter
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/chapters/work/WorkChapter.tsx
import { CSSProperties } from "react";
import { ChapterDivider } from "@/components/primitives";
import { WorkPinnedName } from "./WorkPinnedName";
import { WorkStackRow } from "./WorkStackRow";
import { WorkStackDivider } from "./WorkStackDivider";

export function WorkChapter() {
  return (
    <section
      style={{
        background: "var(--color-bg-deep)",
        padding: "140px 0 60px",
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
            <div style={asideNumStyle}>03 / Work</div>
            <h3 style={asideTitleStyle}>Selected</h3>
            <ChapterDivider />
            <div style={asideTextStyle}>
              Three pieces.<br />
              2024 — 2025.<br />
              Available on request.
            </div>
          </div>
        </aside>

        {/* Body */}
        <div>
          {/* Project 1 — pinned name + scrolling beats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
              gap: 80,
              alignItems: "start",
              minHeight: "240vh",
              paddingBottom: 100,
            }}
          >
            <WorkPinnedName
              meta="Project 01 · 2025 · Lead"
              name="Synapse"
              sub="An internal research workbench for a hedge fund (private)."
            />
            <div style={{ paddingTop: 100, display: "flex", flexDirection: "column", gap: 110, maxWidth: "56ch" }}>
              <Beat
                tag="Beat 01 · The piece"
                body={
                  <>
                    Analysts query the firm&rsquo;s full corpus through a single conversational
                    surface. The system retrieves, cites, and reasons across structured and
                    unstructured sources — and tells you when it doesn&rsquo;t know.
                  </>
                }
              />
              <Beat
                tag="Beat 02 · The challenge"
                body={
                  <>
                    Six different research silos. Twenty-eight analysts asking the same
                    questions across them in slightly different ways. The fix wasn&rsquo;t
                    another search box — it was a system that knew{" "}
                    <b style={beatBodyEmStyle}>which silo to ask, in what order, with what authority.</b>
                  </>
                }
              />
              <Beat
                tag="Beat 03 · What shipped"
                body={
                  <>
                    A multi-agent retrieval graph with a single interface, source-cited
                    responses, an evaluation harness scoring every answer against
                    analyst-curated gold, and a custom dashboard for the head of research
                    to monitor query patterns and flag drift.
                  </>
                }
                tags="Claude · LangGraph · pgvector · Modal · Next.js"
              />
            </div>
          </div>

          <WorkStackDivider />

          <WorkStackRow
            name="Lumen"
            meta="Project 02 · 2024"
            client="The New Atlas · Lead"
            body="A public-facing AI search experience built on a publication's 12-year archive. Reads like an editorial — structured answers with cited paragraphs, related stories, and a timeline of how a story evolved over a decade."
            tags="Editorial UX · Hybrid retrieval · Citation architecture · Public beta"
          />

          <WorkStackDivider />

          <WorkStackRow
            name="Threshold"
            meta="Project 03 · 2025"
            client="Block Eleven · Lead"
            body="An agent-driven incident response system for a security firm. Triages alerts, writes the first draft of the runbook execution, and routes humans only when the system's confidence drops below threshold."
            tags="Agent orchestration · Tool use · Confidence routing · Internal production"
          />
        </div>
      </div>
    </section>
  );
}

interface BeatProps {
  tag: string;
  body: React.ReactNode;
  tags?: string;
}
function Beat({ tag, body, tags }: BeatProps) {
  return (
    <div>
      <div style={beatTagStyle}>{tag}</div>
      <p style={beatBodyStyle}>{body}</p>
      {tags && (
        <div style={beatTagsStyle}>
          {tags}
        </div>
      )}
    </div>
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
const beatTagStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.4em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 14,
};
const beatBodyStyle: CSSProperties = {
  fontSize: "1.02rem",
  color: "var(--color-text-body)",
  lineHeight: 1.78,
  fontWeight: 300,
};
const beatBodyEmStyle: CSSProperties = {
  color: "var(--color-text-primary)",
  fontWeight: 400,
};
const beatTagsStyle: CSSProperties = {
  marginTop: 16,
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.32em",
  color: "var(--color-text-subtle)",
  textTransform: "uppercase",
};
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- WorkChapter
```

Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/chapters/work/WorkChapter.tsx src/components/chapters/work/__tests__/WorkChapter.test.tsx
git commit -m "feat(work): add Chapter 03 (pinned Synapse + stacked Lumen + Threshold)"
```

---

### Task 5.7: Build useSpringValue hook

**Files:**
- Create: `src/components/hooks/useSpringValue.ts`
- Create: `src/components/hooks/__tests__/useSpringValue.test.ts`

The reusable spring physics for the process spine — a single number that lerps toward a target each rAF tick.

- [ ] **Step 1: Write the failing test**

```ts
// src/components/hooks/__tests__/useSpringValue.test.ts
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSpringValue } from "../useSpringValue";

describe("useSpringValue", () => {
  it("returns the initial value (0) before any target is set", () => {
    const { result } = renderHook(() => useSpringValue(() => 100));
    // Spring hasn't run yet
    expect(result.current).toBeGreaterThanOrEqual(0);
  });

  it("converges toward the target after several frames", async () => {
    const { result } = renderHook(() => useSpringValue(() => 200, { stiffness: 0.16, damping: 0.76 }));
    // Wait for several rAF cycles
    await act(async () => {
      for (let i = 0; i < 100; i++) {
        await new Promise((r) => setTimeout(r, 16));
      }
    });
    expect(result.current).toBeGreaterThan(150);
    expect(result.current).toBeLessThan(250);
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- useSpringValue
```

Expected: FAIL.

- [ ] **Step 3: Write the hook**

```ts
// src/components/hooks/useSpringValue.ts
"use client";
import { useEffect, useRef, useState } from "react";

export interface SpringOptions {
  /** Pull strength toward target. Default 0.16. */
  stiffness?: number;
  /** Velocity decay per tick. Default 0.76. */
  damping?: number;
  /** Below this magnitude of motion, snap to target and stop. Default 0.05. */
  restThreshold?: number;
}

/**
 * Spring-driven reactive value. Reads `getTarget` each rAF and lerps toward it
 * with velocity. Returns the displayed value as React state (re-renders on change).
 */
export function useSpringValue(
  getTarget: () => number,
  { stiffness = 0.16, damping = 0.76, restThreshold = 0.05 }: SpringOptions = {},
): number {
  const [displayed, setDisplayed] = useState(0);
  const valueRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    function tick() {
      const target = getTarget();
      const force = (target - valueRef.current) * stiffness;
      velocityRef.current = velocityRef.current * damping + force;
      valueRef.current += velocityRef.current;
      // Update React state only when change is meaningful
      if (Math.abs(valueRef.current - displayed) > restThreshold) {
        setDisplayed(valueRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTarget, stiffness, damping, restThreshold]);

  return displayed;
}
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- useSpringValue
```

Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/hooks/useSpringValue.ts src/components/hooks/__tests__/useSpringValue.test.ts
git commit -m "feat(hooks): add useSpringValue (rAF lerp + velocity)"
```

---

### Task 5.8: Build ProcessStep + ProcessSpine + ProcessChapter

**Files:**
- Create: `src/components/chapters/process/ProcessStep.tsx`
- Create: `src/components/chapters/process/ProcessSpine.tsx`
- Create: `src/components/chapters/process/ProcessChapter.tsx`
- Create: `src/components/chapters/process/__tests__/ProcessChapter.test.tsx`

Combined into one task because the three pieces are tightly coupled.

- [ ] **Step 1: Write ProcessStep**

```tsx
// src/components/chapters/process/ProcessStep.tsx
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
```

- [ ] **Step 2: Write ProcessSpine**

```tsx
// src/components/chapters/process/ProcessSpine.tsx
"use client";
import { CSSProperties, useCallback, useRef } from "react";
import { useSpringValue } from "@/components/hooks/useSpringValue";

export interface ProcessSpineProps {
  /** Diagram element to track (used for boundsRect). */
  diagramRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Spring-driven gold spine + glowing tip particle. Tracker is at viewport
 * center; progress = (tracker - diagram.top) / diagram.height.
 */
export function ProcessSpine({ diagramRef }: ProcessSpineProps) {
  const lastHeightRef = useRef(0);

  const getTarget = useCallback(() => {
    const el = diagramRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    if (rect.height <= 0) return 0;
    const tracker = window.innerHeight * 0.5;
    const offset = tracker - rect.top;
    const progress = Math.max(0, Math.min(1, offset / rect.height));
    lastHeightRef.current = rect.height;
    return progress * rect.height;
  }, [diagramRef]);

  const displayed = useSpringValue(getTarget, { stiffness: 0.16, damping: 0.76 });

  const showTip =
    lastHeightRef.current > 0 &&
    displayed > lastHeightRef.current * 0.005 &&
    displayed < lastHeightRef.current * 0.995;

  return (
    <>
      {/* Background hairline */}
      <div style={spineBgStyle} aria-hidden />
      {/* Filled portion */}
      <div
        style={{
          ...spineFillStyle,
          height: `${displayed}px`,
        }}
        aria-hidden
      />
      {/* Tip particle */}
      <div
        style={{
          ...spineTipStyle,
          top: `${displayed}px`,
          opacity: showTip ? 1 : 0,
        }}
        aria-hidden
      />
    </>
  );
}

const spineBgStyle: CSSProperties = {
  position: "absolute",
  left: 24,
  top: 0,
  bottom: 0,
  width: 1,
  background: "rgba(200, 168, 78, 0.08)",
};
const spineFillStyle: CSSProperties = {
  position: "absolute",
  left: 24,
  top: 0,
  width: 2,
  marginLeft: -0.5,
  background:
    "linear-gradient(to bottom, rgba(200, 168, 78, 0.9) 0%, var(--color-gold) 100%)",
  boxShadow: "0 0 8px rgba(200, 168, 78, 0.6)",
  willChange: "height",
};
const spineTipStyle: CSSProperties = {
  position: "absolute",
  left: 24,
  transform: "translate(-50%, -50%)",
  width: 10,
  height: 10,
  borderRadius: "50%",
  background:
    "radial-gradient(circle, #fff5d8 0%, var(--color-gold-brightest) 30%, var(--color-gold) 50%, transparent 75%)",
  boxShadow: "0 0 14px rgba(232, 200, 120, 0.85), 0 0 28px rgba(200, 168, 78, 0.5)",
  pointerEvents: "none",
  transition: "opacity 0.3s ease",
  willChange: "top",
};
```

- [ ] **Step 3: Write ProcessChapter**

```tsx
// src/components/chapters/process/ProcessChapter.tsx
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
```

- [ ] **Step 4: Write the smoke test**

```tsx
// src/components/chapters/process/__tests__/ProcessChapter.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { ProcessChapter } from "../ProcessChapter";

describe("ProcessChapter", () => {
  it("renders the chapter aside", () => {
    render(<ProcessChapter />);
    expect(screen.getByText(/04 \/ Process/i)).toBeInTheDocument();
    expect(screen.getByText(/How we work/i)).toBeInTheDocument();
  });

  it("renders all four phase numbers", () => {
    render(<ProcessChapter />);
    ["Phase 01", "Phase 02", "Phase 03", "Phase 04"].forEach((p) => {
      expect(screen.getByText(p)).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 5: Run, verify pass**

```bash
npm run test:run -- ProcessChapter
```

Expected: 2 passed.

- [ ] **Step 6: Commit**

```bash
git add src/components/chapters/process/
git commit -m "feat(process): add Chapter 04 with spring-driven kinematic spine"
```

---

### Task 5.9: Build BriefTeaser (Chapter 05)

**Files:**
- Create: `src/components/chapters/BriefTeaser.tsx`
- Create: `src/components/chapters/__tests__/BriefTeaser.test.tsx`

A single-section teaser on the home that shows ONE question + a CTA to /brief. Plan 3 builds the full /brief flow; this one passes its draft answer to the next page via a query parameter.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/chapters/__tests__/BriefTeaser.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { BriefTeaser } from "../BriefTeaser";

describe("BriefTeaser", () => {
  it("renders the chapter number and prompt", () => {
    render(<BriefTeaser />);
    expect(screen.getByText(/05 \/ Brief/i)).toBeInTheDocument();
    expect(screen.getByText(/coming back to/i)).toBeInTheDocument();
  });

  it("renders the continue CTA link to /brief", () => {
    render(<BriefTeaser />);
    const link = screen.getByRole("link", { name: /Continue the brief/i });
    expect(link).toHaveAttribute("href", expect.stringContaining("/brief"));
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- BriefTeaser
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/chapters/BriefTeaser.tsx
"use client";
import Link from "next/link";
import { CSSProperties, useState } from "react";

export function BriefTeaser() {
  const [draft, setDraft] = useState("");
  const href = draft.trim()
    ? `/brief?seed=${encodeURIComponent(draft.trim())}`
    : "/brief";

  return (
    <section
      style={{
        background: "var(--color-bg-deep)",
        padding: "120px 32px 140px",
        borderTop: "1px solid rgba(200, 168, 78, 0.06)",
      }}
    >
      <div style={{ maxWidth: 740, margin: "0 auto", textAlign: "center" }}>
        <div style={numStyle}>05 / Brief</div>
        <h2 style={promptStyle}>
          What&rsquo;s the question you keep <em style={emStyle}>coming back to</em>?
        </h2>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="The real one, not the polished one."
          rows={3}
          style={inputStyle}
        />
        <div style={ruleStyle} aria-hidden />
        <div style={{ marginTop: 32 }}>
          <Link href={href} style={ctaStyle}>
            Continue the brief <span style={{ marginLeft: 12 }}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

const numStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.5em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 24,
};
const promptStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "clamp(1.8rem, 4vw, 3rem)",
  letterSpacing: "-0.025em",
  color: "var(--color-text-primary)",
  lineHeight: 1.1,
  marginBottom: 36,
};
const emStyle: CSSProperties = {
  color: "var(--color-gold-brightest)",
  fontStyle: "italic",
  fontWeight: 400,
  textShadow: "0 0 18px rgba(232, 200, 120, 0.35)",
};
const inputStyle: CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  outline: "none",
  color: "var(--color-text-primary)",
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
  padding: "6px 0 14px",
  caretColor: "var(--color-gold-brightest)",
  resize: "none",
  textAlign: "center",
};
const ruleStyle: CSSProperties = {
  height: 1,
  background:
    "linear-gradient(90deg, rgba(200, 168, 78, 0.25), rgba(200, 168, 78, 0.5) 50%, rgba(200, 168, 78, 0.25))",
  boxShadow: "0 0 4px rgba(200, 168, 78, 0.2)",
};
const ctaStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.42em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  padding: "18px 4px",
  borderBottom: "1px solid var(--color-gold)",
  boxShadow: "0 1px 0 0 rgba(200, 168, 78, 0.5)",
};
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- BriefTeaser
```

Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/chapters/BriefTeaser.tsx src/components/chapters/__tests__/BriefTeaser.test.tsx
git commit -m "feat(brief): add Chapter 05 BriefTeaser (one-question CTA → /brief)"
```

---

### Task 5.10: Build ContactClosing

**Files:**
- Create: `src/components/closing/ContactClosing.tsx`
- Create: `src/components/closing/__tests__/ContactClosing.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/closing/__tests__/ContactClosing.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { ContactClosing } from "../ContactClosing";

describe("ContactClosing", () => {
  it("renders the closing headline", () => {
    render(<ContactClosing />);
    expect(screen.getByText(/A short conversation/i)).toBeInTheDocument();
  });

  it("renders the begin-a-brief CTA", () => {
    render(<ContactClosing />);
    const link = screen.getByRole("link", { name: /Begin a brief/i });
    expect(link).toHaveAttribute("href", "/brief");
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- ContactClosing
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/closing/ContactClosing.tsx
import Link from "next/link";
import { CSSProperties } from "react";
import { CornerGlyphs } from "@/components/intro/CornerGlyphs";

export function ContactClosing() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 50% 50%, var(--color-bg-radial) 0%, var(--color-bg-deep) 80%)",
        borderTop: "1px solid rgba(200, 168, 78, 0.06)",
        padding: "80px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div className="grid-overlay" aria-hidden />
      <CornerGlyphs />

      <div style={{ textAlign: "center", maxWidth: 640, position: "relative", zIndex: 5 }}>
        <div style={tagStyle}>Closing</div>
        <h2 style={headlineStyle}>
          A short conversation, <em style={emStyle}>privately</em>.
        </h2>
        <div style={ruleStyle} aria-hidden />
        <p style={bodyStyle}>
          If you have an idea you&rsquo;ve been turning over and you&rsquo;d like
          a second opinion before it becomes a project, write to us. The first
          conversation is short, off the record, and free of charge.
        </p>
        <Link href="/brief" style={ctaStyle}>
          Begin a brief <span style={{ marginLeft: 12 }}>→</span>
        </Link>
        <div style={auxStyle}>
          Or write directly &middot;{" "}
          <a href="mailto:hello@northtrack.studio" style={auxLinkStyle}>
            hello@northtrack.studio
          </a>
        </div>
      </div>
    </section>
  );
}

const tagStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.5em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 30,
};
const headlineStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontWeight: 300,
  fontSize: "clamp(2.4rem, 4.8vw, 4rem)",
  letterSpacing: "-0.025em",
  color: "var(--color-text-primary)",
  lineHeight: 1.1,
  marginBottom: 32,
};
const emStyle: CSSProperties = {
  fontStyle: "italic",
  color: "var(--color-gold-bright)",
};
const ruleStyle: CSSProperties = {
  width: 280,
  height: 1,
  background:
    "linear-gradient(90deg, transparent, var(--color-gold) 25%, var(--color-gold-brightest) 50%, var(--color-gold) 75%, transparent)",
  boxShadow: "0 0 12px rgba(232, 200, 120, 0.5)",
  margin: "0 auto 28px",
  borderRadius: "999px",
};
const bodyStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "1.05rem",
  color: "var(--color-text-body)",
  lineHeight: 1.7,
  marginBottom: 38,
  maxWidth: "50ch",
  marginLeft: "auto",
  marginRight: "auto",
};
const ctaStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.42em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  textDecoration: "none",
  padding: "14px 38px",
  border: "1px solid rgba(200, 168, 78, 0.4)",
  borderRadius: "999px",
  display: "inline-block",
  transition: "all 0.4s ease",
};
const auxStyle: CSSProperties = {
  marginTop: 28,
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.4em",
  color: "var(--color-text-muted)",
  textTransform: "uppercase",
};
const auxLinkStyle: CSSProperties = {
  color: "var(--color-text-body)",
  textDecoration: "none",
};
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- ContactClosing
```

Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/closing/ContactClosing.tsx src/components/closing/__tests__/ContactClosing.test.tsx
git commit -m "feat(closing): add ContactClosing colophon"
```

---

### Task 5.11: Build FooterMini

**Files:**
- Create: `src/components/closing/FooterMini.tsx`
- Create: `src/components/closing/__tests__/FooterMini.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/closing/__tests__/FooterMini.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils/render";
import { FooterMini } from "../FooterMini";

describe("FooterMini", () => {
  it("renders the studio name and est year", () => {
    render(<FooterMini />);
    expect(screen.getByText(/NorthTrack Studios/i)).toBeInTheDocument();
    expect(screen.getByText(/est\. 2024/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- FooterMini
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/closing/FooterMini.tsx
import { CSSProperties } from "react";

export function FooterMini() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(200, 168, 78, 0.1)",
        padding: 32,
        background: "var(--color-bg-deep)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "var(--font-mono)",
        fontSize: 9,
        letterSpacing: "0.4em",
        color: "var(--color-text-faint)",
        textTransform: "uppercase",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <div>
        NorthTrack Studios <span style={goldStyle}>·</span>{" "}
        <span style={goldStyle}>est. 2024</span>
      </div>
      <div>40.7128° N · 74.0060° W</div>
      <div>Vol. 02 · Issue 01</div>
    </footer>
  );
}

const goldStyle: CSSProperties = { color: "var(--color-gold)" };
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- FooterMini
```

Expected: 1 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/closing/FooterMini.tsx src/components/closing/__tests__/FooterMini.test.tsx
git commit -m "feat(closing): add FooterMini"
```

---

### Task 5.12: Assemble new home page

**Files:**
- Modify: `src/app/page.tsx`

This replaces the v1 page.tsx entirely with the new composition. The v1 components remain in `src/components/` (cleanup is in Plan 4) but are no longer imported.

- [ ] **Step 1: Rewrite page.tsx**

```tsx
// src/app/page.tsx
"use client";
import { useState } from "react";
import { ScrollProgress } from "@/components/nav/ScrollProgress";
import { NavShell } from "@/components/nav/NavShell";
import { IntroStage } from "@/components/intro/IntroStage";
import { PracticeChapter } from "@/components/chapters/PracticeChapter";
import { CapabilitiesChapter } from "@/components/chapters/capabilities/CapabilitiesChapter";
import { WorkChapter } from "@/components/chapters/work/WorkChapter";
import { ProcessChapter } from "@/components/chapters/process/ProcessChapter";
import { BriefTeaser } from "@/components/chapters/BriefTeaser";
import { ContactClosing } from "@/components/closing/ContactClosing";
import { FooterMini } from "@/components/closing/FooterMini";
import { ChapterBreak } from "@/components/primitives";

export default function Home() {
  const [handedOff, setHandedOff] = useState(false);

  return (
    <>
      <ScrollProgress />
      <NavShell show={handedOff} />

      <IntroStage onHandoffChange={setHandedOff} />

      <PracticeChapter />
      <ChapterBreak n="01" />

      <CapabilitiesChapter />
      <ChapterBreak n="02" />

      <WorkChapter />
      <ChapterBreak n="03" />

      <ProcessChapter />
      <ChapterBreak n="04" />

      <BriefTeaser />
      <ChapterBreak n="05" />

      <ContactClosing />
      <FooterMini />
    </>
  );
}
```

- [ ] **Step 2: Manual verification**

```bash
npm run dev
```

Open http://localhost:3000.

Expected: home renders with intro animation, scroll handoff fires when you scroll, all 5 chapters render in order, contact closing + footer at bottom. No console errors. No pages broken.

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(home): assemble v2 home page from new chapter components"
```

---

## Verification — end of Plan 2

- [ ] **Run the full test suite**

```bash
npm run test:run
```

Expected: every test passes (Plan 1 tests + all new Plan 2 tests).

- [ ] **Run lint**

```bash
npm run lint
```

Expected: clean. Note: v1 components (`Hero.tsx`, `Services.tsx`, etc.) are still on disk but unused — ESLint may warn about unused exports; that's OK, Plan 4 removes them.

- [ ] **Run a production build**

```bash
npm run build
```

Expected: build completes.

- [ ] **Manual visual verification of the home page**

```bash
npm run dev
```

Open http://localhost:3000 in a browser. Walk through:

1. **Intro stage** loads. Mono "northtrack  studios" wipes in left to right (~1.5s). Gold rule grows under it (~1.9s). ~14 particles burst upward. Italic Fraunces "A studio for applied *intelligence*" fades in (~3.5s). "begin" cue + stem visible at bottom.
2. **Scroll down ~60% of viewport.** Wordmark scales to ~32% and migrates to the top-left as `N·T/S`. Mini nav (About / Capabilities / Work / Process / Contact) fades in. Top hairline progress bar grows.
3. **Chapter 01 / Practice** — sticky aside on the left, italic-emphasis serif headline ("We build *intelligent* systems and the *interfaces* they live in"), 2-col body + margin notes.
4. **Chapter 02 / Capabilities** — blue + gold-grid aura visible behind the body, masked-fading on both sides. Scroll through capabilities; aside title morphs as you pass each row (Intelligence → Surface → Throughput → Direction). Indicator bars on the aside light up.
5. **Chapter 03 / Work** — *Synapse* italic name pinned for ~2 viewports while 3 text beats scroll past. Then *Lumen* and *Threshold* stack as text-only rows separated by gold rules with drift particles.
6. **Chapter 04 / Process** — vertical gold spine grows down with elastic spring as you scroll. Glowing tip particle rides the leading edge. Each phase activates as the spine reaches its dot.
7. **Chapter 05 / Brief teaser** — single italic question, textarea (type something to test), Continue link goes to `/brief?seed=...`.
8. **Closing** — quiet centered colophon with gold rule, italic body, `Begin a brief →` CTA, direct email link.
9. **Footer** — minimal mono row.

If any of these fail visually, fix the underlying component before moving on.

Stop the dev server.

- [ ] **Final commit if any cleanup**

```bash
git add -A
git commit -m "chore: lint + visual cleanup after Plan 2"
```

---

## Plan-2 self-review

- [ ] All chapters render in order in `src/app/page.tsx`
- [ ] `IntroStage onHandoffChange` callback wired to `NavShell.show`
- [ ] `BluePanel` used inside `CapabilitiesChapter`
- [ ] `useSpringValue` defined and used by `ProcessSpine`
- [ ] All test files import their module under test
- [ ] Type names match across files (`WorkPinnedNameProps`, `CapabilityRowProps`, etc.)

---

## What's next (Plan 3 preview)

Plan 3 builds the full `/brief` flow:

- `OptionRow` component (selection question UI)
- `EditorialField` component (text question UI)
- `EditorialButton` component (replaces all pill buttons site-wide)
- `BriefQuestionnaire` state machine
- All 5 question screens (3 selections + 1 long text + 1 two-text)
- Composed inference view ("What we'd build for you")
- `/brief` page route
- Pre-fill from home teaser query parameter
- `/api/brief` route stub for submission

Plan 4 follows: sub-pages + polish + v1 cleanup.
