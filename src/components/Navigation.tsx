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
  const [bannerVisible, setBannerVisible] = useState(true);
  const lastScrollY = useRef(0);

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

  // Re-measure after fonts load
  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(updateIndicator);
    }
  }, [updateIndicator]);

  // Scroll: shrink header + hide banner on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);

      if (y > 300) {
        setBannerVisible(y < lastScrollY.current);
      } else {
        setBannerVisible(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ─── Top bar: logo + CTA ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-gold/[0.08] bg-[#070709]/90 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo.png"
              alt="North Track Studios"
              width={140}
              height={93}
              className="select-none"
              priority
            />
          </Link>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center">
            <Link
              href="/contact"
              className="border border-gold/25 px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase text-gold hover:bg-gold/10 transition-all duration-300"
            >
              Start a Project
            </Link>
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

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gold/[0.06] bg-[#070709]/95 backdrop-blur-xl">
            <div className="flex flex-col px-6 py-8 gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm tracking-[0.2em] uppercase transition-colors ${
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

      {/* ─── Floating Banner Bar ─── */}
      <div
        className="hidden lg:flex fixed left-1/2 z-40 justify-center"
        style={{
          top: scrolled ? "72px" : "80px",
          transform: `translateX(-50%) translateY(${bannerVisible ? "0" : "-140%"})`,
          transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), top 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          className="relative px-3 py-1.5"
          style={{
            background: "linear-gradient(180deg, rgba(22,21,28,0.94) 0%, rgba(14,13,18,0.96) 100%)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(200,168,78,0.1)",
            borderRadius: "2px",
            boxShadow: `
              0 8px 32px rgba(0,0,0,0.6),
              0 2px 8px rgba(0,0,0,0.4),
              inset 0 1px 0 rgba(255,255,255,0.04),
              inset 0 -1px 0 rgba(0,0,0,0.3)
            `,
          }}
        >
          {/* Top metallic edge */}
          <div
            className="absolute top-0 left-4 right-4 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(200,168,78,0.2), transparent)",
            }}
          />
          {/* Bottom metallic edge */}
          <div
            className="absolute bottom-0 left-4 right-4 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(200,168,78,0.12), transparent)",
            }}
          />

          {/* Nav links with morphing indicator */}
          <div ref={navContainerRef} className="relative flex items-center gap-1">
            {/* Morphing active indicator */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                top: "0px",
                bottom: "0px",
                opacity: indicatorStyle.opacity,
                transition: "left 0.4s cubic-bezier(0.16, 1, 0.3, 1), width 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
                border: "1px solid rgba(200,168,78,0.3)",
                borderRadius: "1px",
                background: "linear-gradient(180deg, rgba(200,168,78,0.06) 0%, rgba(200,168,78,0.02) 100%)",
                boxShadow: "0 0 12px rgba(200,168,78,0.05), inset 0 1px 0 rgba(255,255,255,0.03)",
              }}
            >
              {/* Gold accent line under active tab */}
              <div
                className="absolute -bottom-px left-[25%] right-[25%] h-px"
                style={{
                  background: "linear-gradient(90deg, transparent, var(--gold), transparent)",
                  opacity: 0.6,
                }}
              />
            </div>

            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                ref={(el) => { linkRefs.current[i] = el; }}
                className={`relative px-5 py-2.5 text-[10px] tracking-[0.25em] uppercase font-mono transition-colors duration-300 whitespace-nowrap ${
                  pathname === link.href
                    ? "text-gold"
                    : "text-muted-light/70 hover:text-gold/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
