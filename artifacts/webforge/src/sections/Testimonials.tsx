import { motion } from "framer-motion";

const TESTIMONIALS = [
  {
    quote: "Before WebForge, our site took nearly five seconds to load on mobile. After the rebuild, we were sub-second. Inbound call volume increased by 38% in the first month alone.",
    name: "Marcus D.",
    role: "Owner",
    company: "Apex Roofing Co.",
    score: 5,
  },
  {
    quote: "We had a WordPress site with 22 plugins and a PageSpeed score of 19. WebForge stripped it to nothing and rebuilt it clean. We're ranking on page one for every local keyword that matters.",
    name: "Sandra K.",
    role: "Director of Operations",
    company: "Cascade HVAC",
    score: 5,
  },
  {
    quote: "Our conversion rate went from 2.1% to 7.1%. That's not a redesign — that's a different business. The precision of the build is immediately obvious when you compare it to anything else out there.",
    name: "James R.",
    role: "Managing Partner",
    company: "Sentinel Law Group",
    score: 5,
  },
  {
    quote: "We own the code outright, there's nothing to update, nothing breaks. It just runs. For a logistics operation where downtime is not an option, that's exactly what we needed.",
    name: "Priya S.",
    role: "Head of Marketing",
    company: "Vanguard Logistics",
    score: 5,
  },
];

const ACCENT = "#00E5FF";

export function Testimonials() {
  return (
    <section
      id="testimonials"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,8,8,0.99)",
        padding: "80px 48px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 48 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ width: 16, height: 1, background: ACCENT, display: "inline-block" }} />
            <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: ACCENT }}>
              Client Verification
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)",
              fontWeight: 900,
              letterSpacing: "-0.01em",
              color: "#fff",
              margin: 0,
              lineHeight: 1.18,
            }}
          >
            Results, in Their Own Words.
          </h2>
        </motion.div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 6,
                padding: "28px 26px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Large quote mark watermark */}
              <span
                style={{
                  position: "absolute",
                  top: 12,
                  right: 18,
                  fontSize: 80,
                  lineHeight: 1,
                  color: ACCENT,
                  opacity: 0.06,
                  fontFamily: "Georgia, serif",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                "
              </span>

              {/* Stars */}
              <div style={{ display: "flex", gap: 3 }}>
                {Array.from({ length: t.score }).map((_, s) => (
                  <span
                    key={s}
                    style={{ color: ACCENT, fontSize: 13, filter: "drop-shadow(0 0 4px rgba(0,229,255,0.6))" }}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.72)",
                  margin: 0,
                  flex: 1,
                  fontStyle: "italic",
                }}
              >
                "{t.quote}"
              </p>

              {/* Divider */}
              <div style={{ height: 1, background: "rgba(0,229,255,0.12)" }} />

              {/* Attribution */}
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", marginBottom: 2 }}>
                  {t.name}
                </div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "monospace", letterSpacing: "0.04em" }}>
                  {t.role} — {t.company}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
