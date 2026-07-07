import { dashboardStyles as s } from "../styles/dashboard.styles";

export default function RecommendedJobsCard({
  jobs = []
}) {

  /* =========================
     🧠 SAFE DATA
  ========================= */
  const safeJobs = Array.isArray(jobs)
    ? jobs.filter(Boolean)
    : [];

  const topScore = safeJobs.reduce(
    (max, j) => Math.max(max, j?.score || 0),
    0
  );

  const avgScore = safeJobs.length
    ? Math.round(
        safeJobs.reduce((a, b) => a + (b.score || 0), 0) /
        safeJobs.length
      )
    : 0;

  const marketQuality =
    avgScore >= 80
      ? "ELITE MATCHES"
      : avgScore >= 60
        ? "STRONG MATCHES"
        : avgScore >= 40
          ? "MID MARKET"
          : "WEAK MARKET";

  return (

    <div
      style={{
        ...s.card,

        background: `
          radial-gradient(circle at top right, rgba(34,197,94,0.10), transparent 40%),
          radial-gradient(circle at bottom left, rgba(59,130,246,0.08), transparent 40%),
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
            💼 Recommended Jobs
          </div>

          <div style={{
            fontSize: 13,
            color: "#94a3b8"
          }}>
            AI-ranked career opportunities
          </div>

        </div>

        <div style={{
          ...s.badge,
          background:
            avgScore >= 80
              ? "#22c55e"
              : avgScore >= 60
                ? "#3b82f6"
                : "#f59e0b"
        }}>
          {marketQuality}
        </div>

      </div>

      {/* =========================
          STATS BAR
      ========================= */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 12,
        marginBottom: 20
      }}>

        <div style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 12,
          padding: 12,
          textAlign: "center"
        }}>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>
            TOTAL JOBS
          </div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>
            {safeJobs.length}
          </div>
        </div>

        <div style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 12,
          padding: 12,
          textAlign: "center"
        }}>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>
            AVG SCORE
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#3b82f6" }}>
            {avgScore}%
          </div>
        </div>

        <div style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 12,
          padding: 12,
          textAlign: "center"
        }}>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>
            TOP MATCH
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#22c55e" }}>
            {topScore}%
          </div>
        </div>

      </div>

      {/* =========================
          JOB LIST
      ========================= */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 12
      }}>

        {safeJobs.length > 0 ? (

          safeJobs
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .map((job, i) => {

              const score = job?.score || 0;

              const level =
                score >= 85
                  ? "ELITE"
                  : score >= 70
                    ? "STRONG"
                    : score >= 50
                      ? "GOOD"
                      : "LOW";

              return (
                <div
                  key={`${job.title}-${i}`}
                  style={{
                    ...s.jobItem,

                    position: "relative",

                    borderLeft: `3px solid ${
                      score >= 85
                        ? "#22c55e"
                        : score >= 70
                          ? "#3b82f6"
                          : "#f59e0b"
                    }`
                  }}
                >

                  {/* HEADER ROW */}
                  <div style={{
                    ...s.rowBetween,
                    marginBottom: 6
                  }}>

                    <div style={{
                      ...s.jobTitle
                    }}>
                      {job.title}
                    </div>

                    <div style={{
                      ...s.badge,
                      fontSize: 10,
                      padding: "4px 8px",
                      background:
                        score >= 85
                          ? "#22c55e"
                          : score >= 70
                            ? "#3b82f6"
                            : "#f59e0b"
                    }}>
                      {level}
                    </div>

                  </div>

                  {/* CATEGORY */}
                  <div style={{
                    ...s.subtitle,
                    textTransform: "uppercase",
                    fontSize: 11,
                    letterSpacing: "0.05em"
                  }}>
                    {job.category}
                  </div>

                  {/* SCORE BAR */}
                  <div style={{
                    marginTop: 10
                  }}>

                    <div style={{
                      ...s.progressBar,
                      height: 6
                    }}>
                      <div style={{
                        ...s.progressFill(score),
                        background: `
                          linear-gradient(
                            90deg,
                            #3b82f6,
                            #22c55e
                          )
                        `
                      }} />
                    </div>

                    <div style={{
                      marginTop: 6,
                      fontSize: 12,
                      color: "#22c55e",
                      fontWeight: 700
                    }}>
                      AI Match: {score}%
                    </div>

                  </div>

                </div>
              );
            })

        ) : (

          <div style={{
            padding: 18,
            borderRadius: 14,
            background: "#0f172a",
            border: "1px dashed #334155",
            color: "#94a3b8",
            textAlign: "center",
            fontSize: 14
          }}>
            No job recommendations available yet.
          </div>

        )}

      </div>

    </div>
  );
}