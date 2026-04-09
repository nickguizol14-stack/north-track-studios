"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const navLinks = [
  { href: "#capabilities", label: "Capabilities" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#process", label: "Process" },
  { href: "/brief", label: "Vision" },
  { href: "#contact", label: "Contact" },
];

const sections = [
  { id: "capabilities", label: "Capabilities" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
];

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const prevSection = useRef("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);

      // Track active section
      const scrollY = window.scrollY + window.innerHeight * 0.35;
      let current = "";
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= scrollY) {
          current = section.label;
        }
      }
      if (current !== prevSection.current) {
        prevSection.current = current;
        setActiveSection(current);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-gold/[0.08] bg-[#070709]/90 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center group">
          <Image
            src="/logo.png"
            alt="North Track Studios"
            width={150}
            height={86}
            className="select-none"
            priority
          />
        </a>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] tracking-[0.2em] uppercase text-muted-light hover:text-gold transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="ml-4 border border-gold/25 px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase text-gold hover:bg-gold/10 transition-all duration-300"
          >
            Start a Project
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block h-px w-6 bg-gold transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-[3.5px]" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-gold transition-all duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-px w-6 bg-gold transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""
            }`}
          />
        </button>
      </div>

      {/* 3D Section Banner — top right */}
      <div
        className="hidden lg:block fixed z-40"
        style={{
          top: "80px",
          right: "32px",
          perspective: "600px",
        }}
      >
        <div
          style={{
            transform: "rotateY(-8deg) rotateX(2deg)",
            transformOrigin: "right center",
            transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            opacity: activeSection ? 1 : 0,
          }}
        >
          <div
            className="relative px-6 py-2.5 border border-gold/20"
            style={{
              background: "linear-gradient(135deg, rgba(15,14,18,0.92) 0%, rgba(18,17,26,0.95) 50%, rgba(12,11,14,0.92) 100%)",
              backdropFilter: "blur(12px)",
              boxShadow: `
                0 4px 20px rgba(0,0,0,0.5),
                0 1px 0 rgba(200,168,78,0.08) inset,
                0 -1px 0 rgba(0,0,0,0.3) inset
              `,
            }}
          >
            {/* Top edge highlight */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{
                background: "linear-gradient(90deg, transparent, var(--gold-dim), transparent)",
              }}
            />
            {/* Bottom gold accent line */}
            <div
              className="absolute bottom-0 left-[20%] right-[20%] h-px"
              style={{
                background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
                opacity: 0.5,
              }}
            />

            <span
              className="text-[9px] tracking-[0.5em] uppercase font-mono"
              style={{
                background: "linear-gradient(135deg, var(--gold-dim) 0%, var(--gold) 50%, var(--gold-dim) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {activeSection}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gold/[0.06] bg-[#070709]/95 backdrop-blur-xl">
          <div className="flex flex-col px-6 py-8 gap-5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm tracking-[0.2em] uppercase text-muted-light hover:text-gold transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
