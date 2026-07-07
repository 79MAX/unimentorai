
const Payment = require("../models/payment.model");

/**
 * ========================
 * 🧠 AI REVENUE PREDICTION ENGINE
 * UniMentorAI SaaS Intelligence Layer v2
 * ========================
 * Hybrid model:
 * - Moving average smoothing
 * - Trend detection
 * - Simple anomaly filtering
 */

class AIRevenuePredictionEngine {

  /**
   * ========================
   * 📊 GET CLEAN REVENUE DATA
   * ========================
   */
  async getDailyRevenue(days = 30) {

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const raw = await Payment.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" }
          },
          revenue: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    return raw.map(d => d.revenue);
  }

  /**
   * ========================
   * 📉 MOVING AVERAGE SMOOTHING
   * ========================
   */
  movingAverage(data, window = 3) {

    const result = [];

    for (let i = 0; i < data.length; i++) {

      const start = Math.max(0, i - window + 1);
      const slice = data.slice(start, i + 1);

      const avg = slice.reduce((a, b) => a + b, 0) / slice.length;

      result.push(avg);
    }

    return result;
  }

  /**
   * ========================
   * 📈 TREND CALCULATION
   * ========================
   */
  calculateTrend(data) {

    if (data.length < 2) return 0;

    let totalChange = 0;

    for (let i = 1; i < data.length; i++) {
      totalChange += data[i] - data[i - 1];
    }

    return totalChange / (data.length - 1);
  }

  /**
   * ========================
   * 🚨 ANOMALY DETECTION (SIMPLE)
   * ========================
   */
  detectAnomalies(data) {

    const avg = data.reduce((a, b) => a + b, 0) / data.length;

    return data.map(value => {

      const deviation = Math.abs(value - avg) / avg;

      return {
        value,
        isAnomaly: deviation > 0.5
      };
    });
  }

  /**
   * ========================
   * 🔮 PREDICT NEXT 7 DAYS
   * ========================
   */
  async predictNext7DaysRevenue() {

    const raw = await this.getDailyRevenue(30);

    const smoothed = this.movingAverage(raw, 3);

    const trend = this.calculateTrend(smoothed);

    const lastValue = smoothed[smoothed.length - 1] || 0;

    let predictions = [];

    let current = lastValue;

    for (let i = 1; i <= 7; i++) {

      // trend-based forecast + slight decay factor
      current = current + trend * 0.9;

      predictions.push({
        day: i,
        predictedRevenue: Math.max(0, Math.round(current))
      });
    }

    return {
      rawData: raw,
      smoothedData: smoothed,
      trend,
      lastValue,
      predictions
    };
  }

  /**
   * ========================
   * 📊 GROWTH INSIGHTS
   * ========================
   */
  async getGrowthInsights() {

    const raw = await this.getDailyRevenue(30);

    const smoothed = this.movingAverage(raw, 3);

    const trend = this.calculateTrend(smoothed);

    const isGrowing = trend > 0;

    const growthRate =
      raw.length > 1
        ? ((raw[raw.length - 1] - raw[0]) / raw[0]) * 100
        : 0;

    return {
      trend,
      isGrowing,
      growthRate: growthRate.toFixed(2) + "%"
    };
  }

  /**
   * ========================
   * 🧠 FULL AI INSIGHTS ENGINE
   * ========================
   */
  async getAIInsights() {

    const prediction = await this.predictNext7DaysRevenue();
    const growth = await this.getGrowthInsights();

    const anomalies = this.detectAnomalies(prediction.rawData);

    return {
      prediction,
      growth,
      anomalies,
      recommendation: this.getRecommendation(growth.isGrowing)
    };
  }

  /**
   * ========================
   * 💡 AI RECOMMENDATION SYSTEM
   * ========================
   */
  getRecommendation(isGrowing) {

    if (isGrowing) {
      return {
        action: "scale",
        message: "🚀 Increase marketing spend and scale acquisition"
      };
    }

    return {
      action: "optimize",
      message: "⚠️ Improve conversion rate and pricing strategy"
    };
  }
}

module.exports = new AIRevenuePredictionEngine();
