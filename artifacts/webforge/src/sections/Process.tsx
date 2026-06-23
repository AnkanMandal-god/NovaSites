import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const ACCENT = "#00E5FF";
const STEPS = [
  { num: "01", phase: "PHASE_01", title: "THE BLUEPRINT", subtitle: "Strategy & Structure", desc: "We map out your business objectives, target audience, and required architecture before a single line of code is written." },
  { num: "02", phase: "PHASE_02", title: "THE BUILD", subtitle: "High-Velocity Engineering", desc: "Custom clean-code implementation using modern web technologies to ensure a lightweight, secure, and blazing fast application." },
  { num: "03", phase: "PHASE_03", title: "THE DEPLOYMENT", subtitle: "Live Operations", desc: "Rigorous testing, final optimization, and launch. Your lead generation asset is now live and tracking conversions." },
];

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
      style={{
        position: "relative",
        background: active ? "rgba(0,229,255,0.03)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${active ? "rgba(0,229,255,0.45)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 6,
        padding: "28px 24px 26px",
        transition: "border-color 0.5s, background 0.5s",
        overflow: "hidden",
      }}
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
            strokeWidth={1.5}
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
  const [isMobile, setIsMobile] = useState(false);
  const LINE_WIDTHS = ["0%", "50%", "100%"];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  useEffect(() => {
    if (activeStep < 0) return;
    const timer = setTimeout(() => {
      setActiveStep((s) => (s + 1) % 3);
    }, 1750);
    return () => clearTimeout(timer);
  }, [activeStep]);

  return (
    <section
      id="process"
      ref={sectionRef}
      style={{
        padding: isMobile ? "48px 0" : "96px 0",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(12,12,12,0.98)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "0 20px" : "0 48px", boxSizing: "border-box" }}>

        {/* Section label */}
        <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.28em", color: ACCENT, textTransform: "uppercase", marginBottom: 10 }}>
          The Process
        </div>

        {/* Section heading */}
        <h2
          style={{
            fontSize: isMobile ? "clamp(1.5rem, 6vw, 2rem)" : "clamp(1.8rem, 3vw, 2.6rem)",
            fontWeight: 900,
            color: "#fff",
            margin: "0 0 40px",
            letterSpacing: "-0.01em",
            lineHeight: 1.15,
          }}
        >
          <span style={{ color: ACCENT, fontFamily: "monospace", fontWeight: 400, fontSize: "0.55em", verticalAlign: "middle", marginRight: 8 }}>//</span>
          Operational overview.
        </h2>

        {/* Step line — desktop only */}
        {!isMobile && (
          <div style={{ position: "relative", marginBottom: 48, paddingTop: 32 }}>
            <div style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: 2, background: "rgba(255,255,255,0.08)", transform: "translateY(-50%)" }} />
            <motion.div
              style={{ position: "absolute", top: "50%", left: 0, height: 2, background: ACCENT, boxShadow: `0 0 12px rgba(0,229,255,0.6)`, transform: "translateY(-50%)" }}
              animate={{ width: activeStep >= 0 ? LINE_WIDTHS[activeStep] : "0%" }}
              transition={{ duration: 0.55, ease: "easeInOut" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 10 }}>
              <PhaseNode label="PHASE 01" active={activeStep === 0} />
              <PhaseNode label="PHASE 02" active={activeStep === 1} />
              <PhaseNode label="PHASE 03" active={activeStep === 2} />
            </div>
          </div>
        )}

        {/* Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: isMobile ? 14 : 24,
        }}>
          {STEPS.map((item, i) => (
            <CometCard key={i} active={activeStep === i}>
              {/* Large decorative number */}
              <div style={{
                position: "absolute",
                top: 10, right: 16,
                fontFamily: "monospace",
                fontSize: isMobile ? 52 : 68,
                fontWeight: 900,
                color: activeStep === i ? "rgba(0,229,255,0.07)" : "rgba(255,255,255,0.04)",
                lineHeight: 1,
                userSelect: "none",
                pointerEvents: "none",
                transition: "color 0.5s",
              }}>{item.num}</div>

              {/* Phase code badge */}
              <div style={{
                fontFamily: "monospace",
                fontSize: 9,
                letterSpacing: "0.22em",
                color: activeStep === i ? ACCENT : "rgba(0,229,255,0.35)",
                textTransform: "uppercase",
                marginBottom: 12,
                transition: "color 0.4s",
              }}>
                {item.phase}
              </div>

              {/* Main title — monospace, large */}
              <div style={{
                fontFamily: "monospace",
                fontSize: isMobile ? 17 : 20,
                fontWeight: 900,
                color: activeStep === i ? "#ffffff" : "rgba(255,255,255,0.65)",
                letterSpacing: "0.04em",
                lineHeight: 1.1,
                marginBottom: 8,
                transition: "color 0.4s",
              }}>
                {item.title}
              </div>

              {/* Subtitle — accent, small */}
              <div style={{
                fontFamily: "monospace",
                fontSize: isMobile ? 10 : 11,
                color: ACCENT,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 16,
                opacity: activeStep === i ? 1 : 0.55,
                transition: "opacity 0.4s",
              }}>
                {item.subtitle}
              </div>

              {/* Divider */}
              <div style={{
                height: 1,
                background: `linear-gradient(to right, ${activeStep === i ? "rgba(0,229,255,0.25)" : "rgba(255,255,255,0.06)"}, transparent)`,
                marginBottom: 14,
                transition: "background 0.4s",
              }} />

              {/* Description */}
              <p style={{
                fontSize: isMobile ? 12 : 13,
                lineHeight: 1.72,
                color: "rgba(255,255,255,0.45)",
                margin: 0,
              }}>
                {item.desc}
              </p>
            </CometCard>
          ))}
        </div>

        {/* Mobile phase indicator dots */}
        {isMobile && activeStep >= 0 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === activeStep ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: i === activeStep ? ACCENT : "rgba(255,255,255,0.15)",
                transition: "all 0.4s ease",
                boxShadow: i === activeStep ? `0 0 8px rgba(0,229,255,0.5)` : "none",
              }} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
