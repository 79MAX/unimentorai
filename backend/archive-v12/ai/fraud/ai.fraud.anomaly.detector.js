
/**
 * ========================
 * 🔍 FRAUD ANOMALY DETECTOR
 * UniMentorAI SaaS Intelligence Layer
 * ========================
 * Detects statistical + behavioral anomalies in system activity
 */

class AnomalyDetector {

  /**
   * ========================
   * 🚀 MAIN ANOMALY DETECTION
   * ========================
   */
  detect(signals = {}) {

    const anomalies = [];

    // 📊 TRANSACTION ANOMALIES
    anomalies.push(...this.transactionAnomalies(signals.transactionSignals || {}));

    // 👤 BEHAVIOR ANOMALIES
    anomalies.push(...this.behaviorAnomalies(signals.behaviorSignals || {}));

    // 👤 USER ANOMALIES
    anomalies.push(...this.userAnomalies(signals.userSignals || {}));

    // ⚡ VELOCITY ANOMALIES
    anomalies.push(...this.velocityAnomalies(signals.velocitySignals || {}));

    return {
      anomalies,
      detected: anomalies.length > 0,
      score: this.computeAnomalyScore(anomalies)
    };
  }

  /**
   * ========================
   * 💰 TRANSACTION ANOMALIES
   * ========================
   */
  transactionAnomalies(tx) {

    const anomalies = [];

    if (tx.avgAmount > 3000) {
      anomalies.push({
        type: "HIGH_AVERAGE_TRANSACTION",
        severity: "medium",
        deviation: tx.avgAmount
      });
    }

    if (tx.failureRate > 0.4) {
      anomalies.push({
        type: "ABNORMAL_FAILURE_RATE",
        severity: "high",
        deviation: tx.failureRate
      });
    }

    if (tx.highValueRatio > 0.8) {
      anomalies.push({
        type: "UNUSUAL_HIGH_VALUE_CONCENTRATION",
        severity: "medium",
        deviation: tx.highValueRatio
      });
    }

    return anomalies;
  }

  /**
   * ========================
   * 👤 BEHAVIOR ANOMALIES
   * ========================
   */
  behaviorAnomalies(behavior) {

    const anomalies = [];

    if (behavior.suspiciousLoginRate > 0.25) {
      anomalies.push({
        type: "LOGIN_BEHAVIOR_ANOMALY",
        severity: "high",
        deviation: behavior.suspiciousLoginRate
      });
    }

    if (behavior.loginEvents > 800) {
      anomalies.push({
        type: "EXCESSIVE_LOGIN_ACTIVITY",
        severity: "medium",
        deviation: behavior.loginEvents
      });
    }

    return anomalies;
  }

  /**
   * ========================
   * 👤 USER ANOMALIES
   * ========================
   */
  userAnomalies(users) {

    const anomalies = [];

    if (users.incompleteProfilesRate > 0.5) {
      anomalies.push({
        type: "LOW_PROFILE_COMPLETENESS",
        severity: "medium",
        deviation: users.incompleteProfilesRate
      });
    }

    if (users.newUsers > 1000) {
      anomalies.push({
        type: "UNUSUAL_USER_ACQUISITION_SPIKE",
        severity: "low",
        deviation: users.newUsers
      });
    }

    return anomalies;
  }

  /**
   * ========================
   * ⚡ VELOCITY ANOMALIES (CRITICAL FOR FRAUD)
   * ========================
   */
  velocityAnomalies(velocity) {

    const anomalies = [];

    if (velocity.rapidVelocityDetected) {
      anomalies.push({
        type: "VELOCITY_SPIKE",
        severity: "critical",
        deviation: "system_triggered"
      });
    }

    if (velocity.transactionsPerMinute > 120) {
      anomalies.push({
        type: "EXTREME_TRANSACTION_RATE",
        severity: "critical",
        deviation: velocity.transactionsPerMinute
      });
    }

    if (velocity.eventsPer5Min > 1000) {
      anomalies.push({
        type: "EVENT_STORM_DETECTED",
        severity: "high",
        deviation: velocity.eventsPer5Min
      });
    }

    return anomalies;
  }

  /**
   * ========================
   * 📊 ANOMALY SCORING ENGINE
   * ========================
   */
  computeAnomalyScore(anomalies) {

    if (anomalies.length === 0) return 0;

    let score = 0;

    for (const a of anomalies) {

      if (a.severity === "critical") score += 0.5;
      if (a.severity === "high") score += 0.3;
      if (a.severity === "medium") score += 0.15;
      if (a.severity === "low") score += 0.05;
    }

    return Math.min(score, 1);
  }
}

module.exports = new AnomalyDetector();
