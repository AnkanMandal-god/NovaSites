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

  /* Track card dimensions for the SVG border trace */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setDims({ w: el.offsetWidth, h: el.offsetHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Typewriter — completes in ~250ms */
  useEffect(() => {
    if (!hov) {
      setTypedText("");
      return;
    }
    let i = 0;
    const interval = Math.max(1, 250 / pillar.expanded.length);
    const t = setInterval(() => {
      i++;
      setTypedText(pillar.expanded.slice(0, i));
      if (i >= pillar.expanded.length) clearInterval(t);
    }, interval);
    return () => clearInterval(t);
  }, [hov, pillar.expanded]);

  const perimeter = 2 * (dims.w + dims.h);
  const DASH = 80;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={{
        position: "relative",
        padding: hov ? "18px 22px 20px" : "18px 22px 14px",
        transition: "padding 0.22s ease",
        cursor: "default",
      }}
      onMouseEnter={() => { setHov(true); onHoverChange(true); }}
      onMouseLeave={() => { setHov(false); onHoverChange(false); }}
    >
      {/* Traveling perimeter border — only on hover */}
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
            x={0.5}
            y={0.5}
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

      {/* Content above the SVG */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Number + title row */}
        <div className="flex items-baseline gap-3 mb-1">
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              color: "rgba(0,229,255,0.4)",
              letterSpacing: "0.15em",
              flexShrink: 0,
            }}
          >
            {pillar.num}
          </span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#00E5FF",
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            {pillar.title}
          </span>
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "rgba(255,255,255,0.75)",
            marginTop: 4,
            letterSpacing: "0.01em",
          }}
        >
          {pillar.subtext}
        </div>

        {/* Expanded typewriter text */}
        {hov && (
          <div
            style={{
              fontSize: 12.5,
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.48)",
              marginTop: 10,
              maxWidth: 420,
            }}
          >
            {typedText}
            {typedText.length < pillar.expanded.length && (
              <span style={{ opacity: 0.6, fontFamily: "monospace" }}>▌</span>
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
              marginTop: 8,
              letterSpacing: "0.1em",
            }}
          >
            [hover to expand]
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* Shield — floating, dual counter-rotating perimeter traces, scales on card hover */
function Shield({ enlarged }: { enlarged: boolean }) {
  const PATH = "M100 8L188 44V122C188 178 100 232 100 232C100 232 12 178 12 122V44L100 8Z";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      <motion.div
        animate={{ scale: enlarged ? 1.32 : 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        style={{ originX: 0.5, originY: 0.5 }}
      >
        <svg
          width="230"
          height="276"
          viewBox="0 0 200 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ambient inner fill */}
          <path
            d={PATH}
            fill="rgba(0,229,255,0.04)"
          />

          {/* Static dim outline */}
          <path
            d={PATH}
            stroke="rgba(0,229,255,0.15)"
            strokeWidth={1.5}
          />

          {/* Clockwise trace */}
          <motion.path
            d={PATH}
            fill="none"
            stroke="#00E5FF"
            strokeWidth={1.5}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="0.14 0.86"
            animate={{ strokeDashoffset: [0, -1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ filter: "drop-shadow(0 0 5px rgba(0,229,255,0.9))" }}
          />

          {/* Counter-clockwise trace */}
          <motion.path
            d={PATH}
            fill="none"
            stroke="rgba(0,229,255,0.6)"
            strokeWidth={1}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="0.10 0.90"
            animate={{ strokeDashoffset: [0, 1] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
            style={{ filter: "drop-shadow(0 0 3px rgba(0,229,255,0.6))" }}
          />

          {/* WEBFORGE monogram */}
          <motion.text
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5 }}
            x="100"
            y="126"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="'Courier New', monospace"
            fontSize="17"
            fontWeight="bold"
            fill="#00E5FF"
            fillOpacity="0.8"
            style={{ letterSpacing: "0.14em" }}
          >
            WEBFORGE
          </motion.text>
        </svg>
      </motion.div>

      {/* Metadata line */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        style={{
          fontFamily: "monospace",
          fontSize: 9,
          letterSpacing: "0.15em",
          color: "rgba(0,229,255,0.3)",
          textAlign: "center",
          textTransform: "uppercase",
          maxWidth: 280,
          lineHeight: 1.7,
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
        paddingTop: 60, /* clear sticky navbar */
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
        {/* Section label */}
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

        {/* Main grid */}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Shield enlarged={anyHovered} />
          </div>
        </div>
      </div>
    </section>
  );
}
