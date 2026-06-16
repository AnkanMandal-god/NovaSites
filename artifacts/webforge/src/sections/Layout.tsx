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

/* Corner bracket decoration */
function Bracket({
  pos,
}: {
  pos: "tl" | "tr" | "bl" | "br";
}) {
  const size = 8;
  const thickness = 1.5;
  const color = "rgba(0,229,255,0.7)";
  const styles: Record<string, React.CSSProperties> = {
    tl: { top: 3, left: 3, borderTop: `${thickness}px solid ${color}`, borderLeft: `${thickness}px solid ${color}` },
    tr: { top: 3, right: 3, borderTop: `${thickness}px solid ${color}`, borderRight: `${thickness}px solid ${color}` },
    bl: { bottom: 3, left: 3, borderBottom: `${thickness}px solid ${color}`, borderLeft: `${thickness}px solid ${color}` },
    br: { bottom: 3, right: 3, borderBottom: `${thickness}px solid ${color}`, borderRight: `${thickness}px solid ${color}` },
  };
  return (
    <span
      style={{
        position: "absolute",
        width: size,
        height: size,
        ...styles[pos],
        pointerEvents: "none",
      }}
    />
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const collapsed = scrolled && !hovered;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50"
      style={{ padding: "10px 24px 0" }}
    >
      {/* HUD bar */}
      <div
        className="relative mx-auto flex items-center justify-between"
        style={{
          maxWidth: 1200,
          height: 48,
          background: "rgba(10,10,10,0.75)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(0,229,255,0.18)",
          borderBottom: "1px solid rgba(0,229,255,0.35)",
          clipPath:
            "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
          padding: "0 20px",
        }}
      >
        {/* Corner brackets */}
        <Bracket pos="tl" />
        <Bracket pos="tr" />
        <Bracket pos="bl" />
        <Bracket pos="br" />

        {/* Scanning line at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "15%",
            right: "15%",
            height: 1,
            background:
              "linear-gradient(to right, transparent, #00E5FF 30%, #00E5FF 70%, transparent)",
            opacity: 0.6,
          }}
        />

        {/* ── Logo ── */}
        <a
          href="#"
          className="flex items-center gap-2 shrink-0"
          data-testid="link-logo"
        >
          <span
            className="font-mono text-[10px] tracking-widest"
            style={{ color: "#00E5FF" }}
          >
            //
          </span>
          <span className="text-white font-bold tracking-[0.2em] text-sm">
            WEBFORGE
          </span>
          <span
            className="font-mono text-[9px] hidden sm:block"
            style={{ color: "rgba(0,229,255,0.4)" }}
          >
            v2.4
          </span>
        </a>

        {/* ── Center nav engine ── */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex items-center"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          data-testid="nav-engine"
        >
          <AnimatePresence mode="wait" initial={false}>
            {!collapsed ? (
              <motion.div
                key="links"
                className="flex items-center"
                style={{ gap: 2 }}
                initial={{ opacity: 0, scaleX: 0.5 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0.5 }}
                transition={spring}
              >
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    className="relative px-3 py-1 text-[11px] font-medium tracking-wider uppercase transition-colors group"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                    data-testid={`link-nav-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#00E5FF")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(255,255,255,0.55)")
                    }
                  >
                    {link.label}
                    {/* bottom accent on hover */}
                    <span
                      style={{
                        position: "absolute",
                        bottom: -1,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 0,
                        height: "1px",
                        background: "#00E5FF",
                        transition: "width 0.2s ease",
                      }}
                      className="group-hover:w-full"
                    />
                  </motion.a>
                ))}
              </motion.div>
            ) : (
              <motion.button
                key="rhombus"
                className="flex items-center justify-center cursor-pointer"
                style={{
                  width: 28,
                  height: 28,
                  background: "rgba(0,229,255,0.08)",
                  border: "1px solid rgba(0,229,255,0.6)",
                  boxShadow: "0 0 8px rgba(0,229,255,0.3)",
                  transform: "rotate(45deg)",
                  clipPath: "none",
                }}
                initial={{ opacity: 0, scale: 0.2, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 45 }}
                exit={{ opacity: 0, scale: 0.2, rotate: 0 }}
                transition={spring}
                data-testid="button-nav-collapse"
                aria-label="Expand navigation"
              >
                <span style={{ transform: "rotate(-45deg)", display: "flex" }}>
                  <ChevronDown size={12} color="#00E5FF" strokeWidth={2.5} />
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── CTA ── */}
        <div className="shrink-0" data-testid="nav-cta">
          <a
            href="#contact"
            className="relative inline-flex items-center px-4 py-1.5 text-[11px] font-bold tracking-[0.15em] uppercase transition-all"
            style={{
              color: "#0A0A0A",
              background: "#00E5FF",
              clipPath:
                "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
              letterSpacing: "0.12em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow =
                "0 0 12px rgba(0,229,255,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
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
