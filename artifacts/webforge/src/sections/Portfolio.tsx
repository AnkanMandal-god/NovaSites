import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
};

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "1", client: "Apex Roofing Co.", url: "apexroofing.com", industry: "Home Services",
    description: "Full rebuild from a sluggish WordPress template to a hand-coded asset. Eliminated 14 redundant plugins, restructured local SEO, and redesigned the quote form flow for maximum lead capture.",
    prevSpeed: "3.9s", newSpeed: "0.7s", prevConv: "1.8%", newConv: "5.2%",
    tags: ["Local SEO", "Lead Gen", "Hand-coded"], videoUrl: "",
  },
  {
    id: "2", client: "Cascade HVAC", url: "cascadehvac.com", industry: "HVAC & Climate Control",
    description: "Stripped a 22-plugin WordPress site down to zero dependencies. Rebuilt with semantic HTML, deferred asset loading, and structured data markup. Now ranking page one for 8 target keywords.",
    prevSpeed: "5.2s", newSpeed: "0.6s", prevConv: "0.9%", newConv: "4.8%",
    tags: ["SEO Overhaul", "Plugin Elimination", "Structured Data"], videoUrl: "",
  },
  {
    id: "3", client: "Sentinel Law Group", url: "sentinellaw.com", industry: "Legal Services",
    description: "Trust and authority architecture for a boutique law firm. High-contrast design with precise CTA placement, WCAG-compliant markup, and a conversion-optimised consultation booking flow.",
    prevSpeed: "4.1s", newSpeed: "0.9s", prevConv: "2.1%", newConv: "7.1%",
    tags: ["Conversion Design", "Accessibility", "Consultation Flow"], videoUrl: "",
  },
];

const ARCHIVE_PROJECTS = [
  { name: "Vanguard Logistics",    prevSpeed: "6.0s", newSpeed: "0.8s", prevConv: "1.1%", newConv: "5.5%" },
  { name: "Summit Dental Group",   prevSpeed: "4.4s", newSpeed: "0.7s", prevConv: "1.5%", newConv: "6.0%" },
  { name: "Ember & Oak Interiors", prevSpeed: "5.7s", newSpeed: "0.9s", prevConv: "1.0%", newConv: "4.2%" },
  { name: "TerraForm Landscaping", prevSpeed: "3.8s", newSpeed: "0.6s", prevConv: "2.0%", newConv: "5.9%" },
];

const STORAGE_KEY = "webforge_projects";
const ADMIN_KEY   = "ns_adm";
const ADMIN_PASS  = "novasites2026";
const ACCENT = "#00E5FF";

// ─── Persistence ──────────────────────────────────────────────────────────────
function loadProjects(): Project[] {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r); } catch {}
  return DEFAULT_PROJECTS;
}
function saveProjects(p: Project[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
}
function checkAdmin(): boolean {
  try { return atob(localStorage.getItem(ADMIN_KEY) ?? "") === ADMIN_PASS; } catch { return false; }
}
function setAdminFlag() {
  localStorage.setItem(ADMIN_KEY, btoa(ADMIN_PASS));
}
function clearAdminFlag() {
  localStorage.removeItem(ADMIN_KEY);
}

// ─── YouTube helper ───────────────────────────────────────────────────────────
function getYoutubeEmbed(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0` : null;
}

// ─── Video Mini-Player ────────────────────────────────────────────────────────
function MiniPlayer({ project, onClose }: { project: Project; onClose: () => void }) {
  const embedUrl = project.videoUrl ? getYoutubeEmbed(project.videoUrl) : null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 20 }}
        transition={{ duration: 0.22 }}
        style={{ width: "min(700px, 95vw)", background: "#090909", border: `1px solid rgba(0,229,255,0.3)`, borderRadius: 10, overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chrome */}
        <div style={{ background: "#111", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28CA41", display: "inline-block" }} />
            <span style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", marginLeft: 6 }}>{project.url}</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 18, cursor: "pointer", lineHeight: 1, padding: "0 4px" }}>✕</button>
        </div>

        {/* Video area */}
        <div style={{ position: "relative", paddingTop: "56.25%", background: "#000" }}>
          {project.videoUrl ? (
            embedUrl ? (
              <iframe
                src={embedUrl}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                allow="autoplay; fullscreen"
              />
            ) : (
              <video
                src={project.videoUrl}
                controls autoPlay
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "#000" }}
              />
            )
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)" }}>NO VIDEO URL CONFIGURED</span>
              <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.18)" }}>Add a YouTube or video URL in MANAGE PROJECTS</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#fff" }}>{project.client}</div>
          <div style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{project.industry}</div>
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
  const [err, setErr] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASS) { setAdminFlag(); onSuccess(); }
    else { setErr(true); setPw(""); setTimeout(() => setErr(false), 1800); }
  };
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: "fixed", inset: 0, zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <motion.form initial={{ scale: 0.94, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94 }}
        onSubmit={submit} onClick={(e) => e.stopPropagation()}
        style={{ background: "#0d0d0d", border: `1px solid ${err ? "#FF3333" : "rgba(0,229,255,0.3)"}`, borderRadius: 8, padding: "32px 28px", width: 320, transition: "border-color 0.3s" }}>
        <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em", color: ACCENT, marginBottom: 18 }}>// ADMIN ACCESS</div>
        <input autoFocus type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Enter admin password"
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${err ? "#FF3333" : "rgba(255,255,255,0.15)"}`, borderRadius: 4, padding: "10px 12px", color: "#fff", fontFamily: "monospace", fontSize: 13, outline: "none", boxSizing: "border-box", transition: "border-color 0.3s" }} />
        {err && <div style={{ fontFamily: "monospace", fontSize: 10, color: "#FF3333", marginTop: 8 }}>INCORRECT PASSWORD</div>}
        <button type="submit" style={{ marginTop: 16, width: "100%", padding: "10px", background: ACCENT, border: "none", borderRadius: 4, color: "#0a0a0a", fontWeight: 700, fontSize: 11, letterSpacing: "0.15em", cursor: "pointer", fontFamily: "monospace" }}>AUTHENTICATE</button>
        <button type="button" onClick={onClose} style={{ marginTop: 8, width: "100%", padding: "8px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, color: "rgba(255,255,255,0.3)", fontSize: 10, cursor: "pointer", fontFamily: "monospace" }}>CANCEL</button>
      </motion.form>
    </motion.div>
  );
}

// ─── Project window card ──────────────────────────────────────────────────────
function ProjectWindow({ project, index, editMode, onChange, onDelete, onVideoClick }: {
  project: Project; index: number; editMode: boolean;
  onChange: (p: Project) => void; onDelete: () => void;
  onVideoClick: () => void;
}) {
  const [hov, setHov] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ border: `1px solid ${hov ? "rgba(0,229,255,0.25)" : "rgba(255,255,255,0.08)"}`, borderRadius: 8, overflow: "hidden", background: "rgba(12,12,12,0.98)", transition: "border-color 0.2s", display: "flex", flexDirection: "column" }}
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

      {/* Video preview */}
      <div
        onClick={onVideoClick}
        style={{ position: "relative", height: 140, background: "#050505", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderBottom: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", flexShrink: 0 }}
      >
        {/* Subtle grid pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
        {/* Play icon */}
        <div style={{ zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, transition: "transform 0.2s" }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", border: `1.5px solid ${ACCENT}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 18px rgba(0,229,255,0.25)" }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill={ACCENT} style={{ marginLeft: 2 }}>
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
          <span style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>
            {project.videoUrl ? "CLICK TO PREVIEW" : "VIDEO PREVIEW"}
          </span>
        </div>
        {/* Video URL field in edit mode */}
        {editMode && (
          <div style={{ position: "absolute", bottom: 8, left: 10, right: 10 }} onClick={(e) => e.stopPropagation()}>
            <input
              value={project.videoUrl}
              placeholder="YouTube or video URL"
              onChange={(e) => onChange({ ...project, videoUrl: e.target.value })}
              style={{ width: "100%", background: "rgba(0,0,0,0.7)", border: "1px solid rgba(0,229,255,0.35)", borderRadius: 3, padding: "4px 8px", color: "rgba(255,255,255,0.7)", fontFamily: "monospace", fontSize: 10, outline: "none", boxSizing: "border-box" }}
            />
          </div>
        )}
      </div>

      {/* Hero strip */}
      <div style={{ padding: "16px 18px 14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 5 }}>
          {editMode
            ? <input value={project.industry} placeholder="Industry" onChange={(e) => onChange({ ...project, industry: e.target.value })} style={{ background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 3, padding: "1px 6px", color: "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 9, outline: "none" }} />
            : project.industry}
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 12 }}>
          {editMode
            ? <input value={project.client} placeholder="Client Name" onChange={(e) => onChange({ ...project, client: e.target.value })} style={{ background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.22)", borderRadius: 3, padding: "2px 8px", color: "#fff", fontWeight: 800, fontSize: 16, width: "100%", outline: "none" }} />
            : project.client}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {([["PAGE SPEED", "prevSpeed", "newSpeed"], ["CONVERSION", "prevConv", "newConv"]] as const).map(([label, pk, nk]) => (
            <div key={label}>
              <div style={{ fontFamily: "monospace", fontSize: 8, letterSpacing: "0.14em", color: "rgba(255,255,255,0.28)", marginBottom: 3 }}>{label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                {editMode
                  ? <>
                      <input value={project[pk]} placeholder="0s" onChange={(e) => onChange({ ...project, [pk]: e.target.value })} style={{ width: 38, background: "rgba(255,51,51,0.08)", border: "1px solid rgba(255,51,51,0.25)", borderRadius: 3, padding: "1px 4px", color: "#FF3333", fontFamily: "monospace", fontSize: 10, outline: "none", textDecoration: "line-through" }} />
                      <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 9 }}>►</span>
                      <input value={project[nk]} placeholder="0s" onChange={(e) => onChange({ ...project, [nk]: e.target.value })} style={{ width: 42, background: "rgba(0,229,255,0.07)", border: "1px solid rgba(0,229,255,0.25)", borderRadius: 3, padding: "1px 4px", color: ACCENT, fontFamily: "monospace", fontSize: 13, fontWeight: 700, outline: "none" }} />
                    </>
                  : <>
                      <span style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.28)", textDecoration: "line-through" }}>{project[pk]}</span>
                      <span style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: ACCENT }}>► {project[nk]}</span>
                    </>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Description + tags */}
      <div style={{ padding: "14px 18px 16px", flex: 1 }}>
        {editMode
          ? <textarea value={project.description} placeholder="Project description..." rows={3} onChange={(e) => onChange({ ...project, description: e.target.value })} style={{ width: "100%", background: "rgba(0,229,255,0.03)", border: "1px solid rgba(0,229,255,0.18)", borderRadius: 4, padding: "7px 10px", color: "rgba(255,255,255,0.58)", fontSize: 12, lineHeight: 1.7, resize: "none", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          : <p style={{ fontSize: 12.5, lineHeight: 1.75, color: "rgba(255,255,255,0.5)", margin: 0 }}>{project.description}</p>}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 12 }}>
          {editMode
            ? <input value={project.tags.join(", ")} placeholder="Tag 1, Tag 2" onChange={(e) => onChange({ ...project, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} style={{ flex: 1, background: "rgba(0,229,255,0.03)", border: "1px solid rgba(0,229,255,0.18)", borderRadius: 3, padding: "3px 8px", color: "rgba(255,255,255,0.45)", fontSize: 10.5, outline: "none", fontFamily: "monospace" }} />
            : project.tags.map((tag) => (
                <span key={tag} style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.07em", padding: "3px 7px", borderRadius: 3, border: "1px solid rgba(0,229,255,0.18)", color: "rgba(0,229,255,0.65)", background: "rgba(0,229,255,0.03)" }}>{tag}</span>
              ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Portfolio section ───────────────────────────────────────────────────
export function Portfolio() {
  const [sliderPos, setSliderPos]     = useState(50);
  const sliderRef                     = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded]   = useState(false);
  const [projects, setProjects]       = useState<Project[]>(loadProjects);
  const [editMode, setEditMode]       = useState(false);
  const [activeVideo, setActiveVideo] = useState<Project | null>(null);

  // Admin state
  const [isAdmin, setIsAdmin]             = useState(checkAdmin);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const clickCount                        = useRef(0);
  const clickTimer                        = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTitleClick = () => {
    clickCount.current += 1;
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 900);
    if (clickCount.current >= 3) {
      clickCount.current = 0;
      if (isAdmin) { clearAdminFlag(); setIsAdmin(false); setEditMode(false); }
      else setShowAdminModal(true);
    }
  };

  const handleSlider = (clientX: number) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect();
      setSliderPos(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
    }
  };

  function updateProject(i: number, updated: Project) {
    const next = projects.map((p, idx) => (idx === i ? updated : p));
    setProjects(next); saveProjects(next);
  }
  function deleteProject(i: number) {
    const next = projects.filter((_, idx) => idx !== i);
    setProjects(next); saveProjects(next);
  }
  function addProject() {
    const next: Project = { id: Date.now().toString(), client: "New Client", url: "newclient.com", industry: "Industry", description: "Project description.", prevSpeed: "0.0s", newSpeed: "0.0s", prevConv: "0.0%", newConv: "0.0%", tags: ["Tag"], videoUrl: "" };
    const updated = [...projects, next]; setProjects(updated); saveProjects(updated);
  }
  function resetProjects() {
    setProjects(DEFAULT_PROJECTS); saveProjects(DEFAULT_PROJECTS);
  }

  return (
    <section id="portfolio" className="py-24 bg-background">
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

          {/* Admin controls — only visible when authenticated */}
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
            // EDIT MODE — fields are editable, changes persist in your browser. Click video area to add URLs.
          </motion.div>
        )}

        {/* ── SLIDER — Before/After Comparison (above cards) ── */}
        <div
          ref={sliderRef}
          className="relative w-full h-[50vh] min-h-[340px] bg-card border border-border overflow-hidden select-none cursor-ew-resize mb-10 rounded"
          onMouseMove={(e) => { if (e.buttons === 1) handleSlider(e.clientX); }}
          onTouchMove={(e) => handleSlider(e.touches[0].clientX)}
          onMouseDown={(e) => handleSlider(e.clientX)}
        >
          <div className="absolute inset-0 bg-[#221111] flex items-center justify-center overflow-hidden">
            <div className="opacity-20 text-destructive text-[10rem] font-black blur-sm select-none pointer-events-none transform -rotate-12">LEGACY</div>
            <div className="absolute bottom-8 left-8 text-destructive font-mono text-sm">SPEED: 4.8s<br />CONVERSION: 1.2%</div>
          </div>
          <div className="absolute top-0 left-0 bottom-0 bg-[#0A1A1A] overflow-hidden border-r border-primary shadow-[2px_0_15px_rgba(0,229,255,0.3)]" style={{ width: `${sliderPos}%` }}>
            <div className="absolute inset-0 w-[100vw] flex items-center justify-center">
              <div className="opacity-20 text-primary text-[10rem] font-black blur-[1px] select-none pointer-events-none transform rotate-12">FORGED</div>
              <div className="absolute bottom-8 left-8 text-primary font-mono text-sm">SPEED: 0.8s<br />CONVERSION: 6.4%</div>
            </div>
          </div>
          <div className="absolute top-0 bottom-0 w-1 bg-primary -ml-[2px] flex items-center justify-center pointer-events-none" style={{ left: `${sliderPos}%` }}>
            <div className="bg-background border border-primary text-primary px-3 py-1 rounded-full text-xs font-mono shadow-[0_0_10px_rgba(0,229,255,0.5)] whitespace-nowrap">◄ SLIDE TO COMPARE ►</div>
          </div>
        </div>

        {/* ── Project Windows ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, marginBottom: 32 }}>
          {projects.map((project, i) => (
            <ProjectWindow
              key={project.id} project={project} index={i} editMode={editMode && isAdmin}
              onChange={(u) => updateProject(i, u)}
              onDelete={() => deleteProject(i)}
              onVideoClick={() => setActiveVideo(project)}
            />
          ))}
        </div>

        {/* ── Archive ── */}
        <ArchiveButton expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)} />
        <AnimatePresence>
          {isExpanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-8">
              <div className="grid gap-4 md:grid-cols-2">
                {ARCHIVE_PROJECTS.map((item, i) => (
                  <div key={i} className="bg-card border border-border p-6 rounded flex flex-col justify-between">
                    <h4 className="text-white font-bold text-lg mb-4">{item.name}</h4>
                    <div className="grid grid-cols-2 gap-4 font-mono text-xs">
                      <div>
                        <div className="text-muted-foreground mb-1">PAGE SPEED</div>
                        <div className="flex items-end gap-2">
                          <span className="text-muted-foreground line-through">{item.prevSpeed}</span>
                          <span className="text-primary text-lg leading-none">► {item.newSpeed}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground mb-1">CONVERSION RATE</div>
                        <div className="flex items-end gap-2">
                          <span className="text-muted-foreground line-through">{item.prevConv}</span>
                          <span className="text-primary text-lg leading-none">► {item.newConv}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Video mini-player overlay */}
      <AnimatePresence>
        {activeVideo && <MiniPlayer project={activeVideo} onClose={() => setActiveVideo(null)} />}
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
