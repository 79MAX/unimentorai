/**
 * ⚖️ LEGAL CHECK ENGINE — FINAL GOVERNANCE LAYER (PRO MAX)
 * Last decision layer before execution (Stripe-style compliance gate)
 */

export class LegalCheckEngine {

  /* =========================
     🚨 MAIN LEGAL VALIDATION
  ========================= */
  static check(input = {}) {

    const user = input.user || {};
    const risk = this.normalizeRisk(input.risk);
    const consent = Boolean(user.consent);
    const blocked = (user.flags || []).includes("blocked");

    /* =========================
       🧠 LEGAL DECISION ENGINE
    ========================= */
    let status = "APPROVED";

    if (!consent) status = "REJECTED";
    if (blocked) status = "REJECTED";
    if (risk >= 70 && status !== "REJECTED") status = "REVIEW";

    /* =========================
       📊 FINAL OUTPUT
    ========================= */
    return {
      approved: status === "APPROVED",
      status, // APPROVED | REVIEW | REJECTED
      riskLevel: risk,

      meta: {
        hasConsent: consent,
        isBlocked: blocked,
        timestamp: Date.now()
      }
    };
  }

  /* =========================
     📊 RISK NORMALIZER
  ========================= */
  static normalizeRisk(risk) {

    if (typeof risk !== "number") return 50;

    if (risk < 0) return 0;
    if (risk > 100) return 100;

    return Math.round(risk);
  }
}

