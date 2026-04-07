"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Style definitions ──────────────────────────────────────────────

interface StyleOption {
  name: string;
  label: string;
  icon: React.ReactNode;
}

const styles: StyleOption[] = [
  {
    name: "plain",
    label: "Plain",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="1" width="12" height="12" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    name: "liquid-glass",
    label: "Liquid Glass",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1C7 1 2 6.5 2 9C2 11.5 4.2 13 7 13C9.8 13 12 11.5 12 9C12 6.5 7 1 7 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M4.5 9.5C4.5 8 7 4 7 4" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
  },
  {
    name: "claymorphism",
    label: "Claymorphism",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
      </svg>
    ),
  },
  {
    name: "minimalism",
    label: "Minimalism",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    name: "skeuomorphism",
    label: "Skeuomorphism",
    icon: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        <circle cx="7" cy="7" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
];

// ─── Apply style to DOM ─────────────────────────────────────────────

function applyStyle(styleName: string) {
  document.documentElement.setAttribute("data-style", styleName);
}

// ─── Main component ─────────────────────────────────────────────────

export function StyleSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState("plain");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Apply on mount
  useEffect(() => {
    applyStyle(current);
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const handleSelect = useCallback(
    (style: StyleOption) => {
      if (style.name === current) {
        setIsOpen(false);
        return;
      }

      applyStyle(style.name);
      setCurrent(style.name);
      setIsOpen(false);
    },
    [current]
  );

  const currentStyle = styles.find((s) => s.name === current)!;

  return (
    <div className="fixed bottom-[88px] right-6" style={{ zIndex: 9999 }}>
      {/* Picker panel */}
      <div
        ref={panelRef}
        className="absolute bottom-16 right-0 overflow-hidden"
        style={{
          width: isOpen ? "200px" : "0px",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0) scale(1)" : "translateY(8px) scale(0.95)",
          transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <div className="border border-[var(--gold)]/20 bg-[#0f0e12]/95 backdrop-blur-xl rounded-lg p-3 flex flex-col gap-1">
          <span
            className="text-[9px] tracking-[0.4em] uppercase font-mono px-2 pt-1 pb-1.5"
            style={{ color: "var(--gold-dim)" }}
          >
            Style
          </span>
          {styles.map((style) => {
            const isActive = style.name === current;
            return (
              <button
                key={style.name}
                onClick={() => handleSelect(style)}
                className="flex items-center gap-3 px-2 py-2 rounded-md transition-all duration-300 group"
                style={{
                  background: isActive ? "rgba(255,255,255,0.05)" : "transparent",
                }}
              >
                {/* Icon */}
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-all duration-300 border"
                  style={{
                    color: isActive ? "var(--gold)" : "#8e8a9e",
                    borderColor: isActive ? "var(--gold)" : "rgba(255,255,255,0.06)",
                    background: isActive ? "rgba(var(--glow-r), var(--glow-g), var(--glow-b), 0.1)" : "transparent",
                  }}
                >
                  {style.icon}
                </div>
                {/* Label */}
                <span
                  className="text-xs tracking-wider font-light transition-colors duration-300"
                  style={{
                    color: isActive ? "var(--gold)" : "#8e8a9e",
                  }}
                >
                  {style.label}
                </span>
                {/* Active indicator */}
                {isActive && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--gold)" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggle button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 group border"
        style={{
          background: "rgba(15, 14, 18, 0.9)",
          borderColor: isOpen ? "var(--gold)" : "rgba(var(--glow-r), var(--glow-g), var(--glow-b), 0.25)",
          boxShadow: isOpen
            ? "0 0 20px rgba(var(--glow-r), var(--glow-g), var(--glow-b), 0.3)"
            : "0 0 8px rgba(var(--glow-r), var(--glow-g), var(--glow-b), 0.15)",
        }}
        aria-label="Change design style"
      >
        {/* Layers icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          style={{ color: "var(--gold)" }}
          className="transition-transform duration-500"
        >
          <path
            d="M12 2L2 7L12 12L22 7L12 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity="0.6"
          />
          <path
            d="M2 17L12 22L22 17"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity="0.3"
          />
        </svg>
      </button>
    </div>
  );
}
