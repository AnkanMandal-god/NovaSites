import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { label: "What We Do", href: "#what-we-do" },
  { label: "The Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

/* Blinking cursor */
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
        height: "0.85em",
        background: on ? "#00E5FF" : "transparent",
        marginLeft: 3,
        verticalAlign: "middle",
      }}
    />
  );
}

/* Animated bottom scan line */
function ScanLine() {
  return (
    <div style={{ position: "relative", height: 1, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,229,255,0.1)" }} />
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          width: 160,
          height: 1,
          background: "linear-gradient(to right, transparent, #00E5FF 45%, #00E5FF 55%, transparent)",
        }}
        animate={{ x: ["-160px", "100vw"] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 0.8 }}
      />
    </div>
  );
}

/* Magnetic nav link — pulls toward cursor, springs back */
function MagneticLink({
  href,
  label,
  index,
}: {
  href: string;
  label: string;
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 380, damping: 22 });
  const y = useSpring(rawY, { stiffness: 380, damping: 22 });
  const [lit, setLit] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    rawX.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    rawY.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };
  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
    setLit(false);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      className="relative px-4 py-1 text-[11px] font-semibold tracking-widest uppercase select-none cursor-pointer"
      style={{
        color: lit ? "#ffffff" : "rgba(255,255,255,0.48)",
        x,
        y,
      }}
      data-testid={`link-nav-${index}`}
      onMouseMove={onMove}
      onMouseEnter={() => setLit(true)}
      onMouseLeave={onLeave}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      {label}
      {/* Cyan underline slides in */}
      <motion.span
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          translateX: "-50%",
          height: 1,
          background: "#00E5FF",
          boxShadow: "0 0 4px #00E5FF",
        }}
        initial={{ width: 0 }}
        animate={{ width: lit ? "70%" : 0 }}
        transition={{ duration: 0.18 }}
      />
    </motion.a>
  );
}

/* Creative CTA: bracket-corner button with fill-sweep */
function CtaButton() {
  const [hov, setHov] = useState(false);

  return (
    <a
      href="#contact"
      data-testid="link-cta"
      className="relative inline-flex items-center gap-2 select-none cursor-pointer"
      style={{
        padding: "7px 18px",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: hov ? "#0A0A0A" : "#00E5FF",
        border: "1px solid rgba(0,229,255,0.55)",
        background: "transparent",
        overflow: "hidden",
        transition: "color 0.22s",
        userSelect: "none",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onMouseDown={(e) =>
        ((e.currentTarget as HTMLElement).style.transform = "scale(0.96)")
      }
      onMouseUp={(e) =>
        ((e.currentTarget as HTMLElement).style.transform = "scale(1)")
      }
    >
      {/* Sweep fill */}
      <motion.span
        style={{
          position: "absolute",
          inset: 0,
          background: "#00E5FF",
          originX: 0,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hov ? 1 : 0 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
      />

      {/* Corner brackets — TL */}
      <span
        style={{
          position: "absolute",
          top: 3,
          left: 3,
          width: 7,
          height: 7,
          borderTop: "1.5px solid #00E5FF",
          borderLeft: "1.5px solid #00E5FF",
          zIndex: 2,
          opacity: hov ? 0 : 1,
          transition: "opacity 0.15s",
        }}
      />
      {/* BR */}
      <span
        style={{
          position: "absolute",
          bottom: 3,
          right: 3,
          width: 7,
          height: 7,
          borderBottom: "1.5px solid #00E5FF",
          borderRight: "1.5px solid #00E5FF",
          zIndex: 2,
          opacity: hov ? 0 : 1,
          transition: "opacity 0.15s",
        }}
      />

      {/* Text */}
      <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: "monospace", opacity: hov ? 1 : 0.5, transition: "opacity 0.2s" }}>{">"}</span>
        {hov ? "INITIALIZE" : "GET STARTED"}
      </span>
    </a>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [arrowHovered, setArrowHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navVisible = !scrolled || arrowHovered;

  return (
    <>
      {/* ── Full navbar — slides up when scrolled ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50"
        animate={{
          y: navVisible ? 0 : "-100%",
          opacity: navVisible ? 1 : 0,
        }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Top accent line */}
        <div
          style={{
            height: 2,
            background:
              "linear-gradient(to right, transparent 0%, #00E5FF 25%, rgba(0,229,255,0.35) 50%, #00E5FF 75%, transparent 100%)",
          }}
        />

        {/* Bar */}
        <div
          style={{
            background: "rgba(8,8,8,0.90)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(0,229,255,0.08)",
          }}
        >
          <div
            className="relative mx-auto flex items-center justify-between"
            style={{ maxWidth: 1200, height: 60, padding: "0 28px" }}
          >
            {/* Left stripe */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "22%",
                bottom: "22%",
                width: 3,
                background: "#00E5FF",
                boxShadow: "0 0 8px rgba(0,229,255,0.8)",
                borderRadius: 2,
              }}
            />

            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-2 shrink-0 pl-3"
              data-testid="link-logo"
            >
              <span className="font-mono font-bold" style={{ color: "#00E5FF", fontSize: 14 }}>
                //
              </span>
              <span className="font-bold text-white" style={{ fontSize: 20, letterSpacing: "0.22em" }}>
                WEBFORGE
              </span>
              <Cursor />
            </a>

            {/* Center nav */}
            <div
              className="absolute left-1/2 -translate-x-1/2 flex items-center"
            >
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {NAV_LINKS.map((link, i) => (
                  <div key={link.href} className="flex items-center">
                    {/* Vertical divider before each link (except first) */}
                    {i > 0 && (
                      <span
                        style={{
                          display: "inline-block",
                          width: 1,
                          height: 12,
                          background: "rgba(0,229,255,0.2)",
                          margin: "0 2px",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <MagneticLink href={link.href} label={link.label} index={i} />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* CTA */}
            <div className="shrink-0">
              <CtaButton />
            </div>
          </div>
        </div>

        <ScanLine />
      </motion.div>

      {/* ── Floating arrow — visible only when scrolled ── */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            className="fixed z-50 flex items-center justify-center"
            style={{
              top: 10,
              left: "50%",
              translateX: "-50%",
              width: 32,
              height: 32,
              background: arrowHovered
                ? "rgba(0,229,255,0.15)"
                : "rgba(8,8,8,0.85)",
              border: "1px solid rgba(0,229,255,0.55)",
              boxShadow: arrowHovered
                ? "0 0 14px rgba(0,229,255,0.4)"
                : "0 0 6px rgba(0,229,255,0.2)",
              transform: "rotate(45deg)",
              cursor: "pointer",
              backdropFilter: "blur(12px)",
              transition: "background 0.18s, box-shadow 0.18s",
            }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.18 }}
            onMouseEnter={() => setArrowHovered(true)}
            onMouseLeave={() => setArrowHovered(false)}
            data-testid="button-nav-arrow"
            aria-label="Show navigation"
          >
            <span style={{ transform: "rotate(-45deg)", display: "flex" }}>
              <ChevronDown size={13} color="#00E5FF" strokeWidth={2.5} />
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
