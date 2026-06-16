import { useState } from "react";
import { motion } from "framer-motion";

const PILLARS = [
  {
    num: "01",
    title: "Better Search Rankings",
    desc: "We don't rely on generic templates that search engines struggle to read. We build your site from the ground up, ensuring your business is perfectly structured for Google to find, understand, and rank you above your local competition.",
  },
  {
    num: "02",
    title: "Lightning-Fast Performance",
    desc: "In a digital-first market, every second of lag is a lost customer. We strip away the unnecessary bloat found in common page builders, ensuring your site loads instantly on every phone—making it effortless for visitors to connect with you.",
  },
  {
    num: "03",
    title: "Designs That Actually Convert",
    desc: "A beautiful website is only effective if it drives results. We create clean, distraction-free layouts designed with one goal in mind: guiding your visitors to take action, whether that's calling your number, booking a consultation, or completing a purchase.",
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

  return (
    <motion.div
      initial={{ opacity: 0, x: -18 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        padding: "20px 22px",
        borderLeft: `2px solid ${hov ? "#00E5FF" : "rgba(0,229,255,0.18)"}`,
        background: hov ? "rgba(0,229,255,0.03)" : "transparent",
        transition: "border-color 0.22s, background 0.22s",
        cursor: "default",
      }}
    >
      {/* Number badge */}
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.2em",
          color: hov ? "#00E5FF" : "rgba(0,229,255,0.4)",
          transition: "color 0.22s",
          display: "block",
          marginBottom: 6,
        }}
      >
        {pillar.num} ——
      </span>

      <strong
        style={{
          display: "block",
          fontSize: 15,
          fontWeight: 700,
          color: hov ? "#ffffff" : "rgba(255,255,255,0.85)",
          marginBottom: 8,
          transition: "color 0.2s",
          letterSpacing: "0.01em",
        }}
      >
        {pillar.title}
      </strong>

      <span style={{ fontSize: 13.5, lineHeight: 1.7, color: "rgba(255,255,255,0.45)" }}>
        {pillar.desc}
      </span>

      {/* Corner accent on hover */}
      <span
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 7,
          height: 7,
          borderTop: "1.5px solid #00E5FF",
          borderRight: "1.5px solid #00E5FF",
          opacity: hov ? 0.7 : 0,
          transition: "opacity 0.2s",
        }}
      />
    </motion.div>
  );
}

export function WhatWeDo() {
  return (
    <section
      id="what-we-do"
      className="py-28 border-t border-border"
      style={{ background: "rgba(10,10,10,0.98)" }}
    >
      <div className="container mx-auto px-6">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-4"
        >
          <span style={{ width: 18, height: 1, background: "#00E5FF", display: "inline-block" }} />
          <span
            className="font-mono text-[10px] tracking-[0.28em] uppercase"
            style={{ color: "#00E5FF" }}
          >
            Core Architecture
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-black text-white mb-16"
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.6rem)", letterSpacing: "-0.01em", maxWidth: 520 }}
        >
          Built for Growth.{" "}
          <span style={{ color: "#00E5FF" }}>Engineered to Last.</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left — Pillars */}
          <div className="space-y-2">
            {PILLARS.map((p, i) => (
              <PillarCard key={p.num} pillar={p} index={i} />
            ))}
          </div>

          {/* Right — Shield */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex flex-col items-center"
          >
            {/* Shield panel */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 380,
                aspectRatio: "1",
                background: "linear-gradient(135deg, rgba(0,229,255,0.04) 0%, rgba(0,0,0,0) 60%)",
                border: "1px solid rgba(0,229,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {/* Grid overlay */}
              <svg
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06 }}
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern id="wg-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                    <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#00E5FF" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#wg-grid)" />
              </svg>

              {/* Corner marks */}
              {[
                { top: 12, left: 12, borderTop: true, borderLeft: true },
                { top: 12, right: 12, borderTop: true, borderRight: true },
                { bottom: 12, left: 12, borderBottom: true, borderLeft: true },
                { bottom: 12, right: 12, borderBottom: true, borderRight: true },
              ].map((c, i) => (
                <span
                  key={i}
                  style={{
                    position: "absolute",
                    width: 14,
                    height: 14,
                    top: c.top,
                    left: c.left,
                    right: c.right,
                    bottom: c.bottom,
                    borderTop: c.borderTop ? "1.5px solid rgba(0,229,255,0.5)" : undefined,
                    borderLeft: c.borderLeft ? "1.5px solid rgba(0,229,255,0.5)" : undefined,
                    borderBottom: c.borderBottom ? "1.5px solid rgba(0,229,255,0.5)" : undefined,
                    borderRight: c.borderRight ? "1.5px solid rgba(0,229,255,0.5)" : undefined,
                  }}
                />
              ))}

              {/* Shield SVG */}
              <div style={{ position: "relative", zIndex: 2 }}>
                <svg
                  width="190"
                  height="228"
                  viewBox="0 0 200 240"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer shield glow fill */}
                  <path
                    d="M100 8L188 44V122C188 178 100 232 100 232C100 232 12 178 12 122V44L100 8Z"
                    fill="rgba(0,229,255,0.03)"
                  />

                  {/* Animated shield outline */}
                  <motion.path
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                    d="M100 8L188 44V122C188 178 100 232 100 232C100 232 12 178 12 122V44L100 8Z"
                    stroke="#00E5FF"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    style={{ filter: "drop-shadow(0 0 8px rgba(0,229,255,0.45))" }}
                  />

                  {/* Inner structure lines */}
                  <motion.path
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                    d="M100 8V232 M12 82L188 82 M50 158L150 158"
                    stroke="#00E5FF"
                    strokeWidth="1"
                    strokeOpacity="0.22"
                    strokeDasharray="4 6"
                  />

                  {/* WF monogram inside shield */}
                  <motion.text
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.7, duration: 0.5 }}
                    x="100"
                    y="130"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="monospace"
                    fontSize="32"
                    fontWeight="bold"
                    fill="#00E5FF"
                    fillOpacity="0.7"
                    style={{ letterSpacing: "0.1em" }}
                  >
                    WF
                  </motion.text>
                </svg>
              </div>

              {/* Ambient glow behind shield */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(0,229,255,0.07) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Stamp label */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              style={{
                marginTop: 24,
                maxWidth: 380,
                padding: "14px 20px",
                borderLeft: "2px solid rgba(0,229,255,0.3)",
                background: "rgba(0,229,255,0.03)",
              }}
            >
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.45)",
                  letterSpacing: "0.02em",
                }}
              >
                <span style={{ color: "rgba(0,229,255,0.7)", fontWeight: 700 }}>
                  THE WEBFORGE STANDARD:
                </span>{" "}
                Every site we deliver is optimized for search, built for mobile, and engineered to turn traffic into business.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
