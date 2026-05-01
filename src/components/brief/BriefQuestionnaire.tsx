"use client";
import { CSSProperties, useState } from "react";
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
