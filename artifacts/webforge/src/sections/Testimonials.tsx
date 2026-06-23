import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { checkAdmin } from "../utils/auth";

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  score: number;
};

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  { id: "1", quote: "Before NovaSites, our site took nearly five seconds to load on mobile. After the rebuild, we were sub-second. Inbound call volume increased by 38% in the first month alone.", name: "Marcus D.", role: "Owner", company: "Apex Roofing Co.", score: 5 },
  { id: "2", quote: "We had a WordPress site with 22 plugins and a PageSpeed score of 19. NovaSites stripped it to nothing and rebuilt it clean. We're ranking on page one for every local keyword that matters.", name: "Sandra K.", role: "Director of Operations", company: "Cascade HVAC", score: 5 },
  { id: "3", quote: "Our conversion rate went from 2.1% to 7.1%. That's not a redesign — that's a different business. The precision of the build is immediately obvious when you compare it to anything else out there.", name: "James R.", role: "Managing Partner", company: "Sentinel Law Group", score: 5 },
  { id: "4", quote: "We own the code outright, there's nothing to update, nothing breaks. It just runs. For a logistics operation where downtime is not an option, that's exactly what we needed.", name: "Priya S.", role: "Head of Marketing", company: "Vanguard Logistics", score: 5 },
  { id: "5", quote: "From the first call to launch was 8 days. The site is fast, it looks sharp, and the leads came in before we'd even finished telling people about it. Genuinely impressive.", name: "Tom E.", role: "Principal", company: "Summit Dental Group", score: 5 },
];

const STORAGE_KEY = "webforge_testimonials";
const ACCENT = "#00E5FF";
const CARD_W = 340;
const CARD_GAP = 20;

function loadTestimonials(): Testimonial[] {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r); } catch {}
  return DEFAULT_TESTIMONIALS;
}
function saveTestimonials(t: Testimonial[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(t)); } catch {}
}

function TestimonialCard({ t, editMode, onEdit, onDelete, fullWidth }: {
  t: Testimonial; editMode: boolean;
  onEdit: () => void; onDelete: () => void;
  fullWidth?: boolean;
}) {
  return (
    <div style={{
      width: fullWidth ? "100%" : CARD_W,
      flexShrink: 0,
      background: "rgba(255,255,255,0.025)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 6,
      padding: fullWidth ? "22px 20px" : "24px 22px",
      display: "flex", flexDirection: "column", gap: 14,
      position: "relative", overflow: "hidden", boxSizing: "border-box",
    }}>
      <span style={{ position: "absolute", top: 10, right: 14, fontSize: 70, lineHeight: 1, color: ACCENT, opacity: 0.05, fontFamily: "Georgia, serif", userSelect: "none", pointerEvents: "none" }}>"</span>

      <div style={{ display: "flex", gap: 3 }}>
        {Array.from({ length: t.score }).map((_, i) => (
          <span key={i} style={{ color: ACCENT, fontSize: 12, filter: "drop-shadow(0 0 4px rgba(0,229,255,0.5))" }}>★</span>
        ))}
      </div>

      <p style={{ fontSize: 13, lineHeight: 1.72, color: "rgba(255,255,255,0.7)", margin: 0, flex: 1, fontStyle: "italic" }}>"{t.quote}"</p>

      <div style={{ height: 1, background: "rgba(0,229,255,0.1)" }} />

      <div>
        <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", marginBottom: 2 }}>{t.name}</div>
        <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.38)", fontFamily: "monospace", letterSpacing: "0.04em" }}>{t.role} — {t.company}</div>
      </div>

      {editMode && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <button onClick={onEdit} style={{ fontFamily: "monospace", fontSize: 10, padding: "6px 14px", border: `1px solid ${ACCENT}`, color: ACCENT, background: "rgba(0,229,255,0.08)", borderRadius: 4, cursor: "pointer" }}>EDIT</button>
          <button onClick={onDelete} style={{ fontFamily: "monospace", fontSize: 10, padding: "6px 14px", border: "1px solid rgba(255,51,51,0.5)", color: "#FF3333", background: "rgba(255,51,51,0.07)", borderRadius: 4, cursor: "pointer" }}>DELETE</button>
        </div>
      )}
    </div>
  );
}

function EditModal({ t, onSave, onClose }: { t: Testimonial; onSave: (updated: Testimonial) => void; onClose: () => void }) {
  const [draft, setDraft] = useState<Testimonial>({ ...t });
  const set = (key: keyof Testimonial, val: string | number) => setDraft((d) => ({ ...d, [key]: val }));
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <motion.div initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#0d0d0d", border: `1px solid rgba(0,229,255,0.28)`, borderRadius: 8, padding: "28px 26px", width: "min(500px, 94vw)", display: "flex", flexDirection: "column", gap: 14, boxSizing: "border-box" }}>
        <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: ACCENT, marginBottom: 4 }}>// EDIT TESTIMONIAL</div>

        <textarea value={draft.quote} onChange={(e) => set("quote", e.target.value)} rows={4} placeholder="Quote text"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 4, padding: "9px 12px", color: "#fff", fontSize: 13, fontStyle: "italic", lineHeight: 1.7, resize: "none", outline: "none", fontFamily: "inherit", boxSizing: "border-box", width: "100%" }} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {(["name", "role", "company"] as const).map((k) => (
            <input key={k} value={draft[k]} onChange={(e) => set(k, e.target.value)} placeholder={k.charAt(0).toUpperCase() + k.slice(1)}
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "8px 10px", color: "#fff", fontSize: 12, outline: "none", fontFamily: "inherit", gridColumn: k === "company" ? "span 2" : undefined }} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.4)" }}>RATING:</span>
          {[1,2,3,4,5].map((s) => (
            <span key={s} onClick={() => set("score", s)}
              style={{ fontSize: 18, cursor: "pointer", color: draft.score >= s ? ACCENT : "rgba(255,255,255,0.2)", filter: draft.score >= s ? "drop-shadow(0 0 4px rgba(0,229,255,0.6))" : "none", transition: "all 0.15s" }}>★</span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <button onClick={() => onSave(draft)} style={{ flex: 1, padding: "10px", background: ACCENT, border: "none", borderRadius: 4, color: "#0a0a0a", fontWeight: 700, fontSize: 11, letterSpacing: "0.14em", cursor: "pointer", fontFamily: "monospace" }}>SAVE</button>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, color: "rgba(255,255,255,0.35)", fontSize: 11, cursor: "pointer", fontFamily: "monospace" }}>CANCEL</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(loadTestimonials);
  const [isAdmin, setIsAdmin]           = useState(checkAdmin);
  const [editMode, setEditMode]         = useState(false);
  const [editingId, setEditingId]       = useState<string | null>(null);
  const [paused, setPaused]             = useState(false);
  const [isMobile, setIsMobile]         = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const clickCount = useRef(0);
  const clickTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleHeadingClick = () => {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 900);
    if (clickCount.current >= 3) { clickCount.current = 0; setIsAdmin(checkAdmin()); }
  };

  function update(updated: Testimonial) {
    const next = testimonials.map((t) => (t.id === updated.id ? updated : t));
    setTestimonials(next); saveTestimonials(next); setEditingId(null);
  }
  function remove(id: string) {
    const next = testimonials.filter((t) => t.id !== id);
    setTestimonials(next); saveTestimonials(next);
    setCurrentIndex((i) => Math.min(i, next.length - 1));
  }
  function add() {
    const t: Testimonial = { id: Date.now().toString(), quote: "Write the client quote here.", name: "Client Name", role: "Role", company: "Company", score: 5 };
    const next = [...testimonials, t]; setTestimonials(next); saveTestimonials(next); setEditingId(t.id);
  }
  function reset() { setTestimonials(DEFAULT_TESTIMONIALS); saveTestimonials(DEFAULT_TESTIMONIALS); setCurrentIndex(0); }

  const editingTestimonial = editingId ? testimonials.find((t) => t.id === editingId) ?? null : null;

  const track = [...testimonials, ...testimonials];
  const trackWidth = testimonials.length * (CARD_W + CARD_GAP);
  const duration = Math.max(10, trackWidth / 60);

  const safeIndex = testimonials.length > 0 ? ((currentIndex % testimonials.length) + testimonials.length) % testimonials.length : 0;

  const Header = (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "0 20px" : "0 48px", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 36 }}>
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ width: 16, height: 1, background: ACCENT, display: "inline-block" }} />
            <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: ACCENT }}>Client Verification</span>
          </div>
          <h2 onClick={handleHeadingClick} style={{ fontSize: isMobile ? "clamp(1.3rem, 5vw, 1.6rem)" : "clamp(1.6rem, 2.6vw, 2.2rem)", fontWeight: 900, letterSpacing: "-0.01em", color: "#fff", margin: 0, lineHeight: 1.18, cursor: "default", userSelect: "none" }}>
            Results, in Their Own Words.
          </h2>
        </motion.div>

        {isAdmin && (
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            {editMode && (
              <>
                <button onClick={add} style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", padding: "7px 14px", border: `1px solid rgba(0,229,255,0.4)`, color: ACCENT, background: "rgba(0,229,255,0.06)", borderRadius: 4, cursor: "pointer" }}>+ ADD</button>
                <button onClick={reset} style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", padding: "7px 14px", border: "1px solid rgba(255,51,51,0.35)", color: "#FF3333", background: "rgba(255,51,51,0.05)", borderRadius: 4, cursor: "pointer" }}>RESET</button>
              </>
            )}
            <button onClick={() => setEditMode(!editMode)} style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", padding: "7px 14px", border: `1px solid ${editMode ? "rgba(0,229,255,0.55)" : "rgba(255,255,255,0.15)"}`, color: editMode ? ACCENT : "rgba(255,255,255,0.4)", background: editMode ? "rgba(0,229,255,0.06)" : "transparent", borderRadius: 4, cursor: "pointer", transition: "all 0.2s" }}>
              {editMode ? "DONE" : "MANAGE"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    const t = testimonials[safeIndex];
    return (
      <section id="testimonials" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(8,8,8,0.99)", padding: "56px 0 48px", overflow: "hidden" }}>
        {Header}

        {/* Mobile single-card carousel */}
        <div style={{ padding: "0 20px", boxSizing: "border-box" }}>
          {t && (
            <AnimatePresence mode="wait">
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <TestimonialCard
                  t={t}
                  fullWidth
                  editMode={editMode}
                  onEdit={() => setEditingId(t.id)}
                  onDelete={() => remove(t.id)}
                />
              </motion.div>
            </AnimatePresence>
          )}

          {/* Prev / Next controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 20 }}>
            <button
              onClick={() => setCurrentIndex((i) => (i - 1 + testimonials.length) % testimonials.length)}
              style={{
                fontFamily: "monospace", fontSize: 11, padding: "8px 18px",
                border: "1px solid rgba(255,255,255,0.15)", borderRadius: 4,
                color: "rgba(255,255,255,0.5)", background: "transparent", cursor: "pointer",
                letterSpacing: "0.1em",
              }}
            >
              ← PREV
            </button>

            <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}>
              {safeIndex + 1} / {testimonials.length}
            </span>

            <button
              onClick={() => setCurrentIndex((i) => (i + 1) % testimonials.length)}
              style={{
                fontFamily: "monospace", fontSize: 11, padding: "8px 18px",
                border: `1px solid rgba(0,229,255,0.4)`, borderRadius: 4,
                color: ACCENT, background: "rgba(0,229,255,0.05)", cursor: "pointer",
                letterSpacing: "0.1em",
              }}
            >
              NEXT →
            </button>
          </div>

          {/* Indicator dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 14 }}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                style={{
                  width: i === safeIndex ? 18 : 5,
                  height: 5,
                  borderRadius: 3,
                  border: "none",
                  background: i === safeIndex ? ACCENT : "rgba(255,255,255,0.15)",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.3s ease",
                  boxShadow: i === safeIndex ? `0 0 6px rgba(0,229,255,0.5)` : "none",
                }}
              />
            ))}
          </div>
        </div>

        <AnimatePresence>
          {editingTestimonial && (
            <EditModal t={editingTestimonial} onSave={update} onClose={() => setEditingId(null)} />
          )}
        </AnimatePresence>
      </section>
    );
  }

  // ── Desktop: infinite scroll ──
  return (
    <section id="testimonials" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(8,8,8,0.99)", padding: "80px 0", overflow: "hidden" }}>
      <style>{`
        @keyframes ns-scroll { from { transform: translateX(0); } to { transform: translateX(-${trackWidth}px); } }
      `}</style>

      {Header}

      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{ overflow: "hidden", paddingBottom: 8 }}
      >
        <div style={{
          display: "flex",
          gap: CARD_GAP,
          width: "max-content",
          padding: "8px 0 8px 48px",
          animation: `ns-scroll ${duration}s linear infinite`,
          animationPlayState: paused || editMode ? "paused" : "running",
          willChange: "transform",
        }}>
          {track.map((t, i) => (
            <TestimonialCard
              key={`${t.id}-${i}`}
              t={t}
              editMode={editMode && i < testimonials.length}
              onEdit={() => setEditingId(t.id)}
              onDelete={() => remove(t.id)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {editingTestimonial && (
          <EditModal t={editingTestimonial} onSave={update} onClose={() => setEditingId(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
