"use client";

import { useState, useCallback } from "react";
import { GoldBrushText, ThunderShimmer } from "./GoldPaint";
import { GoldParticles } from "./GoldParticles";

const questions = [
  {
    id: "project-type",
    label: "01",
    question: "What are you looking to build?",
    type: "select" as const,
    options: [
      { value: "website", label: "Website", desc: "Marketing, portfolio, or landing page" },
      { value: "web-app", label: "Web Application", desc: "SaaS, dashboard, or internal tool" },
      { value: "ai-tool", label: "AI-Powered Tool", desc: "Agents, chatbots, or intelligent workflows" },
      { value: "workflow", label: "Workflow Optimization", desc: "Streamline operations with smart automation" },
      { value: "other", label: "Something Else", desc: "Custom infrastructure or integration" },
    ],
  },
  {
    id: "design-direction",
    label: "02",
    question: "What design direction speaks to you?",
    type: "select" as const,
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
    type: "select" as const,
    options: [
      { value: "asap", label: "Yesterday", desc: "Urgent — we need to move fast" },
      { value: "1-2months", label: "1–2 Months", desc: "Near-term with room to plan" },
      { value: "3-6months", label: "3–6 Months", desc: "Strategic build with proper architecture" },
      { value: "exploring", label: "Just Exploring", desc: "Early stage — scoping what's possible" },
    ],
  },
  {
    id: "contact",
    label: "04",
    question: "Where should we reach you?",
    type: "contact" as const,
    options: [],
  },
];

export function Survey({ embedded = false }: { embedded?: boolean }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "" });

  const current = questions[step];
  const isLast = step === questions.length - 1;
  const totalSteps = questions.length;
  const progress = ((step + (submitted ? 1 : 0)) / totalSteps) * 100;

  const selectOption = useCallback((value: string) => {
    setSelected(value);
    setAnswers((prev) => ({ ...prev, [current.id]: value }));

    setTimeout(() => {
      setSelected(null);
      setDirection("forward");
      if (isLast) {
        setSubmitted(true);
      } else {
        setStep((s) => s + 1);
      }
    }, 350);
  }, [current.id, isLast]);

  const goBack = useCallback(() => {
    setDirection("back");
    setStep((s) => s - 1);
  }, []);

  const submitContact = useCallback(() => {
    setAnswers((prev) => ({
      ...prev,
      contact: `${contactForm.name} — ${contactForm.email}${contactForm.phone ? ` — ${contactForm.phone}` : ""}`,
    }));
    setDirection("forward");
    setSubmitted(true);
  }, [contactForm]);

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
                delay={0}
                speed={200}
              >
                {submitted ? "We'll be in touch." : "Tell us your vision."}
              </GoldBrushText>
            </ThunderShimmer>
          </div>
        </div>

        {/* Progress bar */}
        {!submitted && (
          <div className="mb-12">
            <div className="h-[3px] bg-gold/[0.06] rounded-full relative overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-gold/70 via-gold/50 to-gold/30"
                style={{
                  width: `${progress}%`,
                  transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </div>
            <div className="mt-3 flex justify-between">
              <span className="text-[9px] tracking-[0.4em] uppercase text-gold/40 font-mono">
                Step {step + 1} of {totalSteps}
              </span>
              <span className="text-[9px] tracking-[0.4em] uppercase text-gold/40 font-mono">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        )}

        {/* Question area */}
        {!submitted ? (
          <div
            key={current.id}
            className="survey-step"
            style={{
              animation: `${direction === "forward" ? "surveySlideIn" : "surveySlideBack"} 0.4s cubic-bezier(0.16, 1, 0.3, 1) both`,
            }}
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

            {/* Options or Contact form */}
            {current.type === "select" ? (
              <div className="flex flex-col gap-3">
                {current.options.map((option, i) => {
                  const isSelected = selected === option.value;
                  const wasAnswered = answers[current.id] === option.value;

                  return (
                    <button
                      key={option.value}
                      onClick={() => selectOption(option.value)}
                      className={`group relative text-left rounded-2xl overflow-hidden transition-all duration-400 ${
                        isSelected
                          ? "scale-[0.98]"
                          : ""
                      }`}
                      style={{
                        opacity: 0,
                        animation: `surveyOptionIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${80 + i * 50}ms both`,
                      }}
                    >
                      <div
                        className={`relative p-5 md:p-6 rounded-2xl border transition-all duration-400 ${
                          isSelected || wasAnswered
                            ? "border-gold/40 bg-gold/[0.06]"
                            : "border-gold/[0.08] bg-card/80 hover:border-gold/20"
                        }`}
                        style={{
                          boxShadow: isSelected
                            ? "0 8px 30px rgba(200,168,78,0.1), 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.05)"
                            : "0 4px 16px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.04), inset 0 -1px 2px rgba(0,0,0,0.2)",
                          transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span
                              className={`text-base font-light tracking-tight transition-colors duration-300 ${
                                isSelected || wasAnswered
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

                          {/* Selection indicator — rounded */}
                          <div
                            className={`mt-1 w-3 h-3 rounded-full border shrink-0 transition-all duration-300 ${
                              isSelected || wasAnswered
                                ? "border-gold bg-gold scale-110"
                                : "border-gold/20 group-hover:border-gold/40"
                            }`}
                          />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Contact form — step 4 */
              <div
                className="rounded-2xl border border-gold/[0.08] bg-card/80 p-6 md:p-8"
                style={{
                  boxShadow: "0 6px 24px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3), inset 0 1.5px 2px rgba(255,255,255,0.05), inset 0 -1.5px 3px rgba(0,0,0,0.2)",
                  opacity: 0,
                  animation: "surveyOptionIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) 80ms both",
                }}
              >
                <p className="text-sm text-muted-light font-light mb-6">
                  Leave your details and we&apos;ll set up a free consultation to discuss your project.
                </p>
                <div className="flex flex-col gap-5">
                  <div>
                    <label
                      htmlFor="survey-name"
                      className="block text-[10px] tracking-[0.3em] uppercase text-gold-dim font-mono mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="survey-name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full bg-transparent border-b border-gold/15 pb-3 text-sm text-foreground outline-none focus:border-gold/50 transition-colors placeholder:text-muted/30 rounded-none"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="survey-email"
                      className="block text-[10px] tracking-[0.3em] uppercase text-gold-dim font-mono mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="survey-email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full bg-transparent border-b border-gold/15 pb-3 text-sm text-foreground outline-none focus:border-gold/50 transition-colors placeholder:text-muted/30 rounded-none"
                      placeholder="you@company.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="survey-phone"
                      className="block text-[10px] tracking-[0.3em] uppercase text-gold-dim font-mono mb-2"
                    >
                      Phone <span className="text-muted/40">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="survey-phone"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm((f) => ({ ...f, phone: e.target.value }))}
                      className="w-full bg-transparent border-b border-gold/15 pb-3 text-sm text-foreground outline-none focus:border-gold/50 transition-colors placeholder:text-muted/30 rounded-none"
                      placeholder="(555) 000-0000"
                    />
                  </div>
                </div>

                <button
                  onClick={submitContact}
                  disabled={!contactForm.name.trim() || !contactForm.email.trim()}
                  className="mt-8 border border-gold/30 px-9 py-4 text-[11px] tracking-[0.25em] uppercase text-gold hover:bg-gold hover:text-background transition-all duration-400 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gold"
                >
                  Submit Brief
                </button>
              </div>
            )}

            {/* Back button */}
            {step > 0 && (
              <button
                onClick={goBack}
                className="mt-8 text-[10px] tracking-[0.2em] uppercase text-muted hover:text-gold transition-colors duration-300 font-mono"
              >
                &larr; Back
              </button>
            )}
          </div>
        ) : (
          /* Submitted state */
          <div
            className="text-center"
            style={{
              animation: "surveySlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
            }}
          >
            {/* Success circle */}
            <div
              className="mx-auto w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center mb-8"
              style={{
                boxShadow: "0 4px 20px rgba(200,168,78,0.1), inset 0 1px 2px rgba(255,255,255,0.05)",
                animation: "surveyCheckIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M4 10L8.5 14.5L16 5.5"
                  stroke="var(--gold)"
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
                if (key === "contact") {
                  return (
                    <div key={key} className="flex items-center justify-center gap-3">
                      <span className="text-[9px] tracking-wider uppercase text-muted font-mono">04</span>
                      <span className="text-sm text-gold/70 font-light">{contactForm.name}</span>
                    </div>
                  );
                }
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
                setSelected(null);
                setContactForm({ name: "", email: "", phone: "" });
              }}
              className="mt-10 border border-gold/25 px-7 py-3 text-[10px] tracking-[0.2em] uppercase text-gold hover:bg-gold/10 transition-all duration-300 rounded-xl"
            >
              Start Over
            </button>
          </div>
        )}
      </div>

      {/* Survey animations */}
      <style jsx>{`
        @keyframes surveySlideIn {
          from {
            opacity: 0;
            transform: translateX(24px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes surveySlideBack {
          from {
            opacity: 0;
            transform: translateX(-24px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes surveyOptionIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes surveyCheckIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </Wrapper>
  );
}
