
/**
 * ========================
 * 📊 REVENUE PATTERN DETECTOR
 * UniMentorAI SaaS Intelligence Layer
 * ========================
 * Detects growth, decline, anomalies and behavioral patterns
 */

class PatternDetector {

  /**
   * ========================
   * 🔍 MAIN DETECTION FUNCTION
   * ========================
   */
  detect(data = []) {

    if (!Array.isArray(data) || data.length < 3) {
      return {
        isGrowthPattern: false,
        isDeclinePattern: false,
        anomaly: false,
        confidence: 0
      };
    }

    const values = data.map(d => d.revenue || 0);

    const trend = this.getTrend(values);

    const anomaly = this.detectAnomalies(values);

    const cycle = this.detectCycle(values);

    return {
      isGrowthPattern: trend > 0.2,
      isDeclinePattern: trend < -0.2,
      isStablePattern: Math.abs(trend) <= 0.2,

      anomaly: anomaly.detected,
      anomalyScore: anomaly.score,

      cycleDetected: cycle.detected,
      cycleStrength: cycle.strength,

      confidence: this.computeConfidence(trend, anomaly, cycle)
    };
  }

  /**
   * ========================
   * 📈 TREND ENGINE
   * ========================
   */
  getTrend(values) {

    const n = values.length;

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    for (let i = 0; i < n; i++) {

      sumX += i;
      sumY += values[i];
      sumXY += i * values[i];
      sumX2 += i * i;
    }

    const slope =
      (n * sumXY - sumX * sumY) /
      (n * sumX2 - sumX * sumX || 1);

    const normalized = slope / (this.mean(values) || 1);

    return normalized;
  }

  /**
   * ========================
   * 🚨 ANOMALY DETECTION
   * ========================
   */
  detectAnomalies(values) {

    const mean = this.mean(values);
    const std = this.std(values);

    let anomalies = 0;

    for (const v of values) {
      if (Math.abs(v - mean) > 2 * std) {
        anomalies++;
      }
    }

    const score = anomalies / values.length;

    return {
      detected: score > 0.15,
      score
    };
  }

  /**
   * ========================
   * 🔄 CYCLE DETECTION (SIMPLIFIED AUTO-CORRELATION)
   * ========================
   */
  detectCycle(values) {

    if (values.length < 6) {
      return {
        detected: false,
        strength: 0
      };
    }

    let correlation = 0;

    const lag = Math.floor(values.length / 3);

    for (let i = 0; i < values.length - lag; i++) {
      correlation += values[i] * values[i + lag];
    }

    correlation = correlation / values.length;

    const normalized = correlation / (this.mean(values) || 1);

    return {
      detected: normalized > 0.6,
      strength: Math.min(normalized, 1)
    };
  }

  /**
   * ========================
   * 📊 CONFIDENCE ENGINE
   * ========================
   */
  computeConfidence(trend, anomaly, cycle) {

    let confidence = 0.5;

    if (Math.abs(trend) > 0.3) confidence += 0.2;

    if (!anomaly.detected) confidence += 0.2;

    if (cycle.detected) confidence += 0.1;

    return Math.min(confidence, 0.95);
  }

  /**
   * ========================
   * 📊 MEAN
   * ========================
   */
  mean(values) {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * ========================
   * 📊 STANDARD DEVIATION
   * ========================
   */
  std(values) {

    const mean = this.mean(values);

    const variance = values.reduce((acc, v) => {
      return acc + Math.pow(v - mean, 2);
    }, 0) / values.length;

    return Math.sqrt(variance);
  }
}

module.exports = new PatternDetector();
