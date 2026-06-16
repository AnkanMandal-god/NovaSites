import { useState } from "react";
import { motion } from "framer-motion";
import { DataRain } from "../components/DataRain";

function HeroButton({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  const [hov, setHov] = useState(false);

  if (primary) {
    return (
      <a
        href={href}
        className="relative inline-flex items-center gap-2 select-none cursor-pointer"
        style={{
          padding: "10px 28px",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: hov ? "#0A0A0A" : "#00E5FF",
          border: "1px solid rgba(0,229,255,0.55)",
          background: "transparent",
          overflow: "hidden",
          transition: "color 0.22s",
        }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onMouseDown={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(0.97)")}
        onMouseUp={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
        data-testid="button-hero-primary"
      >
        <motion.span
          style={{ position: "absolute", inset: 0, background: "#00E5FF", originX: 0 }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: hov ? 1 : 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
        />
        <span style={{ position: "absolute", top: 4, left: 4, width: 8, height: 8, borderTop: "1.5px solid #00E5FF", borderLeft: "1.5px solid #00E5FF", zIndex: 2, opacity: hov ? 0 : 1, transition: "opacity 0.15s" }} />
        <span style={{ position: "absolute", bottom: 4, right: 4, width: 8, height: 8, borderBottom: "1.5px solid #00E5FF", borderRight: "1.5px solid #00E5FF", zIndex: 2, opacity: hov ? 0 : 1, transition: "opacity 0.15s" }} />
        <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontFamily: "monospace", opacity: hov ? 1 : 0.5, transition: "opacity 0.2s" }}>{">"}</span>
          {children}
        </span>
      </a>
    );
  }

  return (
    <a
      href={href}
      className="relative inline-flex items-center gap-2 select-none cursor-pointer"
      style={{
        padding: "10px 28px",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: hov ? "#00E5FF" : "rgba(255,255,255,0.55)",
        border: `1px solid ${hov ? "rgba(0,229,255,0.5)" : "rgba(255,255,255,0.15)"}`,
        background: hov ? "rgba(0,229,255,0.04)" : "transparent",
        transition: "color 0.2s, border-color 0.2s, background 0.2s",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onMouseDown={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(0.97)")}
      onMouseUp={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
      data-testid="button-hero-secondary"
    >
      <span style={{ fontFamily: "monospace", fontSize: 10, opacity: 0.6 }}>{"_"}</span>
      {children}
    </a>
  );
}

const STATS = [
  { val: "< 1s",  label: "Load Time" },
  { val: "5–10",  label: "Day Delivery" },
  { val: "100%",  label: "Code Ownership" },
];

function StatItem({ val, label }: { val: string; label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="text-center px-10 select-none"
      style={{
        transition: "transform 0.2s ease, filter 0.2s ease",
        transform: hov ? "translateY(-3px)" : "translateY(0px)",
        filter: hov
          ? "drop-shadow(0 0 5px rgba(0,229,255,0.28))"
          : "none",
        cursor: "default",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div
        className="font-black"
        style={{
          fontSize: 22,
          letterSpacing: "0.05em",
          color: hov ? "#00E5FF" : "#ffffff",
          transition: "color 0.2s",
        }}
      >
        {val}
      </div>
      <div
        className="font-mono text-[9px] tracking-widest uppercase mt-0.5"
        style={{ color: "rgba(0,229,255,0.5)" }}
      >
        {label}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      className="hero-section min-h-screen flex items-center justify-center overflow-hidden"
      style={{ paddingTop: 80 }}
    >
      {/* Data rain — constrained to hero section only */}
      <DataRain />

      {/* Subtle radial glow behind text */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 400,
          background: "radial-gradient(ellipse, rgba(0,229,255,0.06) 0%, transparent 70%)",
          zIndex: 3,
        }}
      />

      <div className="relative text-center px-6 max-w-3xl mx-auto" style={{ zIndex: 10 }}>
        {/* Pre-label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <span style={{ width: 24, height: 1, background: "#00E5FF", display: "inline-block" }} />
          <span
            className="font-mono text-[10px] tracking-[0.3em] uppercase"
            style={{ color: "#00E5FF" }}
          >
            Web Development Studio
          </span>
          <span style={{ width: 24, height: 1, background: "#00E5FF", display: "inline-block" }} />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-black text-white leading-tight tracking-tight mb-5"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          Your Business Deserves{" "}
          <span style={{ color: "#00E5FF" }}>More Leads.</span>
          <br />
          We Build the Website That Delivers Them.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base leading-relaxed mb-10 max-w-xl mx-auto"
          style={{ color: "#8A8A8A" }}
        >
          No templates. No page builders. No bloat. Hand-coded websites that rank
          higher, load faster, and convert visitors into paying customers.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <HeroButton href="#contact" primary>
            Get Your Website
          </HeroButton>
          <HeroButton href="#what-we-do">
            See the Difference
          </HeroButton>
        </motion.div>

        {/* Bottom stat strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center justify-center mt-16"
        >
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <StatItem val={s.val} label={s.label} />
              {i < STATS.length - 1 && (
                <div
                  style={{
                    width: 1,
                    height: 36,
                    background: "linear-gradient(to bottom, transparent, rgba(0,229,255,0.25), transparent)",
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
