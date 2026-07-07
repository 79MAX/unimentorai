/**
 * 🧠 MATURITY LEVEL ENGINE — PRODUCTION GRADE
 * Level: Stripe / Notion / Uber scaling logic style
 */

export class MaturityLevelEngine {

  /* =========================
     ⚙️ CONFIGURATION LEVELS
  ========================= */
  static thresholds = {
    MVP: 50,
    GROWTH: 200,
    SCALE: 800
  };

  /* =========================
     🧠 MAIN COMPUTE ENGINE
  ========================= */
  static compute(m = {}) {

    const metrics = this.normalize(m);

    const score = this.calculateScore(metrics);

    return this.resolveLevel(score);
  }

  /* =========================
     📊 SCORE CALCULATION
  ========================= */
  static calculateScore(m) {

    let score =
      (m.users * 0.4) +
      (m.revenue * 0.4) +
      (m.activity * 0.2) -
      (m.errors * 10) -
      (m.latency * 2);

    /* =========================
       🧯 SCORE BOUNDING (IMPORTANT)
    ========================= */
    score = Math.max(0, Math.min(1000, score));

    return score;
  }

  /* =========================
     🧠 LEVEL RESOLUTION
  ========================= */
  static resolveLevel(score) {

    if (score < this.thresholds.MVP) {
      return "MVP";
    }

    if (score < this.thresholds.GROWTH) {
      return "GROWTH";
    }

    if (score < this.thresholds.SCALE) {
      return "SCALE";
    }

    return "ENTERPRISE";
  }

  /* =========================
     🧼 INPUT NORMALIZATION
  ========================= */
  static normalize(m) {

    return {
      users: this.toNumber(m.users),
      revenue: this.toNumber(m.revenue),
      activity: this.toNumber(m.activity),
      errors: this.toNumber(m.errors),
      latency: this.toNumber(m.latency)
    };
  }

  /* =========================
     🔢 SAFE NUMBER CONVERTER
  ========================= */
  static toNumber(v) {

    const n = Number(v);

    return Number.isFinite(n) ? n : 0;
  }
}

