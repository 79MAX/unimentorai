/**
 * 💰 AI REVENUE ENGINE — STRIPE STYLE INTELLIGENCE (PRODUCTION GRADE)
 * Level: Stripe / OpenAI Billing Analytics / SaaS Revenue Core
 *
 * FEATURES:
 * - MRR/ARR estimation
 * - Revenue velocity tracking
 * - Payment health scoring
 * - Growth signal detection
 * - Revenue risk analysis
 */

export class RevenueEngine {

  /* =========================
     💰 MAIN ANALYTICS ENTRY
  ========================= */
  static analyze(payments = []) {

    const now = Date.now();

    const total = this.calculateTotal(payments);
    const avg = this.calculateAverage(payments, total);

    const monthlyRevenue = this.calculateMonthlyRevenue(payments, now);
    const revenueVelocity = this.calculateVelocity(payments);

    const status = this.getRevenueStatus(total);
    const healthScore = this.calculateHealthScore(total, monthlyRevenue, payments.length);

    return {
      timestamp: now,

      // 💰 CORE METRICS
      total,
      average: avg,

      // 📊 SaaS METRICS
      monthlyRevenue,
      estimatedARR: monthlyRevenue * 12,
      revenueVelocity,

      // 🧠 INTELLIGENCE LAYER
      status,
      healthScore,

      // 📡 SIGNALS
      signals: this.generateSignals({
        total,
        monthlyRevenue,
        payments
      })
    };
  }

  /* =========================
     💰 TOTAL REVENUE
  ========================= */
  static calculateTotal(payments) {

    let total = 0;

    for (let i = 0; i < payments.length; i++) {
      total += payments[i]?.amount || 0;
    }

    return total;
  }

  /* =========================
     📊 AVERAGE CHECK VALUE
  ========================= */
  static calculateAverage(payments, total) {

    if (!payments.length) return 0;

    return Math.round(total / payments.length);
  }

  /* =========================
     📅 MONTHLY REVENUE ENGINE
  ========================= */
  static calculateMonthlyRevenue(payments, now) {

    const month = 30 * 86400000;

    let monthly = 0;

    for (let i = 0; i < payments.length; i++) {

      const p = payments[i];

      if (now - new Date(p.createdAt || 0).getTime() < month) {
        monthly += p.amount || 0;
      }
    }

    return monthly;
  }

  /* =========================
     📈 REVENUE VELOCITY
  ========================= */
  static calculateVelocity(payments) {

    if (payments.length < 2) return 0;

    return Math.round(payments.length / 30); // payments/day approx
  }

  /* =========================
     🧠 REVENUE STATUS ENGINE
  ========================= */
  static getRevenueStatus(total) {

    if (total > 10000) return "STRONG";
    if (total > 1000) return "HEALTHY";
    if (total > 0) return "STARTING";

    return "FLAT";
  }

  /* =========================
     🧠 HEALTH SCORE (0–100)
  ========================= */
  static calculateHealthScore(total, monthly, count) {

    let score = 50;

    if (total > 10000) score += 25;
    if (monthly > 2000) score += 20;
    if (count > 50) score += 10;

    if (total === 0) score -= 40;

    return Math.max(0, Math.min(100, score));
  }

  /* =========================
     📡 BUSINESS SIGNALS ENGINE
  ========================= */
  static generateSignals({ total, monthlyRevenue, payments }) {

    const signals = [];

    if (total === 0) {
      signals.push({
        type: "CRITICAL",
        message: "No revenue detected — monetization required"
      });
    }

    if (monthlyRevenue < 1000) {
      signals.push({
        type: "WARNING",
        message: "Monthly revenue below healthy threshold"
      });
    }

    if (payments.length > 100) {
      signals.push({
        type: "POSITIVE",
        message: "Strong transaction volume detected"
      });
    }

    return signals;
  }
}

