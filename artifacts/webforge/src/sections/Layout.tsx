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

/* Blinking terminal cursor */
function Cursor() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn((v) => !v), 530);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      style={{
        display: "inline-block",
        width: 2,
        height: "1em",
        background: on ? "#00E5FF" : "transparent",
        marginLeft: 3,
        verticalAlign: "middle",
        transition: "background 0.1s",
      }}
    />
  );
}

/* Animated scan line that travels across the bottom border */
function ScanLine() {
  return (
    <div style={{ position: "relative", height: 1, overflow: "hidden" }}>
      {/* Static dim base */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,229,255,0.12)",
        }}
      />
      {/* Moving glow */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          width: 180,
          height: 1,
          background:
            "linear-gradient(to right, transparent, #00E5FF 40%, #00E5FF 60%, transparent)",
          filter: "blur(1px)",
        }}
        animate={{ x: ["-180px", "100vw"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
      />
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const collapsed = scrolled && !hovered;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* 2px top accent line */}
      <div
        style={{
          height: 2,
          background:
            "linear-gradient(to right, transparent 0%, #00E5FF 25%, rgba(0,229,255,0.4) 50%, #00E5FF 75%, transparent 100%)",
        }}
      />

      {/* Main bar */}
      <div
        style={{
          background: "rgba(8,8,8,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,229,255,0.1)",
        }}
      >
        <div
          className="relative mx-auto flex items-center justify-between"
          style={{ maxWidth: 1200, height: 64, padding: "0 28px" }}
        >

          {/* Left accent stripe */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "20%",
              bottom: "20%",
              width: 3,
              background: "#00E5FF",
              boxShadow: "0 0 8px rgba(0,229,255,0.8)",
              borderRadius: 2,
            }}
          />

          {/* ── Logo ── */}
          <a
            href="#"
            className="flex items-center gap-2 shrink-0 pl-3"
            data-testid="link-logo"
          >
            <span
              className="font-mono font-bold"
              style={{ color: "#00E5FF", fontSize: 15, letterSpacing: "0.05em" }}
            >
              //
            </span>
            <span
              className="font-bold text-white"
              style={{ fontSize: 20, letterSpacing: "0.22em" }}
            >
              WEBFORGE
            </span>
            <Cursor />
          </a>

          {/* ── Center nav ── */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            data-testid="nav-engine"
          >
            <AnimatePresence mode="wait" initial={false}>
              {!collapsed ? (
                <motion.div
                  key="links"
                  className="flex items-center"
                  style={{ gap: 4 }}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={spring}
                >
                  {NAV_LINKS.map((link, i) => (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      className="relative px-4 py-1 text-xs font-semibold tracking-widest uppercase transition-colors"
                      style={{
                        color:
                          activeLink === link.href
                            ? "#00E5FF"
                            : "rgba(255,255,255,0.5)",
                      }}
                      data-testid={`link-nav-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#ffffff";
                        setActiveLink(link.href);
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                        setActiveLink(null);
                      }}
                      onClick={() => setActiveLink(link.href)}
                    >
                      {link.label}
                      {/* Underline */}
                      <motion.span
                        style={{
                          position: "absolute",
                          bottom: -1,
                          left: "50%",
                          x: "-50%",
                          height: 1,
                          background: "#00E5FF",
                          boxShadow: "0 0 4px #00E5FF",
                        }}
                        initial={{ width: 0 }}
                        whileHover={{ width: "80%" }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.a>
                  ))}
                </motion.div>
              ) : (
                <motion.button
                  key="rhombus"
                  className="flex items-center justify-center cursor-pointer"
                  style={{
                    width: 30,
                    height: 30,
                    background: "rgba(0,229,255,0.07)",
                    border: "1px solid rgba(0,229,255,0.55)",
                    boxShadow: "0 0 10px rgba(0,229,255,0.25)",
                    transform: "rotate(45deg)",
                  }}
                  initial={{ opacity: 0, scale: 0.3, rotate: 0 }}
                  animate={{ opacity: 1, scale: 1, rotate: 45 }}
                  exit={{ opacity: 0, scale: 0.3, rotate: 0 }}
                  transition={spring}
                  data-testid="button-nav-collapse"
                  aria-label="Expand navigation"
                >
                  <span style={{ transform: "rotate(-45deg)", display: "flex" }}>
                    <ChevronDown size={13} color="#00E5FF" strokeWidth={2.5} />
                  </span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* ── CTA ── */}
          <div className="shrink-0" data-testid="nav-cta">
            <a
              href="#contact"
              className="inline-flex items-center px-5 py-2 text-[11px] font-bold tracking-[0.18em] uppercase transition-all"
              style={{
                color: "#0A0A0A",
                background: "#00E5FF",
                letterSpacing: "0.15em",
                boxShadow: "0 0 0px rgba(0,229,255,0)",
                transition: "box-shadow 0.2s, transform 0.1s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 18px rgba(0,229,255,0.55)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 0 0px rgba(0,229,255,0)";
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(0.97)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
              data-testid="link-cta"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>

      {/* Animated scan line at the bottom */}
      <ScanLine />
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
