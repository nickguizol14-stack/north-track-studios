"use client";

import { useState } from "react";
import { GoldBrushText, GoldBrushStroke, ThunderShimmer } from "./GoldPaint";
import { GoldParticles } from "./GoldParticles";

const questions = [
  {
    id: "project-type",
    label: "01",
    question: "What are you looking to build?",
    options: [
      { value: "website", label: "Website", desc: "Marketing, portfolio, or landing page" },
      { value: "web-app", label: "Web Application", desc: "SaaS, dashboard, or internal tool" },
      { value: "ai-tool", label: "AI-Powered Tool", desc: "Agents, chatbots, or intelligent workflows" },
      { value: "mobile", label: "Mobile App", desc: "iOS, Android, or cross-platform" },
      { value: "other", label: "Something Else", desc: "Custom infrastructure or integration" },
    ],
  },
  {
    id: "design-direction",
    label: "02",
    question: "What design direction speaks to you?",
    options: [
      { value: "minimal", label: "Minimal & Clean", desc: "Whitespace, precision, quiet confidence" },
      { value: "bold", label: "Bold & Expressive", desc: "Strong visuals, motion, commanding presence" },
      { value: "technical", label: "Technical & Data-Rich", desc: "Dashboards, metrics, information density" },
      { value: "editorial", label: "Editorial & Narrative", desc: "Story-driven, longform, immersive" },
      { value: "unsure", label: "Guide Me", desc: "I trust the experts — surprise me" },
    ],
  },
  {
    id: "timeline",
    label: "03",
    question: "When do you need this shipped?",
    options: [
      { value: "asap", label: "Yesterday", desc: "Urgent — we need to move fast" },
      { value: "1-2months", label: "1–2 Months", desc: "Near-term with room to plan" },
      { value: "3-6months", label: "3–6 Months", desc: "Strategic build with proper architecture" },
      { value: "exploring", label: "Just Exploring", desc: "Early stage — scoping what's possible" },
    ],
  },
];

export function Survey({ embedded = false }: { embedded?: boolean }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);

  const current = questions[step];
  const isLast = step === questions.length - 1;
  const progress = ((step + (submitted ? 1 : 0)) / questions.length) * 100;

  const selectOption = (value: string) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));

    if (isLast) {
      setTimeout(() => setSubmitted(true), 400);
    } else {
      setTimeout(() => setStep((s) => s + 1), 400);
    }
  };

  const Wrapper = embedded ? "div" : "section";

  return (
    <Wrapper
      id="brief"
      className={`relative overflow-hidden ${
        embedded ? "py-36 bg-surface" : "min-h-screen flex items-center py-20"
      }`}
    >
      {embedded && <div className="painted-divider" />}

      <GoldParticles density={30} speed={0.2} />

      <div className="relative z-10 mx-auto max-w-3xl px-6 w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] tracking-[0.5em] uppercase text-gold font-mono">
            Quick Brief
          </span>
          <div className="mt-5 flex justify-center">
            <ThunderShimmer interval={10000} intensity={0.3}>
              <GoldBrushText
                as="h2"
                className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight"
                delay={50}
                speed={600}
              >
                {submitted ? "We'll be in touch." : "Tell us the vision."}
              </GoldBrushText>
            </ThunderShimmer>
          </div>
          <GoldBrushStroke width="80px" delay={500} className="mt-6 mx-auto" />
        </div>

        {/* Progress bar */}
        {!submitted && (
          <div className="mb-12">
            <div className="h-px bg-gold/10 relative">
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold/60 to-gold/30"
                style={{
                  width: `${progress}%`,
                  transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
            </div>
            <div className="mt-3 flex justify-between">
              <span className="text-[9px] tracking-[0.4em] uppercase text-gold/40 font-mono">
                Question {step + 1} of {questions.length}
              </span>
              <span className="text-[9px] tracking-[0.4em] uppercase text-gold/40 font-mono">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        )}

        {/* Question */}
        {!submitted ? (
          <div
            key={current.id}
            className="animate-fade-in-up"
            style={{ animationDuration: "0.5s" }}
          >
            {/* Question text */}
            <div className="flex items-baseline gap-4 mb-10">
              <span className="text-[11px] font-mono text-gold/30">
                {current.label}
              </span>
              <h3 className="text-xl md:text-2xl font-extralight tracking-tight text-foreground-warm">
                {current.question}
              </h3>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-3">
              {current.options.map((option) => {
                const isSelected = answers[current.id] === option.value;
                const isHovered = hoveredOption === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => selectOption(option.value)}
                    onMouseEnter={() => setHoveredOption(option.value)}
                    onMouseLeave={() => setHoveredOption(null)}
                    className={`group relative text-left border p-5 md:p-6 transition-all duration-500 card-alive ${
                      isSelected
                        ? "border-gold/50 bg-gold/[0.06]"
                        : "border-gold/[0.08] bg-card hover:border-gold/25"
                    }`}
                    style={{
                      animationPlayState: isHovered ? "paused" : "running",
                    }}
                  >
                    {/* Left accent */}
                    <div
                      className="absolute top-0 left-0 w-[2px] h-full transition-all duration-500"
                      style={{
                        background: isSelected || isHovered
                          ? "linear-gradient(to bottom, rgba(200,168,78,0.6), rgba(200,168,78,0.2))"
                          : "linear-gradient(to bottom, rgba(200,168,78,0.1), transparent)",
                      }}
                    />

                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute top-0 right-0 w-full h-px bg-gold/30" />
                      <div className="absolute top-0 right-0 w-px h-full bg-gold/30" />
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span
                          className={`text-base font-light tracking-tight transition-colors duration-300 ${
                            isSelected
                              ? "text-gold"
                              : "text-foreground-warm group-hover:text-gold"
                          }`}
                        >
                          {option.label}
                        </span>
                        <p className="mt-1.5 text-sm text-muted font-light">
                          {option.desc}
                        </p>
                      </div>

                      {/* Selection indicator */}
                      <div
                        className={`mt-1 w-3 h-3 border rotate-45 shrink-0 transition-all duration-300 ${
                          isSelected
                            ? "border-gold bg-gold"
                            : "border-gold/20 group-hover:border-gold/40"
                        }`}
                      />
                    </div>

                    {/* Bottom glow on hover */}
                    <div
                      className="absolute bottom-0 inset-x-4 h-px transition-all duration-500"
                      style={{
                        background: isHovered
                          ? "linear-gradient(90deg, transparent, rgba(200,168,78,0.3), transparent)"
                          : "transparent",
                      }}
                    />
                  </button>
                );
              })}
            </div>

            {/* Back button */}
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="mt-8 text-[10px] tracking-[0.2em] uppercase text-muted hover:text-gold transition-colors font-mono"
              >
                &larr; Back
              </button>
            )}
          </div>
        ) : (
          /* Submitted state */
          <div className="text-center animate-fade-in-up" style={{ animationDuration: "0.6s" }}>
            {/* Success diamond */}
            <div className="mx-auto w-12 h-12 border border-gold/40 rotate-45 flex items-center justify-center mb-8">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="-rotate-45"
              >
                <path
                  d="M4 10L8.5 14.5L16 5.5"
                  stroke="#c8a84e"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="text-lg text-foreground-warm font-light leading-relaxed max-w-md mx-auto">
              Your brief has been received. We&apos;ll review your vision and
              reach out within 24 hours with next steps.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              {Object.entries(answers).map(([key, val]) => {
                const q = questions.find((q) => q.id === key);
                const opt = q?.options.find((o) => o.value === val);
                return (
                  <div key={key} className="flex items-center justify-center gap-3">
                    <span className="text-[9px] tracking-wider uppercase text-muted font-mono">
                      {q?.label}
                    </span>
                    <span className="text-sm text-gold/70 font-light">
                      {opt?.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                setStep(0);
                setAnswers({});
                setSubmitted(false);
              }}
              className="mt-10 border border-gold/25 px-7 py-3 text-[10px] tracking-[0.2em] uppercase text-gold hover:bg-gold/10 transition-all duration-300"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </Wrapper>
  );
}
