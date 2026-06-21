import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const PILLARS = [
  {
    num: "01",
    title: "Better Search Rankings",
    subtext: "Built to dominate local search and put your business in front of the right customers at the right time.",
    expanded:
      "We eliminate unnecessary code, fix crawl inefficiencies, and structure your content so search engines rank you first. Your competitors are invisible — you won't be. Every page we ship is tuned for the keywords your local customers are actually typing.",
  },
  {
    num: "02",
    title: "Lightning-Fast Performance",
    subtext: "Sub-second load times on any device, any connection — so you never lose a visitor to a slow page.",
    expanded:
      "We strip out every kilobyte of dead weight: no page builders, no redundant plugins, no bloated frameworks. The result is a site that loads before your competitors have even started. Faster pages mean lower bounce rates, higher engagement, and more conversions — measurably.",
  },
  {
    num: "03",
    title: "Designs That Actually Convert",
    subtext: "Precision layouts engineered around buyer psychology to turn traffic into tangible revenue.",
    expanded:
      "Every element — headline placement, CTA contrast, whitespace, scroll depth — is deliberate. We remove friction and visual noise so visitors move naturally toward the action you want: a call, a form fill, a purchase. Good design isn't decoration; it's architecture for revenue.",
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
      initial={{ opacity: 0, x: -14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      style={{
        position: "relative",
        padding: hov ? "20px 22px 22px" : "20px 22px 14px",
        borderLeft: `2px solid ${hov ? "#00E5FF" : "rgba(0,229,255,0.18)"}`,
        background: hov ? "rgba(0,229,255,0.03)" : "transparent",
        transition: "padding 0.25s ease, border-color 0.22s, background 0.22s",
        cursor: "default",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
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

        <strong
          style={{
            display: "block",
            fontSize: 17,
            fontWeight: 700,
            color: hov ? "#ffffff" : "rgba(255,255,255,0.85)",
            marginBottom: 6,
            transition: "color 0.2s",
            letterSpacing: "0.01em",
          }}
        >
          {pillar.title}
        </strong>

        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.55 }}>
          {pillar.subtext}
        </span>

        {hov && (
          <div
            style={{
              fontSize: 13,
              lineHeight: 1.7,
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

function Shield({ cardsHeight }: { cardsHeight: number }) {
  const [hov, setHov] = useState(false);

  const svgH = cardsHeight > 0 ? cardsHeight : 320;
  const svgW = svgH * (560 / 342);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <motion.div
        animate={{ scale: hov ? 1.08 : 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        style={{ originX: 0.5, originY: 0.5, cursor: "default" }}
      >
        <svg
          width={svgW}
          height={svgH}
          viewBox="0 0 560 342"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="b1"/>
              <feGaussianBlur stdDeviation="9" result="b2"/>
              <feMerge>
                <feMergeNode in="b2"/>
                <feMergeNode in="b1"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="glowDim" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="b1"/>
              <feMerge>
                <feMergeNode in="b1"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <style>{`
            .pulse {
              animation: dashmove 2s linear infinite;
            }
            @keyframes dashmove {
              from { stroke-dashoffset: 563; }
              to   { stroke-dashoffset: 0; }
            }
          `}</style>

          {/* background matches page bg #080808 */}
          <rect width="560" height="342" fill="#080808"/>

          {/* static shield outline */}
          <path
            d="M 276 78
               C 255 95, 230 100, 205 110
               L 205 210
               C 205 245, 235 262, 276 274
               C 317 262, 347 245, 347 210
               L 347 110
               C 322 100, 297 95, 276 78
               Z"
            fill="none"
            stroke="#3a9bc7"
            strokeWidth="2.5"
            opacity="0.85"
            filter="url(#glowDim)"
          />

          {/* traveling pulse */}
          <path
            className="pulse"
            d="M 276 78
               C 255 95, 230 100, 205 110
               L 205 210
               C 205 245, 235 262, 276 274
               C 317 262, 347 245, 347 210
               L 347 110
               C 322 100, 297 95, 276 78
               Z"
            fill="none"
            stroke="#7fe0ff"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glow)"
            strokeDasharray="120 443"
          />
        </svg>
      </motion.div>

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
  const cardsRef = useRef<HTMLDivElement>(null);
  const [cardsHeight, setCardsHeight] = useState(0);

  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setCardsHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
        paddingTop: 40,
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
        {/* Label + Headline — constrained to left half */}
        <div style={{ maxWidth: "48%", paddingTop: 20, marginBottom: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
            style={{ marginBottom: 6 }}
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
              fontSize: "clamp(1.55rem, 2.4vw, 2.1rem)",
              fontWeight: 900,
              letterSpacing: "-0.01em",
              color: "#fff",
              marginBottom: 0,
              lineHeight: 1.18,
            }}
          >
            Built for Growth.{" "}
            <br />
            <span style={{ color: "#00E5FF" }}>Engineered to Last.</span>
          </motion.h2>
        </div>

        {/* Content grid */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 40,
            alignItems: "center",
            minHeight: 0,
            paddingBottom: 20,
          }}
        >
          {/* Left — Cards shifted 10px left */}
          <div
            ref={cardsRef}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              transform: "translateX(-10px)",
            }}
          >
            {PILLARS.map((p, i) => (
              <PillarCard
                key={p.num}
                pillar={p}
                index={i}
              />
            ))}
          </div>

          {/* Right — Shield, independently hoverable */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield cardsHeight={cardsHeight} />
          </div>
        </div>
      </div>
    </section>
  );
}
