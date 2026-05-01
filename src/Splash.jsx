import { useState, useRef } from "react";

const DEFAULT_NOTE = "Everything you wish\ncan be done if you\nwork for it and\nreally want it.";
const STORAGE_KEY = "bluecard-splash-note";

export default function Splash({ onEnter }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(() => localStorage.getItem(STORAGE_KEY) || DEFAULT_NOTE);
  const textareaRef = useRef(null);

  function startEdit() {
    setEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  function saveEdit() {
    const trimmed = text.trim() || DEFAULT_NOTE;
    setText(trimmed);
    localStorage.setItem(STORAGE_KEY, trimmed);
    setEditing(false);
  }

  // Format last "word group" in blue (last line)
  const lines = text.split("\n");
  const lastLine = lines[lines.length - 1];
  const rest = lines.slice(0, -1).join("\n");

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fdf6e3 0%, #fef9ed 50%, #fdf3d0 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      position: "relative",
      overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Lined paper background */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute", left: 0, right: 0,
            top: `${(i + 1) * 5}%`, height: 1,
            background: "rgba(180, 160, 100, 0.12)",
          }} />
        ))}
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: "12%",
          width: 1, background: "rgba(220, 100, 100, 0.15)",
        }} />
      </div>

      {/* Paper card */}
      <div style={{
        position: "relative", maxWidth: 480, width: "100%",
        background: "rgba(255, 252, 240, 0.95)", borderRadius: 4,
        padding: "52px 48px 44px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.10), 2px 2px 0 rgba(180,160,100,0.2)",
        transform: "rotate(-0.8deg)",
      }}>
        {/* Lined paper inside */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 4, overflow: "hidden", pointerEvents: "none" }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute", left: 0, right: 0,
              top: `${52 + i * 42}px`, height: 1,
              background: "rgba(180, 160, 100, 0.2)",
            }} />
          ))}
          <div style={{
            position: "absolute", top: 0, bottom: 0, left: 56,
            width: 1, background: "rgba(220, 100, 100, 0.2)",
          }} />
        </div>

        {/* Spiral holes */}
        {[20, 50, 78].map(top => (
          <div key={top} style={{
            position: "absolute", left: -10, top: `${top}%`,
            width: 20, height: 20, borderRadius: "50%",
            background: "#fdf6e3", border: "2px solid rgba(180,160,100,0.3)",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
          }} />
        ))}

        <div style={{ position: "relative" }}>
          <p style={{
            fontFamily: "'Caveat', cursive", fontSize: 15,
            color: "#b45309", margin: "0 0 24px", letterSpacing: 0.5,
          }}>a note to myself —</p>

          {/* Editable note area */}
          {editing ? (
            <textarea
              ref={textareaRef}
              value={text}
              onChange={e => setText(e.target.value)}
              onBlur={saveEdit}
              style={{
                fontFamily: "'Caveat', cursive", fontSize: 34,
                lineHeight: 1.55, color: "#1c1917", fontWeight: 600,
                width: "100%", minHeight: 160, background: "transparent",
                border: "none", borderBottom: "2px dashed #d97706",
                outline: "none", resize: "none", padding: 0,
                boxSizing: "border-box",
              }}
            />
          ) : (
            <div
              onClick={startEdit}
              title="Click to edit"
              style={{
                fontFamily: "'Caveat', cursive", fontSize: 34,
                lineHeight: 1.55, margin: "0 0 36px",
                cursor: "text", whiteSpace: "pre-wrap",
              }}
            >
              {rest && (
                <span style={{ color: "#1c1917" }}>{rest}{"\n"}</span>
              )}
              <span style={{ color: "#2563eb" }}>{lastLine}</span>
              <span style={{
                display: "inline-block", marginLeft: 6, fontSize: 14,
                color: "#d97706", verticalAlign: "middle", opacity: 0.6,
              }}>✏️</span>
            </div>
          )}

          {!editing && (
            <>
              <div style={{
                fontFamily: "'Caveat', cursive", fontSize: 22,
                color: "#d97706", marginBottom: 32,
              }}>✦ ✦ ✦</div>

              <button
                onClick={onEnter}
                style={{
                  fontFamily: "'Caveat', cursive", fontSize: 20, fontWeight: 700,
                  color: "white", background: "#2563eb", border: "none",
                  borderRadius: 6, padding: "12px 32px", cursor: "pointer",
                  letterSpacing: 0.5, boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
                  transform: "rotate(0.5deg)", transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "rotate(0.5deg) scale(1.04)";
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(37,99,235,0.45)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "rotate(0.5deg)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(37,99,235,0.35)";
                }}
              >
                let's get to work →
              </button>
            </>
          )}

          {editing && (
            <button
              onClick={saveEdit}
              style={{
                marginTop: 16, fontFamily: "'Caveat', cursive", fontSize: 16,
                fontWeight: 700, color: "#b45309", background: "transparent",
                border: "2px solid #d97706", borderRadius: 6, padding: "8px 20px",
                cursor: "pointer",
              }}
            >
              save ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
