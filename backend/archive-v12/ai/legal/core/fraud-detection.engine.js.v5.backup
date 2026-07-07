/**
 * 🚨 FRAUD DETECTION ENGINE — STRIPE-STYLE INTELLIGENCE LAYER (PRO MAX)
 * Real-time fraud scoring + risk classification system
 */

export class FraudDetectionEngine {

  /* =========================
     🧠 MAIN DETECTION ENGINE
  ========================= */
  static detect(input = {}) {

    const user = input.user || {};
    const payment = input.payment || {};

    let score = 0;
    const flags = [];

    // 💳 HIGH VALUE TRANSACTION
    if (payment.amount > 5000) {
      score += 25;
      flags.push("HIGH_VALUE_TRANSACTION");
    }

    // 🌍 GEO LOCATION MISMATCH
    if (
      user.country &&
      payment.country &&
      user.country !== payment.country
    ) {
      score += 20;
      flags.push("COUNTRY_MISMATCH");
    }

    // ⚠️ USER BEHAVIOR RISK
    if ((user.flags || []).includes("suspicious")) {
      score += 30;
      flags.push("SUSPICIOUS_USER");
    }

    // 🔐 MISSING CRITICAL DATA
    if (!user.email) {
      score += 15;
      flags.push("MISSING_EMAIL");
    }

    if (!payment.currency) {
      score += 10;
      flags.push("MISSING_CURRENCY");
    }

    // 🌐 VPN / ANOMALOUS IP
    if (input.ip === "vpn" || input.ip === "proxy") {
      score += 20;
      flags.push("ANOMALOUS_IP");
    }

    /* =========================
       ⚖️ RISK CLASSIFICATION
    ========================= */
    const level =
      score >= 70 ? "CRITICAL"
      : score >= 50 ? "HIGH"
      : score >= 25 ? "MEDIUM"
      : "LOW";

    /* =========================
       🚫 FRAUD DECISION ENGINE
    ========================= */
    const fraud = score >= 50;

    return {
      fraud,
      score,
      level,
      flags,

      meta: {
        timestamp: Date.now(),
        safe: !fraud
      }
    };
  }
}

