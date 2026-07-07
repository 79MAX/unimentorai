
/**
 * ========================
 * 📈 TIME SERIES ANALYSIS ENGINE
 * UniMentorAI SaaS Intelligence Layer
 * ========================
 * Provides trend, smoothing, and stability analysis
 */

class TimeSeries {

  /**
   * ========================
   * 📊 MAIN ANALYSIS FUNCTION
   * ========================
   */
  analyze(data = []) {

    if (!Array.isArray(data) || data.length === 0) {
      return {
        trend: 0,
        stable: true,
        smoothed: []
      };
    }

    const values = data.map(d => d.revenue || 0);

    const smoothed = this.smooth(values);

    const trend = this.calculateTrend(smoothed);

    const stability = this.calculateStability(values);

    const seasonality = this.detectSeasonality(values);

    return {
      trend,                // growth direction (-1 → 1)
      stable: stability > 0.7,
      stability,
      seasonality,
      smoothed,
      volatility: this.volatility(values)
    };
  }

  /**
   * ========================
   * 📊 MOVING AVERAGE SMOOTHING
   * ========================
   */
  smooth(values, window = 3) {

    const result = [];

    for (let i = 0; i < values.length; i++) {

      const start = Math.max(0, i - window + 1);
      const subset = values.slice(start, i + 1);

      const avg = subset.reduce((a, b) => a + b, 0) / subset.length;

      result.push(avg);
    }

    return result;
  }

  /**
   * ========================
   * 📈 TREND CALCULATION
   * ========================
   * returns -1 (down), 0 (neutral), 1 (up)
   */
  calculateTrend(values) {

    if (values.length < 2) return 0;

    const first = values[0];
    const last = values[values.length - 1];

    const diff = last - first;

    const normalized = diff / (first || 1);

    if (normalized > 0.1) return 1;
    if (normalized < -0.1) return -1;

    return 0;
  }

  /**
   * ========================
   * 📊 STABILITY SCORE
   * ========================
   */
  calculateStability(values) {

    if (values.length < 2) return 1;

    const mean = this.mean(values);

    const variance = values.reduce((acc, v) => {
      return acc + Math.pow(v - mean, 2);
    }, 0) / values.length;

    const std = Math.sqrt(variance);

    const stability = 1 / (1 + std / (mean || 1));

    return Math.min(Math.max(stability, 0), 1);
  }

  /**
   * ========================
   * 🌊 VOLATILITY
   * ========================
   */
  volatility(values) {

    if (values.length < 2) return 0;

    const mean = this.mean(values);

    const variance = values.reduce((acc, v) => {
      return acc + Math.pow(v - mean, 2);
    }, 0) / values.length;

    return Math.sqrt(variance) / (mean || 1);
  }

  /**
   * ========================
   * 📅 SEASONALITY DETECTION (SIMPLE HEURISTIC)
   * ========================
   */
  detectSeasonality(values) {

    if (values.length < 6) {
      return {
        detected: false,
        strength: 0
      };
    }

    const diffs = [];

    for (let i = 1; i < values.length; i++) {
      diffs.push(values[i] - values[i - 1]);
    }

    const positive = diffs.filter(d => d > 0).length;
    const negative = diffs.filter(d => d < 0).length;

    const balance = Math.abs(positive - negative) / diffs.length;

    return {
      detected: balance < 0.2,
      strength: 1 - balance
    };
  }

  /**
   * ========================
   * 📊 MEAN UTILITY
   * ========================
   */
  mean(values) {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
}

module.exports = new TimeSeries();
