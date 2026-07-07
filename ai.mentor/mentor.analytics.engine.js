
/**
 * ==========================================
 * 📊 MENTOR ANALYTICS ENGINE
 * UniMentorAI Learning Intelligence Observatory
 * ==========================================
 * Responsible for:
 * - tracking learning performance
 * - measuring teaching effectiveness
 * - analyzing user progression
 * - evaluating system efficiency
 * - generating actionable insights
 */

class MentorAnalyticsEngine {

  constructor() {

    this.metricsStore = new Map();
  }

  /**
   * ==========================================
   * MAIN TRACKING ENTRY
   * ==========================================
   */
  track(userId, event) {

    const metrics =
      this.getOrCreateMetrics(userId);

    this.updateMetrics(metrics, event);

    return this.generateInsights(metrics);
  }

  /**
   * ==========================================
   * METRICS INITIALIZATION
   * ==========================================
   */
  getOrCreateMetrics(userId) {

    if (!this.metricsStore.has(userId)) {

      this.metricsStore.set(userId, {
        sessions: 0,
        totalEngagement: 0,
        totalConfusion: 0,
        masteryProgress: 0,
        interactions: 0,
        successRate: 0,
        strategyPerformance: new Map(),
        timeline: []
      });
    }

    return this.metricsStore.get(userId);
  }

  /**
   * ==========================================
   * METRICS UPDATE ENGINE
   * ==========================================
   */
  updateMetrics(metrics, event) {

    metrics.sessions += 1;
    metrics.interactions += 1;

    metrics.totalEngagement += event.context?.engagement || 0;
    metrics.totalConfusion += event.context?.confusion || 0;

    metrics.masteryProgress =
      event.learningState?.mastery || metrics.masteryProgress;

    metrics.timeline.push({
      timestamp: Date.now(),
      engagement: event.context?.engagement,
      confusion: event.context?.confusion,
      mastery: event.learningState?.mastery
    });

    if (metrics.timeline.length > 200) {
      metrics.timeline.shift();
    }
  }

  /**
   * ==========================================
   * INSIGHT GENERATION ENGINE
   * ==========================================
   */
  generateInsights(metrics) {

    return {
      avgEngagement:
        metrics.totalEngagement / metrics.interactions,

      avgConfusion:
        metrics.totalConfusion / metrics.interactions,

      learningVelocity:
        this.calculateVelocity(metrics),

      retentionRisk:
        this.calculateRetentionRisk(metrics),

      performanceScore:
        this.calculatePerformance(metrics),

      trend:
        this.calculateTrend(metrics)
    };
  }

  /**
   * ==========================================
   * LEARNING VELOCITY
   * ==========================================
   */
  calculateVelocity(metrics) {

    const first = metrics.timeline[0];
    const last = metrics.timeline[metrics.timeline.length - 1];

    if (!first || !last) return 0;

    return (last.mastery - first.mastery) /
           Math.max(metrics.interactions, 1);
  }

  /**
   * ==========================================
   * RETENTION RISK ANALYSIS
   * ==========================================
   */
  calculateRetentionRisk(metrics) {

    const avgEngagement =
      metrics.totalEngagement / metrics.interactions;

    const avgConfusion =
      metrics.totalConfusion / metrics.interactions;

    let risk = 0;

    if (avgEngagement < 0.4) risk += 0.4;
    if (avgConfusion > 0.7) risk += 0.4;
    if (metrics.masteryProgress < 30) risk += 0.2;

    return Math.min(risk, 1);
  }

  /**
   * ==========================================
   * PERFORMANCE SCORE ENGINE
   * ==========================================
   */
  calculatePerformance(metrics) {

    const engagement =
      metrics.totalEngagement / metrics.interactions;

    const confusion =
      1 - (metrics.totalConfusion / metrics.interactions);

    const mastery =
      metrics.masteryProgress / 100;

    return (engagement + confusion + mastery) / 3;
  }

  /**
   * ==========================================
   * TREND DETECTION
   * ==========================================
   */
  calculateTrend(metrics) {

    const timeline = metrics.timeline;

    if (timeline.length < 5) return "stable";

    const recent = timeline.slice(-5);
    const older = timeline.slice(-10, -5);

    const recentAvg =
      recent.reduce((a, b) => a + (b.mastery || 0), 0) / recent.length;

    const olderAvg =
      older.reduce((a, b) => a + (b.mastery || 0), 0) / older.length;

    if (recentAvg > olderAvg) return "improving";
    if (recentAvg < olderAvg) return "declining";

    return "stable";
  }

  /**
   * ==========================================
   * GLOBAL SYSTEM INSIGHT (ALL USERS)
   * ==========================================
   */
  systemReport() {

    let totalUsers = this.metricsStore.size;

    let totalEngagement = 0;
    let totalConfusion = 0;
    let totalPerformance = 0;

    for (let metrics of this.metricsStore.values()) {

      totalEngagement += metrics.totalEngagement;
      totalConfusion += metrics.totalConfusion;
      totalPerformance += this.calculatePerformance(metrics);
    }

    return {
      users: totalUsers,
      avgEngagement: totalEngagement / totalUsers,
      avgConfusion: totalConfusion / totalUsers,
      avgPerformance: totalPerformance / totalUsers,
      systemHealth: totalPerformance / totalUsers
    };
  }
}

module.exports = MentorAnalyticsEngine;
