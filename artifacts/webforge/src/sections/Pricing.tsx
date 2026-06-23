import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { checkAdmin } from "../utils/auth";

const ACCENT = "#00E5FF";

type Region = "loading" | "IN" | "INTL";

const PRICING: Record<"IN" | "INTL", { agency: string; ours: string }> = {
  IN:   { agency: "₹50,000 - ₹3,00,000", ours: "₹10,000 - ₹70,000" },
  INTL: { agency: "$2,500 - $7,500+",     ours: "$500 - $5,000"      },
};

function GetQuoteButton({ compact }: { compact?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href="#contact"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onMouseDown={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(0.96)")}
      onMouseUp={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
      style={{
        position: "relative", display: "inline-flex", alignItems: "center",
        padding: compact ? "10px 22px" : "13px 40px",
        fontSize: compact ? 9 : 11,
        fontWeight: 700, letterSpacing: "0.22em",
        textTransform: "uppercase", color: hov ? "#0A0A0A" : ACCENT,
        border: `1px solid ${hov ? ACCENT : "rgba(0,229,255,0.5)"}`,
        background: "transparent", overflow: "hidden", cursor: "pointer",
        textDecoration: "none", transition: "color 0.22s, border-color 0.22s", userSelect: "none",
      }}
    >
      <motion.span style={{ position: "absolute", inset: 0, background: ACCENT, originX: 0, display: "block" }}
        initial={{ scaleX: 0 }} animate={{ scaleX: hov ? 1 : 0 }} transition={{ duration: 0.22, ease: "easeInOut" }} />
      <span style={{ position: "absolute", top: 5, left: 5, width: 9, height: 9, borderTop: `1.5px solid ${ACCENT}`, borderLeft: `1.5px solid ${ACCENT}`, zIndex: 2, opacity: hov ? 0 : 1, transition: "opacity 0.15s" }} />
      <span style={{ position: "absolute", bottom: 5, right: 5, width: 9, height: 9, borderBottom: `1.5px solid ${ACCENT}`, borderRight: `1.5px solid ${ACCENT}`, zIndex: 2, opacity: hov ? 0 : 1, transition: "opacity 0.15s" }} />
      <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "monospace", opacity: hov ? 1 : 0.5, transition: "opacity 0.2s" }}>{">"}</span>
        {hov ? "GO TO CONTACT FORM" : "GET A QUOTE"}
      </span>
    </a>
  );
}

export function Pricing() {
  const [region, setRegion] = useState<Region>("loading");
  const [manual, setManual] = useState<"IN" | "INTL" | null>(null);
  const [isAdmin, setIsAdmin] = useState(checkAdmin);
  const [isMobile, setIsMobile] = useState(false);

  const clickCount = useRef(0);
  const clickTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleHeadingClick = () => {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 900);
    if (clickCount.current >= 3) {
      clickCount.current = 0;
      setIsAdmin(checkAdmin());
    }
  };

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((data) => setRegion(data.country_code === "IN" ? "IN" : "INTL"))
      .catch(() => setRegion("INTL"));
  }, []);

  const effectiveRegion: "IN" | "INTL" = manual ?? (region === "loading" ? "INTL" : region);
  const p = PRICING[effectiveRegion];

  const m = isMobile;

  return (
    <section id="pricing" style={{ padding: m ? "48px 0" : "96px 0", background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: m ? "0 16px" : "0 48px", boxSizing: "border-box" }}>

        <h2
          onClick={handleHeadingClick}
          style={{
            cursor: "default", userSelect: "none",
            fontSize: m ? "clamp(1.1rem, 4.5vw, 1.5rem)" : "clamp(1.5rem, 2.5vw, 2.2rem)",
            fontWeight: 900, color: "#fff",
            margin: m ? "0 0 24px" : "0 0 48px",
            lineHeight: 1.2, letterSpacing: "-0.01em",
          }}
        >
          <span style={{ color: ACCENT, fontFamily: "monospace", fontWeight: 400, fontSize: "0.55em", verticalAlign: "middle", marginRight: 8 }}>//</span>
          Elite engineering. Traditional agency prices liquidated.
        </h2>

        {/* Admin region toggle */}
        {isAdmin && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, marginTop: -12 }}>
            <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(0,229,255,0.5)", letterSpacing: "0.14em" }}>ADMIN — REGION:</span>
            {(["IN", "INTL"] as const).map((r) => (
              <button key={r} onClick={() => setManual(r)}
                style={{
                  fontFamily: "monospace", fontSize: 9, letterSpacing: "0.1em",
                  padding: "2px 8px", borderRadius: 3, cursor: "pointer",
                  border: `1px solid ${effectiveRegion === r ? ACCENT : "rgba(255,255,255,0.12)"}`,
                  color: effectiveRegion === r ? ACCENT : "rgba(255,255,255,0.3)",
                  background: effectiveRegion === r ? "rgba(0,229,255,0.06)" : "transparent",
                  transition: "all 0.2s",
                }}>
                {r === "IN" ? "INDIA" : "INTERNATIONAL"}
              </button>
            ))}
          </div>
        )}

        {/* Pricing cards — always side-by-side */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: m ? 6 : 10,
          overflow: "hidden",
          maxWidth: m ? "100%" : 900,
          margin: "0 auto",
        }}>
          {/* Legacy Agency */}
          <div style={{
            background: "rgba(255,255,255,0.02)",
            padding: m ? "16px 14px" : "40px 40px",
            borderRight: "1px solid rgba(255,255,255,0.08)",
            position: "relative",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: "#FF3333" }} />

            <h3 style={{
              fontSize: m ? 11 : 20,
              fontWeight: 800, color: "#fff",
              margin: m ? "0 0 4px" : "0 0 8px",
              lineHeight: 1.2,
            }}>
              {m ? "Agency" : "Traditional Agency Model"}
            </h3>

            <p style={{
              fontSize: m ? 8 : 12,
              color: "rgba(255,255,255,0.35)",
              margin: m ? "0 0 12px" : "0 0 28px",
              fontFamily: "monospace",
              letterSpacing: "0.04em",
            }}>
              {m ? "WP / Wix" : "WordPress / Wix / Elementor"}
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: m ? "0 0 12px" : "0 0 32px", display: "flex", flexDirection: "column", gap: m ? 6 : 14 }}>
              {[
                m ? "4.5s+ load" : "4.5+ second load times",
                m ? "Monthly fees" : "Monthly maintenance retainers",
                m ? "4–8 wk delays" : "4–8 week bloated timelines",
                m ? "No ownership" : "You rent, they own the code",
              ].map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: m ? 5 : 8, fontSize: m ? 9 : 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>
                  <span style={{ color: "#FF3333", flexShrink: 0, marginTop: 1 }}>✕</span>
                  {item}
                </li>
              ))}
            </ul>

            <div style={{ paddingTop: m ? 10 : 24, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ fontSize: m ? 8 : 11, color: "rgba(255,255,255,0.3)", marginBottom: m ? 4 : 6, fontFamily: "monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {m ? "Market Rate" : "Standard Industry Pricing"}
              </div>
              <motion.div key={effectiveRegion + "-agency"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  fontSize: m ? 11 : 24,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.3)",
                  textDecoration: "line-through",
                  wordBreak: "break-all",
                }}>
                {region === "loading" && !manual ? "—" : p.agency}
              </motion.div>
            </div>
          </div>

          {/* NovaSites */}
          <div style={{
            background: "rgba(0,229,255,0.02)",
            padding: m ? "16px 14px" : "40px 40px",
            position: "relative",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: ACCENT, boxShadow: "0 0 10px rgba(0,229,255,0.5)" }} />

            <h3 style={{
              fontSize: m ? 11 : 20,
              fontWeight: 800, color: "#fff",
              margin: m ? "0 0 4px" : "0 0 8px",
              lineHeight: 1.2,
            }}>
              {m ? "NovaSites" : "Custom Hand-Coded Engine"}
            </h3>

            <p style={{
              fontSize: m ? 8 : 12,
              color: ACCENT,
              margin: m ? "0 0 12px" : "0 0 28px",
              fontFamily: "monospace",
              letterSpacing: "0.04em",
            }}>
              {m ? "NOVA // ARCH" : "NOVASITES // ARCHITECTURE"}
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: m ? "0 0 12px" : "0 0 32px", display: "flex", flexDirection: "column", gap: m ? 6 : 14 }}>
              {[
                m ? "Sub-second" : "Sub-second load times",
                m ? "Zero maint." : "Zero maintenance required",
                m ? "5–10 days" : "5–10 day rapid deployment",
                m ? "100% yours" : "100% asset ownership",
              ].map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: m ? 5 : 8, fontSize: m ? 9 : 13, color: "#fff", lineHeight: 1.4 }}>
                  <span style={{ color: ACCENT, flexShrink: 0, marginTop: 1 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>

            <div style={{ paddingTop: m ? 10 : 24, borderTop: "1px solid rgba(0,229,255,0.15)" }}>
              <div style={{ fontSize: m ? 8 : 11, color: ACCENT, marginBottom: m ? 4 : 6, fontFamily: "monospace", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {m ? "One-Time Fee" : "One-Time Deployment Fee"}
              </div>
              <motion.div key={effectiveRegion + "-ours"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  fontSize: m ? 13 : 32,
                  fontWeight: 900,
                  color: "#fff",
                  wordBreak: "break-all",
                }}>
                {region === "loading" && !manual ? "—" : p.ours}
              </motion.div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: m ? 28 : 48 }}>
          <p style={{ fontFamily: "monospace", fontSize: m ? 9 : 10, letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", margin: 0 }}>
            Ready to eliminate the overhead?
          </p>
          <GetQuoteButton compact={m} />
        </div>
      </div>
    </section>
  );
}
