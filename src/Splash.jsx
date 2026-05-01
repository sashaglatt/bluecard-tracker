export default function Splash({ onEnter }) {
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

      {/* Subtle lined paper lines */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: 0, right: 0,
            top: `${(i + 1) * 5}%`,
            height: 1,
            background: "rgba(180, 160, 100, 0.12)",
          }} />
        ))}
        {/* Left margin line */}
        <div style={{
          position: "absolute",
          top: 0, bottom: 0,
          left: "12%",
          width: 1,
          background: "rgba(220, 100, 100, 0.15)",
        }} />
      </div>

      {/* Paper card */}
      <div style={{
        position: "relative",
        maxWidth: 480,
        width: "100%",
        background: "rgba(255, 252, 240, 0.95)",
        borderRadius: 4,
        padding: "52px 48px 44px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.10), 2px 2px 0 rgba(180,160,100,0.2)",
        transform: "rotate(-0.8deg)",
      }}>
        {/* Lined paper inside card */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 4, overflow: "hidden", pointerEvents: "none" }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              left: 0, right: 0,
              top: `${52 + i * 42}px`,
              height: 1,
              background: "rgba(180, 160, 100, 0.2)",
            }} />
          ))}
          <div style={{
            position: "absolute",
            top: 0, bottom: 0,
            left: 56,
            width: 1,
            background: "rgba(220, 100, 100, 0.2)",
          }} />
        </div>

        {/* Spiral holes */}
        <div style={{ position: "absolute", left: -10, top: "20%", width: 20, height: 20, borderRadius: "50%", background: "#fdf6e3", border: "2px solid rgba(180,160,100,0.3)", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)" }} />
        <div style={{ position: "absolute", left: -10, top: "50%", width: 20, height: 20, borderRadius: "50%", background: "#fdf6e3", border: "2px solid rgba(180,160,100,0.3)", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)" }} />
        <div style={{ position: "absolute", left: -10, top: "78%", width: 20, height: 20, borderRadius: "50%", background: "#fdf6e3", border: "2px solid rgba(180,160,100,0.3)", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)" }} />

        {/* Content */}
        <div style={{ position: "relative" }}>
          <p style={{
            fontFamily: "'Caveat', cursive",
            fontSize: 15,
            color: "#b45309",
            margin: "0 0 24px",
            letterSpacing: 0.5,
          }}>a note to myself —</p>

          <p style={{
            fontFamily: "'Caveat', cursive",
            fontSize: 34,
            lineHeight: 1.55,
            color: "#1c1917",
            margin: "0 0 36px",
            fontWeight: 600,
          }}>
            Everything you wish<br />
            can be done if you<br />
            work for it and<br />
            <span style={{ color: "#2563eb" }}>really want it.</span>
          </p>

          {/* Small doodle star */}
          <div style={{
            fontFamily: "'Caveat', cursive",
            fontSize: 22,
            color: "#d97706",
            marginBottom: 32,
          }}>✦ ✦ ✦</div>

          <button
            onClick={onEnter}
            style={{
              fontFamily: "'Caveat', cursive",
              fontSize: 20,
              fontWeight: 700,
              color: "white",
              background: "#2563eb",
              border: "none",
              borderRadius: 6,
              padding: "12px 32px",
              cursor: "pointer",
              letterSpacing: 0.5,
              boxShadow: "0 2px 8px rgba(37,99,235,0.35)",
              transform: "rotate(0.5deg)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
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
        </div>
      </div>
    </div>
  );
}
