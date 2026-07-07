
/**
 * ==========================================
 * 📈 VIDEO AI DEMAND PREDICTOR
 * UniMentorAI Forecast Intelligence Layer
 * ==========================================
 * Predicts future demand for video sessions:
 * - user activity spikes
 * - room saturation
 * - peak usage hours
 * - revenue pressure signals
 */

class VideoAIDemandPredictor {

  constructor({ tracker, collector }) {
    this.tracker = tracker;
    this.collector = collector;

    this.historicalData = [];
  }

  /**
   * ==========================================
   * MAIN DEMAND PREDICTION ENGINE
   * ==========================================
   */
  predict(currentContext = {}) {

    const hourlyPattern =
      this.analyzeHourlyPatterns();

    const dailyPattern =
      this.analyzeDailyPatterns();

    const baseDemand =
      this.calculateBaseDemand();

    let prediction =
      baseDemand;

    // ==========================================
    // 1. TIME-BASED PREDICTION
    // ==========================================
    const hour = new Date().getHours();

    prediction *= hourlyPattern[hour] || 1;

    // ==========================================
    // 2. ACTIVITY MOMENTUM
    // ==========================================
    const recentActivity =
      this.getRecentActivityScore();

    prediction *= recentActivity;

    // ==========================================
    // 3. SEASONAL / DAILY PATTERN
    // ==========================================
    const day = new Date().getDay();

    prediction *= dailyPattern[day] || 1;

    // ==========================================
    // 4. SESSION CONGESTION EFFECT
    // ==========================================
    if (currentContext.activeUsers > 50) {
      prediction *= 1.3;
    }

    if (currentContext.activeUsers < 10) {
      prediction *= 0.7;
    }

    // ==========================================
    // 5. REVENUE MOMENTUM EFFECT
    // ==========================================
    const revenueMomentum =
      this.collector.getDailyRevenue() /
      (this.collector.getDailyRevenue(
        new Date(Date.now() - 86400000)
      ) || 1);

    prediction *= Math.min(revenueMomentum, 2);

    // ==========================================
    // FINAL NORMALIZATION
    // ==========================================
    prediction = Math.max(0, Math.min(1, prediction));

    return {
      demandScore: prediction,
      level: this.classifyDemand(prediction),
      recommendation: this.getRecommendation(prediction)
    };
  }

  /**
   * ==========================================
   * BASE DEMAND CALCULATION
   * ==========================================
   */
  calculateBaseDemand() {

    const sessions =
      this.tracker.events.filter(
        e => e.type === "SESSION_REVENUE"
      ).length;

    const conversions =
      this.tracker.events.filter(
        e => e.type === "CONVERSION"
      ).length;

    if (sessions === 0) return 0.5;

    return Math.min(
      conversions / sessions,
      1
    );
  }

  /**
   * ==========================================
   * HOURLY PATTERN ANALYSIS
   * ==========================================
   */
  analyzeHourlyPatterns() {

    const pattern = Array(24).fill(1);

    this.tracker.events.forEach(e => {

      const hour =
        new Date(e.timestamp).getHours();

      if (e.type === "SESSION_REVENUE") {
        pattern[hour] += 0.05;
      }
    });

    return pattern;
  }

  /**
   * ==========================================
   * DAILY PATTERN ANALYSIS
   * ==========================================
   */
  analyzeDailyPatterns() {

    const pattern = Array(7).fill(1);

    this.tracker.events.forEach(e => {

      const day =
        new Date(e.timestamp).getDay();

      if (e.type === "SESSION_REVENUE") {
        pattern[day] += 0.1;
      }
    });

    return pattern;
  }

  /**
   * ==========================================
   * RECENT ACTIVITY SCORE
   * ==========================================
   */
  getRecentActivityScore() {

    const now = Date.now();

    const recent =
      this.tracker.events.filter(
        e =>
          e.timestamp >
          now - 3600000 // last hour
      );

    if (recent.length > 50) return 1.5;
    if (recent.length > 20) return 1.2;
    if (recent.length > 5) return 1;

    return 0.7;
  }

  /**
   * ==========================================
   * DEMAND CLASSIFICATION
   * ==========================================
   */
  classifyDemand(score) {

    if (score > 0.8) return "HIGH_DEMAND";
    if (score > 0.5) return "MEDIUM_DEMAND";

    return "LOW_DEMAND";
  }

  /**
   * ==========================================
   * PRICING RECOMMENDATION ENGINE
   * ==========================================
   */
  getRecommendation(score) {

    if (score > 0.8) {
      return "INCREASE_PRICE";
    }

    if (score < 0.4) {
      return "DISCOUNT_PRICE";
    }

    return "KEEP_STABLE";
  }

  /**
   * ==========================================
   * LEARNING STORAGE
   * ==========================================
   */
  storePrediction(data) {

    this.historicalData.push({
      ...data,
      timestamp: Date.now()
    });

    if (this.historicalData.length > 1000) {
      this.historicalData.shift();
    }
  }
}

module.exports =
  VideoAIDemandPredictor;
