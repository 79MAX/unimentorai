import { dashboardStyles as s } from "../styles/dashboard.styles";

export default function CareerSignalCard({
  signal = "STABLE",
  readiness = 0
}) {

  /* =========================
     🧠 SAFE VALUE
  ========================= */
  const safeReadiness = Math.max(
    0,
    Math.min(100, Number(readiness) || 0)
  );

  /* =========================
     🎯 SIGNAL CONFIG
  ========================= */
  const signalConfig = getSignalConfig(
    signal,
    safeReadiness
  );

  return (

    <div
      style={{
        ...s.card,

        background: `
          radial-gradient(circle at top right, ${signalConfig.glow}, transparent 35%),
          linear-gradient(
            180deg,
            rgba(255,255,255,0.02),
            rgba(255,255,255,0.01)
          ),
          #111827
        `
      }}
    >

      {/* =========================
          HEADER
      ========================= */}
      <div style={{
        ...s.rowBetween,
        marginBottom: 18
      }}>

        <div>

          <div style={{
            ...s.title,
            marginBottom: 6
          }}>
            🚀 Career Signal
          </div>

          <div style={{
            color: "#94a3b8",
            fontSize: 13
          }}>
            Real-time AI market positioning
          </div>

        </div>

        <div style={{
          ...s.badge,
          background: signalConfig.color
        }}>
          {signalConfig.label}
        </div>

      </div>

      {/* =========================
          MAIN VALUE
      ========================= */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap"
      }}>

        <div>

          <div style={{
            ...s.value,
            color: signalConfig.color,
            fontSize: 42
          }}>
            {safeReadiness}%
          </div>

          <div style={{
            marginTop: 8,
            fontSize: 15,
            fontWeight: 700
          }}>
            {signal}
          </div>

        </div>

        {/* =========================
            STATUS PANEL
        ========================= */}
        <div style={{
          minWidth: 180,

          padding: 14,

          borderRadius: 14,

          background: "rgba(255,255,255,0.03)",

          border: "1px solid rgba(255,255,255,0.04)"
        }}>

          <div style={{
            fontSize: 11,
            color: "#94a3b8",
            marginBottom: 6
          }}>
            AI INTERPRETATION
          </div>

          <div style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: "#e2e8f0"
          }}>
            {signalConfig.description}
          </div>

        </div>

      </div>

      {/* =========================
          PROGRESS SECTION
      ========================= */}
      <div style={{
        marginTop: 24
      }}>

        <div style={{
          ...s.rowBetween,
          marginBottom: 10
        }}>

          <div style={{
            fontSize: 13,
            color: "#cbd5e1",
            fontWeight: 600
          }}>
            AI readiness score
          </div>

          <div style={{
            fontSize: 12,
            color: signalConfig.color,
            fontWeight: 700
          }}>
            {signalConfig.level}
          </div>

        </div>

        <div style={s.progressBar}>
          <div
            style={{
              ...s.progressFill(safeReadiness),

              background: `
                linear-gradient(
                  90deg,
                  ${signalConfig.color},
                  ${signalConfig.secondary}
                )
              `
            }}
          />
        </div>

      </div>

    </div>
  );
}

/* =========================
   🧠 SIGNAL ENGINE
========================= */
function getSignalConfig(signal, readiness) {

  if (readiness >= 85) {
    return {
      label: "ELITE",
      level: "HIGH DEMAND",
      color: "#22c55e",
      secondary: "#3b82f6",
      glow: "rgba(34,197,94,0.18)",
      description:
        "Your profile is strongly aligned with current AI-driven market demand."
    };
  }

  if (readiness >= 65) {
    return {
      label: "ADVANCED",
      level: "GROWING",
      color: "#3b82f6",
      secondary: "#22c55e",
      glow: "rgba(59,130,246,0.16)",
      description:
        "Your career trajectory is progressing well with strong positioning potential."
    };
  }

  if (readiness >= 40) {
    return {
      label: "DEVELOPING",
      level: "MID LEVEL",
      color: "#f59e0b",
      secondary: "#3b82f6",
      glow: "rgba(245,158,11,0.16)",
      description:
        "You have a solid base, but strategic upskilling is recommended."
    };
  }

  return {
    label: "STARTER",
    level: "EARLY STAGE",
    color: "#ef4444",
    secondary: "#f59e0b",
    glow: "rgba(239,68,68,0.14)",
    description:
      "Your profile needs foundational reinforcement to improve market competitiveness."
  };
}