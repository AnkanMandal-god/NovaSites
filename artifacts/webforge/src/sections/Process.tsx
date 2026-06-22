import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const ACCENT = "#00E5FF";
const STEPS = [
  { phase: "PHASE_01", title: "THE BLUEPRINT", subtitle: "Strategy & Structure", desc: "We map out your business objectives, target audience, and required architecture before a single line of code is written." },
  { phase: "PHASE_02", title: "THE BUILD", subtitle: "High-Velocity Engineering", desc: "Custom clean-code implementation using modern web technologies to ensure a lightweight, secure, and blazing fast application." },
  { phase: "PHASE_03", title: "THE DEPLOYMENT", subtitle: "Live Operations", desc: "Rigorous testing, final optimization, and launch. Your lead generation asset is now live and tracking conversions." },
];

// ─── Comet border overlay for the active card ─────────────────────────────────
function CometCard({ children, active }: { children: React.ReactNode; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setDims({ w: el.offsetWidth, h: el.offsetHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const perim = dims.w > 0 ? 2 * (dims.w + dims.h) : 0;
  const COMET = 80;

  return (
    <div
      ref={ref}
      style={{ position: "relative" }}
      className={`bg-card border ${active ? "border-primary" : "border-border"} p-8 rounded-md transition-colors duration-500`}
    >
      {children}
      {active && perim > 0 && (
        <svg
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -1, left: -1,
            width: dims.w + 2, height: dims.h + 2,
            pointerEvents: "none",
            zIndex: 10,
            overflow: "visible",
          }}
        >
          <motion.rect
            x={0.5} y={0.5}
            width={dims.w} height={dims.h}
            rx={6}
            fill="none"
            stroke={ACCENT}
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray={`${COMET} ${perim - COMET}`}
            animate={{ strokeDashoffset: [0, -perim] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            style={{ filter: "drop-shadow(0 0 5px rgba(0,229,255,0.9))" }}
          />
        </svg>
      )}
    </div>
  );
}

// ─── Phase node pill ──────────────────────────────────────────────────────────
function PhaseNode({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      style={{
        padding: "4px 14px",
        fontFamily: "monospace",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.08em",
        border: `1px solid ${active ? ACCENT : "rgba(0,229,255,0.3)"}`,
        borderRadius: 4,
        color: active ? "#0a0a0a" : ACCENT,
        background: active ? ACCENT : "rgba(8,8,8,0.99)",
        boxShadow: active ? `0 0 14px rgba(0,229,255,0.6)` : "none",
        transition: "all 0.45s ease",
        position: "relative",
        zIndex: 1,
      }}
    >
      {label}
    </div>
  );
}

export function Process() {
  const [activeStep, setActiveStep] = useState(-1);
  const sectionRef = useRef<HTMLElement>(null);
  const startedRef = useRef(false);
  const LINE_WIDTHS = ["0%", "50%", "100%"];

  // Start when section enters viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          setActiveStep(0);
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Advance every 1.75s
  useEffect(() => {
    if (activeStep < 0) return;
    const timer = setTimeout(() => {
      setActiveStep((s) => (s + 1) % 3);
    }, 1750);
    return () => clearTimeout(timer);
  }, [activeStep]);

  return (
    <section id="process" ref={sectionRef} className="py-24 border-y border-border bg-card/20">
      <div className="container mx-auto px-6">
        <div className="text-primary font-mono text-sm mb-4 uppercase">The Process</div>
        <h2 className="!normal-case mb-12"><span className="anchor-prefix">//</span> Operational overview.</h2>

        {/* ── Step line — desktop only ── */}
        <div className="relative mb-16 pt-8 hidden md:block">
          {/* Track */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border -translate-y-1/2" />

          {/* Animated fill */}
          <motion.div
            className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2"
            style={{ background: ACCENT, boxShadow: `0 0 12px rgba(0,229,255,0.6)` }}
            animate={{ width: activeStep >= 0 ? LINE_WIDTHS[activeStep] : "0%" }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
          />

          {/* Phase nodes */}
          <div className="flex justify-between relative z-10">
            <PhaseNode label="PHASE 01" active={activeStep === 0} />
            <PhaseNode label="PHASE 02" active={activeStep === 1} />
            <PhaseNode label="PHASE 03" active={activeStep === 2} />
          </div>
        </div>

        {/* ── Cards ── */}
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((item, i) => (
            <CometCard key={i} active={activeStep === i}>
              <div className="text-primary font-mono text-xs mb-2">
                {item.phase} // {item.title}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{item.subtitle}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </CometCard>
          ))}
        </div>
      </div>
    </section>
  );
}
