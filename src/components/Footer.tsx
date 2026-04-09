import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "/capabilities", label: "Capabilities" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/process", label: "Process" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-gold/[0.06] bg-[#070709]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-5">
              <Image
                src="/logo.png"
                alt="North Track Studios"
                width={120}
                height={80}
                className="select-none"
              />
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-md font-light">
              An AI-native technology studio engineering intelligent systems at
              the intersection of design and precision. We don&apos;t follow the
              map — we draw it.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[9px] tracking-[0.4em] uppercase text-gold-dim font-mono mb-5">
              Navigate
            </h4>
            <div className="flex flex-col gap-3">
              {footerLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-muted hover:text-gold transition-colors font-light"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-[9px] tracking-[0.4em] uppercase text-gold-dim font-mono mb-5">
              Connect
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@northtrackstudios.com"
                className="text-sm text-muted hover:text-gold transition-colors font-light"
              >
                hello@northtrackstudios.com
              </a>
              <span className="text-sm text-muted font-light">GitHub</span>
              <span className="text-sm text-muted font-light">LinkedIn</span>
              <span className="text-sm text-muted font-light">X / Twitter</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="painted-divider mt-14 mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-muted/60 font-mono">
            &copy; {new Date().getFullYear()} North Track Studios. All rights
            reserved.
          </p>
          <p className="text-[11px] text-muted/30 font-mono tracking-widest">
            40.7128&deg; N &middot; 74.0060&deg; W
          </p>
        </div>
      </div>
    </footer>
  );
}
