
const FraudSignals = require("./ai.fraud.signals");
const FraudRules = require("./ai.fraud.rules");
const AnomalyDetector = require("./ai.fraud.anomaly.detector");
const RiskScorer = require("./ai.fraud.risk.scorer");

/**
 * ========================
 * 🔍 AI FRAUD ENGINE
 * UniMentorAI SaaS Intelligence Layer
 * ========================
 * Detects fraudulent behavior and abnormal patterns
 */

class FraudEngine {

  /**
   * ========================
   * 🚀 MAIN FRAUD ANALYSIS PIPELINE
   * ========================
   */
  analyze(context = {}) {

    const events = context.events || [];
    const users = context.users || [];
    const transactions = context.transactions || [];

    // 🧠 STEP 1 — SIGNAL EXTRACTION
    const signals = FraudSignals.extract({
      events,
      users,
      transactions
    });

    // 🚨 STEP 2 — RULE-BASED CHECK
    const ruleViolations = FraudRules.evaluate(signals);

    // 📊 STEP 3 — ANOMALY DETECTION
    const anomalies = AnomalyDetector.detect(signals);

    // ⚖️ STEP 4 — RISK SCORING
    const risk = RiskScorer.compute({
      signals,
      ruleViolations,
      anomalies
    });

    // 🧠 STEP 5 — DECISION ENGINE
    const decision = this.makeDecision(risk);

    return {
      riskScore: risk.score,
      riskLevel: risk.level,

      decision,

      signals,
      anomalies,
      ruleViolations,

      insights: this.generateInsights(risk),

      timestamp: new Date()
    };
  }

  /**
   * ========================
   * ⚖️ DECISION ENGINE
   * ========================
   */
  makeDecision(risk) {

    if (risk.score >= 0.8) {
      return "BLOCK";
    }

    if (risk.score >= 0.5) {
      return "REVIEW";
    }

    return "ALLOW";
  }

  /**
   * ========================
   * 🧠 INSIGHT GENERATION
   * ========================
   */
  generateInsights(risk) {

    const insights = [];

    if (risk.level === "high") {
      insights.push("High fraud probability detected");
    }

    if (risk.anomalyScore > 0.6) {
      insights.push("Unusual behavioral pattern detected");
    }

    if (risk.ruleViolations > 0) {
      insights.push("Policy rule violations detected");
    }

    return insights;
  }
}

module.exports = new FraudEngine();
