/**
 * 📊 LEGAL RISK ANALYTICS ENGINE (PRO MAX)
 * Level: Stripe Radar Analytics / OpenAI Safety Observability Layer
 * Computes system-wide legal risk intelligence
 */

export class LegalRiskAnalytics {

  /* =========================
     📊 MAIN ANALYTICS ENGINE
  ========================= */
  static analyze(logs = []) {

    const safeLogs = Array.isArray(logs) ? logs : [];

    const total = safeLogs.length;

    if (total === 0) {
      return this.emptyMetrics();
    }

    const riskValues = safeLogs.map(l => this.normalizeRisk(l?.risk));

    const highRisk = riskValues.filter(r => r >= 70).length;
    const mediumRisk = riskValues.filter(r => r >= 40 && r < 70).length;
    const lowRisk = riskValues.filter(r => r < 40).length;

    const avgRisk = this.average(riskValues);

    return {
      total,

      // 📊 CORE METRICS
      highRisk,
      mediumRisk,
      lowRisk,

      // 📈 RISK INTELLIGENCE
      riskRate: Math.round((highRisk / total) * 100),
      averageRisk: Math.round(avgRisk),

      // 🧠 SYSTEM HEALTH CLASSIFICATION
      riskLevel: this.getRiskLevel(avgRisk),

      // 📊 DISTRIBUTION INSIGHT
      distribution: {
        high: highRisk,
        medium: mediumRisk,
        low: lowRisk
      }
    };
  }

  /* =========================
     📊 SAFE RISK NORMALIZER
  ========================= */
  static normalizeRisk(risk) {

    if (typeof risk !== "number") return 0;

    if (risk < 0) return 0;
    if (risk > 100) return 100;

    return risk;
  }

  /* =========================
     📊 AVERAGE CALCULATION
  ========================= */
  static average(values = []) {

    if (!values.length) return 0;

    const sum = values.reduce((a, b) => a + b, 0);

    return sum / values.length;
  }

  /* =========================
     🧠 RISK LEVEL CLASSIFIER
  ========================= */
  static getRiskLevel(avgRisk) {

    if (avgRisk >= 75) return "CRITICAL";
    if (avgRisk >= 50) return "HIGH";
    if (avgRisk >= 25) return "MEDIUM";
    return "LOW";
  }

  /* =========================
     📊 EMPTY STATE HANDLER
  ========================= */
  static emptyMetrics() {

    return {
      total: 0,
      highRisk: 0,
      mediumRisk: 0,
      lowRisk: 0,
      riskRate: 0,
      averageRisk: 0,
      riskLevel: "LOW",
      distribution: {
        high: 0,
        medium: 0,
        low: 0
      }
    };
  }
}

