import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const PILLARS = [
  {
    num: "01",
    title: "Better Search Rankings",
    subtext: "Built to be found first by the customers you actually want — before your competitors even show up.",
    expanded:
      "We eliminate unnecessary code, fix crawl inefficiencies, and structure your content so search engines rank you first. Every page we ship is tuned for the exact keywords your local customers are typing.",
    icon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="42" cy="42" r="26" stroke="white" strokeWidth="7" strokeLinecap="round"/>
        <line x1="61" y1="61" x2="84" y2="84" stroke="white" strokeWidth="7" strokeLinecap="round"/>
        <line x1="34" y1="42" x2="50" y2="42" stroke="white" strokeWidth="5" strokeLinecap="round"/>
        <line x1="42" y1="34" x2="42" y2="50" stroke="white" strokeWidth="5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: "02",
    title: "Lightning-Fast Performance",
    subtext: "Sub-second load times on any device, any connection — so you never lose a visitor to a slow page.",
    expanded:
      "We strip every kilobyte of dead weight: no page builders, no redundant plugins, no bloated frameworks. Faster pages mean lower bounce rates, higher engagement, and more conversions — measurably.",
    icon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline
          points="58,8 28,52 50,52 42,92 72,48 50,48 58,8"
          stroke="white"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Designs That Actually Convert",
    subtext: "Precision layouts engineered around real buyer behaviour to turn every visit into measurable revenue.",
    expanded:
      "Every element — headline placement, CTA contrast, whitespace, scroll depth — is deliberate. We remove friction so visitors move naturally toward the action you want: a call, a form fill, a purchase.",
    icon: (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="36" stroke="white" strokeWidth="6"/>
        <circle cx="50" cy="50" r="22" stroke="white" strokeWidth="5"/>
        <circle cx="50" cy="50" r="8" stroke="white" strokeWidth="5"/>
        <line x1="50" y1="8" x2="50" y2="20" stroke="white" strokeWidth="5" strokeLinecap="round"/>
        <line x1="50" y1="80" x2="50" y2="92" stroke="white" strokeWidth="5" strokeLinecap="round"/>
        <line x1="8" y1="50" x2="20" y2="50" stroke="white" strokeWidth="5" strokeLinecap="round"/>
        <line x1="80" y1="50" x2="92" y2="50" stroke="white" strokeWidth="5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

function PillarCard({
  pillar,
  index,
}: {
  pillar: (typeof PILLARS)[0];
  index: number;
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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      style={{
        position: "relative",
        flex: 1,
        padding: hov ? "24px 24px 26px" : "24px 24px 20px",
        borderLeft: `2px solid ${hov ? "#00E5FF" : "rgba(0,229,255,0.18)"}`,
        background: hov ? "rgba(0,229,255,0.03)" : "transparent",
        transition: "padding 0.25s ease, border-color 0.22s, background 0.22s",
        cursor: "default",
        minWidth: 0,
        overflow: "hidden",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Faint static background icon — fixed position, never moves */}
      <div
        style={{
          position: "absolute",
          bottom: -10,
          right: -10,
          width: 110,
          height: 110,
          opacity: 0.045,
          pointerEvents: "none",
          zIndex: 0,
          flexShrink: 0,
        }}
      >
        {pillar.icon}
      </div>

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
            zIndex: 1,
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

      <div style={{ position: "relative", zIndex: 2 }}>
        <span
          style={{
            display: "block",
            fontFamily: "monospace",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: hov ? "#00E5FF" : "rgba(0,229,255,0.4)",
            transition: "color 0.22s",
            marginBottom: 10,
          }}
        >
          {pillar.num} ——
        </span>

        <strong
          style={{
            display: "block",
            fontSize: 18,
            fontWeight: 700,
            color: hov ? "#ffffff" : "rgba(255,255,255,0.85)",
            marginBottom: 10,
            transition: "color 0.2s",
            letterSpacing: "0.01em",
            lineHeight: 1.25,
          }}
        >
          {pillar.title}
        </strong>

        <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.42)", lineHeight: 1.6, display: "block" }}>
          {pillar.subtext}
        </span>

        {hov && (
          <div
            style={{
              fontSize: 12.5,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.5)",
              marginTop: 12,
            }}
          >
            {typedText}
            {typedText.length < pillar.expanded.length && (
              <span style={{ opacity: 0.5, fontFamily: "monospace" }}>▌</span>
            )}
          </div>
        )}

        {!hov && (
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 9.5,
              color: "rgba(255,255,255,0.18)",
              marginTop: 10,
              letterSpacing: "0.1em",
            }}
          >
            [hover to expand]
          </div>
        )}
      </div>

      <span
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          width: 8,
          height: 8,
          borderTop: "1.5px solid #00E5FF",
          borderRight: "1.5px solid #00E5FF",
          opacity: hov ? 0.75 : 0,
          transition: "opacity 0.2s",
          zIndex: 2,
        }}
      />
    </motion.div>
  );
}

export function WhatWeDo() {
  return (
    <section
      id="what-we-do"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,8,8,0.99)",
        padding: "72px 48px 80px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 48,
        }}
      >
        {/* Label + Headline */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}
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

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.04 }}
            style={{
              fontSize: "clamp(1.7rem, 2.8vw, 2.4rem)",
              fontWeight: 900,
              letterSpacing: "-0.01em",
              color: "#fff",
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            Built for Growth.{" "}
            <span style={{ color: "#00E5FF" }}>Engineered to Last.</span>
          </motion.h2>
        </div>

        {/* Horizontal cards row */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 24,
            alignItems: "stretch",
          }}
        >
          {PILLARS.map((p, i) => (
            <PillarCard key={p.num} pillar={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
