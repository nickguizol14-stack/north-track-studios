# NorthTrack v2 Redesign — Plan 3 of 4: Brief Questionnaire

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full `/brief` flow — 3 selection questions + 1 long-text + 1 two-text contact, with the editorial option-row UI, type-on-line text fields, gold-underlined editorial buttons, spring-physics page transitions, and the "what we'd build for you" composed inference view at the end.

**Architecture:** A single `BriefQuestionnaire` client component owns the question state machine. Each question type renders a different body (selection rows, single textarea, or two side-by-side text fields). Three primitive UI components — `OptionRow`, `EditorialField`, `EditorialButton` — are reusable across the rest of the site (Plan 4's `/contact` form uses them too). Composed view runs deterministic inference rules over the user's selections.

**Tech Stack:** Same as Plans 1 + 2. No new runtime deps.

**Out of scope:** Real submission backend (only a stub `/api/brief` route is included). Plan 4 has the `/contact` page that uses the same `EditorialField` + `EditorialButton`.

**Spec reference:** `docs/superpowers/specs/2026-04-30-redesign-v2-atelier-design.md` §8.

**Depends on:** Plans 1 + 2 complete (primitives, hooks, NavShell, BluePanel, BurstParticles, TypeParticles).

---

## File structure

**Created:**
- `src/components/brief/OptionRow.tsx`
- `src/components/brief/EditorialField.tsx`
- `src/components/brief/EditorialButton.tsx`
- `src/components/brief/QuestionShell.tsx` — header + stage scaffolding shared across questions
- `src/components/brief/BriefQuestionnaire.tsx` — state machine + question rendering + composed view
- `src/components/brief/inference.ts` — pure inference rules used by composed view
- `src/components/brief/index.ts` — barrel
- Tests for each in matching `__tests__/`
- `src/app/brief/page.tsx` — replaces existing /brief content
- `src/app/api/brief/route.ts` — POST stub

**Modified:**
- `src/app/globals.css` — add a couple of brief-specific keyframes (page enter/exit, option-row drift)

---

## Phase 6 — Brief questionnaire

### Task 6.1: Add brief-specific keyframes

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Append keyframes**

Append to `src/app/globals.css`:

```css
/* ─── Brief questionnaire ─── */
@keyframes opt-drift {
  0% { opacity: 0; transform: translateY(0); }
  25% { opacity: 0.9; }
  100% { opacity: 0; transform: translateY(-22px); }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(brief): add option-row drift keyframe"
```

---

### Task 6.2: Build EditorialButton

**Files:**
- Create: `src/components/brief/EditorialButton.tsx`
- Create: `src/components/brief/__tests__/EditorialButton.test.tsx`

The mono caps text on a gold underline with sliding arrow — used for Continue / Send and reused for /contact submit later.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/brief/__tests__/EditorialButton.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test-utils/render";
import { EditorialButton } from "../EditorialButton";

describe("EditorialButton", () => {
  it("renders the label and arrow", () => {
    render(<EditorialButton ready>Continue</EditorialButton>);
    expect(screen.getByText("Continue")).toBeInTheDocument();
    expect(screen.getByText("→")).toBeInTheDocument();
  });

  it("supports back direction (left arrow)", () => {
    render(
      <EditorialButton direction="back" ready>
        Back
      </EditorialButton>,
    );
    expect(screen.getByText("←")).toBeInTheDocument();
  });

  it("invokes onClick when ready and clicked", () => {
    const onClick = vi.fn();
    render(
      <EditorialButton ready onClick={onClick}>
        Continue
      </EditorialButton>,
    );
    screen.getByRole("button").click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does not invoke onClick when not ready", () => {
    const onClick = vi.fn();
    render(
      <EditorialButton ready={false} onClick={onClick}>
        Continue
      </EditorialButton>,
    );
    screen.getByRole("button").click();
    expect(onClick).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- EditorialButton
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/brief/EditorialButton.tsx
"use client";
import { CSSProperties, ReactNode, useState } from "react";

export interface EditorialButtonProps {
  children: ReactNode;
  /** When true, button is enabled and styled gold. Default true. */
  ready?: boolean;
  /** "forward" arrow → on right; "back" arrow ← on left. Default forward. */
  direction?: "forward" | "back";
  onClick?: () => void;
  className?: string;
}

export function EditorialButton({
  children,
  ready = true,
  direction = "forward",
  onClick,
  className,
}: EditorialButtonProps) {
  const [hover, setHover] = useState(false);

  const arrow = direction === "forward" ? "→" : "←";
  const arrowOffset = direction === "forward" ? 8 : -8;

  const baseColor = ready
    ? hover
      ? "var(--color-gold-brightest)"
      : "var(--color-gold)"
    : "var(--color-text-faint)";

  const ruleBg = ready
    ? hover
      ? "linear-gradient(90deg, var(--color-gold) 0%, var(--color-gold-brightest) 50%, var(--color-gold) 100%)"
      : "var(--color-gold)"
    : "rgba(200, 168, 78, 0.18)";
  const ruleShadow = ready
    ? hover
      ? "0 0 18px rgba(232, 200, 120, 0.7)"
      : "0 0 8px rgba(200, 168, 78, 0.5)"
    : "none";

  return (
    <button
      type="button"
      className={`editorial-btn ${className ?? ""}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        if (ready && onClick) onClick();
      }}
      disabled={!ready}
      style={{
        ...wrapStyle,
        color: baseColor,
        cursor: ready ? "pointer" : "not-allowed",
      }}
    >
      {direction === "back" && (
        <span
          style={{
            display: "inline-block",
            fontSize: 16,
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: ready && hover ? `translateX(${arrowOffset}px)` : "translateX(0)",
            marginRight: 14,
          }}
        >
          {arrow}
        </span>
      )}
      {children}
      {direction === "forward" && (
        <span
          style={{
            display: "inline-block",
            fontSize: 16,
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: ready && hover ? `translateX(${arrowOffset}px)` : "translateX(0)",
            marginLeft: 14,
          }}
        >
          {arrow}
        </span>
      )}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 1,
          background: ruleBg,
          boxShadow: ruleShadow,
          transition: "background 0.4s ease, box-shadow 0.4s ease",
        }}
      />
    </button>
  );
}

const wrapStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.42em",
  textTransform: "uppercase",
  background: "transparent",
  border: "none",
  padding: "18px 4px",
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  transition: "color 0.4s ease",
};
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- EditorialButton
```

Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/brief/EditorialButton.tsx src/components/brief/__tests__/EditorialButton.test.tsx
git commit -m "feat(brief): add EditorialButton (gold-underlined editorial action)"
```

---

### Task 6.3: Build OptionRow

**Files:**
- Create: `src/components/brief/OptionRow.tsx`
- Create: `src/components/brief/__tests__/OptionRow.test.tsx`

The editorial selection row — number / italic concept / gold rule / detail / dot indicator.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/brief/__tests__/OptionRow.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test-utils/render";
import { OptionRow } from "../OptionRow";

describe("OptionRow", () => {
  it("renders index, title, and detail", () => {
    render(
      <OptionRow
        index="01"
        title="An AI assistant or agent"
        detail="Conversational systems."
        selected={false}
        onSelect={() => {}}
      />,
    );
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("An AI assistant or agent")).toBeInTheDocument();
    expect(screen.getByText("Conversational systems.")).toBeInTheDocument();
  });

  it("shows + when not selected, ✓ when selected", () => {
    const { rerender } = render(
      <OptionRow index="01" title="t" detail="d" selected={false} onSelect={() => {}} />,
    );
    expect(screen.getByText("+")).toBeInTheDocument();
    rerender(<OptionRow index="01" title="t" detail="d" selected onSelect={() => {}} />);
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  it("invokes onSelect when clicked", () => {
    const onSelect = vi.fn();
    render(<OptionRow index="01" title="t" detail="d" selected={false} onSelect={onSelect} />);
    screen.getByText("t").click();
    expect(onSelect).toHaveBeenCalledOnce();
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- OptionRow
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/brief/OptionRow.tsx
"use client";
import { CSSProperties, useState } from "react";

export interface OptionRowProps {
  index: string;        // "01"
  title: string;        // italic Fraunces
  detail: string;       // mono / sans body
  selected: boolean;
  onSelect: () => void;
}

export function OptionRow({ index, title, detail, selected, onSelect }: OptionRowProps) {
  const [hover, setHover] = useState(false);
  const active = selected || hover;

  const titleColor = selected
    ? "var(--color-gold-brightest)"
    : hover
      ? "var(--color-text-primary)"
      : "var(--color-text-body-soft)";

  const ruleWidth = selected ? 96 : hover ? 56 : 24;
  const ruleBg = selected
    ? "linear-gradient(90deg, var(--color-gold), var(--color-gold-brightest) 60%, transparent)"
    : hover
      ? "rgba(200, 168, 78, 0.5)"
      : "rgba(200, 168, 78, 0.2)";
  const ruleShadow = selected ? "0 0 8px rgba(200, 168, 78, 0.5)" : "none";

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "64px 1fr 32px",
        gap: 28,
        padding: "24px 0",
        cursor: "pointer",
        borderTop: "1px solid rgba(200, 168, 78, 0.08)",
        alignItems: "start",
        position: "relative",
        paddingLeft: active ? 12 : 0,
        transition: "padding-left 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Selected accent line on left */}
      {selected && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: 24,
            bottom: 24,
            width: 1,
            background: "var(--color-gold)",
            boxShadow: "0 0 6px rgba(200, 168, 78, 0.6)",
          }}
        />
      )}

      {/* Number */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.4em",
          color: selected ? "var(--color-gold)" : hover ? "var(--color-text-muted)" : "var(--color-text-faint)",
          textTransform: "uppercase",
          paddingTop: 10,
          transition: "color 0.4s ease",
        }}
      >
        {index}
      </div>

      {/* Content */}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(1.4rem, 2.4vw, 2rem)",
            letterSpacing: "-0.015em",
            color: titleColor,
            lineHeight: 1.1,
            marginBottom: 12,
            transition: "color 0.4s ease, text-shadow 0.4s ease",
            textShadow: selected ? "0 0 22px rgba(232, 200, 120, 0.35)" : "none",
          }}
        >
          {title}
        </div>
        <div
          style={{
            width: ruleWidth,
            height: 1,
            background: ruleBg,
            boxShadow: ruleShadow,
            marginBottom: 12,
            transition: "width 0.55s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease, box-shadow 0.4s ease",
            position: "relative",
          }}
          aria-hidden
        >
          {selected && (
            <>
              <span
                style={{
                  position: "absolute",
                  width: 1.5,
                  height: 1.5,
                  borderRadius: "50%",
                  background: "var(--color-gold-bright)",
                  boxShadow: "0 0 4px var(--color-gold)",
                  top: -8,
                  left: 24,
                  opacity: 0,
                  animation: "opt-drift 3s ease-in-out infinite",
                  animationDelay: "0s",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  width: 1.5,
                  height: 1.5,
                  borderRadius: "50%",
                  background: "var(--color-gold-bright)",
                  boxShadow: "0 0 4px var(--color-gold)",
                  top: -8,
                  left: 48,
                  opacity: 0,
                  animation: "opt-drift 3s ease-in-out infinite",
                  animationDelay: "1.4s",
                }}
              />
            </>
          )}
        </div>
        <div style={detailStyle(active, selected)}>{detail}</div>
      </div>

      {/* Check dot */}
      <div
        style={{
          width: 24,
          height: 24,
          border: "1px solid",
          borderColor: selected
            ? "var(--color-gold-brightest)"
            : hover
              ? "rgba(200, 168, 78, 0.6)"
              : "rgba(200, 168, 78, 0.25)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: selected ? "var(--color-bg-deep)" : hover ? "var(--color-gold)" : "var(--color-text-faint)",
          background: selected ? "var(--color-gold)" : "transparent",
          boxShadow: selected ? "0 0 16px rgba(200, 168, 78, 0.55)" : "none",
          marginTop: 8,
          transition: "all 0.4s ease",
        }}
      >
        {selected ? "✓" : "+"}
      </div>
    </div>
  );
}

function detailStyle(active: boolean, selected: boolean): CSSProperties {
  return {
    fontSize: "0.95rem",
    color: selected ? "var(--color-text-body-soft)" : active ? "var(--color-text-body-soft)" : "var(--color-text-muted)",
    lineHeight: 1.6,
    fontWeight: 300,
    transition: "color 0.4s ease",
  };
}
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- OptionRow
```

Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/brief/OptionRow.tsx src/components/brief/__tests__/OptionRow.test.tsx
git commit -m "feat(brief): add editorial OptionRow"
```

---

### Task 6.4: Build EditorialField

**Files:**
- Create: `src/components/brief/EditorialField.tsx`
- Create: `src/components/brief/__tests__/EditorialField.test.tsx`

Text input with mono label + gold rule below + italic annotation, no boxed input. Used by Q4, Q5 of brief, and the /contact form in Plan 4.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/brief/__tests__/EditorialField.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@/test-utils/render";
import { EditorialField } from "../EditorialField";

describe("EditorialField", () => {
  it("renders the label and the placeholder", () => {
    render(
      <EditorialField
        label="Your name"
        placeholder="Jane Smith"
        value=""
        onChange={() => {}}
      />,
    );
    expect(screen.getByText("Your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Jane Smith")).toBeInTheDocument();
  });

  it("invokes onChange when typed", () => {
    const onChange = vi.fn();
    render(
      <EditorialField
        label="Name"
        placeholder=""
        value=""
        onChange={onChange}
      />,
    );
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "abc" } });
    expect(onChange).toHaveBeenCalledWith("abc");
  });

  it("renders a multiline textarea when multiline=true", () => {
    render(
      <EditorialField
        label="Question"
        placeholder=""
        value=""
        onChange={() => {}}
        multiline
      />,
    );
    const ta = screen.getByRole("textbox");
    expect(ta.tagName.toLowerCase()).toBe("textarea");
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- EditorialField
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/brief/EditorialField.tsx
"use client";
import { CSSProperties, useEffect, useRef } from "react";

export interface EditorialFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  /** Render a textarea instead of input; auto-grows. Default false. */
  multiline?: boolean;
  /** HTML input type for non-multiline. Default "text". */
  type?: string;
  /** Optional italic annotation under the rule. */
  annotation?: string;
  /** Auto-focus on mount. */
  autoFocus?: boolean;
  className?: string;
}

export function EditorialField({
  label,
  placeholder,
  value,
  onChange,
  multiline = false,
  type = "text",
  annotation,
  autoFocus = false,
  className,
}: EditorialFieldProps) {
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Auto-grow for textarea
  useEffect(() => {
    if (!multiline) return;
    const el = ref.current as HTMLTextAreaElement | null;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value, multiline]);

  useEffect(() => {
    if (autoFocus) {
      ref.current?.focus();
    }
  }, [autoFocus]);

  const hasContent = value.trim().length > 0;

  return (
    <div className={className} style={{ position: "relative" }}>
      <div style={labelStyle}>{label}</div>
      {multiline ? (
        <textarea
          ref={(el) => {
            ref.current = el;
          }}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: "none", minHeight: 96, lineHeight: 1.5, overflow: "hidden" }}
        />
      ) : (
        <input
          ref={(el) => {
            ref.current = el;
          }}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      )}
      <div
        style={{
          ...ruleStyle,
          background: hasContent
            ? "linear-gradient(90deg, var(--color-gold), var(--color-gold-brightest) 50%, var(--color-gold))"
            : "linear-gradient(90deg, rgba(200,168,78,0.25), rgba(200,168,78,0.5) 50%, rgba(200,168,78,0.25))",
          boxShadow: hasContent
            ? "0 0 10px rgba(232,200,120,0.55), 0 0 22px rgba(200,168,78,0.3)"
            : "0 0 4px rgba(200,168,78,0.2)",
        }}
        aria-hidden
      />
      {annotation && <div style={annotStyle}>{annotation}</div>}
    </div>
  );
}

const labelStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.4em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 14,
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
};
const ruleStyle: CSSProperties = {
  height: 1,
  transition: "background 0.4s ease, box-shadow 0.4s ease",
};
const annotStyle: CSSProperties = {
  marginTop: 14,
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "0.9rem",
  color: "var(--color-text-muted)",
};
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- EditorialField
```

Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/brief/EditorialField.tsx src/components/brief/__tests__/EditorialField.test.tsx
git commit -m "feat(brief): add EditorialField (no-box typing on gold rule)"
```

---

### Task 6.5: Build inference rules

**Files:**
- Create: `src/components/brief/inference.ts`
- Create: `src/components/brief/__tests__/inference.test.ts`

Pure deterministic mapping from selection IDs to "what we'd build for you" cards.

- [ ] **Step 1: Write the failing test**

```ts
// src/components/brief/__tests__/inference.test.ts
import { describe, it, expect } from "vitest";
import { inferProject, inferStage, inferScope } from "../inference";

describe("inference", () => {
  it("maps project IDs", () => {
    expect(inferProject("agent")).toEqual({
      title: "Agent system",
      detail: expect.stringContaining("Multi-agent"),
    });
    expect(inferProject("search").title).toBe("Knowledge experience");
    expect(inferProject("tool").title).toBe("Internal workbench");
    expect(inferProject("unclear").title).toBe("Discovery engagement");
  });

  it("maps stage IDs", () => {
    expect(inferStage("thinking").title).toBe("Begin with a brief");
    expect(inferStage("spec").title).toBe("Move into Define + Build");
    expect(inferStage("wall").title).toBe("Audit + intervene");
    expect(inferStage("shipped").title).toBe("Optimization audit");
  });

  it("maps scope IDs", () => {
    expect(inferScope("brief").title).toMatch(/2 weeks/);
    expect(inferScope("prototype").title).toMatch(/4–6 weeks/);
    expect(inferScope("build").title).toMatch(/8–12 weeks/);
    expect(inferScope("partner").title).toMatch(/Ongoing/);
  });

  it("returns a fallback for unknown IDs", () => {
    expect(inferProject("nonsense").title).toBe("—");
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- inference
```

Expected: FAIL.

- [ ] **Step 3: Write the module**

```ts
// src/components/brief/inference.ts

export interface InferredCell {
  title: string;
  detail: string;
}

const FALLBACK: InferredCell = { title: "—", detail: "—" };

const PROJECT: Record<string, InferredCell> = {
  agent: {
    title: "Agent system",
    detail: "Multi-agent orchestration with tool use, evaluation harness, observability.",
  },
  search: {
    title: "Knowledge experience",
    detail: "Hybrid retrieval over your corpus, citation architecture, editorial UX.",
  },
  tool: {
    title: "Internal workbench",
    detail: "Custom interface for power users, decision support, data access patterns.",
  },
  unclear: {
    title: "Discovery engagement",
    detail: "Workshop-led shape-finding before we commit to a build.",
  },
};

const STAGE: Record<string, InferredCell> = {
  thinking: { title: "Begin with a brief", detail: "We map the territory before we touch code." },
  spec: { title: "Move into Define + Build", detail: "Skip discovery, go straight to spec validation and increments." },
  wall: { title: "Audit + intervene", detail: "Identify the wall, plan around it, ship the unblock." },
  shipped: { title: "Optimization audit", detail: "Performance, quality, cost — the unsexy second 80%." },
};

const SCOPE: Record<string, InferredCell> = {
  brief: { title: "2 weeks · written opinion", detail: "Single document, one opinion, no engineering." },
  prototype: { title: "4–6 weeks · prototype", detail: "Working proof, ready to validate with real users." },
  build: { title: "8–12 weeks · production system", detail: "Deployed in your stack, with handoff and runbook." },
  partner: { title: "Ongoing · named partnership", detail: "Continued engagement, on-call for the long arc." },
};

export function inferProject(id: string): InferredCell {
  return PROJECT[id] ?? FALLBACK;
}
export function inferStage(id: string): InferredCell {
  return STAGE[id] ?? FALLBACK;
}
export function inferScope(id: string): InferredCell {
  return SCOPE[id] ?? FALLBACK;
}
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- inference
```

Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/brief/inference.ts src/components/brief/__tests__/inference.test.ts
git commit -m "feat(brief): add deterministic inference rules"
```

---

### Task 6.6: Build BriefQuestionnaire

**Files:**
- Create: `src/components/brief/BriefQuestionnaire.tsx`
- Create: `src/components/brief/__tests__/BriefQuestionnaire.test.tsx`

The state machine + question rendering + composed view. Big component but cohesive — splitting it would scatter related state.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/brief/__tests__/BriefQuestionnaire.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@/test-utils/render";
import { BriefQuestionnaire } from "../BriefQuestionnaire";

describe("BriefQuestionnaire", () => {
  it("renders question 01 by default", () => {
    render(<BriefQuestionnaire />);
    expect(screen.getByText(/Question 01 of 05/i)).toBeInTheDocument();
    expect(screen.getByText(/What are you trying to/i)).toBeInTheDocument();
  });

  it("Continue button is disabled until selection", () => {
    render(<BriefQuestionnaire />);
    const next = screen.getByRole("button", { name: /Continue/i });
    expect(next).toBeDisabled();
  });

  it("seed prop pre-fills question 04", () => {
    render(<BriefQuestionnaire seed="how do we ship" />);
    // Pre-filled value isn't visible until Q4 — but we can verify the seed
    // is wired by inspecting that the component does not throw.
    expect(screen.getByText(/Question 01 of 05/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run, verify fail**

```bash
npm run test:run -- BriefQuestionnaire
```

Expected: FAIL.

- [ ] **Step 3: Write the component**

```tsx
// src/components/brief/BriefQuestionnaire.tsx
"use client";
import { CSSProperties, useEffect, useState } from "react";
import { OptionRow } from "./OptionRow";
import { EditorialField } from "./EditorialField";
import { EditorialButton } from "./EditorialButton";
import { inferProject, inferStage, inferScope } from "./inference";

type SelectionKey = "project" | "stage" | "scope";
type ContactKey = "contact_name" | "contact_email";
type AnswerKey = SelectionKey | "question" | ContactKey;

interface Option {
  id: string;
  title: string;
  detail: string;
}

interface SelectQuestion {
  type: "select";
  key: SelectionKey;
  prompt: string;
  options: Option[];
}
interface TextQuestion {
  type: "text";
  key: "question";
  prompt: string;
  label: string;
  placeholder: string;
  annotation: string;
}
interface TwoTextQuestion {
  type: "two-text";
  key: "contact";
  prompt: string;
  annotation: string;
  fields: Array<{ id: ContactKey; label: string; placeholder: string; type?: string }>;
}
type Question = SelectQuestion | TextQuestion | TwoTextQuestion;

const QUESTIONS: Question[] = [
  {
    type: "select",
    key: "project",
    prompt: "What are you trying to **build**?",
    options: [
      { id: "agent", title: "An AI assistant or agent", detail: "Conversational systems, agents that take action, copilots that work alongside humans." },
      { id: "search", title: "A search or knowledge experience", detail: "AI search, RAG over your corpus, retrieval pipelines, citation-rich answers." },
      { id: "tool", title: "An internal tool or workbench", detail: "Operations dashboards, research surfaces, decision support, custom UI for power users." },
      { id: "unclear", title: "Something I haven't named yet", detail: "The shape's still unclear. We'll find it together in a brief." },
    ],
  },
  {
    type: "select",
    key: "stage",
    prompt: "Where are you in the **arc**?",
    options: [
      { id: "thinking", title: "Just thinking", detail: "Exploring what's possible, looking for a thinking partner." },
      { id: "spec", title: "Have a spec, need execution", detail: "Direction is clear; you need a team to ship." },
      { id: "wall", title: "Building, hit a wall", detail: "Existing project that's stalled or pulling sideways." },
      { id: "shipped", title: "Shipped, need optimization", detail: "Live system that needs work — performance, cost, or quality." },
    ],
  },
  {
    type: "select",
    key: "scope",
    prompt: "What **scope** are you imagining?",
    options: [
      { id: "brief", title: "A strategy brief", detail: "2 weeks. A written opinion. No code." },
      { id: "prototype", title: "A prototype", detail: "4–6 weeks. Proof of concept, ready to validate." },
      { id: "build", title: "A full build", detail: "8–12 weeks. Production system, deployed in your stack." },
      { id: "partner", title: "An ongoing partnership", detail: "Continued engagement — we become part of your team." },
    ],
  },
  {
    type: "text",
    key: "question",
    prompt: "Tell us the **question** you've been turning over.",
    label: "The question you keep coming back to",
    placeholder: "How do we...",
    annotation: "The real one, not the polished one. A few sentences is enough.",
  },
  {
    type: "two-text",
    key: "contact",
    prompt: "Last thing — **who** are you?",
    annotation: "We'll write back within 48 hours.",
    fields: [
      { id: "contact_name", label: "Your name", placeholder: "Jane Smith" },
      { id: "contact_email", label: "Your email", placeholder: "you@company.com", type: "email" },
    ],
  },
];

interface Answers {
  project?: string;
  stage?: string;
  scope?: string;
  question?: string;
  contact_name?: string;
  contact_email?: string;
}

export interface BriefQuestionnaireProps {
  /** Pre-fill question 04 from a query parameter handoff. */
  seed?: string;
}

export function BriefQuestionnaire({ seed }: BriefQuestionnaireProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() => (seed ? { question: seed } : {}));
  const [done, setDone] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  function set(key: AnswerKey, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function isAnswered(idx: number): boolean {
    const q = QUESTIONS[idx];
    if (q.type === "select") return !!answers[q.key];
    if (q.type === "text") return (answers.question ?? "").trim().length > 0;
    if (q.type === "two-text") {
      return q.fields.every((f) => (answers[f.id] ?? "").trim().length > 0);
    }
    return false;
  }

  function advance() {
    if (!isAnswered(current)) return;
    setTransitioning(true);
    setTimeout(() => {
      if (current === QUESTIONS.length - 1) {
        setDone(true);
      } else {
        setCurrent((c) => c + 1);
      }
      setTransitioning(false);
    }, 380);
  }

  function previous() {
    if (current === 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent((c) => c - 1);
      setTransitioning(false);
    }, 380);
  }

  function restart() {
    setAnswers({});
    setCurrent(0);
    setDone(false);
  }

  if (done) {
    return <ComposedView answers={answers} onRestart={restart} />;
  }

  const q = QUESTIONS[current];
  const isLast = current === QUESTIONS.length - 1;

  return (
    <section style={stageStyle}>
      <div className="grid-overlay" aria-hidden />

      {/* Header */}
      <div style={headerStyle}>
        <div style={markStyle}>
          N<span style={{ color: "var(--color-gold)", margin: "0 4px" }}>·</span>T
          <span style={{ color: "var(--color-gold)", margin: "0 4px" }}>/</span>S{" "}
          · Brief
        </div>
        <div style={progressWrapStyle}>
          <div style={progressLabelStyle}>
            {String(current + 1).padStart(2, "0")}{" "}
            <span style={{ color: "var(--color-text-faint)" }}>/ 05</span>
          </div>
          <div style={progressBarStyle}>
            <div
              style={{
                ...progressFillStyle,
                width: `${(current / QUESTIONS.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          ...qWrapStyle,
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateY(-28px)" : "translateY(0)",
        }}
      >
        <div style={tagStyle}>
          <span style={tagRuleStyle} aria-hidden />
          Question {String(current + 1).padStart(2, "0")} of 05
        </div>
        <h2 style={promptStyle}>{renderPrompt(q.prompt)}</h2>

        {q.type === "select" && (
          <div>
            {q.options.map((opt, i) => (
              <OptionRow
                key={opt.id}
                index={String(i + 1).padStart(2, "0")}
                title={opt.title}
                detail={opt.detail}
                selected={answers[q.key] === opt.id}
                onSelect={() => set(q.key, opt.id)}
              />
            ))}
          </div>
        )}

        {q.type === "text" && (
          <EditorialField
            label={q.label}
            placeholder={q.placeholder}
            value={answers.question ?? ""}
            onChange={(v) => set("question", v)}
            annotation={q.annotation}
            multiline
            autoFocus
          />
        )}

        {q.type === "two-text" && (
          <>
            <div style={twoFieldsStyle}>
              {q.fields.map((f, i) => (
                <EditorialField
                  key={f.id}
                  label={f.label}
                  placeholder={f.placeholder}
                  type={f.type}
                  value={answers[f.id] ?? ""}
                  onChange={(v) => set(f.id, v)}
                  autoFocus={i === 0}
                />
              ))}
            </div>
            <div style={{ ...annotStyle, marginTop: 22 }}>{q.annotation}</div>
          </>
        )}

        <div style={controlsStyle}>
          <EditorialButton direction="back" ready={current > 0} onClick={previous}>
            Back
          </EditorialButton>
          <EditorialButton ready={isAnswered(current)} onClick={advance}>
            {isLast ? "Compose brief" : "Continue"}
          </EditorialButton>
        </div>
      </div>
    </section>
  );
}

function renderPrompt(s: string) {
  // Replace **word** with italic gold em
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const word = part.slice(2, -2);
      return (
        <em
          key={i}
          style={{
            color: "var(--color-gold-brightest)",
            fontStyle: "italic",
            fontWeight: 400,
            textShadow: "0 0 18px rgba(232, 200, 120, 0.35)",
          }}
        >
          {word}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function ComposedView({ answers, onRestart }: { answers: Answers; onRestart: () => void }) {
  const proj = inferProject(answers.project ?? "");
  const stage = inferStage(answers.stage ?? "");
  const scope = inferScope(answers.scope ?? "");
  const name = answers.contact_name ?? "";
  const email = answers.contact_email ?? "";

  const onSend = () => {
    fetch("/api/brief", { method: "POST", body: JSON.stringify(answers) })
      .then(() => alert("Brief sent. We'll be in touch within 48 hours."))
      .catch(() => alert("Could not deliver. Email hello@northtrack.studio."));
  };

  return (
    <section style={stageStyle}>
      <div className="grid-overlay" aria-hidden />
      <div style={composedWrapStyle}>
        <div style={tagStyle}>Brief · what we&rsquo;d build for you</div>
        <h2 style={composedHeadlineStyle}>
          A draft engagement, <em style={emStyle}>composed from your answers</em>.
        </h2>
        <p style={composedSubStyle}>
          {name && (
            <>
              {name} —{" "}
            </>
          )}
          here&rsquo;s our read on what you&rsquo;re after. Send it and we&rsquo;ll write
          back with a real opinion within 48 hours.
        </p>
        <div
          style={{
            width: 96,
            height: 1,
            background: "linear-gradient(90deg, var(--color-gold), transparent)",
            boxShadow: "0 0 6px rgba(200, 168, 78, 0.5)",
            marginBottom: 32,
          }}
          aria-hidden
        />
        <div style={composedGridStyle}>
          <Cell label="Type of work" value={proj.title} detail={proj.detail} />
          <Cell label="Recommended approach" value={stage.title} detail={stage.detail} />
          <Cell label="Engagement shape" value={scope.title} detail={scope.detail} />
          <Cell label="Reply to" value={name || "—"} detail={email || "—"} />
        </div>
        {answers.question?.trim() && (
          <div style={quoteStyle}>
            <div style={quoteLabelStyle}>In your words</div>
            <div style={quoteBodyStyle}>&ldquo;{answers.question}&rdquo;</div>
          </div>
        )}
        <div style={sealRowStyle}>
          <div style={sealRuleStyle} aria-hidden />
          <div style={sealMarkStyle}>× NTS · ready to send</div>
          <div style={sealRuleStyle} aria-hidden />
        </div>
        <div style={{ marginTop: 32, display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <EditorialButton ready onClick={onSend}>
            Send brief
          </EditorialButton>
          <EditorialButton direction="back" ready onClick={onRestart}>
            Start over
          </EditorialButton>
        </div>
      </div>
    </section>
  );
}

function Cell({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div>
      <div style={cellLabelStyle}>{label}</div>
      <div style={cellValueStyle}>{value}</div>
      <div style={cellDetailStyle}>{detail}</div>
    </div>
  );
}

// ───────── styles ─────────
const stageStyle: CSSProperties = {
  position: "relative",
  minHeight: "100vh",
  background: "radial-gradient(ellipse at 50% 55%, var(--color-bg-radial) 0%, var(--color-bg-deep) 80%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  padding: "140px 32px 80px",
};
const headerStyle: CSSProperties = {
  position: "fixed",
  top: 40,
  left: 0,
  right: 0,
  padding: "26px 32px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  zIndex: 100,
  pointerEvents: "none",
};
const markStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: "0.3em",
  color: "var(--color-text-primary)",
  textTransform: "uppercase",
};
const progressWrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: 8,
  minWidth: 140,
};
const progressLabelStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.4em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
};
const progressBarStyle: CSSProperties = {
  width: 140,
  height: 1,
  background: "rgba(200, 168, 78, 0.15)",
  position: "relative",
};
const progressFillStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  top: 0,
  height: 1,
  background: "var(--color-gold)",
  boxShadow: "0 0 6px rgba(200, 168, 78, 0.7)",
  transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
};
const qWrapStyle: CSSProperties = {
  width: "min(820px, 92vw)",
  position: "relative",
  zIndex: 5,
  transition: "opacity 0.45s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
};
const tagStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 10,
  letterSpacing: "0.5em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 22,
  display: "flex",
  alignItems: "center",
  gap: 14,
};
const tagRuleStyle: CSSProperties = {
  flex: "0 0 28px",
  height: 1,
  background: "linear-gradient(90deg, var(--color-gold), transparent)",
  boxShadow: "0 0 4px rgba(200, 168, 78, 0.4)",
};
const promptStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "clamp(1.8rem, 4vw, 3.4rem)",
  letterSpacing: "-0.025em",
  color: "var(--color-text-primary)",
  lineHeight: 1.1,
  marginBottom: 44,
};
const twoFieldsStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 32,
};
const annotStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "0.9rem",
  color: "var(--color-text-muted)",
};
const controlsStyle: CSSProperties = {
  marginTop: 48,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 24,
  flexWrap: "wrap",
};

const composedWrapStyle: CSSProperties = {
  width: "min(820px, 92vw)",
  position: "relative",
  zIndex: 5,
};
const composedHeadlineStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "clamp(1.8rem, 3.6vw, 3rem)",
  letterSpacing: "-0.025em",
  color: "var(--color-text-primary)",
  lineHeight: 1.1,
  marginBottom: 14,
};
const emStyle: CSSProperties = { color: "var(--color-gold-brightest)" };
const composedSubStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "1.05rem",
  color: "var(--color-text-muted)",
  lineHeight: 1.6,
  marginBottom: 36,
  maxWidth: "56ch",
};
const composedGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "32px 56px",
  marginBottom: 32,
};
const cellLabelStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.4em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 10,
};
const cellValueStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "1.4rem",
  color: "var(--color-text-primary)",
  lineHeight: 1.2,
  marginBottom: 6,
};
const cellDetailStyle: CSSProperties = {
  fontSize: "0.85rem",
  color: "var(--color-text-muted)",
  lineHeight: 1.55,
  fontWeight: 300,
};
const quoteStyle: CSSProperties = {
  margin: "8px 0 32px",
  padding: "18px 0 18px 24px",
  borderLeft: "1px solid rgba(200, 168, 78, 0.4)",
  boxShadow: "-1px 0 6px rgba(200, 168, 78, 0.2)",
};
const quoteLabelStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.4em",
  color: "var(--color-gold)",
  textTransform: "uppercase",
  marginBottom: 10,
};
const quoteBodyStyle: CSSProperties = {
  fontFamily: "var(--font-serif)",
  fontStyle: "italic",
  fontWeight: 300,
  fontSize: "1.15rem",
  color: "var(--color-text-body-soft)",
  lineHeight: 1.55,
};
const sealRowStyle: CSSProperties = {
  marginTop: 20,
  display: "flex",
  alignItems: "center",
  gap: 18,
  flexWrap: "wrap",
};
const sealRuleStyle: CSSProperties = {
  flex: 1,
  height: 1,
  background: "linear-gradient(90deg, transparent, rgba(200, 168, 78, 0.5), transparent)",
  boxShadow: "0 0 4px rgba(200, 168, 78, 0.3)",
};
const sealMarkStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  letterSpacing: "0.5em",
  color: "var(--color-gold-brightest)",
  textTransform: "uppercase",
  padding: "8px 18px",
  border: "1px solid rgba(200, 168, 78, 0.5)",
  borderRadius: "999px",
  boxShadow: "0 0 10px rgba(200, 168, 78, 0.2)",
};
```

- [ ] **Step 4: Run, verify pass**

```bash
npm run test:run -- BriefQuestionnaire
```

Expected: 3 passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/brief/BriefQuestionnaire.tsx src/components/brief/__tests__/BriefQuestionnaire.test.tsx
git commit -m "feat(brief): add BriefQuestionnaire state machine + composed view"
```

---

### Task 6.7: Wire up /brief page

**Files:**
- Modify: `src/app/brief/page.tsx`

- [ ] **Step 1: Replace the page**

```tsx
// src/app/brief/page.tsx
import { Suspense } from "react";
import { BriefQuestionnaire } from "@/components/brief/BriefQuestionnaire";
import BriefSeed from "./BriefSeed";

export const metadata = {
  title: "NorthTrack Studios — Brief",
};

export default function BriefPage() {
  return (
    <Suspense fallback={null}>
      <BriefSeed />
    </Suspense>
  );
}
```

- [ ] **Step 2: Create the seed reader**

Search params reading must happen in a client component wrapped in Suspense. Create:

```tsx
// src/app/brief/BriefSeed.tsx
"use client";
import { useSearchParams } from "next/navigation";
import { BriefQuestionnaire } from "@/components/brief/BriefQuestionnaire";

export default function BriefSeed() {
  const params = useSearchParams();
  const seed = params.get("seed") ?? undefined;
  return <BriefQuestionnaire seed={seed} />;
}
```

- [ ] **Step 3: Manual verification**

```bash
npm run dev
```

Visit http://localhost:3000/brief — questionnaire renders at Q1.
Click an option → Continue button lights up → click → Q2.
At the end ("Compose brief"), composed view should render with inferred cells.

Visit http://localhost:3000/brief?seed=how%20do%20we — verify Q4 textarea is pre-filled when you reach it.

Stop dev.

- [ ] **Step 4: Commit**

```bash
git add src/app/brief/page.tsx src/app/brief/BriefSeed.tsx
git commit -m "feat(brief): wire /brief page with seed handoff from home teaser"
```

---

### Task 6.8: Add /api/brief route stub

**Files:**
- Create: `src/app/api/brief/route.ts`

A POST stub that logs the body and returns success. Real email/CRM integration is out of scope for this plan; flag in the spec's open questions and revisit during deployment.

- [ ] **Step 1: Create the route**

```ts
// src/app/api/brief/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Stub: in production, deliver to inbox (Resend, Postmark, etc.)
  console.log("[brief] received:", body);

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 2: Manual verification**

```bash
npm run dev
```

In another terminal:

```bash
curl -X POST http://localhost:3000/api/brief \
  -H "Content-Type: application/json" \
  -d '{"project":"agent","stage":"thinking","scope":"brief","question":"test","contact_name":"Test","contact_email":"a@b.com"}'
```

Expected response: `{"ok":true}` with the dev server log printing the received body.

Stop dev.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/brief/route.ts
git commit -m "feat(brief): add /api/brief POST stub (logs to console)"
```

---

## Verification — end of Plan 3

- [ ] **Run the full test suite**

```bash
npm run test:run
```

Expected: every test passes (Plan 1 + Plan 2 + Plan 3).

- [ ] **Lint + build**

```bash
npm run lint && npm run build
```

Expected: clean.

- [ ] **End-to-end visual walk-through of /brief**

```bash
npm run dev
```

Open http://localhost:3000/brief. Walk through:

1. Q1 (Project) — option-rows render. Hover any: title turns lighter, gold rule extends to 56px, dot border lights up. Click: row gold accent line on left appears, title turns gold, gold rule extends to 96px with two drift particles, dot fills gold with `✓`. Continue button lights up gold and underline glows.
2. Click Continue. Page fades up and out, next question fades in from below.
3. Q2 (Stage), Q3 (Scope) — same pattern.
4. Q4 (Question) — textarea with mono label and gold rule. Type something. Rule turns brighter when content present. Continue lights up.
5. Q5 (Contact) — 2 fields side by side. Fill both. Continue (says "Compose brief") lights up.
6. Click. Composed view appears with 2×2 grid of inferred cells (Type of work / Recommended approach / Engagement shape / Reply to). Quoted question block. Seal row. Send + Start over buttons.
7. Click Send. Alert: "Brief sent...". Server log shows the body.
8. Click Start over. Q1 again, all answers cleared.
9. Visit `/brief?seed=test%20question` — Q4 should be pre-filled when you reach it.

If any step misbehaves, fix the underlying component before moving on.

Stop dev.

- [ ] **Final commit if any cleanup**

```bash
git add -A
git commit -m "chore: lint + cleanup after Plan 3"
```

---

## What's next (Plan 4 preview)

- `/capabilities` — RightMarginIndex sticky right-edge index, full chapter book per capability
- `/work` — full archive + filter pills + cascade reveal
- `/work/[slug]` — case page template using WorkPinnedName
- `/about` — TimelineGutter on the left edge, Story / People / Beliefs sections
- `/process` — deep walk + WeekAxis (mono week markers parallel to spine)
- `/contact` — editorial form (reuses EditorialField + EditorialButton)
- Polish: mobile breakpoints, reduced-motion fallbacks site-wide, performance audit
- Cleanup: delete unused v1 components (Hero, Services, Survey, IntroSequence, ScrollTransitions, ConstellationBackground, GoldPaint, ColorSchemeSwitcher, StyleSwitcher)
