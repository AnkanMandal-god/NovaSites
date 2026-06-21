import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Project data ─────────────────────────────────────────────────────────────
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
};

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "1",
    client: "Apex Roofing Co.",
    url: "apexroofing.com",
    industry: "Home Services",
    description: "Full rebuild from a sluggish WordPress template to a hand-coded asset. Eliminated 14 redundant plugins, restructured local SEO, and redesigned the quote form flow for maximum lead capture.",
    prevSpeed: "3.9s",
    newSpeed: "0.7s",
    prevConv: "1.8%",
    newConv: "5.2%",
    tags: ["Local SEO", "Lead Gen", "Hand-coded"],
  },
  {
    id: "2",
    client: "Cascade HVAC",
    url: "cascadehvac.com",
    industry: "HVAC & Climate Control",
    description: "Stripped a 22-plugin WordPress site down to zero dependencies. Rebuilt with semantic HTML, deferred asset loading, and structured data markup. Now ranking page one for 8 target keywords.",
    prevSpeed: "5.2s",
    newSpeed: "0.6s",
    prevConv: "0.9%",
    newConv: "4.8%",
    tags: ["SEO Overhaul", "Plugin Elimination", "Structured Data"],
  },
  {
    id: "3",
    client: "Sentinel Law Group",
    url: "sentinellaw.com",
    industry: "Legal Services",
    description: "Trust and authority architecture for a boutique law firm. High-contrast design with precise CTA placement, WCAG-compliant markup, and a conversion-optimised consultation booking flow.",
    prevSpeed: "4.1s",
    newSpeed: "0.9s",
    prevConv: "2.1%",
    newConv: "7.1%",
    tags: ["Conversion Design", "Accessibility", "Consultation Flow"],
  },
];

const ARCHIVE_PROJECTS = [
  { name: "Vanguard Logistics", prevSpeed: "6.0s", newSpeed: "0.8s", prevConv: "1.1%", newConv: "5.5%" },
  { name: "Summit Dental Group", prevSpeed: "4.4s", newSpeed: "0.7s", prevConv: "1.5%", newConv: "6.0%" },
  { name: "Ember & Oak Interiors", prevSpeed: "5.7s", newSpeed: "0.9s", prevConv: "1.0%", newConv: "4.2%" },
  { name: "TerraForm Landscaping", prevSpeed: "3.8s", newSpeed: "0.6s", prevConv: "2.0%", newConv: "5.9%" },
];

const STORAGE_KEY = "webforge_projects";
const ACCENT = "#00E5FF";
const RED = "#FF3333";

function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Project[];
  } catch {}
  return DEFAULT_PROJECTS;
}
function saveProjects(p: Project[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
}

// ─── Animated archive button — same style as navbar CTA ──────────────────────
function ArchiveButton({ expanded, onClick }: { expanded: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onMouseDown={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(0.97)")}
      onMouseUp={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
      style={{
        position: "relative",
        width: "100%",
        padding: "11px 22px",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: hov ? "#0A0A0A" : ACCENT,
        border: `1px solid ${hov ? ACCENT : "rgba(0,229,255,0.45)"}`,
        background: "transparent",
        overflow: "hidden",
        cursor: "pointer",
        transition: "color 0.22s, border-color 0.22s",
        fontFamily: "inherit",
      }}
    >
      {/* Sweep fill */}
      <motion.span
        style={{ position: "absolute", inset: 0, background: ACCENT, originX: 0, display: "block" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hov ? 1 : 0 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
      />
      {/* Corner brackets TL */}
      <span style={{
        position: "absolute", top: 4, left: 4, width: 8, height: 8,
        borderTop: `1.5px solid ${ACCENT}`, borderLeft: `1.5px solid ${ACCENT}`,
        zIndex: 2, opacity: hov ? 0 : 1, transition: "opacity 0.15s",
      }} />
      {/* Corner brackets BR */}
      <span style={{
        position: "absolute", bottom: 4, right: 4, width: 8, height: 8,
        borderBottom: `1.5px solid ${ACCENT}`, borderRight: `1.5px solid ${ACCENT}`,
        zIndex: 2, opacity: hov ? 0 : 1, transition: "opacity 0.15s",
      }} />
      <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <span style={{ fontFamily: "monospace", opacity: hov ? 1 : 0.5, transition: "opacity 0.2s" }}>{">"}</span>
        {expanded ? "HIDE ARCHIVE" : "VIEW EXTENDED DEPLOYED ARCHIVE"}
      </span>
    </button>
  );
}

// ─── Browser window mockup per project ───────────────────────────────────────
function ProjectWindow({
  project, index, editMode,
  onChange, onDelete,
}: {
  project: Project; index: number; editMode: boolean;
  onChange: (p: Project) => void; onDelete: () => void;
}) {
  const [hov, setHov] = useState(false);

  function field(key: keyof Project, placeholder: string, style?: React.CSSProperties) {
    const val = project[key] as string;
    if (!editMode) return <span style={style}>{val || placeholder}</span>;
    return (
      <input
        value={val}
        placeholder={placeholder}
        onChange={(e) => onChange({ ...project, [key]: e.target.value })}
        style={{
          background: "rgba(0,229,255,0.06)",
          border: "1px solid rgba(0,229,255,0.3)",
          borderRadius: 3,
          padding: "2px 6px",
          color: "#fff",
          fontSize: "inherit",
          fontFamily: "inherit",
          fontWeight: "inherit",
          width: "100%",
          outline: "none",
          ...style,
        }}
      />
    );
  }

  const accent = index === 0 ? RED : ACCENT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `1px solid ${hov ? "rgba(0,229,255,0.3)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 8,
        overflow: "hidden",
        background: "rgba(12,12,12,0.98)",
        transition: "border-color 0.2s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Window chrome */}
      <div style={{
        background: "#111",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexShrink: 0,
      }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57", display: "inline-block", flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E", display: "inline-block", flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28CA41", display: "inline-block", flexShrink: 0 }} />
        <div style={{
          flex: 1, background: "#0a0a0a", borderRadius: 4,
          padding: "3px 10px", marginLeft: 6,
          fontFamily: "monospace", fontSize: 10.5,
          color: "rgba(255,255,255,0.35)",
          overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
        }}>
          {editMode
            ? <input value={project.url} placeholder="domain.com" onChange={(e) => onChange({ ...project, url: e.target.value })}
                style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.55)", fontFamily: "monospace", fontSize: 10.5, width: "100%", outline: "none" }} />
            : project.url}
        </div>
        {editMode && (
          <button onClick={onDelete}
            style={{ background: "rgba(255,51,51,0.15)", border: "1px solid rgba(255,51,51,0.4)", borderRadius: 3, color: "#FF3333", fontSize: 10, padding: "2px 8px", cursor: "pointer", flexShrink: 0, fontFamily: "monospace" }}>
            DELETE
          </button>
        )}
      </div>

      {/* Hero strip */}
      <div style={{
        padding: "20px 22px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: `linear-gradient(135deg, rgba(${accent === ACCENT ? "0,229,255" : "255,51,51"},0.04) 0%, transparent 60%)`,
      }}>
        <div style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: 6 }}>
          {editMode
            ? <input value={project.industry} placeholder="Industry" onChange={(e) => onChange({ ...project, industry: e.target.value })}
                style={{ background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.25)", borderRadius: 3, padding: "1px 6px", color: "rgba(255,255,255,0.55)", fontFamily: "monospace", fontSize: 9, outline: "none" }} />
            : project.industry}
        </div>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 10 }}>
          {editMode
            ? <input value={project.client} placeholder="Client Name" onChange={(e) => onChange({ ...project, client: e.target.value })}
                style={{ background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.25)", borderRadius: 3, padding: "2px 8px", color: "#fff", fontWeight: 800, fontSize: 17, width: "100%", outline: "none" }} />
            : project.client}
        </div>

        {/* Metrics row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "PAGE SPEED", prev: project.prevSpeed, next: project.newSpeed, key: ["prevSpeed", "newSpeed"] as const },
            { label: "CONVERSION", prev: project.prevConv, next: project.newConv, key: ["prevConv", "newConv"] as const },
          ].map(({ label, prev, next, key }) => (
            <div key={label}>
              <div style={{ fontFamily: "monospace", fontSize: 8, letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>{label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                {editMode
                  ? <>
                      <input value={prev} placeholder="0.0s" onChange={(e) => onChange({ ...project, [key[0]]: e.target.value })}
                        style={{ width: 40, background: "rgba(255,51,51,0.1)", border: "1px solid rgba(255,51,51,0.3)", borderRadius: 3, padding: "1px 4px", color: "#FF3333", fontFamily: "monospace", fontSize: 11, outline: "none", textDecoration: "line-through" }} />
                      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>►</span>
                      <input value={next} placeholder="0.0s" onChange={(e) => onChange({ ...project, [key[1]]: e.target.value })}
                        style={{ width: 44, background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.3)", borderRadius: 3, padding: "1px 4px", color: ACCENT, fontFamily: "monospace", fontSize: 14, fontWeight: 700, outline: "none" }} />
                    </>
                  : <>
                      <span style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", textDecoration: "line-through" }}>{prev}</span>
                      <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: ACCENT }}>► {next}</span>
                    </>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div style={{ padding: "16px 22px 18px", flex: 1 }}>
        {editMode
          ? <textarea value={project.description} placeholder="Project description..." rows={3}
              onChange={(e) => onChange({ ...project, description: e.target.value })}
              style={{ width: "100%", background: "rgba(0,229,255,0.04)", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 4, padding: "8px 10px", color: "rgba(255,255,255,0.6)", fontSize: 12.5, lineHeight: 1.7, resize: "none", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          : <p style={{ fontSize: 12.5, lineHeight: 1.75, color: "rgba(255,255,255,0.52)", margin: 0 }}>
              {project.description}
            </p>}

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
          {editMode
            ? <input
                value={project.tags.join(", ")}
                placeholder="Tag 1, Tag 2, Tag 3"
                onChange={(e) => onChange({ ...project, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                style={{ flex: 1, background: "rgba(0,229,255,0.04)", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 3, padding: "4px 8px", color: "rgba(255,255,255,0.5)", fontSize: 11, outline: "none", fontFamily: "monospace" }}
              />
            : project.tags.map((tag) => (
                <span key={tag} style={{
                  fontFamily: "monospace", fontSize: 9.5, letterSpacing: "0.08em",
                  padding: "3px 8px", borderRadius: 3,
                  border: "1px solid rgba(0,229,255,0.2)",
                  color: "rgba(0,229,255,0.7)",
                  background: "rgba(0,229,255,0.04)",
                }}>
                  {tag}
                </span>
              ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Portfolio section ───────────────────────────────────────────────────
export function Portfolio() {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [projects, setProjects] = useState<Project[]>(loadProjects);
  const [editMode, setEditMode] = useState(false);

  const handleMove = (clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      setSliderPos(percent);
    }
  };

  function updateProject(index: number, updated: Project) {
    const next = projects.map((p, i) => (i === index ? updated : p));
    setProjects(next);
    saveProjects(next);
  }

  function deleteProject(index: number) {
    const next = projects.filter((_, i) => i !== index);
    setProjects(next);
    saveProjects(next);
  }

  function addProject() {
    const next: Project = {
      id: Date.now().toString(),
      client: "New Client",
      url: "newclient.com",
      industry: "Industry",
      description: "Project description goes here.",
      prevSpeed: "0.0s", newSpeed: "0.0s",
      prevConv: "0.0%", newConv: "0.0%",
      tags: ["Tag"],
    };
    const updated = [...projects, next];
    setProjects(updated);
    saveProjects(updated);
  }

  function resetProjects() {
    setProjects(DEFAULT_PROJECTS);
    saveProjects(DEFAULT_PROJECTS);
  }

  return (
    <section id="portfolio" className="py-24 bg-background">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4 mb-12">
          <div>
            <h2 className="mb-4"><span className="anchor-prefix">//</span> The Portfolio.</h2>
            <p className="text-muted-foreground max-w-2xl">
              Performance Proof: A digital infrastructure is only as valuable as the measurable results it delivers.
            </p>
          </div>

          {/* Edit mode controls */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
            {editMode && (
              <>
                <button onClick={addProject}
                  style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.15em", padding: "7px 14px", border: `1px solid rgba(0,229,255,0.5)`, color: ACCENT, background: "rgba(0,229,255,0.06)", borderRadius: 4, cursor: "pointer" }}>
                  + ADD PROJECT
                </button>
                <button onClick={resetProjects}
                  style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.15em", padding: "7px 14px", border: "1px solid rgba(255,51,51,0.4)", color: "#FF3333", background: "rgba(255,51,51,0.05)", borderRadius: 4, cursor: "pointer" }}>
                  RESET DEFAULTS
                </button>
              </>
            )}
            <button
              onClick={() => setEditMode(!editMode)}
              style={{
                fontFamily: "monospace", fontSize: 10, letterSpacing: "0.15em", padding: "7px 14px",
                border: `1px solid ${editMode ? "rgba(0,229,255,0.6)" : "rgba(255,255,255,0.15)"}`,
                color: editMode ? ACCENT : "rgba(255,255,255,0.45)",
                background: editMode ? "rgba(0,229,255,0.06)" : "transparent",
                borderRadius: 4, cursor: "pointer", transition: "all 0.2s",
              }}>
              {editMode ? "DONE EDITING" : "MANAGE PROJECTS"}
            </button>
          </div>
        </div>

        {editMode && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: "monospace", fontSize: 11, color: ACCENT, background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.2)", borderRadius: 4, padding: "10px 16px", marginBottom: 24 }}>
            // EDIT MODE ACTIVE — changes are saved automatically to your browser. Click fields to edit.
          </motion.div>
        )}

        {/* Project Windows */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
            marginBottom: 40,
          }}
        >
          {projects.map((project, i) => (
            <ProjectWindow
              key={project.id}
              project={project}
              index={i}
              editMode={editMode}
              onChange={(updated) => updateProject(i, updated)}
              onDelete={() => deleteProject(i)}
            />
          ))}
        </div>

        {/* Before/After Slider */}
        <div
          ref={containerRef}
          className="relative w-full h-[60vh] min-h-[400px] bg-card border border-border overflow-hidden select-none cursor-ew-resize mb-8 rounded"
          onMouseMove={(e) => { if (e.buttons === 1) handleMove(e.clientX); }}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onMouseDown={(e) => handleMove(e.clientX)}
        >
          <div className="absolute inset-0 bg-[#221111] flex items-center justify-center overflow-hidden">
            <div className="opacity-20 text-destructive text-[10rem] font-black blur-sm select-none pointer-events-none transform -rotate-12">LEGACY</div>
            <div className="absolute bottom-8 left-8 text-destructive font-mono text-sm">
              SPEED: 4.8s<br />CONVERSION: 1.2%
            </div>
          </div>
          <div
            className="absolute top-0 left-0 bottom-0 bg-[#0A1A1A] overflow-hidden border-r border-primary shadow-[2px_0_15px_rgba(0,229,255,0.3)]"
            style={{ width: `${sliderPos}%` }}
          >
            <div className="absolute inset-0 w-[100vw] flex items-center justify-center">
              <div className="opacity-20 text-primary text-[10rem] font-black blur-[1px] select-none pointer-events-none transform rotate-12">FORGED</div>
              <div className="absolute bottom-8 left-8 text-primary font-mono text-sm">
                SPEED: 0.8s<br />CONVERSION: 6.4%
              </div>
            </div>
          </div>
          <div
            className="absolute top-0 bottom-0 w-1 bg-primary -ml-[2px] flex items-center justify-center pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="bg-background border border-primary text-primary px-3 py-1 rounded-full text-xs font-mono shadow-[0_0_10px_rgba(0,229,255,0.5)] whitespace-nowrap">
              ◄ SLIDE TO COMPARE ►
            </div>
          </div>
        </div>

        {/* Animated archive button */}
        <ArchiveButton expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)} />

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-8"
            >
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
    </section>
  );
}
