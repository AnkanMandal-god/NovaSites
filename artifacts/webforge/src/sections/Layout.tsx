import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { label: "What We Do", href: "#what-we-do" },
  { label: "The Process", href: "#process" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

/* Blinking cursor */
function Cursor() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn((v) => !v), 530);
    return () => clearInterval(t);
  }, []);
  return (
    <span
      style={{
        display: "inline-block",
        width: 2,
        height: "0.85em",
        background: on ? "#00E5FF" : "transparent",
        marginLeft: 3,
        verticalAlign: "middle",
      }}
    />
  );
}

/* Animated bottom scan line */
function ScanLine() {
  return (
    <div style={{ position: "relative", height: 1, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,229,255,0.1)" }} />
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          width: 160,
          height: 1,
          background: "linear-gradient(to right, transparent, #00E5FF 45%, #00E5FF 55%, transparent)",
        }}
        animate={{ x: ["-160px", "100vw"] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear", repeatDelay: 0.8 }}
      />
    </div>
  );
}

/* Magnetic nav link — pulls toward cursor, springs back */
function MagneticLink({
  href,
  label,
  index,
}: {
  href: string;
  label: string;
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 380, damping: 22 });
  const y = useSpring(rawY, { stiffness: 380, damping: 22 });
  const [lit, setLit] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    rawX.set((e.clientX - (r.left + r.width / 2)) * 0.238);
    rawY.set((e.clientY - (r.top + r.height / 2)) * 0.238);
  };
  const onLeave = () => {
    rawX.set(0);
    rawY.set(0);
    setLit(false);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      className="relative px-4 py-1 text-[11px] font-semibold tracking-widest uppercase select-none cursor-pointer"
      style={{
        color: lit ? "#ffffff" : "rgba(255,255,255,0.48)",
        x,
        y,
      }}
      data-testid={`link-nav-${index}`}
      onMouseMove={onMove}
      onMouseEnter={() => setLit(true)}
      onMouseLeave={onLeave}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      {label}
      {/* Cyan underline slides in */}
      <motion.span
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          translateX: "-50%",
          height: 1,
          background: "#00E5FF",
          boxShadow: "0 0 4px #00E5FF",
        }}
        initial={{ width: 0 }}
        animate={{ width: lit ? "70%" : 0 }}
        transition={{ duration: 0.18 }}
      />
    </motion.a>
  );
}

/* Creative CTA: bracket-corner button with fill-sweep */
function CtaButton() {
  const [hov, setHov] = useState(false);

  return (
    <a
      href="#contact"
      data-testid="link-cta"
      className="relative inline-flex items-center gap-2 select-none cursor-pointer"
      style={{
        padding: "7px 18px",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: hov ? "#0A0A0A" : "#00E5FF",
        border: "1px solid rgba(0,229,255,0.55)",
        background: "transparent",
        overflow: "hidden",
        transition: "color 0.22s",
        userSelect: "none",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onMouseDown={(e) =>
        ((e.currentTarget as HTMLElement).style.transform = "scale(0.96)")
      }
      onMouseUp={(e) =>
        ((e.currentTarget as HTMLElement).style.transform = "scale(1)")
      }
    >
      {/* Sweep fill */}
      <motion.span
        style={{
          position: "absolute",
          inset: 0,
          background: "#00E5FF",
          originX: 0,
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hov ? 1 : 0 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
      />

      {/* Corner brackets — TL */}
      <span
        style={{
          position: "absolute",
          top: 3,
          left: 3,
          width: 7,
          height: 7,
          borderTop: "1.5px solid #00E5FF",
          borderLeft: "1.5px solid #00E5FF",
          zIndex: 2,
          opacity: hov ? 0 : 1,
          transition: "opacity 0.15s",
        }}
      />
      {/* BR */}
      <span
        style={{
          position: "absolute",
          bottom: 3,
          right: 3,
          width: 7,
          height: 7,
          borderBottom: "1.5px solid #00E5FF",
          borderRight: "1.5px solid #00E5FF",
          zIndex: 2,
          opacity: hov ? 0 : 1,
          transition: "opacity 0.15s",
        }}
      />

      {/* Text */}
      <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: "monospace", opacity: hov ? 1 : 0.5, transition: "opacity 0.2s" }}>{">"}</span>
        {hov ? "INITIALIZE" : "GET STARTED"}
      </span>
    </a>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
      if (window.scrollY <= 80) setNavOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navVisible = !scrolled || navOpen;

  return (
    <>
      {/* ── Full navbar — slides up when scrolled ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50"
        animate={{
          y: navVisible ? 0 : "-100%",
          opacity: navVisible ? 1 : 0,
        }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        onMouseLeave={() => { if (scrolled) setNavOpen(false); }}
      >
        {/* Top accent line */}
        <div
          style={{
            height: 2,
            background:
              "linear-gradient(to right, transparent 0%, #00E5FF 25%, rgba(0,229,255,0.35) 50%, #00E5FF 75%, transparent 100%)",
          }}
        />

        {/* Bar */}
        <div
          style={{
            background: "rgba(8,8,8,0.90)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(0,229,255,0.08)",
          }}
        >
          <div
            className="relative mx-auto flex items-center justify-between"
            style={{ maxWidth: 1200, height: 60, padding: "0 28px" }}
          >
            {/* Left stripe */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "22%",
                bottom: "22%",
                width: 3,
                background: "#00E5FF",
                boxShadow: "0 0 8px rgba(0,229,255,0.8)",
                borderRadius: 2,
              }}
            />

            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-2 shrink-0 pl-3"
              data-testid="link-logo"
            >
              <span className="font-mono font-bold" style={{ color: "#00E5FF", fontSize: 14 }}>
                //
              </span>
              <span className="font-bold text-white" style={{ fontSize: 20, letterSpacing: "0.22em" }}>NOVASITES</span>
              <Cursor />
            </a>

            {/* Center nav */}
            <div
              className="absolute left-1/2 -translate-x-1/2 flex items-center"
            >
              <motion.div
                className="flex items-center"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {NAV_LINKS.map((link, i) => (
                  <div key={link.href} className="flex items-center">
                    {/* Vertical divider before each link (except first) */}
                    {i > 0 && (
                      <span
                        style={{
                          display: "inline-block",
                          width: 1,
                          height: 12,
                          background: "rgba(0,229,255,0.2)",
                          margin: "0 2px",
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <MagneticLink href={link.href} label={link.label} index={i} />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* CTA */}
            <div className="shrink-0">
              <CtaButton />
            </div>
          </div>
        </div>

        <ScanLine />
      </motion.div>
      {/* ── Trapezoid arrow tab — hangs from top when scrolled, hides when nav open ── */}
      <AnimatePresence>
        {scrolled && !navOpen && (
          <motion.div
            className="fixed z-50"
            style={{
              top: 0,
              left: "50%",
              translateX: "-50%",
              cursor: "pointer",
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            onMouseEnter={() => setNavOpen(true)}
            data-testid="button-nav-arrow"
            aria-label="Show navigation"
          >
            {(() => {
              /* Trapezoid geometry: wider top, narrower bottom, hangs from top edge */
              const TW = 88;   /* top width  */
              const BW = 52;   /* bottom width */
              const H  = 28;   /* height */
              const inset = (TW - BW) / 2; /* = 18 */
              /* SVG polygon points */
              const pts = `0,0 ${TW},0 ${TW - inset},${H} ${inset},${H}`;
              /* Perimeter for dash animation */
              const sideLen = Math.sqrt(inset * inset + H * H); /* ≈ 47.5 */
              const perim = TW + sideLen + BW + sideLen;         /* ≈ 235 */
              const dashLen = 60;

              const clipPct = `polygon(0% 0%, 100% 0%, ${((TW - inset) / TW * 100).toFixed(1)}% 100%, ${(inset / TW * 100).toFixed(1)}% 100%)`;

              return (
                <div style={{ position: "relative", width: TW, height: H }}>
                  {/* Glass fill layer — clip-path gives it the trapezoid shape */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(10,10,10,0.92)",
                      backdropFilter: "blur(18px)",
                      WebkitBackdropFilter: "blur(18px)",
                      clipPath: clipPct,
                    }}
                  />

                  {/* SVG — border + perimeter animation only */}
                  <svg
                    width={TW}
                    height={H}
                    viewBox={`0 0 ${TW} ${H}`}
                    style={{ position: "relative", display: "block" }}
                    overflow="visible"
                  >
                    {/* Static dim border */}
                    <polygon
                      points={pts}
                      fill="none"
                      stroke="rgba(0,229,255,0.22)"
                      strokeWidth={1}
                    />

                    {/* Animated perimeter glow segment */}
                    <motion.polygon
                      points={pts}
                      fill="none"
                      stroke="#00E5FF"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeDasharray={`${dashLen} ${perim - dashLen}`}
                      animate={{ strokeDashoffset: [0, -perim] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                      style={{ filter: "drop-shadow(0 0 2px #00E5FF)" }}
                    />

                    {/* Chevron, centered */}
                    <g transform={`translate(${TW / 2}, ${H * 0.54})`}>
                      <line x1="-5" y1="-2.5" x2="0" y2="3" stroke="#00E5FF" strokeWidth={2} strokeLinecap="round" />
                      <line x1="0" y1="3" x2="5" y2="-2.5" stroke="#00E5FF" strokeWidth={2} strokeLinecap="round" />
                    </g>
                  </svg>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Social icon SVGs ── */
function IconInstagram() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconLinkedIn() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="3" />
      <line x1="8" y1="11" x2="8" y2="16" /><line x1="8" y1="8" x2="8" y2="8.01" />
      <line x1="12" y1="16" x2="12" y2="11" /><path d="M16 16v-3a2 2 0 0 0-4 0" />
    </svg>
  );
}
function IconTwitterX() {
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIALS = [
  { Icon: IconInstagram, href: "https://instagram.com/novasites.co",  label: "Instagram" },
  { Icon: IconLinkedIn,  href: "https://linkedin.com/company/novasites", label: "LinkedIn" },
  { Icon: IconTwitterX,  href: "https://x.com/novasites_co",          label: "Twitter/X" },
];

export function Footer() {
  return (
    <footer style={{ background: "rgba(8,8,8,0.99)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "36px 0 24px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 28px" }}>
        {/* Row 1: logo + socials */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
          {/* Logo */}
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#00E5FF", fontSize: 13 }}>//</span>
            <span style={{ fontWeight: 900, color: "#fff", fontSize: 17, letterSpacing: "0.2em" }}>NOVASITES</span>
          </a>
          {/* Socials */}
          <div style={{ display: "flex", gap: 6 }}>
            {SOCIALS.map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "rgba(255,255,255,0.4)", transition: "color 0.2s, border-color 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#00E5FF"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,229,255,0.4)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 20 }} />

        {/* Row 2: tagline | contact */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
            High-performance digital infrastructure for local businesses.
          </p>
          <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
            <a href="mailto:ankan@novasites.co"
              style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.45)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#00E5FF")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)")}>
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" /></svg>
              ankan@novasites.co
            </a>
            <a href="tel:+919547667707"
              style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.45)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, transition: "color 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#00E5FF")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)")}>
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              +91 95476 67707
            </a>
          </div>
        </div>

        {/* Row 3: system text */}
        <div style={{ fontFamily: "monospace", fontSize: 9.5, color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em", textAlign: "center" }}>
          // SYSTEM: NOVASITES_CORE // {new Date().getFullYear()} // ALL RIGHTS RESERVED
        </div>
      </div>
    </footer>
  );
}
