import { useState, useEffect, useCallback } from "react";

// ─── DATA ───
const TIMELINE = [
  { date: "May 1–7", label: "Document Sprint", desc: "Gather & upload all docs to Deel", status: "active", icon: "📋" },
  { date: "May 8", label: "Submit to Deel", desc: "All documents uploaded, Deel reviews", status: "upcoming", icon: "📤" },
  { date: "~May 12", label: "Deel Files Application", desc: "Submitted to Spanish authorities", status: "upcoming", icon: "🇪🇸" },
  { date: "~Jun 9", label: "Favorable Decision", desc: "Authorities approve (~20 working days)", status: "upcoming", icon: "✅" },
  { date: "~Jun 11–15", label: "Consulate Appointment", desc: "In-person visa application in your country", status: "upcoming", icon: "🏛️" },
  { date: "~Jun 25–29", label: "Entry Visa Issued", desc: "Ready to travel to Spain", status: "upcoming", icon: "✈️" },
  { date: "On Arrival", label: "Start Working + TIE", desc: "Register with Social Security, fingerprinting appts", status: "upcoming", icon: "🎉" },
];

const ITEMS = [
  {
    id: "cv", label: "Updated CV", category: "doc",
    detail: "Include detailed work experience and education history.",
    target: "May 1", required: true,
    action: "Done! Updated with ElevenLabs role.",
  },
  {
    id: "diploma", label: "University Diploma (Apostilled)", category: "doc",
    detail: "IE Official Master's Degree — confirm €220 request is correct, then apostille.",
    target: "May 5", required: true,
    action: "Email sent to IE. Follow up if no reply by May 3.",
  },
  {
    id: "passport", label: "Full Passport Copy", category: "doc",
    detail: "All pages including blank ones. Scan or photograph every page.",
    target: "May 3", required: true,
    action: "Scan all pages to a single PDF.",
  },
  {
    id: "residence_proof", label: "Proof of Current Residence", category: "doc",
    detail: "National ID, Driver's License, Rental contract, or Recent utility bill.",
    target: "May 4", required: true,
    action: "Pick one doc and scan it.",
  },
  {
    id: "experience", label: "Experience Documentation", category: "doc",
    detail: "Only if no diploma available. Employment records + experience letters.",
    target: "May 6", required: false,
    action: "Skip if diploma comes through.",
  },
  {
    id: "criminal", label: "Criminal Record Certificate", category: "doc",
    detail: "Only needed at Consular Stage (Step 3). Valid 3 months once issued.",
    target: "~June", required: false,
    action: "Don't request yet — wait until closer to consulate date.",
  },
  {
    id: "father", label: "Father's Full Name", category: "info",
    detail: "No documentation needed — just enter in the Deel form.",
    target: "May 7", required: true,
    action: "Fill in the Deel intake form.",
  },
  {
    id: "mother", label: "Mother's Full Name", category: "info",
    detail: "No documentation needed — just enter in the Deel form.",
    target: "May 7", required: true,
    action: "Fill in the Deel intake form.",
  },
  {
    id: "dependents", label: "Dependent Sponsorship Decision", category: "info",
    detail: "Decide whether you'll sponsor spouse or children.",
    target: "May 7", required: true,
    action: "Decide and select in the Deel form.",
  },
  {
    id: "address", label: "Current Address", category: "info",
    detail: "Your current residential address.",
    target: "May 7", required: true,
    action: "Fill in the Deel form.",
  },
];

const STORAGE_KEY = "bluecard-tracker-v2";

const STATUS_MAP = {
  not_started: { label: "Not Started", color: "#64748b", bg: "#f1f5f9", ring: "#cbd5e1" },
  in_progress: { label: "In Progress", color: "#d97706", bg: "#fef3c7", ring: "#fbbf24" },
  done: { label: "Done", color: "#059669", bg: "#d1fae5", ring: "#34d399" },
};
const NEXT = { not_started: "in_progress", in_progress: "done", done: "not_started" };

// ─── Storage helpers (localStorage) ───
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { statuses: {}, notes: {} };
}

function saveData(statuses, notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ statuses, notes }));
  } catch {}
}

export default function App() {
  const [tab, setTab] = useState("timeline");
  const [statuses, setStatuses] = useState({});
  const [notes, setNotes] = useState({});
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const d = loadData();
    setStatuses(d.statuses);
    setNotes(d.notes);
  }, []);

  const cycle = (id) => {
    const next = NEXT[statuses[id] || "not_started"];
    const u = { ...statuses, [id]: next };
    setStatuses(u);
    saveData(u, notes);
  };

  const updateNote = (id, v) => {
    const u = { ...notes, [id]: v };
    setNotes(u);
    saveData(statuses, u);
  };

  const doneCount = ITEMS.filter(i => (statuses[i.id] || "not_started") === "done").length;
  const pct = Math.round((doneCount / ITEMS.length) * 100);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 680, margin: "0 auto", padding: "20px 16px", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 26 }}>🇪🇺</span>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: -0.5 }}>EU Blue Card — Spain</h1>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0", fontWeight: 500 }}>Target submit: May 8, 2026 · Best case visa: late June 2026</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 18px", marginBottom: 18, border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Document Progress</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: pct === 100 ? "#059669" : "#3b82f6" }}>{doneCount}/{ITEMS.length} · {pct}%</span>
        </div>
        <div style={{ background: "#e2e8f0", borderRadius: 6, height: 8, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#059669" : "linear-gradient(90deg, #3b82f6, #6366f1)", borderRadius: 6, transition: "width 0.4s ease" }} />
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#f1f5f9", borderRadius: 10, padding: 3 }}>
        {[{ key: "timeline", label: "📅 Timeline" }, { key: "checklist", label: "✅ Checklist" }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, padding: "10px 0", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s ease",
            background: tab === t.key ? "white" : "transparent",
            color: tab === t.key ? "#0f172a" : "#94a3b8",
            boxShadow: tab === t.key ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ═══ TIMELINE TAB ═══ */}
      {tab === "timeline" && (
        <div style={{ position: "relative", paddingLeft: 36 }}>
          <div style={{ position: "absolute", left: 15, top: 8, bottom: 8, width: 2, background: "linear-gradient(to bottom, #3b82f6, #6366f1, #8b5cf6, #059669)", borderRadius: 2 }} />
          {TIMELINE.map((step, i) => (
            <div key={i} style={{ position: "relative", marginBottom: 24 }}>
              <div style={{
                position: "absolute", left: -28, top: 4, width: 24, height: 24, borderRadius: "50%",
                background: step.status === "active" ? "#3b82f6" : "#f1f5f9",
                border: step.status === "active" ? "3px solid #bfdbfe" : "2px solid #cbd5e1",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11,
                boxShadow: step.status === "active" ? "0 0 0 4px rgba(59,130,246,0.15)" : "none",
              }}>
                {step.status === "active" ? <span style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} /> : null}
              </div>
              <div style={{
                background: step.status === "active" ? "#eff6ff" : "white",
                border: step.status === "active" ? "1.5px solid #bfdbfe" : "1px solid #e2e8f0",
                borderRadius: 10, padding: "12px 16px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 16 }}>{step.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{step.label}</span>
                  {step.status === "active" && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#3b82f6", background: "#dbeafe", padding: "2px 8px", borderRadius: 6 }}>YOU ARE HERE</span>
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{step.desc}</span>
                  <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, whiteSpace: "nowrap", marginLeft: 12 }}>{step.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ CHECKLIST TAB ═══ */}
      {tab === "checklist" && (
        <div>
          {[
            { key: "doc", title: "📄 Documents to Upload", items: ITEMS.filter(i => i.category === "doc") },
            { key: "info", title: "✏️ Information to Provide", items: ITEMS.filter(i => i.category === "info") },
          ].map(section => (
            <div key={section.key}>
              <h2 style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1.2, margin: "0 0 10px 4px" }}>{section.title}</h2>
              {section.items.map(item => {
                const st = statuses[item.id] || "not_started";
                const cfg = STATUS_MAP[st];
                const isOpen = expandedId === item.id;
                return (
                  <div key={item.id} onClick={() => setExpandedId(isOpen ? null : item.id)} style={{
                    background: "white", borderRadius: 10, padding: "14px 16px", marginBottom: 8,
                    border: isOpen ? "2px solid #3b82f6" : "1.5px solid #e2e8f0", cursor: "pointer", transition: "all 0.15s ease",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <button onClick={e => { e.stopPropagation(); cycle(item.id); }} style={{
                        width: 30, height: 30, borderRadius: 8, border: `2px solid ${cfg.ring}`, background: cfg.bg,
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        transition: "transform 0.12s ease", fontSize: 14, color: cfg.color,
                      }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.12)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                        {st === "done" ? "✓" : st === "in_progress" ? "◐" : ""}
                      </button>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          <span style={{
                            fontSize: 14, fontWeight: 600, color: st === "done" ? "#059669" : "#1e293b",
                            textDecoration: st === "done" ? "line-through" : "none",
                          }}>{item.label}</span>
                          {item.required && <span style={{ fontSize: 9, fontWeight: 700, color: "#dc2626", background: "#fef2f2", padding: "1px 6px", borderRadius: 5 }}>REQ</span>}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                          <span style={{ fontSize: 11, color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
                          <span style={{ fontSize: 11, color: "#cbd5e1" }}>·</span>
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>Target: {item.target}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: "#cbd5e1", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}>▼</span>
                    </div>

                    {isOpen && (
                      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                        <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 8px", lineHeight: 1.6 }}>{item.detail}</p>
                        <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, padding: "8px 12px", marginBottom: 10 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#0369a1" }}>Next action: </span>
                          <span style={{ fontSize: 11, color: "#0c4a6e" }}>{item.action}</span>
                        </div>
                        <textarea
                          placeholder="Your notes…"
                          value={notes[item.id] || ""}
                          onChange={e => updateNote(item.id, e.target.value)}
                          onClick={e => e.stopPropagation()}
                          style={{
                            width: "100%", minHeight: 50, borderRadius: 8, border: "1.5px solid #e2e8f0",
                            padding: "8px 12px", fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                            color: "#334155", background: "#f8fafc", resize: "vertical", outline: "none", boxSizing: "border-box",
                          }}
                          onFocus={e => e.target.style.borderColor = "#3b82f6"}
                          onBlur={e => e.target.style.borderColor = "#e2e8f0"}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              <div style={{ height: 20 }} />
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 12, padding: "12px 16px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
        <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, lineHeight: 1.7 }}>
          <strong>Tip:</strong> Tap the circle to cycle status. Tap a row to expand details, see next actions, and add notes. Progress saves automatically.
        </p>
      </div>
    </div>
  );
}
