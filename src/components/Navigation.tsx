"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/process", label: "Process" },
  { href: "/contact", label: "Contact" },
];

export function Navigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Morphing indicator state
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navContainerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const activeIndex = navLinks.findIndex((link) => link.href === pathname);

  // Measure and position the morphing indicator
  const updateIndicator = useCallback(() => {
    const idx = activeIndex >= 0 ? activeIndex : 0;
    const el = linkRefs.current[idx];
    const container = navContainerRef.current;
    if (!el || !container) return;

    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    setIndicatorStyle({
      left: elRect.left - containerRect.left,
      width: elRect.width,
      opacity: 1,
    });
  }, [activeIndex]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(updateIndicator);
    }
  }, [updateIndicator]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="North Track Studios"
            width={120}
            height={80}
            className="select-none"
            priority
          />
        </Link>

        {/* ─── Desktop Banner ─── */}
        <div
          className="hidden lg:block relative ml-auto"
          style={{
            padding: "4px",
            background: "linear-gradient(180deg, rgba(22,21,28,0.85) 0%, rgba(14,13,18,0.9) 100%)",
            border: "1px solid rgba(200,168,78,0.1)",
            borderRadius: "2px",
            boxShadow: scrolled
              ? "0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)"
              : "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
            transition: "box-shadow 0.5s ease",
          }}
        >
          {/* Top metallic edge */}
          <div
            className="absolute top-0 left-6 right-6 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(200,168,78,0.18), transparent)" }}
          />
          {/* Bottom metallic edge */}
          <div
            className="absolute bottom-0 left-6 right-6 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(200,168,78,0.1), transparent)" }}
          />

          <div ref={navContainerRef} className="relative flex items-center">
            {/* Morphing active indicator */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                top: "0px",
                bottom: "0px",
                opacity: indicatorStyle.opacity,
                transition: "left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
                border: "1px solid rgba(200,168,78,0.25)",
                borderRadius: "1px",
                background: "linear-gradient(180deg, rgba(200,168,78,0.07) 0%, rgba(200,168,78,0.02) 100%)",
                boxShadow: "0 0 16px rgba(200,168,78,0.04)",
              }}
            >
              {/* Gold accent line under active tab */}
              <div
                className="absolute -bottom-[5px] left-[20%] right-[20%] h-px"
                style={{
                  background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
                  opacity: 0.5,
                }}
              />
            </div>

            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                ref={(el) => { linkRefs.current[i] = el; }}
                className={`relative px-4 py-3 text-[10px] tracking-[0.2em] uppercase font-mono transition-colors duration-300 whitespace-nowrap select-none ${
                  pathname === link.href
                    ? "text-gold"
                    : "text-muted-light/60 hover:text-gold/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-3"
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gold/[0.06] bg-[#070709]/95 backdrop-blur-xl">
          <div className="flex flex-col px-6 py-8 gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm tracking-[0.2em] uppercase transition-colors py-1 ${
                  pathname === link.href
                    ? "text-gold"
                    : "text-muted-light hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
