class MentorAnalyticsEngine {

  constructor() {
    // cache MVP (remplacé plus tard par MongoDB / ClickHouse / BigQuery)
    this.events = new Map();
  }

  // =========================
  // 📊 TRACK EVENT
  // =========================
  async track(userId, data = {}) {
    if (!userId) return;

    const existing = this.events.get(userId) || [];

    const event = {
      timestamp: Date.now(),
      context: data.context || {},
      learning: data.learning || {},
      difficulty: data.difficulty || {},
      eventType: this.detectEventType(data)
    };

    const updated = [...existing, event].slice(-200);

    this.events.set(userId, updated);

    return {
      success: true,
      tracked: true
    };
  }

  // =========================
  // 🧠 EVENT TYPE DETECTION
  // =========================
  detectEventType(data) {
    if (data.learning?.score < 30) return "low_understanding";
    if (data.learning?.score > 70) return "high_understanding";
    if (data.difficulty?.level === "advanced") return "advanced_session";

    return "normal_session";
  }

  // =========================
  // 📈 USER ANALYTICS
  // =========================
  async getUserStats(userId) {
    const events = this.events.get(userId) || [];

    if (events.length === 0) {
      return this.emptyStats();
    }

    const scores = events.map(e => e.learning?.score || 50);
    const avgScore =
      scores.reduce((a, b) => a + b, 0) / scores.length;

    return {
      totalSessions: events.length,
      averageScore: Math.round(avgScore),
      progressionTrend: this.getTrend(scores),
      dominantLevel: this.getDominantLevel(events),
      engagementLevel: this.getEngagement(events)
    };
  }

  // =========================
  // 📊 SYSTEM-WIDE ANALYTICS
  // =========================
  async getGlobalStats() {
    let totalUsers = this.events.size;
    let allEvents = [];

    for (const events of this.events.values()) {
      allEvents.push(...events);
    }

    const avgScore =
      allEvents.reduce((acc, e) => acc + (e.learning?.score || 50), 0) /
      (allEvents.length || 1);

    return {
      totalUsers,
      totalEvents: allEvents.length,
      globalAverageScore: Math.round(avgScore),
      systemHealth: this.getSystemHealth(avgScore)
    };
  }

  // =========================
  // 📈 TREND ANALYSIS
  // =========================
  getTrend(scores) {
    if (scores.length < 5) return "insufficient_data";

    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));

    const avgFirst =
      firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;

    const avgSecond =
      secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    if (avgSecond > avgFirst) return "improving";
    if (avgSecond < avgFirst) return "declining";

    return "stable";
  }

  // =========================
  // 🧠 DOMINANT LEVEL DETECTION
  // =========================
  getDominantLevel(events) {
    const levels = {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    };

    for (const e of events) {
      const score = e.learning?.score || 50;

      if (score < 40) levels.beginner++;
      else if (score < 70) levels.intermediate++;
      else levels.advanced++;
    }

    return Object.keys(levels).reduce((a, b) =>
      levels[a] > levels[b] ? a : b
    );
  }

  // =========================
  // 🔥 ENGAGEMENT SCORE
  // =========================
  getEngagement(events) {
    if (!events.length) return "low";

    const activeRatio = events.length / 50;

    if (activeRatio > 0.7) return "high";
    if (activeRatio > 0.3) return "medium";

    return "low";
  }

  // =========================
  // ⚙️ SYSTEM HEALTH
  // =========================
  getSystemHealth(avgScore) {
    if (avgScore > 70) return "excellent";
    if (avgScore > 50) return "good";
    if (avgScore > 30) return "warning";

    return "critical";
  }

  // =========================
  // 🧼 EMPTY STATS
  // =========================
  emptyStats() {
    return {
      totalSessions: 0,
      averageScore: 50,
      progressionTrend: "unknown",
      dominantLevel: "unknown",
      engagementLevel: "low"
    };
  }
}

export default MentorAnalyticsEngine;
