/* =========================
   🔐 FRAUD DETECTION AI
   UniMentorAI - RISK ENGINE (STRIPE RADAR STYLE)
========================= */

import { getBillingLogs } from "../logs/billing.logs.js";

export class FraudDetector {

  /* =========================
     🧠 MAIN DETECTION ENGINE
  ========================= */
  static detect() {

    const logs = getBillingLogs();

    const suspicious = [];

    /* =========================
       ⚡ PRE-COMPUTE MAP (PERF OPTIMIZATION)
    ========================= */
    const userMap = new Map();

    for (const log of logs) {

      const key = `${log.email}-${log.amount}`;

      if (!userMap.has(key)) {
        userMap.set(key, 0);
      }

      userMap.set(key, userMap.get(key) + 1);
    }

    /* =========================
       🔍 SCAN LOGS (AI RISK SCORING)
    ========================= */
    for (const log of logs) {

      let riskScore = 0;
      const reasons = [];

      const key = `${log.email}-${log.amount}`;
      const count = userMap.get(key);

      /* 🚨 DUPLICATE PAYMENT */
      if (count > 1) {
        riskScore += 50;
        reasons.push("DUPLICATE_PAYMENT");
      }

      /* 🚨 HIGH VALUE TRANSACTION */
      if (Number(log.amount) > 500) {
        riskScore += 30;
        reasons.push("HIGH_VALUE");
      }

      /* 🚨 MULTIPLE FLAGS => CRITICAL */
      if (riskScore >= 60) {

        suspicious.push({
          email: log.email,
          amount: log.amount,
          provider: log.provider || "UNKNOWN",
          riskScore,
          reasons,
          timestamp: log.createdAt
        });
      }
    }

    return this._deduplicate(suspicious);
  }

  /* =========================
     🧹 REMOVE DUPLICATES
  ========================= */
  static _deduplicate(list) {

    const seen = new Set();

    return list.filter(item => {

      const key = `${item.email}-${item.amount}`;

      if (seen.has(key)) return false;

      seen.add(key);

      return true;
    });
  }
}
