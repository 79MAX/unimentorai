import { JobsMatchEngine } from "./jobs.match.engine.js";
import { JobsRecommendationEngine } from "./jobs.recommendation.engine.js";
import { JobsAnalyticsEngine } from "./jobs.analytics.engine.js";
import { JobsProfileEngine } from "./jobs.profile.engine.js";

export class JobsAPIEngine {

  /* =========================
     ⚙️ SAFE NORMALIZER
  ========================= */
  static normalize(user = {}, jobs = []) {

    return {
      user: user || {},
      jobs: Array.isArray(jobs) ? jobs : []
    };
  }

  /* =========================
     🚀 MAIN PIPELINE ENGINE
  ========================= */
  static run(user = {}, jobs = []) {

    const start = Date.now();

    const { user: safeUser, jobs: safeJobs } =
      this.normalize(user, jobs);

    /* =========================
       👤 PROFILE LAYER
    ========================= */
    const profile =
      JobsProfileEngine.buildProfile(safeUser);

    /* =========================
       🎯 MATCHING LAYER
    ========================= */
    const matched =
      JobsMatchEngine.match(safeUser, safeJobs);

    /* =========================
       📊 ANALYTICS LAYER
    ========================= */
    const analytics =
      JobsAnalyticsEngine.analyze(matched);

    /* =========================
       🚀 RECOMMENDATION LAYER
    ========================= */
    const recommendations =
      JobsRecommendationEngine.top(matched, 10);

    /* =========================
       🌍 MARKET INTELLIGENCE
    ========================= */
    const marketScore =
      this.computeMarketScore({
        analytics,
        profile,
        matchedCount: matched.length
      });

    /* =========================
       📦 RESPONSE PAYLOAD
    ========================= */
    return {
      success: true,

      timestamp: start,

      profile,
      analytics,
      marketScore,
      recommendations,

      meta: {
        totalMatches: matched.length,
        processingTime: Date.now() - start,
        system: "JOBS_AI_PRO_MAX",
        version: "1.1.0"
      }
    };
  }

  /* =========================
     🌍 MARKET SCORE ENGINE
  ========================= */
  static computeMarketScore({
    analytics = {},
    profile = {},
    matchedCount = 0
  }) {

    let score = 50;

    // 📊 MARKET SIGNALS
    if (analytics.demandRate > 70) score += 20;
    if (analytics.averageMatchScore > 70) score += 15;

    // 👤 USER SIGNALS
    if (profile.jobReadinessScore > 80) score += 15;
    if (profile.seniority === "EXPERT") score += 10;

    // 📈 VOLUME SIGNALS
    if (matchedCount > 50) score += 10;
    if (matchedCount < 10) score -= 10;

    return Math.max(0, Math.min(100, Math.round(score)));
  }
}

