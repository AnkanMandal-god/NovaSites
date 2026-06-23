import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// ─── Tabler-style outline icons ──────────────────────────────────────────────
function TIcon({ children, size = 24 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
const IconBolt   = ({ size }: { size?: number }) => <TIcon size={size}><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></TIcon>;
const IconSearch = ({ size }: { size?: number }) => <TIcon size={size}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></TIcon>;
const IconMobile = ({ size }: { size?: number }) => <TIcon size={size}><rect x="7" y="2" width="10" height="20" rx="2" /><line x1="11" y1="6" x2="13" y2="6" /><circle cx="12" cy="18" r=".5" fill="currentColor" /></TIcon>;
const IconKey    = ({ size }: { size?: number }) => <TIcon size={size}><circle cx="8" cy="15" r="4" /><line x1="10.85" y1="12.15" x2="19" y2="4" /><line x1="18" y1="5" x2="20" y2="7" /><line x1="15" y1="8" x2="17" y2="6" /></TIcon>;
const IconShield = ({ size }: { size?: number }) => <TIcon size={size}><path d="M9 12l2 2 4-4" /><path d="M12 3a12 12 0 0 1 7.5 2.6A12 12 0 0 1 12 21 12 12 0 0 1 4.5 5.6 12 12 0 0 1 12 3z" /></TIcon>;
const IconTool   = ({ size }: { size?: number }) => <TIcon size={size}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></TIcon>;
const IconTarget = ({ size }: { size?: number }) => <TIcon size={size}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /><line x1="22" y1="12" x2="18" y2="12" /><line x1="6" y1="12" x2="2" y2="12" /></TIcon>;
const IconTrend  = ({ size }: { size?: number }) => <TIcon size={size}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></TIcon>;

// ─── Comet card wrapper ───────────────────────────────────────────────────────
// Adds a traveling comet around the card's border perimeter — non-destructive overlay.
function CometCard({
  color, children, className, style,
}: { color: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref  = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setDims({ w: el.offsetWidth, h: el.offsetHeight });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const perim  = dims.w > 0 ? 2 * (dims.w + dims.h) : 0;
  const COMET  = 90; // visible segment length in px

  return (
    <div ref={ref} className={`relative ${className ?? ""}`} style={style}>
      {children}
      {perim > 0 && (
        <svg
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -1, left: -1,
            width: dims.w, height: dims.h,
            pointerEvents: "none",
            zIndex: 2,
            overflow: "visible",
          }}
        >
          <motion.rect
            x={0.5} y={0.5}
            width={dims.w - 1}
            height={dims.h - 1}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            strokeOpacity={0.8}
            strokeDasharray={`${COMET} ${Math.max(perim - COMET, 1)}`}
            animate={{ strokeDashoffset: [0, -perim] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear", repeatType: "loop" }}
            style={{ filter: `drop-shadow(0 0 5px ${color})` }}
          />
        </svg>
      )}
    </div>
  );
}

// ─── Feature grid data ────────────────────────────────────────────────────────
type Feature     = { Icon: (p: { size?: number }) => React.ReactElement; title: string; subtitle: string };
type FeaturePair = [Feature, Feature];

const FEATURES: FeaturePair[] = [
  [
    { Icon: IconBolt,   title: "Sub-Second Loading",              subtitle: "Pages render in under 1 second, on any connection" },
    { Icon: IconSearch, title: "Search Engine Optimization",      subtitle: "Built-in structure that ranks without paid plugins" },
  ],
  [
    { Icon: IconMobile, title: "Mobile-First Responsiveness",     subtitle: "Layouts adapt natively to every screen size" },
    { Icon: IconKey,    title: "Absolute Asset Ownership",        subtitle: "You own the code outright, no recurring lease fees" },
  ],
  [
    { Icon: IconShield, title: "Enhanced Security",               subtitle: "Locked-down architecture with no plugin attack surface" },
    { Icon: IconTool,   title: "Maintenance-Free Stability",      subtitle: "Hand-coded builds with nothing to break or update" },
  ],
  [
    { Icon: IconTarget, title: "Conversion-Focused Architecture", subtitle: "Every layout decision is built to turn visitors into leads" },
    { Icon: IconTrend,  title: "Scalable Framework",              subtitle: "Add pages and features without a teardown rebuild" },
  ],
];

// ─── Animation constants ──────────────────────────────────────────────────────
const INIT_TEXT = "> initializing...";
const DONE_TEXT = "> 8/8 loaded";
const CHAR_MS   = 10;   // ≈3× faster than before (was 28)
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

// ─── Feature grid ─────────────────────────────────────────────────────────────
function FeatureGrid() {
  const rootRef    = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  const [initTyped, setInitTyped] = useState("");
  const [rows, setRows] = useState<RowState[]>(
    FEATURES.map(() => ({ leftTitle:"", leftSub:"", leftIcon:false, rightTitle:"", rightSub:"", rightIcon:false }))
  );
  const [doneTyped, setDoneTyped] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let cancelled = false;

    async function run() {
      if (startedRef.current) return;
      startedRef.current = true;

      // "> initializing..."
      for (let i = 1; i <= INIT_TEXT.length; i++) {
        if (cancelled) return;
        setInitTyped(INIT_TEXT.slice(0, i));
        await sleep(CHAR_MS);
      }
      await sleep(200); // brief pause before row 1 (was 500)

      for (let r = 0; r < FEATURES.length; r++) {
        if (cancelled) return;
        const [left, right] = FEATURES[r];

        // Titles — both cards simultaneously
        const maxTL = Math.max(left.title.length, right.title.length);
        for (let i = 1; i <= maxTL; i++) {
          if (cancelled) return;
          const lt = left.title.slice(0, Math.min(i, left.title.length));
          const rt = right.title.slice(0, Math.min(i, right.title.length));
          setRows((prev) => { const n = [...prev]; n[r] = { ...n[r], leftTitle: lt, rightTitle: rt }; return n; });
          await sleep(CHAR_MS);
        }
        await sleep(70); // brief pause between title → subtitle (was 180)

        // Subtitles — both cards simultaneously
        const maxSL = Math.max(left.subtitle.length, right.subtitle.length);
        for (let i = 1; i <= maxSL; i++) {
          if (cancelled) return;
          const ls = left.subtitle.slice(0, Math.min(i, left.subtitle.length));
          const rs = right.subtitle.slice(0, Math.min(i, right.subtitle.length));
          setRows((prev) => { const n = [...prev]; n[r] = { ...n[r], leftSub: ls, rightSub: rs }; return n; });
          await sleep(CHAR_MS);
        }
        await sleep(70);

        // Icons — both simultaneously
        if (cancelled) return;
        setRows((prev) => { const n = [...prev]; n[r] = { ...n[r], leftIcon: true, rightIcon: true }; return n; });
        await sleep(180); // pause before next row (was 350)
      }

      // "> 8/8 loaded"
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

  // Card layout: horizontal flex — [text block] [icon]
  const cardStyle: React.CSSProperties = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 6,
    padding: "20px 22px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    flex: 1,
  };

  return (
    <div ref={rootRef} style={{ fontFamily: MONO }}>
      {/* Introducer line */}
      <div style={{ fontFamily: MONO, fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em", marginBottom: 20 }}>
        // Every deployment ships with this. No exceptions.
      </div>

      {/* "> initializing..." */}
      {initTyped && (
        <div style={{ fontFamily: MONO, fontSize: 14, color: ACCENT, marginBottom: 20 }}>
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

          const TextBlock = ({ title, sub, titleCursor, subCursor }: {
            title: string; sub: string; titleCursor: boolean; subCursor: boolean;
          }) => (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: MONO, fontSize: 14.5, fontWeight: 700, color: "rgba(255,255,255,0.9)", lineHeight: 1.3, marginBottom: sub ? 6 : 0 }}>
                {title}{titleCursor && <BlinkCursor />}
              </div>
              {sub.length > 0 && (
                <div style={{ fontFamily: MONO, fontSize: 12.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>
                  {sub}{subCursor && <BlinkCursor />}
                </div>
              )}
            </div>
          );

          return (
            <div key={r} style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
              {/* Left card */}
              <div style={cardStyle}>
                <TextBlock
                  title={row.leftTitle} sub={row.leftSub}
                  titleCursor={showLeftTitleCursor} subCursor={showLeftSubCursor}
                />
                {row.leftIcon && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.22 }}
                    style={{ color: ACCENT, flexShrink: 0 }}
                  >
                    <left.Icon size={24} />
                  </motion.div>
                )}
              </div>

              {/* Right card */}
              <div style={cardStyle}>
                <TextBlock
                  title={row.rightTitle} sub={row.rightSub}
                  titleCursor={showRightTitleCursor} subCursor={showRightSubCursor}
                />
                {row.rightIcon && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.22 }}
                    style={{ color: ACCENT, flexShrink: 0 }}
                  >
                    <right.Icon size={24} />
                  </motion.div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* "> 8/8 loaded" */}
      {doneTyped && (
        <div style={{ fontFamily: MONO, fontSize: 14, color: ACCENT, textAlign: "center", marginTop: 20 }}>
          {doneTyped}
          {doneTyped.length < DONE_TEXT.length && <BlinkCursor />}
        </div>
      )}
    </div>
  );
}

// ─── Chart section ────────────────────────────────────────────────────────────
const X_LABELS = ["0", "10", "20", "30", "40", "50", "60s"];

function ChartSection({ color, path, glow }: { color: string; path: string; glow: string }) {
  return (
    <div className="w-full mb-6">
      <div className="font-mono uppercase mb-1.5"
        style={{ fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.38)" }}>
        Visitor Retention
      </div>
      <div style={{ display: "flex", gap: 6, alignItems: "stretch" }}>
        <div className="font-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", display: "flex", flexDirection: "column", justifyContent: "space-between", paddingBottom: 18 }}>
          <span>100%</span>
          <span>0%</span>
        </div>
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

// ─── Main export ──────────────────────────────────────────────────────────────
export function Metrics() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const circleSize = isMobile ? 90 : 192;
  const cardPad    = isMobile ? "12px 10px 16px" : "32px 32px 28px";

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-primary font-mono text-sm mb-4">THE DIFFERENCE WE MAKE</div>
          <h2 style={{ fontSize: isMobile ? "clamp(1.6rem, 7vw, 2.2rem)" : "clamp(2rem, 5vw, 3.5rem)" }}
            className="mx-auto max-w-4xl text-white mb-6 !normal-case">
            The Standard<br />Has Been Raised.
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto" style={{ fontSize: isMobile ? 12 : undefined }}>
            Traditional templates hold businesses back with bloat and slow load times. We engineer precise digital assets built for speed and lead generation.
          </p>
        </div>

        {/* Speedometer cards — always 2-col */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 24, marginBottom: 12 }}>

          {/* Average Template Site */}
          <CometCard color="#FF3333" className="bg-card border border-destructive/50 rounded-md flex flex-col items-center" style={{ padding: cardPad }}>
            <h3 style={{ fontSize: isMobile ? 11 : 20, fontWeight: 700, color: "#fff", marginBottom: isMobile ? 10 : 28, textAlign: "center", lineHeight: 1.3 }}>
              {isMobile ? "Template Site" : "Average Template Site"}
            </h3>
            <div style={{ width: circleSize, height: circleSize, position: "relative", marginBottom: isMobile ? 8 : 24, flexShrink: 0 }}>
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="50" cy="50" r="40" stroke="#2A2A2A" strokeWidth="8" fill="none" />
                <motion.circle
                  initial={{ strokeDasharray: "0 251.2" }}
                  whileInView={{ strokeDasharray: "60.28 251.2" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  cx="50" cy="50" r="40" stroke="#FF3333" strokeWidth="8" fill="none"
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
                <span style={{ fontFamily: "monospace", textTransform: "uppercase", textAlign: "center", lineHeight: 1.2, fontSize: isMobile ? 5 : 8, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>
                  {isMobile ? "Score" : "Google PageSpeed\nScore"}
                </span>
                <span style={{ fontSize: isMobile ? 16 : 24, fontWeight: 900, color: "#FF3333" }}>24</span>
                <span style={{ fontSize: isMobile ? 7 : 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Failing</span>
              </div>
            </div>
            {!isMobile && <ChartSection color="#FF3333" glow="rgba(255,51,51,0.5)" path="M 0 5 C 6 5 13 6 19 33 C 24 38 32 38 48 38 L 75 39 L 100 39" />}
            <p style={{ fontSize: isMobile ? 10 : 13, color: "rgba(255,255,255,0.45)", textAlign: "center", margin: 0, lineHeight: 1.5 }}>
              {isMobile ? "High load times lose visitors." : "Stagnant user retention due to delayed page rendering."}
            </p>
          </CometCard>

          {/* NovaSites Engineered Site */}
          <CometCard color="#00E5FF" className="bg-card border border-primary rounded-md flex flex-col items-center" style={{ padding: cardPad, boxShadow: "0 0 15px rgba(0,229,255,0.08)" }}>
            <h3 style={{ fontSize: isMobile ? 11 : 20, fontWeight: 700, color: "#fff", marginBottom: isMobile ? 10 : 28, textAlign: "center", lineHeight: 1.3 }}>
              {isMobile ? "NovaSites" : "NovaSites Engineered Site"}
            </h3>
            <div style={{ width: circleSize, height: circleSize, position: "relative", marginBottom: isMobile ? 8 : 24, flexShrink: 0 }}>
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="50" cy="50" r="40" stroke="#2A2A2A" strokeWidth="8" fill="none" />
                <motion.circle
                  initial={{ strokeDasharray: "0 251.2" }}
                  whileInView={{ strokeDasharray: "248 251.2" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  cx="50" cy="50" r="40" stroke="#00E5FF" strokeWidth="8" fill="none"
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
                <span style={{ fontFamily: "monospace", textTransform: "uppercase", textAlign: "center", lineHeight: 1.2, fontSize: isMobile ? 5 : 8, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>
                  {isMobile ? "Score" : "Google PageSpeed\nScore"}
                </span>
                <span style={{ fontSize: isMobile ? 16 : 24, fontWeight: 900, color: "#00E5FF" }}>99</span>
                <span style={{ fontSize: isMobile ? 7 : 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>Excellent</span>
              </div>
            </div>
            {!isMobile && <ChartSection color="#00E5FF" glow="rgba(0,229,255,0.8)" path="M 0 6 C 15 5 32 8 50 6 C 68 4 82 5 100 6" />}
            <p style={{ fontSize: isMobile ? 10 : 13, color: isMobile ? "rgba(255,255,255,0.7)" : "#fff", textAlign: "center", margin: 0, lineHeight: 1.5 }}>
              {isMobile ? "Sub-second loads, more leads." : "Sub-second loading speeds resulting in higher inbound call volume."}
            </p>
          </CometCard>

        </div>

        {/* Source attribution */}
        <p className="text-center mb-16 max-w-2xl mx-auto"
          style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>Source: Google PageSpeed Insights, tested on 50 average small-business template sites vs. NovaSites builds, June 2026.</p>

        {/* Animated feature grid */}
        <FeatureGrid />

      </div>
    </section>
  );
}
