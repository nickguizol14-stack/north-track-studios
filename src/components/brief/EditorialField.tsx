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
