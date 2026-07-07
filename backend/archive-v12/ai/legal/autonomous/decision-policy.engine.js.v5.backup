/**
 * 📜 DECISION POLICY ENGINE — RULE GOVERNOR (PRO MAX)
 * Level: Stripe Radar / OpenAI Safety Policy Layer
 * Central rule-based decision system
 */

export class DecisionPolicyEngine {

  /* =========================
     ⚖️ POLICY CONFIGURATION
  ========================= */
  static policies = {
    BLOCK_THRESHOLD: 85,
    REVIEW_THRESHOLD: 60,
    ALLOW_THRESHOLD: 0
  };

  /* =========================
     🚀 MAIN POLICY EXECUTION
  ========================= */
  static apply(risk = 0, context = {}) {

    const normalizedRisk = this.normalizeRisk(risk);

    const decision = this.evaluate(normalizedRisk);

    return {
      decision, // ALLOW | REVIEW | BLOCK
      risk: normalizedRisk,

      meta: {
        policy: "DEFAULT_V1",
        timestamp: Date.now(),
        context: context || {}
      }
    };
  }

  /* =========================
     🧠 CORE RULE ENGINE
  ========================= */
  static evaluate(risk) {

    if (risk >= this.policies.BLOCK_THRESHOLD) {
      return "BLOCK";
    }

    if (risk >= this.policies.REVIEW_THRESHOLD) {
      return "REVIEW";
    }

    return "ALLOW";
  }

  /* =========================
     📊 RISK NORMALIZER (IMPORTANT FOR PROD)
  ========================= */
  static normalizeRisk(risk) {

    if (typeof risk !== "number") return 0;

    if (risk < 0) return 0;
    if (risk > 100) return 100;

    return Math.round(risk);
  }
}

