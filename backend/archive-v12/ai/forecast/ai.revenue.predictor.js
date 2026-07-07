
const ForecastEngine = require("./ai.revenue.forecast.engine");
const TimeSeries = require("./ai.revenue.time.series");
const PatternDetector = require("./ai.revenue.pattern.detector");

/**
 * ========================
 * 🧠 AI REVENUE PREDICTOR
 * UniMentorAI SaaS Intelligence Core Brain
 * ========================
 * Central decision engine for revenue prediction
 */

class RevenuePredictor {

  /**
   * ========================
   * 🚀 MAIN PREDICTION PIPELINE
   * ========================
   */
  predict(context = {}) {

    const history = context.history || [];

    // 📊 STEP 1 — TIME SERIES ANALYSIS
    const timeAnalysis = TimeSeries.analyze(history);

    // 🔍 STEP 2 — PATTERN DETECTION
    const patterns = PatternDetector.detect(history);

    // 📈 STEP 3 — FORECAST ENGINE
    const forecast = ForecastEngine.predict(context);

    // 🧠 STEP 4 — INTELLIGENCE FUSION
    const decision = this.fusion({
      timeAnalysis,
      patterns,
      forecast,
      context
    });

    return {
      prediction: decision.finalPrediction,
      confidence: decision.confidence,
      riskLevel: decision.riskLevel,

      breakdown: {
        timeAnalysis,
        patterns,
        forecast
      },

      insights: decision.insights,

      timestamp: new Date()
    };
  }

  /**
   * ========================
   * 🧠 INTELLIGENCE FUSION ENGINE
   * ========================
   */
  fusion({ timeAnalysis, patterns, forecast, context }) {

    let score = forecast.forecast?.nextPeriodRevenue || 0;

    const insights = [];

    // 📈 TREND IMPACT
    if (timeAnalysis.trend > 0) {
      score *= 1.1;
      insights.push("Positive revenue trend detected");
    }

    if (timeAnalysis.trend < 0) {
      score *= 0.9;
      insights.push("Negative revenue trend detected");
    }

    // 🚨 PATTERN RISK IMPACT
    if (patterns.isDeclinePattern) {
      score *= 0.85;
      insights.push("Decline pattern detected");
    }

    if (patterns.anomaly) {
      score *= 0.8;
      insights.push("Anomalies detected in revenue behavior");
    }

    // 🔄 STABILITY IMPACT
    if (!timeAnalysis.stable) {
      score *= 0.95;
      insights.push("Revenue instability detected");
    }

    // 📊 VOLATILITY IMPACT
    if (timeAnalysis.volatility > 0.5) {
      score *= 0.9;
      insights.push("High volatility detected");
    }

    // 👥 USER SCALE IMPACT
    if (context.activeUsers > 1000) {
      score *= 1.05;
      insights.push("Strong user base scaling effect");
    }

    return {
      finalPrediction: this.clean(score),
      confidence: this.computeConfidence(timeAnalysis, patterns, forecast),
      riskLevel: this.computeRisk(timeAnalysis, patterns),
      insights
    };
  }

  /**
   * ========================
   * 📊 CONFIDENCE ENGINE
   * ========================
   */
  computeConfidence(timeAnalysis, patterns, forecast) {

    let confidence = 0.5;

    if (timeAnalysis.stable) confidence += 0.2;

    if (!patterns.anomaly) confidence += 0.2;

    if (forecast.confidence > 0.7) confidence += 0.1;

    return Math.min(confidence, 0.95);
  }

  /**
   * ========================
   * 🚨 RISK ENGINE
   * ========================
   */
  computeRisk(timeAnalysis, patterns) {

    if (patterns.anomaly && !timeAnalysis.stable) {
      return "high";
    }

    if (patterns.isDeclinePattern) {
      return "medium";
    }

    if (timeAnalysis.volatility > 0.5) {
      return "medium";
    }

    return "low";
  }

  /**
   * ========================
   * 🧮 CLEAN OUTPUT
   * ========================
   */
  clean(value) {
    return Math.round(value * 100) / 100;
  }
}

module.exports = new RevenuePredictor();
