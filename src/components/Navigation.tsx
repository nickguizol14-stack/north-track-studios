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
            padding: "5px",
            background: "linear-gradient(170deg, rgba(28,27,34,0.92) 0%, rgba(18,17,24,0.95) 40%, rgba(14,13,18,0.92) 100%)",
            border: "1px solid rgba(200,168,78,0.08)",
            borderRadius: "14px",
            boxShadow: [
              // Outer depth — dark drop shadow for 3D lift
              "0 6px 24px rgba(0,0,0,0.55)",
              "0 2px 8px rgba(0,0,0,0.4)",
              // Bottom edge shadow for clay thickness
              "0 3px 1px rgba(0,0,0,0.3)",
              // Inner top highlight — lit from above
              "inset 0 1px 1px rgba(255,255,255,0.06)",
              // Inner bottom shadow — concave depth
              "inset 0 -1px 2px rgba(0,0,0,0.25)",
              // Subtle inner side highlights
              "inset 1px 0 1px rgba(255,255,255,0.02)",
              "inset -1px 0 1px rgba(255,255,255,0.02)",
            ].join(", "),
            transition: "box-shadow 0.5s ease, transform 0.5s ease",
            transform: scrolled ? "translateY(0)" : "translateY(0)",
          }}
        >
          {/* Top rim highlight — rounded to match border */}
          <div
            className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden"
            style={{ borderRadius: "14px 14px 0 0" }}
          >
            <div
              className="h-full mx-8"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)" }}
            />
          </div>

          <div ref={navContainerRef} className="relative flex items-center">
            {/* Morphing active indicator — clay pill */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                top: "1px",
                bottom: "1px",
                opacity: indicatorStyle.opacity,
                transition: [
                  "left 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  "opacity 0.3s ease",
                ].join(", "),
                borderRadius: "10px",
                background: "linear-gradient(170deg, rgba(200,168,78,0.1) 0%, rgba(200,168,78,0.04) 60%, rgba(200,168,78,0.02) 100%)",
                border: "1px solid rgba(200,168,78,0.18)",
                boxShadow: [
                  // Outer glow
                  "0 2px 10px rgba(200,168,78,0.06)",
                  // Depth — pressed into the banner surface
                  "0 1px 3px rgba(0,0,0,0.3)",
                  // Inner top light
                  "inset 0 1px 1px rgba(255,255,255,0.05)",
                  // Inner bottom depth
                  "inset 0 -1px 1px rgba(0,0,0,0.15)",
                ].join(", "),
              }}
            >
              {/* Gold accent glow under active pill */}
              <div
                className="absolute -bottom-[4px] left-[25%] right-[25%] h-[2px]"
                style={{
                  background: "radial-gradient(ellipse at center, var(--gold) 0%, transparent 70%)",
                  opacity: 0.35,
                  filter: "blur(1px)",
                  borderRadius: "1px",
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
