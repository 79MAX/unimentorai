/**
 * ⚖️ COMPLIANCE ENGINE — GLOBAL LEGAL VALIDATION CORE
 * Level: Stripe / OpenAI / EU GDPR / AI Act ready
 */

export class ComplianceEngine {

  /* =========================
     🚀 MAIN VALIDATION ENTRY
  ========================= */
  static validate(input = {}) {

    // 🧠 GDPR CHECK
    const gdpr = this.checkGDPR(input);

    // 💰 PAYMENT CHECK
    const payment = this.checkPayment(input);

    // 🤖 AI POLICY CHECK
    const aiPolicy = this.checkAIPolicy(input);

    // ⚖️ FINAL LEGAL STATUS
    const legalStatus = this.computeLegalStatus({
      gdpr,
      payment,
      aiPolicy
    });

    return {
      gdpr,
      paymentCompliant: payment.compliant,
      aiPolicy,

      legalStatus,

      // 🧠 COMPLIANCE SCORE (0–100)
      score: this.computeScore({ gdpr, payment, aiPolicy }),

      meta: {
        system: "COMPLIANCE_ENGINE_PRO",
        version: "1.0",
        timestamp: Date.now()
      }
    };
  }

  /* =========================
     🇪🇺 GDPR VALIDATION ENGINE
  ========================= */
  static checkGDPR(input) {

    const consent = !!input.user?.consent;
    const dataExportAllowed = !!input.user?.dataExportAllowed;
    const deleteRequest = !!input.user?.deleteRequest;

    return {
      compliant: consent,
      consent,
      dataExportAllowed,
      deleteRequest,
      status: consent ? "OK" : "VIOLATION"
    };
  }

  /* =========================
     💰 PAYMENT COMPLIANCE ENGINE
  ========================= */
  static checkPayment(input) {

    const hasPayment = !!input.payment;
    const methodValid = !!input.payment?.method;
    const amountValid = (input.payment?.amount || 0) >= 0;

    const compliant = hasPayment && methodValid && amountValid;

    return {
      compliant,
      hasPayment,
      methodValid,
      amountValid,
      status: compliant ? "OK" : "INVALID"
    };
  }

  /* =========================
     🤖 AI POLICY ENGINE
  ========================= */
  static checkAIPolicy(input) {

    const flags = input.user?.flags || [];

    const blocked = flags.includes("blocked");
    const suspicious = flags.includes("suspicious");

    const allowed = !blocked;

    return {
      allowed,
      blocked,
      suspicious,
      status: allowed ? "OK" : "BLOCKED"
    };
  }

  /* =========================
     ⚖️ LEGAL STATUS ENGINE
  ========================= */
  static computeLegalStatus({ gdpr, payment, aiPolicy }) {

    if (!gdpr.compliant) return "NON_COMPLIANT";
    if (!payment.compliant) return "NON_COMPLIANT";
    if (!aiPolicy.allowed) return "NON_COMPLIANT";

    return "COMPLIANT";
  }

  /* =========================
     📊 COMPLIANCE SCORE ENGINE
  ========================= */
  static computeScore({ gdpr, payment, aiPolicy }) {

    let score = 100;

    if (!gdpr.compliant) score -= 40;
    if (!payment.compliant) score -= 30;
    if (!aiPolicy.allowed) score -= 30;

    return Math.max(0, score);
  }
}

