/* =========================
   📈 REVENUE PREDICTOR AI
   UniMentorAI - FORECAST ENGINE (ENTERPRISE LEVEL)
========================= */

import { getBillingLogs } from "../logs/billing.logs.js";

export class RevenuePredictor {

  /* =========================
     📊 NEXT MONTH FORECAST
  ========================= */
  static predictNextMonth() {

    const logs = getBillingLogs();

    const success = logs.filter(l => l.status === "SUCCESS");

    if (!success.length) {
      return {
        predictedRevenue: 0,
        confidence: 0.1,
        trend: "INSUFFICIENT_DATA"
      };
    }

    /* =========================
       📅 GROUP BY SIMPLE TIME WINDOW
    ========================= */
    const now = Date.now();
    const monthMs = 30 * 24 * 60 * 60 * 1000;

    const lastMonth = success.filter(l =>
      new Date(l.createdAt).getTime() > (now - monthMs)
    );

    const previousMonth = success.filter(l =>
      new Date(l.createdAt).getTime() <= (now - monthMs)
    );

    /* =========================
       💰 REVENUE CALCULATION
    ========================= */
    const lastRevenue = this._sum(lastMonth);
    const previousRevenue = this._sum(previousMonth);

    /* =========================
       📈 GROWTH RATE
    ========================= */
    const growthRate =
      previousRevenue === 0
        ? 1
        : (lastRevenue - previousRevenue) / previousRevenue;

    /* =========================
       🧠 FORECAST MODEL (SIMPLE AI)
    ========================= */
    const basePrediction = lastRevenue * (1 + growthRate);

    /* =========================
       🎯 CONFIDENCE MODEL
    ========================= */
    const confidence = this._calculateConfidence(
      lastMonth.length,
      previousMonth.length,
      growthRate
    );

    return {
      predictedRevenue: Math.max(0, Math.round(basePrediction)),
      growthRate: Number(growthRate.toFixed(2)),
      confidence: Number(confidence.toFixed(2)),
      trend: growthRate >= 0 ? "UP" : "DOWN"
    };
  }

  /* =========================
     💰 SUM HELPER
  ========================= */
  static _sum(list) {

    return list.reduce(
      (s, l) => s + Number(l.amount || 0),
      0
    );
  }

  /* =========================
     🧠 CONFIDENCE ENGINE
  ========================= */
  static _calculateConfidence(lastCount, prevCount, growthRate) {

    let confidence = 0.5;

    /* more data = more confidence */
    confidence += Math.min(lastCount / 100, 0.25);

    /* stable growth = more confidence */
    if (Math.abs(growthRate) < 0.2) {
      confidence += 0.2;
    }

    /* penalize low data */
    if (lastCount < 10) {
      confidence -= 0.2;
    }

    return Math.min(0.95, Math.max(0.1, confidence));
  }
}
