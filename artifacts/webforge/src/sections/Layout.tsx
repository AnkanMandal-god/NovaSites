import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SPRING = {
  type: "spring" as const,
  stiffness: 300,
  damping: 28,
  mass: 0.9,
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const expanded = !scrolled || hovered;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 pointer-events-none">
      <motion.nav
        data-testid="navbar"
        className="pointer-events-auto relative flex items-center justify-center"
        style={{
          background: "rgba(18, 18, 18, 0.82)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          border: "1px solid rgba(42, 42, 42, 0.9)",
          boxShadow: expanded
            ? "0 4px 32px rgba(0,0,0,0.5)"
            : "0 2px 20px rgba(0,0,0,0.6), 0 0 18px rgba(0,229,255,0.06)",
        }}
        animate={expanded ? "expanded" : "collapsed"}
        variants={{
          expanded: {
            width: "min(880px, 90vw)",
            height: 60,
            borderRadius: 10,
            rotate: 0,
          },
          collapsed: {
            width: 46,
            height: 46,
            borderRadius: 7,
            rotate: 45,
          },
        }}
        transition={SPRING}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        <AnimatePresence mode="wait" initial={false}>
          {expanded ? (
            <motion.div
              key="expanded"
              className="w-full h-full flex items-center justify-between px-6 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <a
                href="#"
                data-testid="link-logo"
                className="flex items-center text-base font-bold tracking-widest text-white shrink-0"
              >
                <span className="text-primary mr-1.5 font-mono text-sm">//</span>
                WEBFORGE
              </a>

              <div className="flex items-center gap-7 text-sm font-medium">
                <a
                  href="#what-we-do"
                  data-testid="link-capabilities"
                  className="text-[#8A8A8A] hover:text-primary transition-colors duration-150 tracking-wide"
                >
                  Capabilities
                </a>
                <a
                  href="#process"
                  data-testid="link-protocol"
                  className="text-[#8A8A8A] hover:text-primary transition-colors duration-150 tracking-wide"
                >
                  Protocol
                </a>
                <a
                  href="#pricing"
                  data-testid="link-valuation"
                  className="text-[#8A8A8A] hover:text-primary transition-colors duration-150 tracking-wide"
                >
                  Valuation
                </a>
              </div>

              <a
                href="#contact"
                data-testid="button-initialize"
                className="btn-primary py-1.5 px-5 text-sm shrink-0"
              >
                Initialize
              </a>

              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-[55%] pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to right, transparent 0%, #00E5FF 40%, #00E5FF 60%, transparent 100%)",
                  opacity: 0.7,
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              className="flex items-center justify-center w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              style={{ rotate: -45 }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{ display: "block" }}
              >
                <path
                  d="M8 3L8 13M8 13L4 9M8 13L12 9"
                  stroke="#00E5FF"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-background py-12 border-t border-border text-center">
      <div className="container mx-auto px-6">
        <div className="text-2xl font-bold tracking-widest text-white mb-2">
          <span className="text-primary font-mono mr-2 text-lg">//</span>
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
