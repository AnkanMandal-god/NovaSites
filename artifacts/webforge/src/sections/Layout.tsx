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
const SKEW = -10;

/* Glassmorphic gradient-bordered parallelogram pill */
function Pill({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        transform: `skewX(${SKEW}deg)`,
        /* gradient border via background + 1px padding */
        background:
          "linear-gradient(135deg, rgba(0,229,255,0.55) 0%, rgba(0,229,255,0.08) 45%, rgba(0,229,255,0.45) 100%)",
        padding: "1px",
        borderRadius: "3px",
        ...style,
      }}
    >
      <div
        className={`flex items-center ${className}`}
        style={{
          transform: `skewX(${-SKEW}deg)`,
          background: "rgba(8,8,8,0.72)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderRadius: "2px",
          height: "38px",
          padding: "0 18px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

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
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8"
      style={{ height: "60px", pointerEvents: "none" }}
    >
      {/* ── Left Pill: Logo ── */}
      <div style={{ pointerEvents: "auto" }}>
        <Pill>
          <a
            href="#"
            className="flex items-center text-sm font-bold tracking-widest text-white whitespace-nowrap"
            data-testid="link-logo"
          >
            <span className="text-primary mr-1.5 font-mono text-xs">//</span>
            WEBFORGE
          </a>
        </Pill>
      </div>

      {/* ── Center Pill: Kinetic Engine ── */}
      <div
        style={{ pointerEvents: "auto" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-testid="nav-engine"
      >
        <AnimatePresence mode="wait" initial={false}>
          {!collapsed ? (
            /* Expanded: nav links inside pill */
            <motion.div
              key="links"
              initial={{ opacity: 0, scaleX: 0.4 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0.4 }}
              transition={spring}
              style={{ originX: 0.5 }}
            >
              <Pill>
                <div className="flex items-center gap-7">
                  {NAV_LINKS.map((link, i) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
                      data-testid={`link-nav-${i}`}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...spring, delay: i * 0.04 }}
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </div>
              </Pill>
            </motion.div>
          ) : (
            /* Collapsed: standalone rhombus diamond */
            <motion.div
              key="rhombus"
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: 34,
                height: 34,
                border: "1.5px solid #00E5FF",
                boxShadow: "0 0 10px rgba(0,229,255,0.4), inset 0 0 6px rgba(0,229,255,0.05)",
                transform: "rotate(45deg)",
                background: "rgba(0,229,255,0.07)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
              }}
              initial={{ opacity: 0, scale: 0.2, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 45 }}
              exit={{ opacity: 0, scale: 0.2, rotate: 0 }}
              transition={spring}
              data-testid="button-nav-rhombus"
              aria-label="Expand navigation"
            >
              {/* Counter-rotate chevron so it stays upright */}
              <span style={{ transform: "rotate(-45deg)", display: "flex" }}>
                <ChevronDown size={13} color="#00E5FF" strokeWidth={2.5} />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Right Pill: CTA ── */}
      <div style={{ pointerEvents: "auto" }}>
        <Pill
          style={{
            background:
              "linear-gradient(135deg, rgba(0,229,255,0.9) 0%, rgba(0,229,255,0.4) 50%, rgba(0,229,255,0.85) 100%)",
          }}
        >
          <a
            href="#contact"
            className="text-xs font-bold tracking-wide whitespace-nowrap"
            style={{ color: "#0A0A0A" }}
            data-testid="link-cta"
          >
            Get Started
          </a>
        </Pill>
      </div>
    </div>
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
