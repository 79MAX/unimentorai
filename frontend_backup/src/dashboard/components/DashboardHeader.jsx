import { dashboardStyles as s } from "../styles/dashboard.styles";

export default function DashboardHeader({ user = {} }) {

  /* =========================
     🧠 SAFE USER DATA
  ========================= */
  const {
    name = "Talent",
    role = "AI Powered Professional",
    profileStrength = 0,
    jobReadinessScore = 0
  } = user;

  /* =========================
     🎯 STATUS DETECTION
  ========================= */
  const readinessStatus =
    jobReadinessScore >= 85
      ? "ELITE"
      : jobReadinessScore >= 65
        ? "ADVANCED"
        : jobReadinessScore >= 40
          ? "GROWING"
          : "STARTER";

  return (

    <div
      style={{
        ...s.card,

        background: `
          radial-gradient(circle at top right, rgba(59,130,246,0.12), transparent 25%),
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
          TOP BAR
      ========================= */}
      <div style={{
        ...s.rowBetween,
        alignItems: "flex-start",
        flexWrap: "wrap"
      }}>

        {/* =========================
            LEFT SIDE
        ========================= */}
        <div style={{ flex: 1, minWidth: 280 }}>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap"
          }}>

            <h1 style={{
              margin: 0,
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.1
            }}>
              🧠 AI Career Dashboard
            </h1>

            <div style={{
              ...s.badge,
              background:
                readinessStatus === "ELITE"
                  ? "#22c55e"
                  : readinessStatus === "ADVANCED"
                    ? "#3b82f6"
                    : "#f59e0b"
            }}>
              {readinessStatus}
            </div>

          </div>

          <p style={{
            ...s.subtitle,
            marginTop: 12,
            fontSize: 15
          }}>
            Welcome back <strong>{name}</strong>
          </p>

          <p style={{
            ...s.mutedText,
            marginTop: 4,
            fontSize: 13
          }}>
            {role}
          </p>

        </div>

        {/* =========================
            RIGHT SIDE
        ========================= */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          minWidth: 240
        }}>

          {/* AI Layer Badge */}
          <div style={{
            ...s.badge,
            justifyContent: "center"
          }}>
            UniMentorAI Intelligence Layer
          </div>

          {/* Metrics */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12
          }}>

            <div style={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 14,
              padding: 14
            }}>

              <div style={{
                fontSize: 11,
                color: "#94a3b8",
                marginBottom: 6
              }}>
                PROFILE STRENGTH
              </div>

              <div style={{
                fontSize: 22,
                fontWeight: 800
              }}>
                {profileStrength}%
              </div>

            </div>

            <div style={{
              background: "#0f172a",
              border: "1px solid #1e293b",
              borderRadius: 14,
              padding: 14
            }}>

              <div style={{
                fontSize: 11,
                color: "#94a3b8",
                marginBottom: 6
              }}>
                JOB READINESS
              </div>

              <div style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#22c55e"
              }}>
                {jobReadinessScore}%
              </div>

            </div>

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
            Career Growth Intelligence
          </div>

          <div style={{
            fontSize: 12,
            color: "#94a3b8"
          }}>
            AI monitored progression
          </div>

        </div>

        <div style={s.progressBar}>
          <div
            style={s.progressFill(jobReadinessScore)}
          />
        </div>

      </div>

    </div>
  );
}