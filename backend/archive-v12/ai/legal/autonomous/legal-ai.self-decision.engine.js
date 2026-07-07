/**
 * 🧠 AUTONOMOUS LEGAL AI — SELF DECISION CORE (PRO MAX)
 * Level: OpenAI Safety / Stripe Radar / Meta Governance AI
 */

import { LegalRouter } from "../core/legal.router.js";

export class LegalSelfDecisionEngine {

  /* =========================
     🧠 INTERNAL STATE (AUDITABLE MEMORY)
  ========================= */
  static state = {
    logs: [],
    counters: {
      allow: 0,
      block: 0,
      review: 0,
      limit: 0
    }
  };

  /* =========================
     🚀 MAIN DECISION ENGINE
  ========================= */
  static evaluate(input = {}) {

    const legal = LegalRouter.evaluate(input);

    const risk = legal?.risk || 0;
    const allowed = Boolean(legal?.allowed);

    /* =========================
       ⚖️ DECISION HIERARCHY (FIXED LOGIC)
    ========================= */
    let action = this.decide({ allowed, risk });

    /* =========================
       📊 DECISION OBJECT
    ========================= */
    const decision = {
      action, // ALLOW | LIMIT | REVIEW | BLOCK
      risk,
      allowed: action === "ALLOW",
      timestamp: Date.now(),

      meta: {
        legalAllowed: allowed,
        system: "LEGAL_SELF_DECISION_ENGINE"
      }
    };

    /* =========================
       🧠 AUDIT LOGGING (IMMUTABLE STYLE)
    ========================= */
    this.log(decision);

    return decision;
  }

  /* =========================
     ⚖️ DECISION RULE ENGINE
  ========================= */
  static decide({ allowed, risk }) {

    // 🚫 HARD BLOCK FROM LEGAL ROUTER
    if (!allowed) return "BLOCK";

    // ⚠️ RISK-BASED POLICY
    if (risk >= 85) return "BLOCK";
    if (risk >= 70) return "REVIEW";
    if (risk >= 50) return "LIMIT";

    return "ALLOW";
  }

  /* =========================
     📊 AUDIT LOG ENGINE
  ========================= */
  static log(decision) {

    this.state.logs.push(decision);

    // 📊 COUNTERS UPDATE
    const key = decision.action.toLowerCase();

    if (this.state.counters[key] !== undefined) {
      this.state.counters[key]++;
    }

    // 🧹 MEMORY LIMIT (avoid memory leak in production)
    if (this.state.logs.length > 1000) {
      this.state.logs.shift();
    }
  }

  /* =========================
     📈 ANALYTICS (FOR ADMIN PANEL)
  ========================= */
  static getStats() {

    const total = this.state.logs.length;

    return {
      totalDecisions: total,

      breakdown: this.state.counters,

      lastDecision: this.state.logs[total - 1] || null,

      blockRate: total
        ? (this.state.counters.block / total) * 100
        : 0
    };
  }
}

