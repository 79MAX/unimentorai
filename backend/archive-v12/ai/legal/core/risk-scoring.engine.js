/**
 * ⚖️ COMPLIANCE ENGINE — GDPR / PAYMENTS / AI POLICY LAYER (PRO MAX)
 * Legal-grade validation system
 */

export class ComplianceEngine {

  static validate(input = {}) {

    const user = input.user || {};

    const gdprConsent = Boolean(user.consent === true);
    const hasPaymentIntent = Boolean(input.payment);
    const isNotBlocked = !(user.flags || []).includes("blocked");
    const hasValidEmail = typeof user.email === "string" && user.email.includes("@");

    const legalStatus =
      gdprConsent && isNotBlocked && hasValidEmail
        ? "COMPLIANT"
        : "NON_COMPLIANT";

    return {
      gdprConsent,
      paymentIntent: hasPaymentIntent,
      aiPolicyCompliant: isNotBlocked,
      emailValid: hasValidEmail,
      legalStatus
    };
  }
}

