
const TimeSeries = require("./ai.revenue.time.series");
const PatternDetector = require("./ai.revenue.pattern.detector");

/**
 * ========================
 * 📊 AI REVENUE FORECAST ENGINE
 * UniMentorAI SaaS Intelligence Layer
 * ========================
 * Predicts future revenue using trends, patterns, and signals
 */

class RevenueForecastEngine {

  /**
   * ========================
   * 🚀 MAIN FORECAST FUNCTION
   * ========================
   */
  predict(context = {}) {

    const history = context.history || [];

    const signals = this.extractSignals(history, context);

    const trends = TimeSeries.analyze(history);

    const patterns = PatternDetector.detect(history);

    const forecast = this.computeForecast({
      signals,
      trends,
      patterns,
      context
    });

    return {
      currentRevenue: this.getCurrentRevenue(history),
      forecast,
      confidence: this.calculateConfidence(trends, patterns),
      signals,
      trends,
      patterns,
      timestamp: new Date()
    };
  }

  /**
   * ========================
   * 📊 SIGNAL EXTRACTION
   * ========================
   */
  extractSignals(history, context) {

    const revenue = history.map(h => h.revenue || 0);

    return {
      avgRevenue: this.avg(revenue),
      growthRate: this.growthRate(revenue),
      volatility: this.volatility(revenue),
      conversionRate: context.conversionRate || 0,
      churnRate: context.churnRate || 0,
      activeUsers: context.activeUsers || 0,
      seasonalityFactor: this.seasonalityFactor()
    };
  }

  /**
   * ========================
   * 📈 FORECAST CORE ENGINE
   * ========================
   */
  computeForecast({ signals, trends, patterns, context }) {

    let base = signals.avgRevenue;

    // 📈 trend influence
    base *= (1 + (signals.growthRate || 0));

    // 📉 churn impact
    base *= (1 - (signals.churnRate || 0.1));

    // ⚡ volatility penalty
    base *= (1 - (signals.volatility || 0) * 0.2);

    // 🧠 pattern boost
    if (patterns?.isGrowthPattern) {
      base *= 1.15;
    }

    if (patterns?.isDeclinePattern) {
      base *= 0.85;
    }

    // 🕒 seasonality adjustment
    base *= signals.seasonalityFactor;

    // 👥 user base scaling
    if (context.activeUsers > 1000) {
      base *= 1.1;
    }

    return {
      nextPeriodRevenue: this.clean(base),
      optimistic: this.clean(base * 1.2),
      pessimistic: this.clean(base * 0.8)
    };
  }

  /**
   * ========================
   * 📊 CURRENT REVENUE
   * ========================
   */
  getCurrentRevenue(history) {
    if (!history.length) return 0;
    return history[history.length - 1].revenue || 0;
  }

  /**
   * ========================
   * 📈 GROWTH RATE
   * ========================
   */
  growthRate(values) {

    if (values.length < 2) return 0;

    const first = values[0];
    const last = values[values.length - 1];

    if (first === 0) return 0;

    return (last - first) / first;
  }

  /**
   * ========================
   * 📉 VOLATILITY
   * ========================
   */
  volatility(values) {

    if (values.length < 2) return 0;

    const avg = this.avg(values);

    const variance = values.reduce((acc, v) => {
      return acc + Math.pow(v - avg, 2);
    }, 0) / values.length;

    return Math.sqrt(variance) / (avg || 1);
  }

  /**
   * ========================
   * 🕒 SEASONALITY FACTOR
   * ========================
   */
  seasonalityFactor() {

    const hour = new Date().getHours();

    // peak hours
    if (hour >= 18 && hour <= 22) return 1.1;

    // low activity hours
    if (hour >= 0 && hour <= 6) return 0.9;

    return 1;
  }

  /**
   * ========================
   * 🧠 CONFIDENCE SCORE
   * ========================
   */
  calculateConfidence(trends, patterns) {

    let confidence = 0.5;

    if (trends?.stable) confidence += 0.2;
    if (patterns?.confidence) confidence += patterns.confidence * 0.3;

    return Math.min(confidence, 0.95);
  }

  /**
   * ========================
   * 📊 HELPERS
   * ========================
   */
  avg(arr) {
    if (!arr.length) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  clean(value) {
    return Math.round(value * 100) / 100;
  }
}

module.exports = new RevenueForecastEngine();
