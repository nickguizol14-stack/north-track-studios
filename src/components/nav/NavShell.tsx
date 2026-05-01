import Link from "next/link";
import { WordmarkMini } from "@/components/intro/WordmarkMini";

export interface NavShellProps {
  /** Whether the nav is visible (driven by intro handoff). */
  show: boolean;
}

const links = [
  { href: "/about", label: "About" },
  { href: "/capabilities", label: "Capabilities" },
  { href: "/work", label: "Work" },
  { href: "/process", label: "Process" },
  { href: "/contact", label: "Contact" },
];

export function NavShell({ show }: NavShellProps) {
  return (
    <nav
      className="nav-shell"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        zIndex: 100,
        pointerEvents: show ? "auto" : "none",
        padding: "18px 32px 0",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        opacity: show ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      <Link href="/" aria-label="NorthTrack Studios home" style={{ textDecoration: "none" }}>
        <WordmarkMini />
      </Link>

      <div
        style={{
          display: "flex",
          gap: 28,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
        }}
      >
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            style={{
              color: "var(--color-text-muted)",
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 32,
          right: 32,
          bottom: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(200, 168, 78, 0.3), transparent)",
        }}
        aria-hidden
      />
    </nav>
  );
}
