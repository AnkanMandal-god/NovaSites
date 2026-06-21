import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// ─── Tabler-style outline icons (scoped, no external package) ───────────────
function TIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
const IconBolt = () => <TIcon><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></TIcon>;
const IconSearch = () => <TIcon><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></TIcon>;
const IconMobile = () => <TIcon><rect x="7" y="2" width="10" height="20" rx="2" /><line x1="11" y1="6" x2="13" y2="6" /><circle cx="12" cy="18" r=".5" fill="currentColor" /></TIcon>;
const IconKey = () => <TIcon><circle cx="8" cy="15" r="4" /><line x1="10.85" y1="12.15" x2="19" y2="4" /><line x1="18" y1="5" x2="20" y2="7" /><line x1="15" y1="8" x2="17" y2="6" /></TIcon>;
const IconShield = () => <TIcon><path d="M9 12l2 2 4-4" /><path d="M12 3a12 12 0 0 1 7.5 2.6A12 12 0 0 1 12 21 12 12 0 0 1 4.5 5.6 12 12 0 0 1 12 3z" /></TIcon>;
const IconTool = () => <TIcon><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></TIcon>;
const IconTarget = () => <TIcon><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /><line x1="22" y1="12" x2="18" y2="12" /><line x1="6" y1="12" x2="2" y2="12" /></TIcon>;
const IconTrend = () => <TIcon><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></TIcon>;

// ─── Feature data ─────────────────────────────────────────────────────────
type Feature = { Icon: () => React.ReactElement; title: string; subtitle: string };
type FeaturePair = [Feature, Feature];

const FEATURES: FeaturePair[] = [
  [
    { Icon: IconBolt,   title: "Sub-Second Loading",             subtitle: "Pages render in under 1 second, on any connection" },
    { Icon: IconSearch, title: "Search Engine Optimization",     subtitle: "Built-in structure that ranks without paid plugins" },
  ],
  [
    { Icon: IconMobile, title: "Mobile-First Responsiveness",    subtitle: "Layouts adapt natively to every screen size" },
    { Icon: IconKey,    title: "Absolute Asset Ownership",       subtitle: "You own the code outright, no recurring lease fees" },
  ],
  [
    { Icon: IconShield, title: "Enhanced Security",              subtitle: "Locked-down architecture with no plugin attack surface" },
    { Icon: IconTool,   title: "Maintenance-Free Stability",     subtitle: "Hand-coded builds with nothing to break or update" },
  ],
  [
    { Icon: IconTarget, title: "Conversion-Focused Architecture",subtitle: "Every layout decision is built to turn visitors into leads" },
    { Icon: IconTrend,  title: "Scalable Framework",             subtitle: "Add pages and features without a teardown rebuild" },
  ],
];

// ─── Animation helpers ────────────────────────────────────────────────────
const INIT_TEXT = "> initializing...";
const DONE_TEXT = "> 8/8 loaded";
const CHAR_MS   = 28;
const MONO      = '"JetBrains Mono","IBM Plex Mono",Consolas,ui-monospace,monospace';
const ACCENT    = "#00E5FF";

function sleep(ms: number) { return new Promise<void>((r) => setTimeout(r, ms)); }

type RowState = {
  leftTitle: string;  leftSub: string;  leftIcon: boolean;
  rightTitle: string; rightSub: string; rightIcon: boolean;
};

function BlinkCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
      style={{ fontFamily: MONO, color: ACCENT, userSelect: "none" }}
    >▌</motion.span>
  );
}

// ─── Feature grid component ───────────────────────────────────────────────
function FeatureGrid() {
  const rootRef    = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  const [initTyped, setInitTyped] = useState("");
  const [rows, setRows] = useState<RowState[]>(
    FEATURES.map(() => ({ leftTitle:"", leftSub:"", leftIcon:false, rightTitle:"", rightSub:"", rightIcon:false }))
  );
  const [doneTyped, setDoneTyped] = useState("");

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let cancelled = false;

    async function run() {
      if (startedRef.current) return;
      startedRef.current = true;

      // 1. Type "> initializing..."
      for (let i = 1; i <= INIT_TEXT.length; i++) {
        if (cancelled) return;
        setInitTyped(INIT_TEXT.slice(0, i));
        await sleep(CHAR_MS);
      }
      await sleep(500);

      // 2-5. Animate row pairs sequentially
      for (let r = 0; r < FEATURES.length; r++) {
        if (cancelled) return;
        const [left, right] = FEATURES[r];

        // Titles (both simultaneously, wait for longer)
        const maxTL = Math.max(left.title.length, right.title.length);
        for (let i = 1; i <= maxTL; i++) {
          if (cancelled) return;
          const lt = left.title.slice(0, Math.min(i, left.title.length));
          const rt = right.title.slice(0, Math.min(i, right.title.length));
          setRows((prev) => { const n=[...prev]; n[r]={...n[r],leftTitle:lt,rightTitle:rt}; return n; });
          await sleep(CHAR_MS);
        }
        await sleep(180);

        // Subtitles (both simultaneously, wait for longer)
        const maxSL = Math.max(left.subtitle.length, right.subtitle.length);
        for (let i = 1; i <= maxSL; i++) {
          if (cancelled) return;
          const ls = left.subtitle.slice(0, Math.min(i, left.subtitle.length));
          const rs = right.subtitle.slice(0, Math.min(i, right.subtitle.length));
          setRows((prev) => { const n=[...prev]; n[r]={...n[r],leftSub:ls,rightSub:rs}; return n; });
          await sleep(CHAR_MS);
        }
        await sleep(180);

        // Icons (both simultaneously)
        if (cancelled) return;
        setRows((prev) => { const n=[...prev]; n[r]={...n[r],leftIcon:true,rightIcon:true}; return n; });
        await sleep(350);
      }

      // 6. Type "> 8/8 loaded"
      for (let i = 1; i <= DONE_TEXT.length; i++) {
        if (cancelled) return;
        setDoneTyped(DONE_TEXT.slice(0, i));
        await sleep(CHAR_MS);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { observer.disconnect(); run(); } },
      { threshold: 0.15 }
    );
    observer.observe(el);

    return () => { cancelled = true; observer.disconnect(); };
  }, []);

  return (
    <div ref={rootRef} style={{ fontFamily: MONO }}>
      {/* Introducer */}
      <div style={{ fontFamily: MONO, fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em", marginBottom: 20 }}>
        // Every deployment ships with this. No exceptions.
      </div>

      {/* "> initializing..." */}
      {initTyped && (
        <div style={{ fontFamily: MONO, fontSize: 12, color: ACCENT, marginBottom: 20 }}>
          {initTyped}
          {initTyped.length < INIT_TEXT.length && <BlinkCursor />}
        </div>
      )}

      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {FEATURES.map(([left, right], r) => {
          const row = rows[r];
          if (!row.leftTitle && !row.rightTitle) return null;

          const showLeftTitleCursor  = !row.leftIcon  && row.leftTitle.length  > 0 && row.leftSub.length  === 0;
          const showLeftSubCursor    = !row.leftIcon  && row.leftSub.length    > 0;
          const showRightTitleCursor = !row.rightIcon && row.rightTitle.length > 0 && row.rightSub.length === 0;
          const showRightSubCursor   = !row.rightIcon && row.rightSub.length   > 0;

          const cardStyle: React.CSSProperties = {
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            flex: 1,
            minHeight: 90,
          };

          return (
            <div key={r} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {/* Left */}
              <div style={cardStyle}>
                <div style={{ fontFamily: MONO, fontSize: 12.5, fontWeight: 700, color: "rgba(255,255,255,0.88)", lineHeight: 1.3 }}>
                  {row.leftTitle}{showLeftTitleCursor && <BlinkCursor />}
                </div>
                {row.leftSub.length > 0 && (
                  <div style={{ fontFamily: MONO, fontSize: 11, color: "rgba(255,255,255,0.42)", lineHeight: 1.65 }}>
                    {row.leftSub}{showLeftSubCursor && <BlinkCursor />}
                  </div>
                )}
                {row.leftIcon && (
                  <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.22 }}
                    style={{ color: ACCENT, marginTop: 6, alignSelf: "flex-end" }}>
                    <left.Icon />
                  </motion.div>
                )}
              </div>

              {/* Right */}
              <div style={cardStyle}>
                <div style={{ fontFamily: MONO, fontSize: 12.5, fontWeight: 700, color: "rgba(255,255,255,0.88)", lineHeight: 1.3 }}>
                  {row.rightTitle}{showRightTitleCursor && <BlinkCursor />}
                </div>
                {row.rightSub.length > 0 && (
                  <div style={{ fontFamily: MONO, fontSize: 11, color: "rgba(255,255,255,0.42)", lineHeight: 1.65 }}>
                    {row.rightSub}{showRightSubCursor && <BlinkCursor />}
                  </div>
                )}
                {row.rightIcon && (
                  <motion.div initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.22 }}
                    style={{ color: ACCENT, marginTop: 6, alignSelf: "flex-end" }}>
                    <right.Icon />
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* "> 8/8 loaded" */}
      {doneTyped && (
        <div style={{ fontFamily: MONO, fontSize: 12, color: ACCENT, textAlign: "center", marginTop: 20 }}>
          {doneTyped}
          {doneTyped.length < DONE_TEXT.length && <BlinkCursor />}
        </div>
      )}
    </div>
  );
}

// ─── Chart with labels ────────────────────────────────────────────────────
const X_LABELS = ["0", "10", "20", "30", "40", "50", "60s"];

function ChartSection({ color, path, glow }: { color: string; path: string; glow: string }) {
  return (
    <div className="w-full mb-6">
      <div className="font-mono uppercase mb-1.5" style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.38)" }}>
        Visitor Retention
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "stretch" }}>
        {/* Y labels */}
        <div className="font-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", display: "flex", flexDirection: "column", justifyContent: "space-between", paddingBottom: 18 }}>
          <span>100%</span>
          <span>0%</span>
        </div>
        {/* Chart + X labels */}
        <div style={{ flex: 1 }}>
          <div style={{ height: 72 }}>
            <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
              <motion.path
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: color === "#FF3333" ? "linear" : "easeOut" }}
                d={path}
                stroke={color} strokeWidth="2" fill="none"
                style={{ filter: `drop-shadow(0px 0px 4px ${glow})` }}
              />
            </svg>
          </div>
          <div className="font-mono" style={{ display: "flex", justifyContent: "space-between", marginTop: 3, fontSize: 8.5, color: "rgba(255,255,255,0.32)" }}>
            {X_LABELS.map((l) => <span key={l}>{l}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────
export function Metrics() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">

        {/* Header — unchanged */}
        <div className="text-center mb-16">
          <div className="text-primary font-mono text-sm mb-4">THE DIFFERENCE WE MAKE</div>
          <h2 className="text-4xl md:text-6xl mx-auto max-w-4xl text-white mb-6 !normal-case">
            The Standard<br />Has Been Raised.
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Traditional templates hold businesses back with bloat and slow load times. We engineer precise digital assets built for speed and lead generation.
          </p>
        </div>

        {/* Speedometer cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-3">

          {/* Average Template Site */}
          <div className="bg-card border border-destructive/50 rounded-md p-8 flex flex-col items-center">
            <h3 className="text-xl font-bold text-white mb-8">Average Template Site</h3>

            <div className="w-48 h-48 relative mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" stroke="#2A2A2A" strokeWidth="8" fill="none" />
                <motion.circle
                  initial={{ strokeDasharray: "0 251.2" }}
                  whileInView={{ strokeDasharray: "60.28 251.2" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  cx="50" cy="50" r="40" stroke="#FF3333" strokeWidth="8" fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-0.5">
                <span className="font-mono uppercase text-center leading-tight" style={{ fontSize: 8, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>
                  Google PageSpeed<br />Score
                </span>
                <span className="text-2xl font-black text-destructive">24</span>
                <span className="text-xs text-muted-foreground uppercase">Failing</span>
              </div>
            </div>

            <ChartSection
              color="#FF3333"
              glow="rgba(255,51,51,0.5)"
              path="M 0 5 C 6 5 13 6 19 33 C 24 38 32 38 48 38 L 75 39 L 100 39"
            />

            <p className="text-sm text-muted-foreground text-center">
              📉 Stagnant user retention due to delayed page rendering.
            </p>
          </div>

          {/* WebForge Engineered Site */}
          <div className="bg-card border border-primary shadow-[0_0_15px_rgba(0,229,255,0.1)] rounded-md p-8 flex flex-col items-center">
            <h3 className="text-xl font-bold text-white mb-8">WebForge Engineered Site</h3>

            <div className="w-48 h-48 relative mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" stroke="#2A2A2A" strokeWidth="8" fill="none" />
                <motion.circle
                  initial={{ strokeDasharray: "0 251.2" }}
                  whileInView={{ strokeDasharray: "248 251.2" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  cx="50" cy="50" r="40" stroke="#00E5FF" strokeWidth="8" fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-0.5">
                <span className="font-mono uppercase text-center leading-tight" style={{ fontSize: 8, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>
                  Google PageSpeed<br />Score
                </span>
                <span className="text-2xl font-black text-primary">99</span>
                <span className="text-xs text-muted-foreground uppercase">Excellent</span>
              </div>
            </div>

            <ChartSection
              color="#00E5FF"
              glow="rgba(0,229,255,0.8)"
              path="M 0 6 C 15 5 32 8 50 6 C 68 4 82 5 100 6"
            />

            <p className="text-sm text-white text-center">
              📈 Sub-second loading speeds resulting in higher inbound call volume.
            </p>
          </div>
        </div>

        {/* Source attribution */}
        <p className="text-center mb-16 max-w-2xl mx-auto" style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>
          Source: Google PageSpeed Insights, tested on 50 average small-business template sites vs. WebForge builds, June 2026.
        </p>

        {/* Animated feature grid */}
        <FeatureGrid />

      </div>
    </section>
  );
}
