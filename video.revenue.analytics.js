
/**
 * ==========================================
 * 📊 VIDEO REVENUE ANALYTICS ENGINE
 * UniMentorAI Business Intelligence Layer
 * ==========================================
 * Converts revenue data into actionable insights:
 * - trends
 * - predictions
 * - performance metrics
 * - business intelligence
 */

class VideoRevenueAnalytics {

  constructor({ collector, tracker }) {
    this.collector = collector;
    this.tracker = tracker;
  }

  /**
   * ==========================================
   * GLOBAL REVENUE TRENDS
   * ==========================================
   */
  getRevenueTrends() {

    const snapshot =
      this.collector.getDashboardSnapshot();

    return {
      trend: this.calculateTrend(),
      growthRate: this.calculateGrowthRate(),
      revenueMomentum: this.calculateMomentum(),
      snapshot
    };
  }

  /**
   * ==========================================
   * REVENUE GROWTH RATE
   * ==========================================
   */
  calculateGrowthRate() {

    const current =
      this.collector.getMonthlyRevenue(
        new Date().getMonth(),
        new Date().getFullYear()
      );

    const previous =
      this.collector.getMonthlyRevenue(
        new Date().getMonth() - 1,
        new Date().getFullYear()
      );

    if (previous === 0) return 1;

    return (current - previous) / previous;
  }

  /**
   * ==========================================
   * REVENUE MOMENTUM (SHORT TERM SIGNAL)
   * ==========================================
   */
  calculateMomentum() {

    const daily =
      this.collector.getDailyRevenue();

    const yesterday =
      this.collector.getDailyRevenue(
        new Date(Date.now() - 86400000)
      );

    if (yesterday === 0) return 1;

    return (daily - yesterday) / yesterday;
  }

  /**
   * ==========================================
   * TOP PERFORMING SEGMENTS
   * ==========================================
   */
  getTopSegments() {

    const rooms =
      this.collector.getTopRooms();

    const users =
      this.collector.getTopUsers();

    return {
      topRooms: rooms,
      topUsers: users
    };
  }

  /**
   * ==========================================
   * REVENUE PER USER VALUE (ARPU)
   * ==========================================
   */
  getARPU() {

    const totalRevenue =
      this.collector.getTotalRevenue();

    const uniqueUsers =
      new Set(
        this.tracker.events
          .map(e => e.userId)
      ).size;

    return uniqueUsers
      ? totalRevenue / uniqueUsers
      : 0;
  }

  /**
   * ==========================================
   * REVENUE PER SESSION VALUE (ARPS)
   * ==========================================
   */
  getARPS() {

    const totalRevenue =
      this.collector.getTotalRevenue();

    const sessions =
      this.tracker.events.filter(
        e => e.type === "SESSION_REVENUE"
      ).length;

    return sessions
      ? totalRevenue / sessions
      : 0;
  }

  /**
   * ==========================================
   * BUSINESS HEALTH SCORE (0-100)
   * ==========================================
   */
  getBusinessHealthScore() {

    let score = 50;

    const growth =
      this.calculateGrowthRate();

    const momentum =
      this.calculateMomentum();

    const arpu = this.getARPU();

    if (growth > 0.2) score += 20;
    if (momentum > 0.2) score += 15;
    if (arpu > 10) score += 15;

    return Math.min(score, 100);
  }

  /**
   * ==========================================
   * REVENUE FORECAST (SIMPLE AI MODEL)
   * ==========================================
   */
  forecastRevenue(days = 7) {

    const dailyRevenue =
      this.collector.getDailyRevenue();

    const momentum =
      this.calculateMomentum();

    const projected = [];

    let base = dailyRevenue;

    for (let i = 1; i <= days; i++) {

      base += base * (momentum * 0.1);

      projected.push({
        day: i,
        revenue: Math.max(0, Math.round(base))
      });
    }

    return projected;
  }

  /**
   * ==========================================
   * ANOMALY DETECTION (BUSINESS LEVEL)
   * ==========================================
   */
  detectRevenueAnomalies() {

    const anomalies = [];

    const growth =
      this.calculateGrowthRate();

    const momentum =
      this.calculateMomentum();

    if (growth < -0.3) {
      anomalies.push("REVENUE_DROP_ALERT");
    }

    if (momentum < -0.5) {
      anomalies.push("CRITICAL_ACTIVITY_DECLINE");
    }

    if (this.getARPU() < 1) {
      anomalies.push("LOW_MONETIZATION_PER_USER");
    }

    return anomalies;
  }

  /**
   * ==========================================
   * FULL BUSINESS INTELLIGENCE SNAPSHOT
   * ==========================================
   */
  getInsightsDashboard() {

    return {
      trends: this.getRevenueTrends(),
      growthRate: this.calculateGrowthRate(),
      momentum: this.calculateMomentum(),

      arpu: this.getARPU(),
      arps: this.getARPS(),

      healthScore: this.getBusinessHealthScore(),

      forecast: this.forecastRevenue(),

      anomalies: this.detectRevenueAnomalies()
    };
  }
}

module.exports =
  VideoRevenueAnalytics;
