import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { label: "What We Do", href: "#what-we-do" },
  { label: "The Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

const spring = { type: "spring", stiffness: 300, damping: 30 };

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const collapsed = scrolled && !hovered;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(10,10,10,0.60)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Main chassis row */}
      <div className="relative container mx-auto px-6 h-20 flex items-center justify-between">

        {/* Static Chassis — Left: Logo */}
        <a
          href="#"
          className="flex items-center text-xl font-bold tracking-widest text-white shrink-0 z-10"
          data-testid="link-logo"
        >
          <span className="text-primary mr-2 font-mono">//</span> WEBFORGE
        </a>

        {/* Dynamic Core — absolutely centered Engine */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-label="Center navigation"
        >
          <div
            className="pointer-events-auto"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            data-testid="nav-engine"
          >
            <AnimatePresence mode="wait" initial={false}>
              {!collapsed ? (
                /* State A — Expanded links */
                <motion.div
                  key="links"
                  className="flex items-center gap-8"
                  initial={{ opacity: 0, scaleX: 0.5, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scaleX: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scaleX: 0.5, filter: "blur(4px)" }}
                  transition={spring}
                  style={{ originX: 0.5 }}
                >
                  {NAV_LINKS.map((link, i) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                      data-testid={`link-nav-${i}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...spring, delay: i * 0.04 }}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </motion.div>
              ) : (
                /* State B — Collapsed rhombus */
                <motion.div
                  key="rhombus"
                  className="flex items-center justify-center cursor-pointer"
                  style={{
                    width: 36,
                    height: 36,
                    border: "1.5px solid #00E5FF",
                    boxShadow: "0 0 8px rgba(0,229,255,0.35)",
                    rotate: 45,
                    background: "rgba(0,229,255,0.06)",
                  }}
                  initial={{ opacity: 0, scale: 0.3, rotate: 0 }}
                  animate={{ opacity: 1, scale: 1, rotate: 45 }}
                  exit={{ opacity: 0, scale: 0.3, rotate: 0 }}
                  transition={spring}
                  data-testid="button-nav-rhombus"
                  aria-label="Expand navigation"
                >
                  {/* Counter-rotate the chevron so it stays upright */}
                  <motion.span
                    style={{ rotate: -45, display: "flex", alignItems: "center" }}
                  >
                    <ChevronDown size={14} color="#00E5FF" />
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Static Chassis — Right: CTA */}
        <div className="shrink-0 z-10" data-testid="nav-cta">
          <a href="#contact" className="btn-primary py-2 px-4 text-sm">
            Get Started
          </a>
        </div>
      </div>

      {/* Permanent neon-cyan base line — full width */}
      <div
        style={{
          height: 2,
          background:
            "linear-gradient(to right, transparent 0%, #00E5FF 30%, #00E5FF 70%, transparent 100%)",
          opacity: 0.5,
          boxShadow: "0 0 6px rgba(0,229,255,0.4)",
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
          // SYSTEM: WEBFORGE_CORE // {new Date().getFullYear()} // ALL RIGHTS RESERVED
        </div>
      </div>
    </footer>
  );
}
