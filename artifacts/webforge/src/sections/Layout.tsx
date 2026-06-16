import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { label: "What We Do", href: "#what-we-do" },
  { label: "The Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

const spring = { type: "spring", stiffness: 320, damping: 28 };

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const expanded = !scrolled || hovered;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(12,12,12,0.55)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
      }}
    >
      <div className="relative container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo — never changes */}
        <a
          href="#"
          className="flex items-center text-xl font-bold tracking-widest text-white shrink-0"
          data-testid="link-logo"
        >
          <span className="text-primary mr-2 font-mono">//</span> WEBFORGE
        </a>

        {/* Kinetic center nav */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{ minWidth: 220 }}
          data-testid="nav-center"
        >
          <AnimatePresence mode="wait" initial={false}>
            {expanded ? (
              <motion.div
                key="links"
                className="flex items-center gap-8"
                initial={{ opacity: 0, scaleX: 0.6 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0.6 }}
                transition={spring}
                style={{ originX: 0.5 }}
              >
                {NAV_LINKS.map((link) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                    data-testid={`link-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ ...spring, delay: 0.03 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </motion.div>
            ) : (
              <motion.button
                key="arrow"
                className="flex items-center justify-center w-9 h-9 rounded-sm border border-[#2A2A2A] text-primary hover:border-primary transition-colors"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={spring}
                aria-label="Expand navigation"
                data-testid="button-nav-expand"
              >
                <ChevronDown size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* CTA — never changes */}
        <div className="shrink-0" data-testid="nav-cta">
          <a href="#contact" className="btn-primary py-2 px-4 text-sm">
            Get Started
          </a>
        </div>
      </div>

      {/* Neon underline — fades at edges */}
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(to right, transparent 0%, #00E5FF 40%, #00E5FF 60%, transparent 100%)",
          opacity: 0.35,
        }}
      />
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-background py-12 border-t border-border text-center">
      <div className="container mx-auto px-6">
        <div className="text-2xl font-bold tracking-widest text-white mb-2">
          WEBFORGE
        </div>
        <p className="text-muted-foreground text-sm mb-8">
          High-performance digital infrastructure for local businesses.
        </p>
        <div className="font-mono text-xs text-muted-foreground/50">
          // SYSTEM: WEBFORGE_CORE // {new Date().getFullYear()} // ALL RIGHTS
          RESERVED
        </div>
      </div>
    </footer>
  );
}
