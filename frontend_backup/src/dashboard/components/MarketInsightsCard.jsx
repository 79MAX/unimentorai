import { dashboardStyles as s } from "../styles/dashboard.styles";

export default function MarketInsightsCard({
  insights = []
}) {

  /* =========================
     🧠 SAFE DATA
  ========================= */
  const safeInsights = Array.isArray(insights)
    ? insights.filter(Boolean)
    : [];

  const insightCount = safeInsights.length;

  const marketState =
    insightCount === 0
      ? "NO DATA"
      : insightCount >= 3
        ? "ACTIVE"
        : "LIMITED";

  return (

    <div
      style={{
        ...s.card,

        background: `
          radial-gradient(circle at top left, rgba(34,197,94,0.10), transparent 40%),
          radial-gradient(circle at bottom right, rgba(59,130,246,0.08), transparent 40%),
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
            📊 Market Insights
          </div>

          <div style={{
            fontSize: 13,
            color: "#94a3b8"
          }}>
            AI job market intelligence layer
          </div>

        </div>

        <div style={{
          ...s.badge,
          background:
            marketState === "ACTIVE"
              ? "#22c55e"
              : marketState === "LIMITED"
                ? "#f59e0b"
                : "#64748b"
        }}>
          {marketState}
        </div>

      </div>

      {/* =========================
          INSIGHT LIST
      ========================= */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 14
      }}>

        {safeInsights.length > 0 ? (

          safeInsights.map((insight, i) => {

            const type = detectInsightType(insight);

            return (
              <div
                key={`${insight}-${i}`}
                style={{
                  ...s.insight,

                  position: "relative",

                  paddingLeft: 14,

                  borderLeft: `3px solid ${
                    type.color
                  }`,

                  background: `
                    linear-gradient(
                      90deg,
                      ${type.glow},
                      transparent 60%
                    )
                  `
                }}
              >

                {/* ICON */}
                <div style={{
                  position: "absolute",
                  left: 10,
                  top: 14,
                  fontSize: 12
                }}>
                  {type.icon}
                </div>

                <div style={{
                  marginLeft: 18
                }}>
                  {insight}
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
            No market insights available yet.
          </div>

        )}

      </div>

      {/* =========================
          FOOTER STATS
      ========================= */}
      {safeInsights.length > 0 && (

        <div style={{
          marginTop: 20,
          paddingTop: 14,
          borderTop: "1px solid #1e293b",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          color: "#94a3b8"
        }}>

          <span>
            Insights: {insightCount}
          </span>

          <span>
            Updated: AI Live Feed
          </span>

        </div>

      )}

    </div>
  );
}

/* =========================
   🧠 INSIGHT CLASSIFIER ENGINE
========================= */
function detectInsightType(text = "") {

  const t = text.toLowerCase();

  if (t.includes("strong") || t.includes("demand") || t.includes("🔥")) {
    return {
      icon: "🔥",
      color: "#22c55e",
      glow: "rgba(34,197,94,0.15)"
    };
  }

  if (t.includes("high") || t.includes("growth") || t.includes("📈")) {
    return {
      icon: "📈",
      color: "#3b82f6",
      glow: "rgba(59,130,246,0.15)"
    };
  }

  if (t.includes("warning") || t.includes("low") || t.includes("⚠️")) {
    return {
      icon: "⚠️",
      color: "#f59e0b",
      glow: "rgba(245,158,11,0.15)"
    };
  }

  return {
    icon: "💡",
    color: "#64748b",
    glow: "rgba(100,116,139,0.12)"
  };
}