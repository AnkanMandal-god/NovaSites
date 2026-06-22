import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ACCENT = "#00E5FF";
const RED = "#FF3333";

type Region = "loading" | "IN" | "INTL";

const PRICING: Record<"IN" | "INTL", { agency: string; ours: string; label: string }> = {
  IN: { agency: "Rs 50,000 – 3,00,000", ours: "Rs 10,000 – 70,000", label: "India" },
  INTL: { agency: "$2,500 – $7,500+", ours: "$500 – $5,000", label: "International" },
};

// ─── Navbar-style CTA button ──────────────────────────────────────────────────
function GetQuoteButton() {
  const [hov, setHov] = useState(false);
  return (
    <a
      href="#contact"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onMouseDown={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(0.96)")}
      onMouseUp={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        padding: "13px 40px",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: hov ? "#0A0A0A" : ACCENT,
        border: `1px solid ${hov ? ACCENT : "rgba(0,229,255,0.5)"}`,
        background: "transparent",
        overflow: "hidden",
        cursor: "pointer",
        textDecoration: "none",
        transition: "color 0.22s, border-color 0.22s",
        userSelect: "none",
      }}
    >
      <motion.span
        style={{ position: "absolute", inset: 0, background: ACCENT, originX: 0, display: "block" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hov ? 1 : 0 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
      />
      {/* TL bracket */}
      <span style={{ position: "absolute", top: 5, left: 5, width: 9, height: 9, borderTop: `1.5px solid ${ACCENT}`, borderLeft: `1.5px solid ${ACCENT}`, zIndex: 2, opacity: hov ? 0 : 1, transition: "opacity 0.15s" }} />
      {/* BR bracket */}
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

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((data) => setRegion(data.country_code === "IN" ? "IN" : "INTL"))
      .catch(() => setRegion("INTL"));
  }, []);

  const effectiveRegion: "IN" | "INTL" = manual ?? (region === "loading" ? "INTL" : region);
  const p = PRICING[effectiveRegion];

  return (
    <section id="pricing" className="py-24 bg-background border-t border-border">
      <div className="container mx-auto px-6">
        <h2><span className="anchor-prefix">//</span> Elite engineering. Traditional agency prices liquidated.</h2>

        {/* Region indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, marginBottom: 48 }}>
          <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em" }}>
            PRICES SHOWN FOR:
          </span>
          {(["IN", "INTL"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setManual(r)}
              style={{
                fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em",
                padding: "3px 10px", borderRadius: 3, cursor: "pointer",
                border: `1px solid ${effectiveRegion === r ? ACCENT : "rgba(255,255,255,0.15)"}`,
                color: effectiveRegion === r ? ACCENT : "rgba(255,255,255,0.35)",
                background: effectiveRegion === r ? "rgba(0,229,255,0.06)" : "transparent",
                transition: "all 0.2s",
              }}
            >
              {r === "IN" ? "INDIA" : "INTERNATIONAL"}
            </button>
          ))}
          {region === "loading" && (
            <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.25)" }}>detecting…</span>
          )}
          {region !== "loading" && !manual && (
            <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.25)" }}>auto-detected</span>
          )}
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-0 border border-border rounded-lg overflow-hidden max-w-5xl mx-auto">
          {/* Legacy Agency */}
          <div className="bg-card p-10 border-r border-border relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-destructive" />
            <h3 className="text-2xl font-bold text-white mb-2">Traditional Agency Model</h3>
            <p className="text-muted-foreground mb-8">WordPress / Wix / Elementor</p>

            <ul className="space-y-4 mb-10 text-muted-foreground">
              <li className="flex items-center"><span className="text-destructive mr-2">✕</span> 4.5+ second load times</li>
              <li className="flex items-center"><span className="text-destructive mr-2">✕</span> Monthly maintenance retainers</li>
              <li className="flex items-center"><span className="text-destructive mr-2">✕</span> 4–8 week bloated timelines</li>
              <li className="flex items-center"><span className="text-destructive mr-2">✕</span> You rent, they own the code</li>
            </ul>

            <div className="pt-8 border-t border-border">
              <div className="text-sm text-muted-foreground mb-1">Standard Industry Pricing</div>
              <motion.div
                key={effectiveRegion + "-agency"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-white line-through opacity-50"
              >
                {region === "loading" && !manual ? "—" : p.agency}
              </motion.div>
            </div>
          </div>

          {/* NovaSites */}
          <div className="bg-card p-10 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
            <h3 className="text-2xl font-bold text-white mb-2">Custom Hand-Coded Engine</h3>
            <p className="text-primary mb-8 font-mono text-sm">NOVASITES // ARCHITECTURE</p>

            <ul className="space-y-4 mb-10 text-white">
              <li className="flex items-center"><span className="text-primary mr-2">✓</span> Sub-second load times</li>
              <li className="flex items-center"><span className="text-primary mr-2">✓</span> Zero maintenance required</li>
              <li className="flex items-center"><span className="text-primary mr-2">✓</span> 5–10 day rapid deployment</li>
              <li className="flex items-center"><span className="text-primary mr-2">✓</span> 100% asset ownership</li>
            </ul>

            <div className="pt-8 border-t border-border">
              <div className="text-sm text-primary font-mono mb-1">One-Time Deployment Fee</div>
              <motion.div
                key={effectiveRegion + "-ours"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-black text-white"
              >
                {region === "loading" && !manual ? "—" : p.ours}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Get Quote CTA */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginTop: 48 }}>
          <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", margin: 0 }}>
            Ready to eliminate the overhead?
          </p>
          <GetQuoteButton />
        </div>

      </div>
    </section>
  );
}
