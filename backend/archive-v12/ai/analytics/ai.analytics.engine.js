
/**
 * ========================
 * 📊 AI ANALYTICS ENGINE
 * UniMentorAI SaaS Intelligence Layer
 * ========================
 * Central business intelligence aggregator
 */

class AnalyticsEngine {

  /**
   * ========================
   * 🚀 MAIN ANALYTICS PIPELINE
   * ========================
   */
  compute(context = {}) {

    const revenue = context.revenue || [];
    const users = context.users || [];
    const events = context.events || [];

    const kpis = this.computeKPIs(revenue, users);

    const engagement = this.computeEngagement(events);

    const growth = this.computeGrowth(revenue, users);

    const health = this.computeSystemHealth(context);

    const insights = this.generateInsights({
      kpis,
      engagement,
      growth,
      health
    });

    return {
      kpis,
      engagement,
      growth,
      health,
      insights,
      timestamp: new Date()
    };
  }

  /**
   * ========================
   * 📊 KPI ENGINE
   * ========================
   */
  computeKPIs(revenue, users) {

    const totalRevenue = this.sum(revenue);
    const totalUsers = users.length;

    const arpu = totalUsers > 0 ? totalRevenue / totalUsers : 0;

    const avgRevenue = this.avg(revenue);

    return {
      totalRevenue: this.clean(totalRevenue),
      totalUsers,
      ARPU: this.clean(arpu),
      avgRevenue: this.clean(avgRevenue)
    };
  }

  /**
   * ========================
   * 📈 GROWTH ENGINE
   * ========================
   */
  computeGrowth(revenue, users) {

    const revenueGrowth = this.calculateGrowth(revenue);
    const userGrowth = users.length > 1
      ? (users.length / Math.max(1, users.length - 1)) - 1
      : 0;

    return {
      revenueGrowth: this.clean(revenueGrowth),
      userGrowth: this.clean(userGrowth)
    };
  }

  /**
   * ========================
   * 📡 ENGAGEMENT ENGINE
   * ========================
   */
  computeEngagement(events) {

    const totalEvents = events.length;

    const activeUsers = new Set(
      events.map(e => e.userId).filter(Boolean)
    ).size;

    const avgEventsPerUser =
      activeUsers > 0 ? totalEvents / activeUsers : 0;

    return {
      totalEvents,
      activeUsers,
      avgEventsPerUser: this.clean(avgEventsPerUser)
    };
  }

  /**
   * ========================
   * 🧠 SYSTEM HEALTH ENGINE
   * ========================
   */
  computeSystemHealth(context) {

    const errorRate = context.errorRate || 0;
    const latency = context.latency || 0;
    const uptime = context.uptime || 1;

    let healthScore = 1;

    if (errorRate > 0.05) healthScore -= 0.3;
    if (latency > 2000) healthScore -= 0.2;
    if (uptime < 0.95) healthScore -= 0.3;

    return {
      healthScore: this.clean(Math.max(healthScore, 0)),
      status: healthScore > 0.7 ? "healthy" : "degraded"
    };
  }

  /**
   * ========================
   * 🧠 INSIGHT GENERATOR
   * ========================
   */
  generateInsights({ kpis, engagement, growth, health }) {

    const insights = [];

    if (growth.revenueGrowth > 0.2) {
      insights.push("Strong revenue growth detected");
    }

    if (engagement.activeUsers < 100) {
      insights.push("Low user engagement detected");
    }

    if (kpis.ARPU > 50) {
      insights.push("High-value users detected");
    }

    if (health.status === "degraded") {
      insights.push("System performance issues detected");
    }

    return insights;
  }

  /**
   * ========================
   * 📊 HELPERS
   * ========================
   */
  sum(arr) {
    return arr.reduce((a, b) => a + (b || 0), 0);
  }

  avg(arr) {
    return arr.length ? this.sum(arr) / arr.length : 0;
  }

  calculateGrowth(arr) {

    if (arr.length < 2) return 0;

    const first = arr[0] || 0;
    const last = arr[arr.length - 1] || 0;

    if (first === 0) return 0;

    return (last - first) / first;
  }

  clean(value) {
    return Math.round(value * 100) / 100;
  }
}

module.exports = new AnalyticsEngine();
