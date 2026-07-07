/**
 * ⚖️ LEGAL AI SYSTEM ENTRY POINT (PRO MAX)
 * Level: OpenAI Safety Gateway / Stripe Radar Entry Router
 * Central access layer for autonomous legal AI system
 */

import { LegalAutonomousEngine } from "./autonomous/legal-autonomous.engine.js";

export class LegalAI {

  /* =========================
     🚀 MAIN SYSTEM ENTRY
  ========================= */
  static run(input = {}) {

    const start = Date.now();

    const result = this.safeProcess(input);

    return {
      ...result,

      // 📊 OBSERVABILITY LAYER
      meta: {
        system: "LEGAL_AI_KERNEL",
        version: "1.0",
        timestamp: Date.now(),
        latency: Date.now() - start
      }
    };
  }

  /* =========================
     🧠 SAFE EXECUTION WRAPPER
  ========================= */
  static safeProcess(input) {

    try {

      return LegalAutonomousEngine.process(input);

    } catch (error) {

      // 🚨 FAIL-SAFE LEGAL BLOCK MODE
      return {
        success: false,

        decision: {
          action: "BLOCK",
          risk: 100,
          allowed: false,
          error: true,
          message: error.message,
          timestamp: Date.now()
        }
      };
    }
  }
}

