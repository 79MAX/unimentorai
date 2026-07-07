/**
 * ⚖️ LEGAL ROUTER — CENTRAL GOVERNANCE ENGINE (PRODUCTION GRADE)
 * Level: Stripe Radar / OpenAI Safety / Meta Policy Router
 */

import { ComplianceEngine } from "./compliance.engine.js";
import { RiskScoringEngine } from "./risk-scoring.engine.js";
import { FraudDetectionEngine } from "./fraud-detection.engine.js";

export class LegalRouter {

  /* =========================
     🚀 MAIN GOVERNANCE CHECK
  ========================= */
  static evaluate(input = {}) {

    // 🧠 STEP 1 — COMPLIANCE CHECK
    const compliance = ComplianceEngine.validate(input);

    // ⚠️ STEP 2 — RISK SCORING
    const risk = RiskScoringEngine.score(input);

    // 🚨 STEP 3 — FRAUD DETECTION
    const fraud = FraudDetectionEngine.detect(input);

    // 🧠 STEP 4 — DECISION ENGINE
    const decision = this.decide({
      compliance,
      risk,
      fraud
    });

    return {
      decision,

      allowed: decision.allowed,

      compliance,
      risk,
      fraud,

      meta: {
        system: "LEGAL_ROUTER_PRO",
        version: "1.0",
        timestamp: Date.now()
      }
    };
  }

  /* =========================
     🧠 DECISION ENGINE (CORE LOGIC)
  ========================= */
  static decide({ compliance, risk, fraud }) {

    // 🚫 HARD BLOCK CONDITIONS
    const isBlocked =
      compliance?.legalStatus !== "COMPLIANT" ||
      fraud?.fraud === true;

    // ⚠️ RISK TIERS
    const riskLevel =
      risk >= 85 ? "CRITICAL"
      : risk >= 70 ? "HIGH"
      : risk >= 40 ? "MEDIUM"
      : "LOW";

    // ⚡ FINAL DECISION LOGIC
    let action = "ALLOW";

    if (isBlocked) {
      action = "BLOCK";
    } else if (riskLevel === "CRITICAL") {
      action = "BLOCK";
    } else if (riskLevel === "HIGH") {
      action = "REVIEW";
    } else if (riskLevel === "MEDIUM") {
      action = "LIMIT";
    }

    return {
      action,
      allowed: action === "ALLOW",

      riskLevel,

      reasons: this.buildReasons({
        compliance,
        riskLevel,
        fraud
      })
    };
  }

  /* =========================
     📊 EXPLAINABILITY ENGINE (AUDIT READY)
  ========================= */
  static buildReasons({ compliance, riskLevel, fraud }) {

    const reasons = [];

    if (compliance?.legalStatus !== "COMPLIANT") {
      reasons.push("NON_COMPLIANT_USER");
    }

    if (fraud?.fraud) {
      reasons.push("FRAUD_DETECTED");
    }

    if (riskLevel === "CRITICAL") {
      reasons.push("CRITICAL_RISK_SCORE");
    }

    if (riskLevel === "HIGH") {
      reasons.push("HIGH_RISK_SCORE");
    }

    return reasons;
  }
}

