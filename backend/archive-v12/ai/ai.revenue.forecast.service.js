
const Payment = require("../models/payment.model");

/**
 * ========================
 * 📈 REVENUE FORECAST SERVICE
 * UniMentorAI SaaS Forecasting Layer
 * ========================
 * Generates structured financial forecasts:
 * - Conservative scenario
 * - Realistic scenario
 * - Aggressive scenario
 */

class AIRevenueForecastService {

  /**
   * ========================
   * 📊 GET HISTORICAL REVENUE (DAILY)
   * ========================
   */
  async getDailyRevenue(days = 30) {

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const data = await Payment.aggregate([
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

    return data.map(d => d.revenue);
  }

  /**
   * ========================
   * 📉 MOVING AVERAGE (STABILITY)
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

    if (!data || data.length < 2) return 0;

    let totalChange = 0;

    for (let i = 1; i < data.length; i++) {
      totalChange += data[i] - data[i - 1];
    }

    return totalChange / (data.length - 1);
  }

  /**
   * ========================
   * 🔮 FORECAST SCENARIOS
   * ========================
   */
  async generateForecast() {

    const raw = await this.getDailyRevenue(30);
    const smoothed = this.movingAverage(raw, 3);

    const trend = this.calculateTrend(smoothed);

    const lastValue = smoothed[smoothed.length - 1] || 0;

    let scenarios = {
      conservative: [],
      realistic: [],
      aggressive: []
    };

    let base = lastValue;

    for (let i = 1; i <= 7; i++) {

      // Conservative (slow growth)
      const conservative = base + (trend * 0.5 * i);

      // Realistic (normal trend)
      const realistic = base + (trend * i);

      // Aggressive (growth boost)
      const aggressive = base + (trend * 1.5 * i);

      scenarios.conservative.push({
        day: i,
        value: Math.max(0, Math.round(conservative))
      });

      scenarios.realistic.push({
        day: i,
        value: Math.max(0, Math.round(realistic))
      });

      scenarios.aggressive.push({
        day: i,
        value: Math.max(0, Math.round(aggressive))
      });
    }

    return {
      meta: {
        trend,
        lastValue,
        dataPoints: raw.length
      },
      scenarios
    };
  }

  /**
   * ========================
   * 📊 GROWTH CLASSIFICATION
   * ========================
   */
  async getGrowthProfile() {

    const raw = await this.getDailyRevenue(30);

    const smoothed = this.movingAverage(raw, 3);

    const trend = this.calculateTrend(smoothed);

    let status = "stable";

    if (trend > 0) status = "growing";
    if (trend > 50) status = "fast-growing";
    if (trend < 0) status = "declining";

    return {
      trend,
      status
    };
  }

  /**
   * ========================
   * 🧠 FULL FORECAST ENGINE
   * ========================
   */
  async getForecastReport() {

    const forecast = await this.generateForecast();
    const growth = await this.getGrowthProfile();

    return {
      forecast,
      growth,
      recommendation: this.getRecommendation(growth.status)
    };
  }

  /**
   * ========================
   * 💡 BUSINESS RECOMMENDATION ENGINE
   * ========================
   */
  getRecommendation(status) {

    switch (status) {

      case "fast-growing":
        return "🚀 Scale ads and increase infrastructure capacity";

      case "growing":
        return "📈 Continue marketing and optimize conversion funnel";

      case "stable":
        return "⚖️ Improve engagement and upselling strategies";

      case "declining":
        return "⚠️ Investigate churn and fix conversion leaks";

      default:
        return "📊 Monitor system health";
    }
  }
}

module.exports = new AIRevenueForecastService();
