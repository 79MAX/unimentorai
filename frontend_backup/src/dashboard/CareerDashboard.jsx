import DashboardHeader from "./components/DashboardHeader";
import CareerSignalCard from "./components/CareerSignalCard";
import SkillsProgressCard from "./components/SkillsProgressCard";
import MarketInsightsCard from "./components/MarketInsightsCard";
import RecommendedJobsCard from "./components/RecommendedJobsCard";

import { dashboardStyles as s } from "./styles/dashboard.styles";

/* =========================
   🧠 MOCK DATA (ISOLATED LAYER)
   👉 Easy to replace by API later
========================= */
const MOCK_DATA = {
  user: {
    name: "Marcel",
    skills: [
      "React",
      "Node.js",
      "AI",
      "JavaScript",
      "Product Strategy"
    ]
  },

  jobs: [
    {
      title: "AI Engineer",
      category: "Artificial Intelligence",
      score: 94
    },
    {
      title: "Frontend Architect",
      category: "Frontend",
      score: 88
    },
    {
      title: "Product AI Manager",
      category: "Product",
      score: 81
    }
  ],

  insights: [
    "🔥 Strong demand for AI Engineers globally",
    "📈 Frontend + AI profiles are rapidly growing",
    "🚀 High salary trend detected in remote AI jobs"
  ]
};

/* =========================
   🚀 MAIN DASHBOARD
========================= */
export default function CareerDashboard() {

  const { user, jobs, insights } = MOCK_DATA;

  /* =========================
     🧠 DERIVED METRICS (FAST COMPUTATION)
  ========================= */
  const avgJobScore = jobs.length
    ? Math.round(
        jobs.reduce((a, b) => a + (b.score || 0), 0) /
        jobs.length
      )
    : 0;

  const readiness = computeReadiness(
    user.skills.length,
    avgJobScore
  );

  const signal = getSignal(readiness);

  return (

    <div style={s.page}>

      <div style={s.container}>

        {/* =========================
            HEADER
        ========================= */}
        <DashboardHeader
          user={user}
        />

        {/* =========================
            MAIN GRID
        ========================= */}
        <div style={s.grid}>

          <CareerSignalCard
            signal={signal}
            readiness={readiness}
          />

          <SkillsProgressCard
            skills={user.skills}
          />

          <MarketInsightsCard
            insights={insights}
          />

          <RecommendedJobsCard
            jobs={jobs}
          />

        </div>

      </div>

    </div>
  );
}

/* =========================
   🧠 CORE AI SCORING ENGINE
========================= */
function computeReadiness(skillCount, avgJobScore) {

  const skillFactor = Math.min(100, skillCount * 12);
  const marketFactor = avgJobScore;

  return Math.round(
    skillFactor * 0.45 +
    marketFactor * 0.55
  );
}

/* =========================
   🚀 SIGNAL ENGINE
========================= */
function getSignal(readiness) {

  if (readiness >= 85) return "ELITE_READY";
  if (readiness >= 70) return "JOB_READY";
  if (readiness >= 50) return "GROWING";
  if (readiness >= 30) return "DEVELOPING";

  return "STARTING";
}