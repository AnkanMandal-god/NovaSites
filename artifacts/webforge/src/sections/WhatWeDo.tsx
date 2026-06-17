import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const PILLARS = [
  {
    num: "01",
    title: "Better Search Rankings",
    subtext: "Built to be found by your local customers.",
    expanded: "We eliminate unnecessary code so your business dominates local search results, making it easy for customers to find you.",
  },
  {
    num: "02",
    title: "Lightning-Fast Performance",
    subtext: "Instant loading for zero lost traffic.",
    expanded: "We remove all digital dead weight so your site loads instantly on any phone, ensuring visitors stay and engage.",
  },
  {
    num: "03",
    title: "Designs That Actually Convert",
    subtext: "Precision layouts designed to drive revenue.",
    expanded: "We strip away distractions to turn every visitor into an actionable business lead, whether that means a phone call or a purchase.",
  },
];

/* Classic heraldic shield — curved sides, pointed bottom */
const SHIELD_PATH =
  "M100 12 C148 12 182 36 182 74 L182 138 C182 186 100 224 100 224 C100 224 18 186 18 138 L18 74 C18 36 52 12 100 12 Z";

function PillarCard({
  pillar,
  index,
  onHoverChange,
}: {
  pillar: (typeof PILLARS)[0];
  index: number;
  onHoverChange: (v: boolean) => void;
}) {
  const [hov, setHov] = useState(false);
  const [typedText, setTypedText] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setDims({ w: el.offsetWidth, h: el.offsetHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Typewriter — ~900ms total for a relaxed token-stream feel */
  useEffect(() => {
    if (!hov) { setTypedText(""); return; }
    let i = 0;
    const interval = Math.max(2, 900 / pillar.expanded.length);
    const t = setInterval(() => {
      i++;
      setTypedText(pillar.expanded.slice(0, i));
      if (i >= pillar.expanded.length) clearInterval(t);
    }, interval);
    return () => clearInterval(t);
  }, [hov, pillar.expanded]);

  const perimeter = 2 * (dims.w + dims.h);
  const DASH = 90;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={{
        position: "relative",
        /* ── Restored card visual style ── */
        padding: hov ? "20px 22px 22px" : "20px 22px 14px",
        borderLeft: `2px solid ${hov ? "#00E5FF" : "rgba(0,229,255,0.18)"}`,
        background: hov ? "rgba(0,229,255,0.03)" : "transparent",
        transition: "padding 0.25s ease, border-color 0.22s, background 0.22s",
        cursor: "default",
      }}
      onMouseEnter={() => { setHov(true); onHoverChange(true); }}
      onMouseLeave={() => { setHov(false); onHoverChange(false); }}
    >
      {/* Traveling perimeter border on hover */}
      {hov && dims.w > 0 && perimeter > 0 && (
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: dims.w,
            height: dims.h,
            pointerEvents: "none",
            overflow: "visible",
            zIndex: 0,
          }}
        >
          <motion.rect
            x={0.5} y={0.5}
            width={dims.w - 1}
            height={dims.h - 1}
            fill="none"
            stroke="#00E5FF"
            strokeWidth={1}
            strokeDasharray={`${DASH} ${Math.max(perimeter - DASH, 1)}`}
            animate={{ strokeDashoffset: [0, -perimeter] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
            style={{ filter: "drop-shadow(0 0 4px rgba(0,229,255,0.8))" }}
          />
        </svg>
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Number badge */}
        <span
          style={{
            display: "block",
            fontFamily: "monospace",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: hov ? "#00E5FF" : "rgba(0,229,255,0.4)",
            transition: "color 0.22s",
            marginBottom: 6,
          }}
        >
          {pillar.num} ——
        </span>

        {/* Title */}
        <strong
          style={{
            display: "block",
            fontSize: 15,
            fontWeight: 700,
            color: hov ? "#ffffff" : "rgba(255,255,255,0.85)",
            marginBottom: 4,
            transition: "color 0.2s",
            letterSpacing: "0.01em",
          }}
        >
          {pillar.title}
        </strong>

        {/* Subtext (always visible) */}
        <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.42)", lineHeight: 1.5 }}>
          {pillar.subtext}
        </span>

        {/* Expanded typewriter text */}
        {hov && (
          <div
            style={{
              fontSize: 12.5,
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.5)",
              marginTop: 10,
              maxWidth: 400,
            }}
          >
            {typedText}
            {typedText.length < pillar.expanded.length && (
              <span style={{ opacity: 0.5, fontFamily: "monospace" }}>▌</span>
            )}
          </div>
        )}

        {/* [hover to expand] hint */}
        {!hov && (
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 9.5,
              color: "rgba(255,255,255,0.18)",
              marginTop: 7,
              letterSpacing: "0.1em",
            }}
          >
            [hover to expand]
          </div>
        )}
      </div>

      {/* Corner accent (top-right) on hover */}
      <span
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 8,
          height: 8,
          borderTop: "1.5px solid #00E5FF",
          borderRight: "1.5px solid #00E5FF",
          opacity: hov ? 0.75 : 0,
          transition: "opacity 0.2s",
        }}
      />
    </motion.div>
  );
}

/* Neon heraldic shield — matches reference: curved body, strong ambient glow, dual traces */
function Shield({ enlarged }: { enlarged: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <motion.div
        animate={{ scale: enlarged ? 1.28 : 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{ originX: 0.5, originY: 0.5 }}
      >
        <svg
          width="220"
          height="240"
          viewBox="0 0 200 236"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer diffuse glow (largest, dimmest) */}
          <path
            d={SHIELD_PATH}
            fill="none"
            stroke="rgba(0,229,255,0.06)"
            strokeWidth={28}
            strokeLinejoin="round"
            style={{ filter: "blur(14px)" }}
          />

          {/* Mid ambient glow */}
          <path
            d={SHIELD_PATH}
            fill="none"
            stroke="rgba(0,229,255,0.14)"
            strokeWidth={14}
            strokeLinejoin="round"
            style={{ filter: "blur(6px)" }}
          />

          {/* Inner fill — very dark so shield "body" feels deep */}
          <path
            d={SHIELD_PATH}
            fill="rgba(0,10,20,0.7)"
          />

          {/* Static base outline */}
          <path
            d={SHIELD_PATH}
            fill="none"
            stroke="rgba(0,229,255,0.22)"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />

          {/* Clockwise bright trace */}
          <motion.path
            d={SHIELD_PATH}
            fill="none"
            stroke="#00E5FF"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="0.18 0.82"
            animate={{ strokeDashoffset: [0, -1] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
            style={{
              filter:
                "drop-shadow(0 0 6px #00E5FF) drop-shadow(0 0 12px rgba(0,229,255,0.7))",
            }}
          />

          {/* Counter-clockwise dimmer trace */}
          <motion.path
            d={SHIELD_PATH}
            fill="none"
            stroke="rgba(0,229,255,0.55)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="0.12 0.88"
            animate={{ strokeDashoffset: [0, 1] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "linear" }}
            style={{ filter: "drop-shadow(0 0 4px rgba(0,229,255,0.5))" }}
          />
        </svg>
      </motion.div>

      {/* Metadata — white, legible */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        style={{
          fontFamily: "monospace",
          fontSize: 10.5,
          letterSpacing: "0.13em",
          color: "rgba(255,255,255,0.62)",
          textAlign: "center",
          textTransform: "uppercase",
          maxWidth: 300,
          lineHeight: 1.8,
        }}
      >
        WEBFORGE CORE STANDARD: 100% HAND-CODED,<br />
        SEO-OPTIMIZED, PERFORMANCE-FIRST INFRASTRUCTURE.
      </motion.p>
    </div>
  );
}

export function WhatWeDo() {
  const [anyHovered, setAnyHovered] = useState(false);

  return (
    <section
      id="what-we-do"
      style={{
        height: "100vh",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,8,8,0.99)",
        display: "flex",
        flexDirection: "column",
        padding: "0 48px",
        paddingTop: 60,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          width: "100%",
          margin: "0 auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3"
          style={{ paddingTop: 36, marginBottom: 8 }}
        >
          <span style={{ width: 16, height: 1, background: "#00E5FF", display: "inline-block" }} />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#00E5FF",
            }}
          >
            Core Architecture
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.04 }}
          style={{
            fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            fontWeight: 900,
            letterSpacing: "-0.01em",
            color: "#fff",
            marginBottom: 0,
            lineHeight: 1.15,
          }}
        >
          Built for Growth.{" "}
          <span style={{ color: "#00E5FF" }}>Engineered to Last.</span>
        </motion.h2>

        {/* Content grid */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 56,
            alignItems: "center",
            minHeight: 0,
            paddingBottom: 32,
          }}
        >
          {/* Left — Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {PILLARS.map((p, i) => (
              <PillarCard
                key={p.num}
                pillar={p}
                index={i}
                onHoverChange={(v) => setAnyHovered(v)}
              />
            ))}
          </div>

          {/* Right — Shield */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield enlarged={anyHovered} />
          </div>
        </div>
      </div>
    </section>
  );
}
