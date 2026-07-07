export class JobsAnalyticsEngine {

  /* =========================
     📊 MAIN ANALYTICS ENGINE
  ========================= */
  static analyze(jobs = []) {

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return this.emptyState();
    }

    let totalScore = 0;
    let highDemand = 0;

    const distribution = {
      high: 0,
      medium: 0,
      low: 0
    };

    /* =========================
       🔁 FAST LOOP (SCALABLE)
    ========================= */
    for (let i = 0; i < jobs.length; i++) {

      const score = jobs[i]?.score || 0;

      totalScore += score;

      if (score > 80) {
        highDemand++;
        distribution.high++;
      } else if (score > 50) {
        distribution.medium++;
      } else {
        distribution.low++;
      }
    }

    const total = jobs.length;

    const averageMatchScore =
      totalScore / total;

    const demandRate =
      (highDemand / total) * 100;

    /* =========================
       📦 RESULT PAYLOAD
    ========================= */
    return {
      /* 📊 CORE METRICS */
      totalJobs: total,

      averageMatchScore: Math.round(averageMatchScore),

      highDemandJobs: highDemand,

      demandRate: Math.round(demandRate),

      /* 🧠 MARKET INTELLIGENCE */
      marketHealth: this.getMarketHealth(demandRate, averageMatchScore),

      /* 📈 DISTRIBUTION */
      distribution,

      /* 💡 INSIGHTS */
      insights: this.generateInsights(distribution, demandRate, averageMatchScore)
    };
  }

  /* =========================
     🧠 MARKET HEALTH ENGINE
  ========================= */
  static getMarketHealth(demandRate = 0, avgScore = 0) {

    if (demandRate > 40 && avgScore > 70) return "HOT_MARKET";
    if (demandRate > 25) return "GROWING";
    if (demandRate > 10) return "STABLE";
    if (avgScore < 30) return "WEAK";

    return "EMERGING";
  }

  /* =========================
     💡 INSIGHT ENGINE
  ========================= */
  static generateInsights(distribution, demandRate, avgScore) {

    const insights = [];

    const { high, medium, low } = distribution;

    if (demandRate > 40) {
      insights.push("🔥 Strong job market demand detected");
    }

    if (avgScore > 70) {
      insights.push("📈 High-quality job opportunities available");
    }

    if (low > high) {
      insights.push("⚠️ Market skewed toward low-match jobs");
    }

    if (medium > high && medium > low) {
      insights.push("📊 Balanced mid-level job ecosystem");
    }

    if (high > medium && high > low) {
      insights.push("🚀 Premium job market dominance detected");
    }

    return insights;
  }

  /* =========================
     🧯 EMPTY STATE SAFE RETURN
  ========================= */
  static emptyState() {

    return {
      totalJobs: 0,
      averageMatchScore: 0,
      highDemandJobs: 0,
      demandRate: 0,
      marketHealth: "NO_DATA",
      distribution: {
        high: 0,
        medium: 0,
        low: 0
      },
      insights: ["No job data available"]
    };
  }
}

