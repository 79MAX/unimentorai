
/**
 * ========================
 * ⚖️ FRAUD RISK SCORER ENGINE
 * UniMentorAI SaaS Intelligence Layer
 * ========================
 * Converts signals + rules + anomalies into unified risk score
 */

class FraudRiskScorer {

  /**
   * ========================
   * 🚀 MAIN SCORING ENGINE
   * ========================
   */
  compute({ signals = {}, ruleViolations = {}, anomalies = {} }) {

    let score = 0;

    // 📊 SIGNAL IMPACT
    score += this.scoreSignals(signals);

    // ⚖️ RULE IMPACT
    score += this.scoreRules(ruleViolations);

    // 🔍 ANOMALY IMPACT
    score += this.scoreAnomalies(anomalies);

    // 🧠 NORMALIZATION
    score = this.normalize(score);

    return {
      score,
      level: this.getRiskLevel(score),
      breakdown: {
        signals,
        ruleViolations,
        anomalies
      }
    };
  }

  /**
   * ========================
   * 📊 SIGNAL SCORING
   * ========================
   */
  scoreSignals(signals) {

    let score = 0;

    const tx = signals.transactionSignals || {};
    const behavior = signals.behaviorSignals || {};
    const velocity = signals.velocitySignals || {};

    // 💰 TRANSACTION SIGNALS
    if (tx.failureRate > 0.4) score += 0.25;
    if (tx.highValueRatio > 0.7) score += 0.15;
    if (tx.avgAmount > 3000) score += 0.1;

    // 👤 BEHAVIOR SIGNALS
    if (behavior.suspiciousLoginRate > 0.3) score += 0.25;

    // ⚡ VELOCITY SIGNALS
    if (velocity.rapidVelocityDetected) score += 0.3;
    if (velocity.transactionsPerMinute > 100) score += 0.2;

    return score;
  }

  /**
   * ========================
   * ⚖️ RULE SCORING
   * ========================
   */
  scoreRules(ruleViolations) {

    let score = 0;

    const violations = ruleViolations.violations || [];

    for (const v of violations) {

      switch (v.severity) {

        case "critical":
          score += 0.5;
          break;

        case "high":
          score += 0.3;
          break;

        case "medium":
          score += 0.15;
          break;

        case "low":
          score += 0.05;
          break;
      }
    }

    return score;
  }

  /**
   * ========================
   * 🔍 ANOMALY SCORING
   * ========================
   */
  scoreAnomalies(anomalies) {

    let score = 0;

    const list = anomalies.anomalies || [];

    for (const a of list) {

      switch (a.severity) {

        case "critical":
          score += 0.4;
          break;

        case "high":
          score += 0.25;
          break;

        case "medium":
          score += 0.1;
          break;

        case "low":
          score += 0.05;
          break;
      }
    }

    return score;
  }

  /**
   * ========================
   * 🧠 NORMALIZATION ENGINE
   * ========================
   */
  normalize(score) {

    if (score > 1) return 1;
    if (score < 0) return 0;

    return score;
  }

  /**
   * ========================
   * ⚖️ RISK LEVEL CLASSIFIER
   * ========================
   */
  getRiskLevel(score) {

    if (score >= 0.8) return "critical";
    if (score >= 0.5) return "high";
    if (score >= 0.2) return "medium";

    return "low";
  }
}

module.exports = new FraudRiskScorer();
