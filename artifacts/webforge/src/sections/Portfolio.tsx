import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { checkAdmin, logout, attemptLogin, getRateLimit } from "../utils/auth";

// ─── Types ────────────────────────────────────────────────────────────────────
export type Project = {
  id: string;
  client: string;
  url: string;
  industry: string;
  description: string;
  prevSpeed: string;
  newSpeed: string;
  prevConv: string;
  newConv: string;
  tags: string[];
  videoUrl: string;
  date?: string;
  priceRange?: string;
  duration?: string;
  images?: string[];
};

// ─── Default data ─────────────────────────────────────────────────────────────
const DEFAULT_PROJECTS: Project[] = [
  {
    id: "1", client: "Apex Roofing Co.", url: "apexroofing.com", industry: "Home Services",
    description: "Full rebuild from a sluggish WordPress template to a hand-coded asset. Eliminated 14 redundant plugins, restructured local SEO, and redesigned the quote form flow for maximum lead capture.",
    prevSpeed: "3.9s", newSpeed: "0.7s", prevConv: "1.8%", newConv: "5.2%",
    tags: ["Local SEO", "Lead Gen", "Hand-coded"], videoUrl: "https://www.youtube.com/watch?v=4DYu-T8koNQ",
    date: "June 2026", priceRange: "$500–$1,200", duration: "5–10 days", images: [],
  },
  {
    id: "2", client: "Cascade HVAC", url: "cascadehvac.com", industry: "HVAC & Climate Control",
    description: "Stripped a 22-plugin WordPress site down to zero dependencies. Rebuilt with semantic HTML, deferred asset loading, and structured data markup. Now ranking page one for 8 target keywords.",
    prevSpeed: "5.2s", newSpeed: "0.6s", prevConv: "0.9%", newConv: "4.8%",
    tags: ["SEO Overhaul", "Plugin Elimination", "Structured Data"], videoUrl: "https://www.youtube.com/watch?v=egDYXqQ-YX0",
    date: "May 2026", priceRange: "$800–$1,500", duration: "7–14 days", images: [],
  },
  {
    id: "3", client: "Sentinel Law Group", url: "sentinellaw.com", industry: "Legal Services",
    description: "Trust and authority architecture for a boutique law firm. High-contrast design with precise CTA placement, WCAG-compliant markup, and a conversion-optimised consultation booking flow.",
    prevSpeed: "4.1s", newSpeed: "0.9s", prevConv: "2.1%", newConv: "7.1%",
    tags: ["Conversion Design", "Accessibility", "Consultation Flow"], videoUrl: "https://www.youtube.com/watch?v=ezQBGeX8_kk",
    date: "April 2026", priceRange: "$1,000–$2,000", duration: "10–21 days", images: [],
  },
];

const DEFAULT_ARCHIVE_PROJECTS: Project[] = [
  {
    id: "arch-1", client: "New Archive Project", url: "client.com", industry: "Industry",
    description: "Describe the project here — what was built, the challenge solved, and the outcome delivered.",
    prevSpeed: "0.0s", newSpeed: "0.0s", prevConv: "0.0%", newConv: "0.0%",
    tags: ["Tag"], videoUrl: "",
    date: "", priceRange: "", duration: "", images: [],
  },
];

// ─── Storage ──────────────────────────────────────────────────────────────────
const STORAGE_KEY         = "webforge_projects_v3";
const ARCHIVE_STORAGE_KEY = "webforge_archive_v1";
const ACCENT = "#00E5FF";

function loadProjects(): Project[] {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r); } catch {}
  return DEFAULT_PROJECTS;
}
function saveProjects(p: Project[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
}
function loadArchiveProjects(): Project[] {
  try { const r = localStorage.getItem(ARCHIVE_STORAGE_KEY); if (r) return JSON.parse(r); } catch {}
  return DEFAULT_ARCHIVE_PROJECTS;
}
function saveArchiveProjects(p: Project[]) {
  try { localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(p)); } catch {}
}

// ─── YouTube helpers ──────────────────────────────────────────────────────────
function getYoutubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}
function getYoutubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0` : null;
}

// ─── Cut-corner clip path ─────────────────────────────────────────────────────
const CUT = 14; // px corner cut size
const cutCorners = `polygon(0 ${CUT}px, ${CUT}px 0, calc(100% - ${CUT}px) 0, 100% ${CUT}px, 100% calc(100% - ${CUT}px), calc(100% - ${CUT}px) 100%, ${CUT}px 100%, 0 calc(100% - ${CUT}px))`;
const cutCornersInner = `polygon(0 ${CUT - 1}px, ${CUT - 1}px 0, calc(100% - ${CUT - 1}px) 0, 100% ${CUT - 1}px, 100% calc(100% - ${CUT - 1}px), calc(100% - ${CUT - 1}px) 100%, ${CUT - 1}px 100%, 0 calc(100% - ${CUT - 1}px))`;



// ─── Project Detail Modal ─────────────────────────────────────────────────────
function ProjectDetailModal({
  projects, index, isAdmin, onClose, onNav, onUpdate,
}: {
  projects: Project[];
  index: number;
  isAdmin: boolean;
  onClose: () => void;
  onNav: (i: number) => void;
  onUpdate: (p: Project) => void;
}) {
  const [modalEdit, setModalEdit] = useState(false);
  const [draft, setDraft] = useState<Project>(projects[index]);

  // Sync draft when navigating
  useEffect(() => {
    setDraft(projects[index]);
    setModalEdit(false);
  }, [index, projects]);

  const project = modalEdit ? draft : projects[index];
  const embedUrl = project.videoUrl ? getYoutubeEmbed(project.videoUrl) : null;
  const images = project.images ?? [];
  const total = projects.length;

  function field<K extends keyof Project>(key: K, val: Project[K]) {
    setDraft((d) => ({ ...d, [key]: val }));
  }

  function save() {
    onUpdate(draft);
    setModalEdit(false);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.25)",
    padding: "6px 10px", color: "#fff", fontFamily: "monospace", fontSize: 12,
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "monospace", fontSize: 9, letterSpacing: "0.16em",
    color: "rgba(0,229,255,0.55)", textTransform: "uppercase", marginBottom: 5, display: "block",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)", padding: "16px" }}
      onClick={onClose}
    >
      {/* Border wrapper — cut corners */}
      <motion.div
        initial={{ scale: 0.95, y: 18 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 18 }}
        transition={{ duration: 0.22 }}
        style={{ width: "min(640px, 100%)", maxHeight: "90vh", clipPath: cutCorners, background: "rgba(0,229,255,0.28)", padding: "1px", display: "flex", flexDirection: "column", boxShadow: "0 0 60px rgba(0,229,255,0.12)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Inner container */}
        <div style={{ clipPath: cutCornersInner, background: "#090909", display: "flex", flexDirection: "column", flex: 1, maxHeight: "calc(90vh - 2px)", overflow: "hidden" }}>

          {/* ── Header ── */}
          <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(0,229,255,0.1)", flexShrink: 0, background: "#0d0d0d" }}>
            {/* Avatar */}
            <div style={{ width: 34, height: 34, background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: ACCENT, fontWeight: 900, fontSize: 13, fontFamily: "monospace" }}>{projects[index].client[0]}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.08em", color: "rgba(255,255,255,0.55)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                // MADE BY <span style={{ color: ACCENT }}>NOVASITES</span>
              </div>
            </div>

            {/* Admin manage button */}
            {isAdmin && (
              <button
                onClick={() => { if (modalEdit) { save(); } else { setModalEdit(true); } }}
                style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.13em", padding: "5px 11px", border: `1px solid ${modalEdit ? ACCENT : "rgba(0,229,255,0.3)"}`, color: modalEdit ? "#0a0a0a" : ACCENT, background: modalEdit ? ACCENT : "transparent", cursor: "pointer", flexShrink: 0, transition: "all 0.18s" }}
              >
                {modalEdit ? "SAVE" : "MANAGE"}
              </button>
            )}
            {modalEdit && (
              <button
                onClick={() => { setDraft(projects[index]); setModalEdit(false); }}
                style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.13em", padding: "5px 11px", border: "1px solid rgba(255,51,51,0.4)", color: "#FF3333", background: "transparent", cursor: "pointer", flexShrink: 0 }}
              >
                CANCEL
              </button>
            )}

            {/* Nav arrows */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
              <button onClick={() => onNav((index - 1 + total) % total)} style={{ width: 26, height: 26, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>←</button>
              <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{index + 1}/{total}</span>
              <button onClick={() => onNav((index + 1) % total)} style={{ width: 26, height: 26, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>→</button>
            </div>

            {/* Close */}
            <button onClick={onClose} style={{ width: 26, height: 26, border: "1px solid rgba(255,255,255,0.12)", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>✕</button>
          </div>

          {/* ── Scrollable body ── */}
          <div style={{ overflowY: "auto", flex: 1 }}>

            {/* Info */}
            <div style={{ padding: "24px 24px 20px" }}>
              {modalEdit ? (
                <div style={{ marginBottom: 10 }}>
                  <span style={labelStyle}>Date</span>
                  <input value={draft.date ?? ""} onChange={(e) => field("date", e.target.value)} style={inputStyle} placeholder="e.g. June 2026" />
                </div>
              ) : (
                project.date && <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", marginBottom: 10 }}>FROM: {project.date}</div>
              )}

              {modalEdit ? (
                <div style={{ marginBottom: 14 }}>
                  <span style={labelStyle}>Client name</span>
                  <input value={draft.client} onChange={(e) => field("client", e.target.value)} style={{ ...inputStyle, fontSize: 20, fontWeight: 800, color: "#fff" }} />
                </div>
              ) : (
                <h2 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: "0 0 14px", lineHeight: 1.2 }}>{project.client}</h2>
              )}

              {modalEdit ? (
                <div style={{ marginBottom: 20 }}>
                  <span style={labelStyle}>Description</span>
                  <textarea value={draft.description} onChange={(e) => field("description", e.target.value)} rows={4} style={{ ...inputStyle, resize: "none", lineHeight: 1.7 }} />
                </div>
              ) : (
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.5)", margin: "0 0 22px" }}>{project.description}</p>
              )}

              {/* Metadata row */}
              {modalEdit ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 8 }}>
                  {([ ["Price range", "priceRange", "$100–$500"], ["Duration", "duration", "1–7 days"], ["Industry", "industry", "Industry"] ] as const).map(([label, key, ph]) => (
                    <div key={key}>
                      <span style={labelStyle}>{label}</span>
                      <input value={(draft[key] as string) ?? ""} onChange={(e) => field(key as keyof Project, e.target.value as never)} placeholder={ph} style={inputStyle} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 8, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 18 }}>
                  <div>
                    <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>PRICE RANGE</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{project.priceRange || "—"}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>DURATION</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{project.duration || "—"}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>INDUSTRY</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{project.industry}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Media */}
            <div style={{ padding: "0 24px 20px", display: "flex", flexDirection: "column", gap: 14 }}>
              {modalEdit ? (
                <>
                  <div>
                    <span style={labelStyle}>Video URL (YouTube or direct)</span>
                    <input value={draft.videoUrl} onChange={(e) => field("videoUrl", e.target.value)} placeholder="https://youtube.com/watch?v=..." style={inputStyle} />
                  </div>
                  <div>
                    <span style={labelStyle}>Image URLs (one per line)</span>
                    <textarea
                      value={(draft.images ?? []).join("\n")}
                      onChange={(e) => field("images", e.target.value.split("\n").map(s => s.trim()).filter(Boolean))}
                      rows={4} placeholder={"https://i.imgur.com/abc.jpg\nhttps://..."}
                      style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
                    />
                  </div>
                </>
              ) : (
                <>
                  {project.videoUrl && (
                    <div style={{ position: "relative", paddingTop: "56.25%", background: "#000", overflow: "hidden" }}>
                      {embedUrl ? (
                        <iframe src={embedUrl} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }} allow="autoplay; fullscreen" />
                      ) : (
                        <video src={project.videoUrl} controls autoPlay style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "#000" }} />
                      )}
                    </div>
                  )}
                  {images.map((src, i) => (
                    <img key={i} src={src} alt={`${project.client} screenshot ${i + 1}`} style={{ width: "100%", display: "block", objectFit: "cover" }} />
                  ))}
                  {!project.videoUrl && images.length === 0 && (
                    <div style={{ border: "1px dashed rgba(0,229,255,0.15)", padding: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)" }}>NO MEDIA — ADMIN CAN ADD VIA MANAGE</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Tags */}
            <div style={{ padding: "0 24px 28px" }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.16em", color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>// PROJECT CATEGORY</div>
              {modalEdit ? (
                <>
                  <span style={labelStyle}>Tags (comma separated)</span>
                  <input
                    value={draft.tags.join(", ")}
                    onChange={(e) => field("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                    placeholder="Tag 1, Tag 2, Tag 3"
                    style={inputStyle}
                  />
                </>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {project.tags.map((tag) => (
                    <span key={tag} style={{ padding: "5px 13px", border: "1px solid rgba(0,229,255,0.22)", fontSize: 12, color: "rgba(0,229,255,0.75)", background: "rgba(0,229,255,0.04)", fontFamily: "monospace", letterSpacing: "0.05em" }}>{tag}</span>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Animated archive button ──────────────────────────────────────────────────
function ArchiveButton({ expanded, onClick }: { expanded: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onMouseDown={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(0.97)")}
      onMouseUp={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
      style={{ position: "relative", width: "100%", padding: "11px 22px", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: hov ? "#0A0A0A" : ACCENT, border: `1px solid ${hov ? ACCENT : "rgba(0,229,255,0.45)"}`, background: "transparent", overflow: "hidden", cursor: "pointer", transition: "color 0.22s, border-color 0.22s", fontFamily: "inherit" }}
    >
      <motion.span style={{ position: "absolute", inset: 0, background: ACCENT, originX: 0, display: "block" }} initial={{ scaleX: 0 }} animate={{ scaleX: hov ? 1 : 0 }} transition={{ duration: 0.22, ease: "easeInOut" }} />
      <span style={{ position: "absolute", top: 4, left: 4, width: 8, height: 8, borderTop: `1.5px solid ${ACCENT}`, borderLeft: `1.5px solid ${ACCENT}`, zIndex: 2, opacity: hov ? 0 : 1, transition: "opacity 0.15s" }} />
      <span style={{ position: "absolute", bottom: 4, right: 4, width: 8, height: 8, borderBottom: `1.5px solid ${ACCENT}`, borderRight: `1.5px solid ${ACCENT}`, zIndex: 2, opacity: hov ? 0 : 1, transition: "opacity 0.15s" }} />
      <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <span style={{ fontFamily: "monospace", opacity: hov ? 1 : 0.5, transition: "opacity 0.2s" }}>{">"}</span>
        {expanded ? "HIDE ARCHIVE" : "VIEW EXTENDED DEPLOYED ARCHIVE"}
      </span>
    </button>
  );
}

// ─── Admin password modal ─────────────────────────────────────────────────────
function AdminModal({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const [pw, setPw] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading" | "wrong" | "locked">("idle");
  const [remainingMs, setRemainingMs] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(3);

  useEffect(() => {
    const { locked, remainingMs: ms, attempts } = getRateLimit();
    if (locked) { setPhase("locked"); setRemainingMs(ms); }
    else { setAttemptsLeft(Math.max(0, 3 - attempts)); }
  }, []);

  useEffect(() => {
    if (phase !== "locked") return;
    const t = setInterval(() => {
      setRemainingMs((ms) => {
        const next = ms - 1000;
        if (next <= 0) { setPhase("idle"); setAttemptsLeft(3); return 0; }
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhase("loading");
    const result = await attemptLogin(pw);
    if (result === "ok") {
      onSuccess();
    } else if (result === "locked") {
      const { remainingMs: ms } = getRateLimit();
      setPhase("locked"); setRemainingMs(ms);
    } else {
      const { attempts } = getRateLimit();
      setAttemptsLeft(Math.max(0, 3 - attempts));
      setPhase("wrong"); setPw("");
      setTimeout(() => setPhase("idle"), 1800);
    }
  };

  const mins = Math.ceil(remainingMs / 60000);
  const isLocked  = phase === "locked";
  const isWrong   = phase === "wrong";
  const isLoading = phase === "loading";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <motion.form initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94 }}
        onSubmit={submit} onClick={(e) => e.stopPropagation()}
        style={{ background: "#0d0d0d", border: `1px solid ${isWrong || isLocked ? "#FF3333" : "rgba(0,229,255,0.3)"}`, borderRadius: 8, padding: "32px 28px", width: 320, transition: "border-color 0.3s", boxSizing: "border-box" }}>

        <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: ACCENT, marginBottom: 18 }}>// ADMIN ACCESS</div>

        {isLocked ? (
          <div style={{ fontFamily: "monospace", fontSize: 11, color: "#FF3333", lineHeight: 1.6, marginBottom: 18 }}>
            ACCESS LOCKED<br />
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 10 }}>
              Try again in {mins} minute{mins !== 1 ? "s" : ""}
            </span>
          </div>
        ) : (
          <>
            <input
              autoFocus type="password" value={pw}
              onChange={(e) => setPw(e.target.value)}
              disabled={isLoading}
              placeholder="Enter admin password"
              style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${isWrong ? "#FF3333" : "rgba(255,255,255,0.15)"}`, borderRadius: 4, padding: "10px 12px", color: "#fff", fontFamily: "monospace", fontSize: 13, outline: "none", boxSizing: "border-box", transition: "border-color 0.3s", opacity: isLoading ? 0.6 : 1 }}
            />
            {isWrong && (
              <div style={{ fontFamily: "monospace", fontSize: 10, color: "#FF3333", marginTop: 8 }}>
                INCORRECT — {attemptsLeft} attempt{attemptsLeft !== 1 ? "s" : ""} remaining
              </div>
            )}
            <button
              type="submit" disabled={isLoading || !pw}
              style={{ marginTop: 16, width: "100%", padding: "10px", background: isLoading ? "rgba(0,229,255,0.5)" : ACCENT, border: "none", borderRadius: 4, color: "#0a0a0a", fontWeight: 700, fontSize: 11, letterSpacing: "0.15em", cursor: isLoading ? "not-allowed" : "pointer", fontFamily: "monospace", transition: "background 0.2s" }}>
              {isLoading ? "VERIFYING..." : "AUTHENTICATE"}
            </button>
          </>
        )}

        <button type="button" onClick={onClose} style={{ marginTop: 8, width: "100%", padding: "8px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, color: "rgba(255,255,255,0.3)", fontSize: 10, cursor: "pointer", fontFamily: "monospace" }}>CANCEL</button>
      </motion.form>
    </motion.div>
  );
}

// ─── Project window card ──────────────────────────────────────────────────────
function ProjectWindow({ project, index, editMode, inView, onChange, onDelete, onOpen }: {
  project: Project; index: number; editMode: boolean; inView: boolean;
  onChange: (p: Project) => void; onDelete: () => void;
  onOpen: () => void;
}) {
  const [hov, setHov] = useState(false);
  const videoId = getYoutubeId(project.videoUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={!editMode ? onOpen : undefined}
      style={{
        border: `1px solid ${hov ? "rgba(0,229,255,0.25)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 8, overflow: "hidden",
        background: "rgba(12,12,12,0.98)",
        transition: "border-color 0.2s",
        display: "flex", flexDirection: "column",
        cursor: editMode ? "default" : "pointer",
      }}
    >
      {/* Window chrome */}
      <div style={{ background: "#111", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "9px 14px", display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57", display: "inline-block", flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E", display: "inline-block", flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28CA41", display: "inline-block", flexShrink: 0 }} />
        <div style={{ flex: 1, background: "#0a0a0a", borderRadius: 3, padding: "3px 10px", marginLeft: 6, fontFamily: "monospace", fontSize: 10.5, color: "rgba(255,255,255,0.32)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
          {editMode
            ? <input value={project.url} placeholder="domain.com" onChange={(e) => onChange({ ...project, url: e.target.value })} style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 10.5, width: "100%", outline: "none" }} />
            : project.url}
        </div>
        {editMode && (
          <button onClick={onDelete} style={{ background: "rgba(255,51,51,0.12)", border: "1px solid rgba(255,51,51,0.35)", borderRadius: 3, color: "#FF3333", fontSize: 9, padding: "2px 7px", cursor: "pointer", flexShrink: 0, fontFamily: "monospace" }}>DELETE</button>
        )}
      </div>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, minHeight: 300 }}>

        {/* LEFT: video */}
        <div style={{ position: "relative", width: "50%", flexShrink: 0, background: "#050505", overflow: "hidden", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          {inView && videoId && (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0&modestbranding=1&playsinline=1`}
              allow="autoplay; fullscreen"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", pointerEvents: "none", transform: "scale(1.04)" }}
              title={`${project.client} reel`}
            />
          )}
          {(!inView || !videoId) && (
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          )}
          {editMode && (
            <div style={{ position: "absolute", bottom: 10, left: 10, right: 10, zIndex: 2 }} onClick={(e) => e.stopPropagation()}>
              <input
                value={project.videoUrl}
                placeholder="YouTube or video URL"
                onChange={(e) => onChange({ ...project, videoUrl: e.target.value })}
                style={{ width: "100%", background: "rgba(0,0,0,0.75)", border: "1px solid rgba(0,229,255,0.4)", borderRadius: 3, padding: "5px 9px", color: "rgba(255,255,255,0.75)", fontFamily: "monospace", fontSize: 10, outline: "none", boxSizing: "border-box" }}
              />
            </div>
          )}
        </div>

        {/* RIGHT: details */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          <div style={{ padding: "20px 22px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 6 }}>
              {editMode
                ? <input value={project.industry} placeholder="Industry" onChange={(e) => onChange({ ...project, industry: e.target.value })} style={{ background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 3, padding: "1px 6px", color: "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 9, outline: "none" }} />
                : project.industry}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 14 }}>
              {editMode
                ? <input value={project.client} placeholder="Client Name" onChange={(e) => onChange({ ...project, client: e.target.value })} style={{ background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.22)", borderRadius: 3, padding: "2px 8px", color: "#fff", fontWeight: 800, fontSize: 18, width: "100%", outline: "none" }} />
                : project.client}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {([["PAGE SPEED", "prevSpeed", "newSpeed"], ["CONVERSION", "prevConv", "newConv"]] as const).map(([label, pk, nk]) => (
                <div key={label}>
                  <div style={{ fontFamily: "monospace", fontSize: 8, letterSpacing: "0.14em", color: "rgba(255,255,255,0.28)", marginBottom: 4 }}>{label}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                    {editMode
                      ? <>
                          <input value={project[pk]} placeholder="0s" onChange={(e) => onChange({ ...project, [pk]: e.target.value })} style={{ width: 38, background: "rgba(255,51,51,0.08)", border: "1px solid rgba(255,51,51,0.25)", borderRadius: 3, padding: "1px 4px", color: "#FF3333", fontFamily: "monospace", fontSize: 10, outline: "none", textDecoration: "line-through" }} />
                          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 9 }}>►</span>
                          <input value={project[nk]} placeholder="0s" onChange={(e) => onChange({ ...project, [nk]: e.target.value })} style={{ width: 42, background: "rgba(0,229,255,0.07)", border: "1px solid rgba(0,229,255,0.25)", borderRadius: 3, padding: "1px 4px", color: ACCENT, fontFamily: "monospace", fontSize: 13, fontWeight: 700, outline: "none" }} />
                        </>
                      : <>
                          <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.28)", textDecoration: "line-through" }}>{project[pk]}</span>
                          <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: ACCENT }}>► {project[nk]}</span>
                        </>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: "16px 22px 20px", flex: 1 }}>
            {editMode
              ? <textarea value={project.description} placeholder="Project description..." rows={4} onChange={(e) => onChange({ ...project, description: e.target.value })} style={{ width: "100%", background: "rgba(0,229,255,0.03)", border: "1px solid rgba(0,229,255,0.18)", borderRadius: 4, padding: "8px 10px", color: "rgba(255,255,255,0.58)", fontSize: 12, lineHeight: 1.7, resize: "none", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              : <p style={{ fontSize: 13, lineHeight: 1.8, color: "rgba(255,255,255,0.5)", margin: "0 0 14px" }}>{project.description}</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {editMode
                ? <input value={project.tags.join(", ")} placeholder="Tag 1, Tag 2" onChange={(e) => onChange({ ...project, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} style={{ flex: 1, background: "rgba(0,229,255,0.03)", border: "1px solid rgba(0,229,255,0.18)", borderRadius: 3, padding: "3px 8px", color: "rgba(255,255,255,0.45)", fontSize: 10.5, outline: "none", fontFamily: "monospace" }} />
                : project.tags.map((tag) => (
                    <span key={tag} style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.07em", padding: "3px 8px", borderRadius: 3, border: "1px solid rgba(0,229,255,0.18)", color: "rgba(0,229,255,0.65)", background: "rgba(0,229,255,0.03)" }}>{tag}</span>
                  ))}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Portfolio section ───────────────────────────────────────────────────
export function Portfolio() {
  const sectionRef                  = useRef<HTMLElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [projects, setProjects]     = useState<Project[]>(loadProjects);
  const [archiveProjects, setArchiveProjects] = useState<Project[]>(loadArchiveProjects);
  const [editMode, setEditMode]     = useState(false);
  const [isMobile, setIsMobile]     = useState(false);
  const [inView, setInView]         = useState(false);

  // activePool: which array is the modal currently showing
  const [activePool, setActivePool] = useState<"main" | "archive">("main");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeProjects = activePool === "main" ? projects : archiveProjects;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Admin
  const [isAdmin, setIsAdmin]               = useState(checkAdmin);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const clickCount                          = useRef(0);
  const clickTimer                          = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTitleClick = () => {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 900);
    if (clickCount.current >= 3) {
      clickCount.current = 0;
      if (isAdmin) { logout(); setIsAdmin(false); setEditMode(false); }
      else setShowAdminModal(true);
    }
  };

  // Main project CRUD
  function updateProject(i: number, updated: Project) {
    const next = projects.map((p, idx) => (idx === i ? updated : p));
    setProjects(next); saveProjects(next);
  }
  function deleteProject(i: number) {
    const next = projects.filter((_, idx) => idx !== i);
    setProjects(next); saveProjects(next);
  }
  function addProject() {
    const next: Project = { id: Date.now().toString(), client: "New Client", url: "newclient.com", industry: "Industry", description: "Project description.", prevSpeed: "0.0s", newSpeed: "0.0s", prevConv: "0.0%", newConv: "0.0%", tags: ["Tag"], videoUrl: "", date: "", priceRange: "", duration: "", images: [] };
    const updated = [...projects, next]; setProjects(updated); saveProjects(updated);
  }
  function resetProjects() { setProjects(DEFAULT_PROJECTS); saveProjects(DEFAULT_PROJECTS); }

  // Archive CRUD
  function updateArchiveProject(i: number, updated: Project) {
    const next = archiveProjects.map((p, idx) => (idx === i ? updated : p));
    setArchiveProjects(next); saveArchiveProjects(next);
  }
  function deleteArchiveProject(i: number) {
    const next = archiveProjects.filter((_, idx) => idx !== i);
    setArchiveProjects(next); saveArchiveProjects(next);
  }
  function addArchiveProject() {
    const next: Project = { id: `arch-${Date.now()}`, client: "New Archive Project", url: "client.com", industry: "Industry", description: "Project description.", prevSpeed: "0.0s", newSpeed: "0.0s", prevConv: "0.0%", newConv: "0.0%", tags: ["Tag"], videoUrl: "", date: "", priceRange: "", duration: "", images: [] };
    const updated = [...archiveProjects, next]; setArchiveProjects(updated); saveArchiveProjects(updated);
  }

  // Modal update router
  function handleModalUpdate(updated: Project) {
    if (activePool === "main" && activeIndex !== null) updateProject(activeIndex, updated);
    else if (activePool === "archive" && activeIndex !== null) updateArchiveProject(activeIndex, updated);
  }

  return (
    <section id="portfolio" className="py-24 bg-background" ref={sectionRef}>
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-12">
          <div>
            <h2 className="mb-4 cursor-default select-none" onClick={handleTitleClick}>
              <span className="anchor-prefix">//</span> The Portfolio.
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Performance Proof: A digital infrastructure is only as valuable as the measurable results it delivers.
            </p>
          </div>

          {isAdmin && (
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
              {editMode && (
                <>
                  <button onClick={addProject} style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.13em", padding: "7px 14px", border: "1px solid rgba(0,229,255,0.4)", color: ACCENT, background: "rgba(0,229,255,0.06)", borderRadius: 4, cursor: "pointer" }}>+ ADD</button>
                  <button onClick={resetProjects} style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.13em", padding: "7px 14px", border: "1px solid rgba(255,51,51,0.35)", color: "#FF3333", background: "rgba(255,51,51,0.05)", borderRadius: 4, cursor: "pointer" }}>RESET</button>
                </>
              )}
              <button onClick={() => setEditMode(!editMode)} style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.13em", padding: "7px 14px", border: `1px solid ${editMode ? "rgba(0,229,255,0.55)" : "rgba(255,255,255,0.15)"}`, color: editMode ? ACCENT : "rgba(255,255,255,0.4)", background: editMode ? "rgba(0,229,255,0.06)" : "transparent", borderRadius: 4, cursor: "pointer", transition: "all 0.2s" }}>
                {editMode ? "DONE" : "MANAGE PROJECTS"}
              </button>
            </div>
          )}
        </div>

        {editMode && isAdmin && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: "monospace", fontSize: 10.5, color: ACCENT, background: "rgba(0,229,255,0.04)", border: "1px solid rgba(0,229,255,0.18)", borderRadius: 4, padding: "9px 16px", marginBottom: 22 }}>
            // EDIT MODE — fields are editable, changes persist in your browser.
          </motion.div>
        )}

        {/* ── Project Windows ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginBottom: 32 }}>
          {projects.map((project, i) => (
            <ProjectWindow
              key={project.id} project={project} index={i} editMode={editMode && isAdmin}
              inView={inView}
              onChange={(u) => updateProject(i, u)}
              onDelete={() => deleteProject(i)}
              onOpen={() => { setActivePool("main"); setActiveIndex(i); }}
            />
          ))}
        </div>

        {/* ── Archive ── */}
        <ArchiveButton expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)} />
        <AnimatePresence>
          {isExpanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-8">

              {/* Archive admin controls */}
              {isAdmin && editMode && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  <button onClick={addArchiveProject} style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.13em", padding: "7px 14px", border: "1px solid rgba(0,229,255,0.4)", color: ACCENT, background: "rgba(0,229,255,0.06)", borderRadius: 4, cursor: "pointer" }}>+ ADD TO ARCHIVE</button>
                </motion.div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
                {archiveProjects.map((project, i) => (
                  <ProjectWindow
                    key={project.id} project={project} index={i} editMode={editMode && isAdmin}
                    inView={inView}
                    onChange={(u) => updateArchiveProject(i, u)}
                    onDelete={() => deleteArchiveProject(i)}
                    onOpen={() => { setActivePool("archive"); setActiveIndex(i); }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Project detail modal */}
      <AnimatePresence>
        {activeIndex !== null && (
          <ProjectDetailModal
            projects={activeProjects}
            index={activeIndex}
            isAdmin={isAdmin}
            onClose={() => setActiveIndex(null)}
            onNav={(i) => setActiveIndex(i)}
            onUpdate={handleModalUpdate}
          />
        )}
      </AnimatePresence>

      {/* Admin password modal */}
      <AnimatePresence>
        {showAdminModal && (
          <AdminModal
            onSuccess={() => { setIsAdmin(true); setShowAdminModal(false); }}
            onClose={() => setShowAdminModal(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
