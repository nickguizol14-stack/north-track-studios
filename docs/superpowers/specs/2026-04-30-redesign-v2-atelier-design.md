# NorthTrack Studios — v2 Redesign Design Spec

**Direction:** A · "Atelier"
**Date:** 2026-04-30
**Status:** Approved through brainstorm rounds 1–5; ready for implementation planning
**Brainstorm artifacts:** `.superpowers/brainstorm/26309-1777603666/content/`

---

## 1. Intent

A second pass at NorthTrack Studios' visual layer. The v1 site has working bones — components, pages, content tone — and a signature gold-particle motion DNA that's worth preserving. v2 keeps the underlying functionality and structure and reimagines the look, feel, and motion from the ground up.

**What persists from v1:**
- The wordmark "NorthTrack Studios" (one word + word) as the only fixed brand artifact
- The gold-particle DNA — both the ambient particles and the gold-underline-with-particles signature, elevated and refined
- Rejection of card-grid layouts as the default — sections must feel deliberately composed
- Content tone (precise, technical, restrained, premium)

**What is replaced:**
- The intro animation (paint-in headers → quiet mono-wipe + amplified second beat)
- The compass-as-central-motif emphasis (preserved as a small mark, no longer dominant)
- The card-grid Services layout (replaced with editorial capability rows)
- The plate/frame project layouts (replaced with pure type-driven editorial Work)
- The Survey component (replaced with the Brief questionnaire)

**Aesthetic compass — "Atelier":**
A modernist workshop journal. Black canvas, gold accents, deep blue ambient lighting where the page wants relief. Numbered chapters, mono journal-edge labels, italic Fraunces serif for display moments. Scroll moves are signature gestures unique to each section, not one repeated reveal. Type is treated as a visual element, not just a label.

**References that anchor the direction:**
- 375.studio — smoothness of motion ("never announces itself")
- akfaholding — originality of motion (each section gets its own signature gesture)
- fromanother.love — calibrated rebellion (format-broken without chaos)

---

## 2. Direction summary

Atelier is a long-form editorial site that reads like a quarterly review. It is dark-base with restrained gold and a single accent color (deep blue) used only for ambient lighting in one chapter. Every chapter has its own structural spine and signature gesture. Motion is smooth (Lenis), scroll-driven (GSAP), and where physics-feel matters (the Process spine), spring-driven via vanilla JS lerp.

The site is a **full rebrand**, not a reskin. Every page gets new layout, new typography, new motion. Content can be rewritten freely; only the wordmark is sacred.

---

## 3. Visual tokens

### 3.1 Color

| Token | Value | Use |
|---|---|---|
| `--bg-deep` | `#050507` | Page base |
| `--bg-elevated` | `#0a0912` | Cards, elevated surfaces |
| `--bg-radial-near` | `#0c0a14` | Inner stop of stage radial gradients |
| `--text-primary` | `#f0e9d8` | Headlines |
| `--text-body` | `#b8b8b8` | Body text |
| `--text-body-soft` | `#c0c0c0` | Lead paragraphs |
| `--text-muted` | `#888` | Secondary body, mono labels |
| `--text-faint` | `#555` | Tertiary, placeholder, inactive states |
| `--text-subtle` | `#6a6a6a` | Footer, very subtle |
| `--gold` | `#c8a84e` | Primary brand color, rules, accents |
| `--gold-bright` | `#e8c878` | Highlight on gold elements |
| `--gold-brightest` | `#f4d68a` | Particles, glow cores, italic emphasis |
| `--gold-deep` | `#7c6a3d` | Shadow stop in gradients |
| `--gold-warm` | `#a99258` | Subtle muted gold for eyebrow text |
| `--blue-aura` | `rgba(40, 70, 145, 0.36)` | Right-side aura (only in Capabilities chapter) |
| `--blue-aura-mid` | `rgba(24, 44, 100, 0.20)` | Mid stop |
| `--blue-aura-far` | `rgba(14, 26, 64, 0.07)` | Far stop |
| `--grid-line` | `rgba(200, 168, 78, 0.04)` | Default grid overlay |
| `--grid-line-strong` | `rgba(200, 168, 78, 0.085)` | Grid overlay in blue-aura zones |
| `--rule-glow` | `rgba(200, 168, 78, 0.5)` | Box-shadow on gold rules |

### 3.2 Typography

**Font stack:**
- Body / sans: **Inter** (weights 200, 300, 400, 500). Used for body copy, generic UI text. Replaces Geist Sans.
- Display / serif: **Fraunces** (italic 300, 400; roman 300, 400, 500). The Atelier voice. Used for chapter headlines, page wordmarks, italic emphasis, the brief composed view. **Always italic for display moments**; italic emphasis on key words within roman text.
- Mono: **JetBrains Mono** (weights 300, 400, 500). Mono labels, indices ("01 / Practice"), kit lines, journal-edge corners, nav, button labels. Replaces Geist Mono.

**Type scale (display, mobile-first clamp):**
- `--type-wordmark`: `clamp(20px, 2.8vw, 32px)` — intro stage, mono caps, 0.42em tracking
- `--type-display-xl`: `clamp(4rem, 9vw, 8rem)` — pinned giant project name (italic)
- `--type-display-l`: `clamp(2.4rem, 5vw, 4.4rem)` — chapter headlines (italic emphasis)
- `--type-display-m`: `clamp(2rem, 4vw, 3.4rem)` — page wordmarks, capability titles
- `--type-display-s`: `clamp(1.4rem, 2.4vw, 2rem)` — option titles in brief
- `--type-body-lead`: `1.05rem` — chapter lead paragraphs
- `--type-body`: `0.95rem` — body
- `--type-body-s`: `0.85rem` — secondary body
- `--type-mono-label`: `10px` letter-spacing `0.5em` — chapter numbers, indices
- `--type-mono-caps`: `9px` letter-spacing `0.32–0.4em` — corner glyphs, kit lines, nav

**Letter spacing:**
- Display italic Fraunces: `-0.025em` (tight)
- Mono labels: `0.32–0.5em` (wide caps)
- Mono wordmark in intro: `0.42em` (signature)

### 3.3 Motion

**Libraries to add:**
- `lenis` — smooth scroll (Lenis takes over native scroll for buttery feel; required for the whole motion language to read correctly)
- `gsap` + `ScrollTrigger` — scroll-tied choreography (intro→home handoff, capability morphing, work pinned scroll, etc.)

**Vanilla JS for spring physics** — the Process spine uses requestAnimationFrame with lerp + velocity + damping (no library dependency). Pattern:
```
target = computed scroll position
force = (target - displayed) * STIFFNESS
velocity = velocity * DAMPING + force
displayed += velocity
```
Locked values: `STIFFNESS = 0.16`, `DAMPING = 0.76`.

**Easing tokens:**
- `--ease-emerge`: `cubic-bezier(0.16, 1, 0.3, 1)` — entrances, content reveals
- `--ease-handoff`: `cubic-bezier(0.65, 0, 0.35, 1)` — large state transitions (intro→home wordmark migration)
- `--ease-rule`: `cubic-bezier(0.4, 0, 0.2, 1)` — gold rule grow
- `--ease-linear-loop`: `linear` — only for repeating ambient loops

**Reveal patterns:**
- **Word stagger** (chapter prompts, capability titles): each word translates from `translateY(8px)` opacity 0 → translateY(0) opacity 1, 50ms apart, 500ms transition
- **Clip-path wipe** (intro wordmark): `inset(0 100% 0 0)` → `inset(0 0 0 0)`, ease-in-out
- **Rule grow**: width 0 → target, with ease-rule, paired with shadow grow

**Loop timing standard:**
- Ambient stage loops: **7s cycle** (intro animation, breathing-light loops)
- Drift particle loops: **3–4s cycle**, staggered delays
- Spring physics: continuous via rAF

### 3.4 Particles

Three particle systems — all share the same color (`#f4d68a` core, `#c8a84e` glow):

**Drift particles** (ambient, used on chapter dividers and gold rules):
- 2px gold dots with 4px box-shadow glow
- Rise upward over 3–4s, fade in/out
- Spawn from a small horizontal range above a gold rule
- Used on: intro stage burst, chapter dividers, capability rules, work stack dividers, brief option-row selected state

**Burst particles** (one-shot, used on intro arrival and brief advance):
- ~14 particles, predefined `--x` offsets, randomized `--xd` for slight horizontal drift mid-rise
- Animate over 1.4s: rise from rule position, scale 0.6 → 1.4 → 1 → 0.4, opacity 0 → 1 → 0.7 → 0
- Triggered by reseting and re-adding `.fire` class on a host element

**Type particles** (input-driven, used in brief textarea/input):
- 1.5px micro-dots
- Spawn at approximate cursor position on each `input` event
- Rise 32px over 1.2s with fade

### 3.5 Layout

- **Page max content width**: `1280px` (with `1640px` for wider section overview pages)
- **Page padding**: `32px` left/right
- **Chapter padding**: `140px` top, `80–120px` bottom (varies by section density)
- **Default chapter grid**: `240px aside | 1fr | 1fr` (gap `56px`) — pinned aside / body / margin notes
- **Capabilities chapter grid**: `280px aside | 1fr` (no margin notes column — kit line replaces them)
- **Work pinned grid**: `minmax(0, 1fr) | minmax(0, 1.1fr)` (gap `80px`) — pinned name / scrolling text beats
- **Sticky offset**: `top: 120px` (under the mini nav after handoff)

---

## 4. Components

### 4.1 New components to build

| Component | Purpose |
|---|---|
| `IntroStage` | The 200vh sticky stage that hosts the wordmark animation + handoff |
| `WordmarkAnimated` | The mono-wipe + gold rule + bloom + burst + esp italic line |
| `WordmarkMini` | Top-left `N·T/S` mark that appears post-handoff |
| `NavShell` | Mini nav (Practice / Capabilities / Work / Process / Contact) that fades in post-handoff with a hairline gold rule beneath |
| `ScrollProgress` | Top hairline progress bar |
| `ChapterShell` | Generic chapter wrapper (number, pinned aside, body, optional margin notes) |
| `ChapterHeadline` | Italic-emphasis Fraunces headline component |
| `ChapterDivider` | Inline gold rule + 2 drift particles (the v1 underline-particle motif refined) |
| `ChapterBreak` | Small between-chapter break (centered gold rule with particles + "end · 0X" mono tag) |
| `GoldRule` | Reusable gold rule with optional box-shadow + drift particles |
| `DriftParticles` | Configurable particle field (count, interval, spawn area) |
| `BurstParticles` | One-shot burst from a host point |
| `TypeParticles` | Input-driven micro-particles |
| `BluePanel` | Right-side mask-feathered blue + grid aura (used in Capabilities home + every Capabilities sub-chapter) |
| `CapabilityList` | The morphing-aside scroll move; lists capability rows; updates aside title/body via callback |
| `CapabilityRow` | Single capability entry (index, italic + mono title, gold rule + drift, body, kit line) |
| `ProcessSpine` | Spring-driven gold spine with glowing tip + step activation |
| `ProcessStep` | Individual phase node (number, headline, body, deliverables) |
| `WorkPinnedName` | Sticky giant italic project name + meta + sub + gold rule |
| `WorkStackRow` | Text-only project entry (no plates) |
| `WorkStackDivider` | Horizontal gold rule with drift particles between stack rows |
| `BriefQuestionnaire` | State-machine driven 5-question flow with composed inference view |
| `OptionRow` | Editorial selection row (number / italic title / gold rule / detail / dot indicator) |
| `EditorialField` | Text input with mono label + gold rule below + italic annotation (no boxed input) |
| `EditorialButton` | Mono caps text on a gold underline with sliding arrow (replaces pill buttons) |
| `ContactClosing` | Full-screen colophon with corners + italic headline + gold rule + CTA |
| `FooterMini` | Minimal mono row (name + est. / coordinates / vol. issue) |
| `RightMarginIndex` | Sticky right-edge capability index for /capabilities sub-page |
| `TimelineGutter` | Sticky left-edge timeline for /about sub-page |
| `WeekAxis` | Secondary mono week-axis next to the Process spine on /process sub-page |

### 4.2 Existing components to delete or replace

- `Hero.tsx` — replaced by `IntroStage` + `WordmarkAnimated`
- `Services.tsx` — replaced by `CapabilityList` (renamed to Capabilities)
- `Survey.tsx` — replaced by `BriefQuestionnaire`
- `IntroSequence.tsx` — replaced by `IntroStage` (re-conceived)
- `PageWithIntro.tsx` — replaced by a simpler layout wrapper
- `ScrollTransitions.tsx` — its variants (neural-web, star-chart) are dropped; chapter breaks replace them
- `GoldPaint.tsx` — `GoldBrushText` and `ThunderShimmer` are no longer used; `GoldBrushStroke`'s underline-particles become the basis for `ChapterDivider` and `WorkStackDivider`; `WordReveal` becomes the word-stagger reveal pattern, kept (refactored)
- `GoldParticles.tsx` — re-conceived as `DriftParticles` + `BurstParticles` + `TypeParticles`
- `ConstellationBackground.tsx` — dropped
- `CompassLogo.tsx` — kept but used only as a faint mark in the intro stage (heavily de-emphasized)
- `ColorSchemeSwitcher.tsx`, `StyleSwitcher.tsx` — assess whether to keep; if shipping a single locked theme, delete

---

## 5. The intro moment (the only persistent v1 element, reimagined)

The opening of the home page. **2.5 seconds of mono restraint, then a second beat that earns notice.**

### 5.1 Sequence (loop reference: 7s cycle for the demo; production fires once on load, then settles)

| Time | Event |
|---|---|
| 0–1.5s | Mono caps "northtrack  studios" (one space between, not two; 0.42em tracking) clip-path wipes left → right |
| ~1.5s | Wordmark fully visible. Hold. |
| ~1.6s | Whole-stage subtle radial warm wash blooms (peak ~0.4s, settles to ~50% sustained) |
| ~1.8s | Soft radial bloom appears behind the rule position |
| 1.9–2.3s | Gold rule grows from center outward, 720px wide, 2px thick, rounded ends, dual-shadow glow |
| ~1.9s | ~14 gold particles burst upward from along the rule, drift past the wordmark, fade by ~3.3s |
| 3.5–4s | Esp line fades in: italic Fraunces, *"A studio for applied __intelligence__"* — "intelligence" in `--gold-brightest` with `text-shadow` glow |
| 5–6s | "begin" scroll cue + thin gold stem fades in at bottom-center, stem pulses |

### 5.2 Stage decoration

- Background: `radial-gradient(ellipse at 50% 55%, #0c0a14 0%, #050507 75%)` — keeps the slight purple-blue lean from v1 colors
- Grid overlay: 56px squares, `rgba(200,168,78,0.035)` lines
- Four mono corner glyphs (no box, just text): `NTS · vol. 02` (TL), `est. 2024 / 40.7128° N · 74.0060° W` (TR), `Index · 00` (BL), `Issue 01 · Spring` (BR). Editorial journal-edge work.
- Faint compass mark `opacity: 0.03` ghosted upper-right (the only carryover from v1 — small, atmospheric, not an icon)

### 5.3 Intro → home handoff (scroll-driven)

When `scrollY > 60vh` of the intro zone (intro zone is 200vh, sticky stage):

- The wordmark `transform: translate(calc(-50vw + 140px), calc(-50vh + 32px)) scale(0.32)` with `ease-handoff` over 0.9s — migrates to the top-left position as the persistent nav mark
- All corner glyphs, the rule, the bloom, the esp line, the burst, the scroll cue: opacity 0
- The mini nav (`NavShell`) fades in: `N·T/S` mark on left, links on right (Practice / Capabilities / Work / Process / Contact), hairline gold rule beneath — sticky at top of viewport

When scrolled back above threshold, the migration reverses (smooth, not snap).

---

## 6. Home page assembly (top to bottom)

```
<IntroStage>                       — 200vh sticky
<Chapter id="01" name="Practice" /> — pinned aside + body + margin notes
<ChapterBreak n="01" />
<Chapter id="02" name="Capabilities" signature="morphing-aside" aura="blue" />
<ChapterBreak n="02" />
<Chapter id="03" name="Work" signature="pinned-name" />
<ChapterBreak n="03" />
<Chapter id="04" name="Process" signature="spring-spine" />
<ChapterBreak n="04" />
<Chapter id="05" name="Brief" signature="teaser-question" />  — embedded one-question teaser
<ChapterBreak n="05" />
<ContactClosing />
<FooterMini />
```

### 6.1 Chapter 01 / Practice

**Structure:** default 3-column chapter grid (aside / body / margin notes)

- **Aside (sticky):** chapter number "01 / Practice" (mono), title "What we are" (Fraunces 300 1.6rem), `ChapterDivider`, 4-line mono mantra ("A small studio. / Applied AI. / Interfaces. / Engineered systems.")
- **Body:** italic-emphasis headline ("We build *intelligent* systems and the *interfaces* they live in."), lead paragraph, 2 body paragraphs with gold-bold inline emphasis on key terms
- **Margin notes (right column):** mono notes block with gold labels — Founded / Practice / Annual capacity

**Signature gesture:** none unique; this is the baseline pinned-aside chapter that establishes the language other chapters break from.

### 6.2 Chapter 02 / Capabilities

**Structure:** 2-column (`280px aside | 1fr`); no margin notes column

**Aside (sticky, morphing):**
- Chapter number "02 / Capabilities"
- Active label (mono, e.g. "currently overview" → "currently reading · 02")
- Title — *morphs* between "What we make" (default) and the italic concept word for the active capability ("Intelligence", "Surface", etc.)
- `ChapterDivider`
- Aside body — *morphs* between default 3-line mantra and the active capability's 3-line mantra
- Capability progress: 4 indicator rows (mono index + thin bar + name); the bar of the active capability extends and turns gold

**Body:** vertical stack of 4 `CapabilityRow`s separated by hairlines:
- 01 / **Intelligence** (AI Systems) — Models that reason · Pipelines that retrieve · Agents that act
- 02 / **Surface** (Interface Design) — Interfaces with weight · Motion with intent · Type that performs
- 03 / **Throughput** (Production Engineering) — Systems that scale · Costs that don't · Pipelines that hold
- 04 / **Direction** (Strategy & Audit) — One question at a time · One opinion at a time · Then build

Each row: mono index, italic concept word (Fraunces 300, ~3rem, gold) + mono formal label, gold rule with two drift particles, body paragraph, mono "Kit ·" footer naming the actual stack.

**Signature gesture:** **morphing pinned aside.** Active row determined by intersection-observer-style logic on scroll (closest-to-viewport-mid wins). On change: aside title and aside body opacity-crossfade (180ms swap), progress indicator updates with width + gold transition. **Default state restored when no row is in viewport center.**

**Aura (Blue):** A `BluePanel` element absolutely positioned across the section bounds:
- `overflow: clip` on the section (NOT `overflow: hidden` — that breaks sticky descendants on Safari/Chrome)
- Pseudo-element `::before` covers the section, layered backgrounds: gold grid + radial blue
- Mask gradient (left → right): `transparent 0% → transparent 14% → rgba(0,0,0,0.18) 24% → rgba(0,0,0,0.55) 36% → black 50% → black 70% → rgba(0,0,0,0.55) 84% → rgba(0,0,0,0.18) 94% → transparent 100%`
- Effect: invisible behind aside + gold concept words; densest behind body text; fades to black past text on the right
- Blue values: see §3.1

### 6.3 Chapter 03 / Work

**Structure:** default chapter grid (aside | body 2-col)

**Aside (sticky):** chapter number "03 / Work", title "Selected", divider, mono mantra ("Three pieces. / 2024 — 2025. / Available on request.")

**Body:** one **pinned project** + two **stacked rows** separated by `WorkStackDivider`s.

**Pinned project (Project 01, "Synapse"):**
- 2-column grid `1fr | 1.1fr`, gap 80px, `min-height: 240vh`
- **Left column (sticky):** `WorkPinnedName` — mono meta ("Project 01 · 2025 · Lead"), giant italic Fraunces name (8rem, `--gold-brightest` with text-shadow glow), italic Fraunces sub-line, small gold rule with drift particles
- **Right column (scrolling):** 3 `WorkBlock`s (Beat 01 The piece / Beat 02 The challenge / Beat 03 What shipped) — each a mono beat tag + italic body paragraph + (optional) mono tags

**Stacked rows (Projects 02, 03):**
- `WorkStackDivider` above each
- 2-col header row: italic giant project name (Fraunces, ~4rem, gold) on left, mono meta block on right (project number/year + client/role)
- Body paragraph spans full width below
- Mono "Tags ·" footer

**Signature gesture:** **pinned giant italic project name.** No plates, no frames, no faux-photograph rectangles. The project name *is* the artifact. Type-as-image.

### 6.4 Chapter 04 / Process

**Structure:** 2-column (`240px aside | 1fr`); diagram replaces the body

**Aside (sticky):** chapter number "04 / Process", title "How we work", divider, mono mantra ("Four phases. / One engagement. / Six to twelve weeks.")

**Body — `ProcessSpine`:**
- Vertical hairline `proc-spine` at left edge of body (full diagram height, `rgba(200,168,78,0.08)`)
- `proc-spine-fill` overlay (2px wide, gold-to-gold gradient, glow shadow) — height JS-driven by spring physics
- `proc-spine-tip` particle (10px radial gradient `#fff5d8 → #f4d68a → #c8a84e`, large glow) — top JS-driven, rides the leading edge of the fill
- 4 `ProcessStep` nodes — each ~60px padding top/bottom:
  - 01 **Brief** — discover the question
  - 02 **Define** — write the spec
  - 03 **Build** — ship in increments
  - 04 **Hand off** — transfer the room
- Each step has a `::before` dot at its left (-47px / top 76px), 14px circle, dark center / gold border. Steps are at 25% opacity by default; activate (opacity 1, dot fills gold + glows) when the springy fill passes their dot Y.

**Signature gesture:** **spring-driven kinematic spine.** Tracker pinned to viewport center; spine fill height = `progress × diagram.height` driven through lerp/velocity/damping. Tracks scroll 1:1 with elastic settle. Step dots ride the same wave.

Per-phase content (visible in each `ProcessStep`):
- Mono "Phase 0X"
- Italic-emphasis headline ("*Brief* — discover the question")
- Body paragraph
- Mono "Output ·" line listing deliverables

### 6.5 Chapter 05 / Brief (teaser)

**Structure:** ~100vh single-section teaser, centered

- Mono "05 / Brief", italic Fraunces prompt: "What's the question you keep *coming back to*?"
- A single editorial textarea (no boxed input — just italic typing on a thin gold rule below)
- `EditorialButton`: "Continue the brief →"
- Click takes user to `/brief` with this answer pre-filled in question 04 of the full questionnaire

**Why it's here:** the home page should rope visitors into the brief flow without forcing them through 5 questions inline. Show them the *kind* of question they'll be asked, give them a continuation point.

### 6.6 ContactClosing

**Structure:** full-screen (min-height 100vh), centered, faint grid overlay, blue-aura optional (subtler than Capabilities)

- Four mono corner glyphs: `NTS · vol. 02` (TL), `colophon · close` (TR), coordinates (BL), location (BR)
- Centered colophon block (max-width 640px):
  - Mono "Closing"
  - Italic-emphasis headline: "A short conversation, *privately*."
  - Gold rule (280px, gradient with `--gold-brightest` core, glow)
  - Italic Fraunces body (max-width 50ch): "If you have an idea you've been turning over and you'd like a second opinion..."
  - **Single CTA:** `EditorialButton` styled — "Begin a brief →" linking to `/brief`
  - Aux line: "Or write directly · hello@northtrack.studio" (mono with linked email)

### 6.7 FooterMini

Minimal single-row mono footer (border-top hairline gold):
- Left: `NorthTrack Studios · est. 2024` (gold separator)
- Center: `40.7128° N · 74.0060° W`
- Right: `Vol. 02 · Issue 01`

---

## 7. Sub-page system

Every sub-page inherits the home tokens (mono nav with active highlighted, italic Fraunces page wordmark, gold rule + drift particles, optional `BluePanel` aura). Each has its own structural spine fit to its content type, and each has **one signature gesture distinct from the home's gestures** so the system feels deep, not repetitive.

**Nav links** (resolution): the mini nav exposes 5 links — `About / Capabilities / Work / Process / Contact` — each mapping to the matching sub-page URL. The home page's "Chapter 01 / Practice" is an in-page section, not a sub-page; visitors who want the long-form studio bio go to `/about`. (Some demo files used a "Practice" nav link as shorthand for /about; the production nav uses "About" for clarity.)

### 7.1 /capabilities

**Purpose:** A long-form chapter book of the four practices — the deep version of what the home page introduces in compressed form.

- **Hero:** italic Fraunces *Capabilities* wordmark + one-line subtitle ("Four practices, deepened."). No paragraphs.
- **Body:** Each capability becomes its own ~500–800-word chapter with origin, cost, two case excerpts, kit list, and a "Begin a brief on this" CTA at the end.
- **Signature gesture:** **pinned right-margin index.** A vertical capability index sticks to the right edge as the user scrolls; the active capability ticks gold, the others sit at 25% opacity. Click any to anchor-jump (`/capabilities#intelligence`, etc.).
- **Aura:** `BluePanel` behind *each* chapter (not just one), masked the same way.

### 7.2 /work

**Purpose:** The full archive. Home shows three "Selected"; this shows everything — chronological, filterable, no plates.

- **Hero:** italic *Work* wordmark + count subtitle ("Twelve pieces, 2024–2025"), mono filter row beneath.
- **Filter row:** mono pills — `All`, `Year`, `Type`, `Stack`. Filtering re-orders with a fluid stagger (`ease-emerge`, 60ms apart), not a snap.
- **Body:** vertical stack of project entries using the home's `WorkStackRow` pattern, separated by `WorkStackDivider`s.
- **Signature gesture:** **cascade reveal.** Project names italic-fade in from a 4° skew + 16px translateY as they enter viewport, staggered 80ms apart per row (each entry's name slightly trails the previous).
- **Project detail:** each entry deep-links to `/work/[slug]` — a long-form case page using the home's pinned-italic-name layout (`WorkPinnedName`) as the template.

### 7.3 /about

**Purpose:** Studio bio — story, people, beliefs. The quietest sub-page.

- **Hero:** italic *About* wordmark + single line ("A small studio, a long view.")
- **Body:** three sections —
  - **Story** — origin manifesto (long-form)
  - **People** — text-only entries, one per person. Format: `name · role · one-liner` mono header + 50-word italic Fraunces bio. If portraits are added later, they replace the gold rule above each entry.
  - **Beliefs** — 6 numbered principles, each in 2–3rem italic Fraunces on its own line, e.g. *"01 / The interface becomes the brand."*
- **Signature gesture:** **vertical timeline gutter.** The left edge is a thin gold timeline (2024 → now) with milestone markers (founded, first engagement, first hire). Active year ticks gold as the relevant section enters viewport — anchors the reader in time.

### 7.4 /process

**Purpose:** The deep version of Chapter 04 from the home. Same kinematic spine, but each phase gets a full pinned chapter with deliverables, examples, and pitfalls.

- **Hero:** italic *Process* wordmark + subtitle ("A 6–12 week walk").
- **Body:** same spring-driven `ProcessSpine` as home. Each phase gets ~150vh of pinned content — the phase pinned on the left while details (workshop deliverables, anonymized real example, common failure modes in italic call-outs) scroll past on the right.
- **Signature gesture:** **secondary week-axis.** A second mono axis runs to the right of the spine showing engagement weeks (WK 01 → WK 12). As phases activate, their week range highlights gold. Two timelines, one walk.
- **Closing:** after phase 04, a CTA block: italic *"Bring us your question. We'll write the brief together."* → `/brief`.

### 7.5 /brief

**Purpose:** The full immersive brief questionnaire — see §8 for the deep spec.

### 7.6 /contact

**Purpose:** Full intake form — alternative to /brief for those who want to write directly. Editorial style, no boxed inputs.

- **Hero:** italic *Begin* wordmark (one word) + the same closing line from the home page.
- **Layout:** two columns —
  - **Form on the left** (5-field editorial intake using `EditorialField` — same component as the brief's text questions): name, email, company, project type, question
  - **Direct details on the right**: email, calendar link, location, response time, FAQ link
- **Signature gesture:** **annotated as you fill.** When a field is focused, a small italic Fraunces annotation fades in to the right ("e.g., the question you've been turning over for weeks") — like an editor leaving margin notes. Disappears once typing starts.
- **Submit:** `EditorialButton` — "Send · begin a brief →". After submit: a quiet confirmation page that reads like a thank-you note.

---

## 8. Brief questionnaire (deep spec)

**Component:** `BriefQuestionnaire`
**Lives at:** `/brief` (full flow) and embedded as Chapter 05 / Brief teaser on home

### 8.1 Question structure

| # | Type | Key | Prompt | Inputs |
|---|---|---|---|---|
| 01 | Selection | `project` | "What are you trying to *build*?" | Agent / Knowledge / Internal tool / Unclear |
| 02 | Selection | `stage` | "Where are you in the *arc*?" | Just thinking / Have a spec / Hit a wall / Shipped |
| 03 | Selection | `scope` | "What *scope* are you imagining?" | Brief / Prototype / Full build / Partnership |
| 04 | Long text | `question` | "Tell us the *question* you've been turning over." | Auto-grow textarea, italic Fraunces typing on gold rule |
| 05 | Two text | `contact` | "Last thing — *who* are you?" | Name + email side-by-side (editorial fields) |

### 8.2 Question screen layout

- **Top fixed:** mini wordmark `N·T/S · Brief` (left) + progress label `01 / 05` and 140px gold progress bar (right, fills with `ease-emerge`)
- **Centered card** (`q-wrap`, max-width 820px): mono "Question 0X of 05" tag with gold rule prefix, italic Fraunces prompt with word-stagger reveal (50ms apart), input zone, controls
- **Footer corners:** `NTS · brief intake` (BL), `est. 2024 · off the record` (BR)
- **Aura:** `BluePanel` right-side at lighter intensity than Capabilities

### 8.3 Option-row (selection question UI)

For Q1–Q3. Replaces all boxed cards / pill chips.

Per row (`OptionRow`):
- `64px | 1fr | 32px` grid: number / content / dot
- Left: mono number `01–04` (color states: faint → muted on hover → gold when selected)
- Center: italic Fraunces title (color states: light gray → soft white on hover → bright gold + text-shadow when selected) + thin gold rule below (width states: 24px → 56px on hover → 96px when selected; turns from `rgba(200,168,78,0.2)` to gradient with drift particles when selected) + italic detail line below
- Right: dot indicator (24px circle, transparent → gold border on hover → fills gold with `✓` when selected)
- Whole row shifts right 12px on hover/select with `ease-emerge`
- Selected row gets a 1px gold accent line on its left edge (`::before` pseudo)

### 8.4 Text question UI (Q4)

`EditorialField`:
- Mono label above (gold caps)
- Textarea: `Fraunces` italic, 1.4rem, transparent bg, no border, `caret-color: --gold-brightest`, auto-grow on input
- Gold rule below: hairline gradient (subdued by default, brighter when content present)
- Italic Fraunces annotation below: "The real one, not the polished one. A few sentences is enough."

### 8.5 Two-field UI (Q5)

Two `EditorialField`s side by side (stacked on mobile <700px) — name + email. Continue is enabled only when both are filled.

### 8.6 Controls

`EditorialButton` (replaces all pill buttons site-wide):
- Continue / Send: mono caps text on a hairline gold underline, with sliding arrow `→` that translates 8px right on hover. Underline color states: `rgba(200,168,78,0.18)` (not ready) → solid `--gold` with glow (ready) → gradient with stronger glow (hover-ready).
- Back: mono caps `← Back`, color goes from muted to gold on hover, arrow translates left.

### 8.7 Advance behavior

- Click Continue (or Enter on single-line text question): `BurstParticles` fires, exit transition (translateY -28px, opacity 0, 380ms), then content swaps + enter transition (translateY +28px → 0, opacity 0 → 1, 500ms with word stagger reveal).
- **Bug to avoid:** the `q-wrap` className must be **set fresh** on every render (`element.className = 'q-wrap enter'`), not just have a class added. Otherwise the stale `exit` class persists and the new question stays invisible. (See `direction-a-round-5-brief-v3.html` for the fix.)

### 8.8 Composed view ("What we'd build for you")

After Q5, instead of "answers received," the page composes an **inferred draft engagement** from the selections.

**Layout:**
- Mono tag: "Brief · what we'd build for you"
- Italic-emphasis headline: "A draft engagement, *composed from your answers*."
- Italic Fraunces sub-line: "{name} — here's our read on what you're after. Send it and we'll write back with a real opinion within 48 hours."
- Gold rule (96px)
- **2×2 grid** (`composed-grid`) — 4 inferred cells:
  - **Type of work** (mapped from `project`): e.g. "Agent system" + detail
  - **Recommended approach** (mapped from `stage`): e.g. "Audit + intervene" + detail
  - **Engagement shape** (mapped from `scope`): e.g. "8–12 weeks · production system" + detail
  - **Reply to** (from contact): name + email
- **Quoted question block** (italic Fraunces with left gold rule + glow): the user's Q4 answer in their own words
- **Seal row:** `gold-rule | "× NTS · ready to send" mono pill | gold-rule`
- **Actions:** `Send brief →` (gold-underlined `EditorialButton`) + "← Start over" subtle button

### 8.9 Inference rules

```
INFER.project = {
  agent:   { title: "Agent system",         detail: "Multi-agent orchestration with tool use, evaluation harness, observability." },
  search:  { title: "Knowledge experience", detail: "Hybrid retrieval over your corpus, citation architecture, editorial UX." },
  tool:    { title: "Internal workbench",   detail: "Custom interface for power users, decision support, data access patterns." },
  unclear: { title: "Discovery engagement", detail: "Workshop-led shape-finding before we commit to a build." }
}
INFER.stage = {
  thinking: { title: "Begin with a brief",       detail: "We map the territory before we touch code." },
  spec:     { title: "Move into Define + Build", detail: "Skip discovery, go straight to spec validation and increments." },
  wall:     { title: "Audit + intervene",        detail: "Identify the wall, plan around it, ship the unblock." },
  shipped:  { title: "Optimization audit",       detail: "Performance, quality, cost — the unsexy second 80%." }
}
INFER.scope = {
  brief:     { title: "2 weeks · written opinion",              detail: "Single document, one opinion, no engineering." },
  prototype: { title: "4–6 weeks · prototype",                  detail: "Working proof, ready to validate with real users." },
  build:     { title: "8–12 weeks · production system",         detail: "Deployed in your stack, with handoff and runbook." },
  partner:   { title: "Ongoing · named partnership",            detail: "Continued engagement, on-call for the long arc." }
}
```

### 8.10 Submission

On `Send brief →`: POST to a server route (`/api/brief`) that emails the inbox + auto-replies with calendar link. Out of scope for the visual spec; capture as a follow-up in the implementation plan.

---

## 9. Technical stack

### 9.1 Existing (keep)

- **Next.js 16** (App Router, Turbopack) — see `node_modules/next/dist/docs/` for v16-specific patterns; do not assume v13/v14 conventions
- **React 19**
- **Tailwind CSS 4** (`@tailwindcss/postcss`)
- **TypeScript**
- Existing pages structure under `src/app/` (about, brief, capabilities, contact, process, work) — preserved; layouts replaced

### 9.2 New dependencies

| Package | Purpose | Approx size |
|---|---|---|
| `lenis` | Smooth scroll wrapper, baseline for the whole motion language | ~8KB |
| `gsap` (with `ScrollTrigger`) | Scroll-tied choreography | ~50KB (free tier covers everything we need) |

Alternatives considered and rejected: `framer-motion` (nice for component motion but doesn't beat GSAP for scroll-driven; would add weight without coverage). `motion-one` (lighter than GSAP but missing the ScrollTrigger ergonomics).

### 9.3 Fonts

Replace `Geist Sans` + `Geist Mono` (current via `next/font/google` in `layout.tsx`) with:
- **Inter** (200, 300, 400, 500)
- **Fraunces** (italic 300, 400; roman 300, 400, 500)
- **JetBrains Mono** (300, 400, 500)

Load via `next/font/google` for self-hosted optimization. Subset to latin only.

### 9.4 Asset handling

- Particle systems use canvas + DOM elements; no image assets needed
- Project glyphs from the Work plates demo are **dropped** (plates removed entirely)
- Compass mark stays as an SVG component for the faint intro stage decoration (`opacity: 0.03`)
- No new image dependencies for the design itself; project case images are content, added later

### 9.5 Reduced motion

Honor `prefers-reduced-motion: reduce`:
- Disable Lenis smooth scroll (fall back to native)
- Skip the intro animation (jump to settled state)
- Disable drift, burst, and type particles
- Disable spring spine animation (jump to scroll-position-based static fill)
- Keep word reveals as instant opacity changes (no translate)
- Keep handoff state (just no transition)

---

## 10. Migration & scope

### 10.1 Approach

Full rebrand on top of the existing Next.js 16 codebase. Page routes preserved (`/`, `/about`, `/brief`, `/capabilities`, `/contact`, `/process`, `/work`). All page contents replaced.

### 10.2 Suggested phasing for implementation plan

1. **Foundation:** tokens (color, type, motion), Lenis + GSAP setup, font swap, layout primitives
2. **Intro + handoff:** `IntroStage`, `WordmarkAnimated`, `WordmarkMini`, `NavShell`, `ScrollProgress`
3. **Chapter primitives:** `ChapterShell`, `ChapterHeadline`, `ChapterDivider`, `ChapterBreak`, `GoldRule`, `DriftParticles`, `BurstParticles`
4. **Home page chapters in order:** Practice → Capabilities (with `BluePanel` + morphing aside) → Work (with `WorkPinnedName` + stack) → Process (with `ProcessSpine` spring physics) → Brief teaser
5. **Closing + Footer:** `ContactClosing`, `FooterMini`
6. **Brief questionnaire:** `BriefQuestionnaire` + `OptionRow` + `EditorialField` + `EditorialButton` + composed view + `/api/brief` route
7. **Sub-pages in order:** `/capabilities` (right-margin index) → `/work` (filter + cascade) → `/work/[slug]` template → `/about` (timeline gutter) → `/process` (deep + week axis) → `/contact` (form + annotations)
8. **Polish pass:** reduced-motion fallbacks, mobile breakpoints, performance audit (intro animation, spring loop, particle count tuning)
9. **Delete unused v1 components** (Hero, Services, Survey, IntroSequence, ScrollTransitions, ConstellationBackground, GoldPaint exports that are no longer used)

### 10.3 Backwards compat

This is a full v2; no need for v1/v2 toggle or feature flag. Ship as a single replacement.

---

## 11. Open questions (for user review before implementation)

1. **Project case images.** The pinned `WorkPinnedName` layout works without images, but `/work/[slug]` deep pages will need *something* visual eventually. Spec deliberately leaves them text-only for now. Plan to revisit when real project assets exist?
2. **Real project content.** "Synapse / Lumen / Threshold" are placeholder names. Replace with real engagements before launch, or keep as demonstration content if shipping before real client work?
3. **Survey/Brief data store + email.** Spec assumes a `/api/brief` POST that emails the studio inbox + auto-replies with a calendar link. Hosting choice (Resend? Postmark? Vercel-native?) — defer to implementation, or decide now?
4. **People entries on `/about`.** Spec says text-only with optional portraits added later. Currently 1 person (founder)? 2? Confirm the team count and bio content scope.
5. **Compass mark fate.** Kept as a faint atmospheric mark (`opacity: 0.03`) in the intro stage, dropped everywhere else. Acceptable, or fully retire the compass motif?
6. **`ColorSchemeSwitcher` + `StyleSwitcher`.** v1 had these for theme/style toggling. Spec assumes one locked theme. Confirm OK to delete, or keep an experimental shelf?
7. **Calendar service.** `/contact` references a calendar link. Cal.com? Calendly? Native scheduling? Out of design scope but flag here so it's planned.

---

## 12. Reference: visual mockups

All in `.superpowers/brainstorm/26309-1777603666/content/` (preserved for implementer reference):

| Round | File | Shows |
|---|---|---|
| 1 | `directions-v2.html` | The 3-direction selection screen (A Atelier · B Compass Drift · C Specimen) |
| 1 lock | `direction-a-locked.html` | Atelier intro at full fidelity after lock |
| 2 | `direction-a-handoff-v3.html` | Intro + tightened rule + intro→home handoff |
| 2.1 | `direction-a-round-2.html` | Adds Chapter 02 / Capabilities with morphing aside |
| 2.3 | `direction-a-round-2-blue-v3.html` | Adds the BluePanel right-side aura with feathered mask |
| 3.1 | `direction-a-round-3-v2.html` | Full home — plates removed (text-only Work), spring-driven Process spine |
| 4 | `direction-a-round-4-subpages.html` | 5 sub-page wireframes (Capabilities / Work / About / Process / Contact) |
| 5.3 | `direction-a-round-5-brief-v3.html` | Brief questionnaire (selection-led, option-rows, composed inference view) |

---

**End of spec. Implementation plan to follow via the `writing-plans` skill.**
