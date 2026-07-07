import { dashboardStyles as s } from "../styles/dashboard.styles";

export default function SkillsProgressCard({
  skills = []
}) {

  /* =========================
     🧠 SAFE DATA
  ========================= */
  const safeSkills = Array.isArray(skills)
    ? skills.filter(Boolean)
    : [];

  const totalSkills = safeSkills.length;

  const profileLevel =
    totalSkills >= 12
      ? "EXPERT"
      : totalSkills >= 7
        ? "ADVANCED"
        : totalSkills >= 4
          ? "INTERMEDIATE"
          : "BEGINNER";

  const masteryScore = Math.min(
    100,
    totalSkills * 8
  );

  return (

    <div
      style={{
        ...s.card,

        background: `
          radial-gradient(circle at top right, rgba(59,130,246,0.12), transparent 35%),
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
        marginBottom: 20,
        alignItems: "flex-start"
      }}>

        <div>

          <div style={{
            ...s.title,
            marginBottom: 6
          }}>
            🧠 Skills Intelligence
          </div>

          <div style={{
            color: "#94a3b8",
            fontSize: 13
          }}>
            AI-powered career capability analysis
          </div>

        </div>

        <div style={{
          ...s.badge,

          background:
            profileLevel === "EXPERT"
              ? "#22c55e"
              : profileLevel === "ADVANCED"
                ? "#3b82f6"
                : profileLevel === "INTERMEDIATE"
                  ? "#f59e0b"
                  : "#ef4444"
        }}>
          {profileLevel}
        </div>

      </div>

      {/* =========================
          MAIN METRICS
      ========================= */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 14,
        marginBottom: 24
      }}>

        {/* TOTAL SKILLS */}
        <div style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 14,
          padding: 16
        }}>

          <div style={{
            fontSize: 11,
            color: "#94a3b8",
            marginBottom: 6
          }}>
            TOTAL SKILLS
          </div>

          <div style={{
            fontSize: 30,
            fontWeight: 800
          }}>
            {totalSkills}
          </div>

        </div>

        {/* MASTERY SCORE */}
        <div style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 14,
          padding: 16
        }}>

          <div style={{
            fontSize: 11,
            color: "#94a3b8",
            marginBottom: 6
          }}>
            AI MASTERY
          </div>

          <div style={{
            fontSize: 30,
            fontWeight: 800,
            color: "#22c55e"
          }}>
            {masteryScore}%
          </div>

        </div>

      </div>

      {/* =========================
          PROGRESS
      ========================= */}
      <div style={{
        marginBottom: 24
      }}>

        <div style={{
          ...s.rowBetween,
          marginBottom: 10
        }}>

          <div style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#cbd5e1"
          }}>
            Skill ecosystem growth
          </div>

          <div style={{
            fontSize: 12,
            color: "#94a3b8"
          }}>
            {profileLevel} profile
          </div>

        </div>

        <div style={s.progressBar}>
          <div
            style={{
              ...s.progressFill(masteryScore),

              background: `
                linear-gradient(
                  90deg,
                  #3b82f6,
                  #22c55e
                )
              `
            }}
          />
        </div>

      </div>

      {/* =========================
          SKILLS GRID
      ========================= */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10
      }}>

        {safeSkills.length > 0 ? (

          safeSkills.map((skill, index) => (

            <div
              key={`${skill}-${index}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,

                padding: "9px 14px",

                borderRadius: 12,

                background: `
                  linear-gradient(
                    135deg,
                    rgba(59,130,246,0.16),
                    rgba(30,41,59,1)
                  )
                `,

                border: "1px solid rgba(59,130,246,0.18)",

                fontSize: 13,
                fontWeight: 600,

                color: "#e2e8f0",

                transition: "all 0.25s ease"
              }}
            >

              <span style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e"
              }} />

              {skill}

            </div>
          ))

        ) : (

          <div style={{
            width: "100%",
            padding: 18,
            borderRadius: 14,
            background: "#0f172a",
            border: "1px dashed #334155",
            color: "#94a3b8",
            textAlign: "center",
            fontSize: 14
          }}>
            No skills detected yet.
          </div>

        )}

      </div>

    </div>
  );
}