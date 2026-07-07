
/**
 * ==========================================
 * 📈 MENTOR PROGRESS TRACKER ENGINE
 * UniMentorAI Learning Progress Intelligence
 * ==========================================
 * Responsible for:
 * - long-term learning progression tracking
 * - mastery evolution analysis
 * - performance trend detection
 * - stagnation / regression detection
 * - learning velocity computation
 */

class MentorProgressTracker {

  constructor() {

    this.userProgress = new Map();
  }

  /**
   * ==========================================
   * GET OR CREATE PROGRESS STATE
   * ==========================================
   */
  get(userId) {

    if (!this.userProgress.has(userId)) {
      this.userProgress.set(userId, this.create(userId));
    }

    return this.userProgress.get(userId);
  }

  /**
   * ==========================================
   * INITIAL PROGRESS STRUCTURE
   * ==========================================
   */
  create(userId) {

    return {
      userId,

      // --------------------------------------
      // CORE METRICS
      // --------------------------------------
      mastery: 0,
      previousMastery: 0,
      sessions: 0,

      // --------------------------------------
      // LEARNING DYNAMICS
      // --------------------------------------
      improvements: 0,
      regressions: 0,
      stagnationCount: 0,

      // --------------------------------------
      // LEARNING VELOCITY
      // --------------------------------------
      velocity: 0,
      trend: "stable",

      // --------------------------------------
      // HISTORY CURVE
      // --------------------------------------
      history: [],

      // --------------------------------------
      // PERFORMANCE PROFILE
      // --------------------------------------
      performance: {
        averageMastery: 0,
        bestScore: 0,
        worstScore: 1
      }
    };
  }

  /**
   * ==========================================
   * MAIN UPDATE ENGINE
   * ==========================================
   */
  update(userId, learningState, context) {

    const progress = this.get(userId);

    // --------------------------------------
    // STORE PREVIOUS STATE
    // --------------------------------------
    progress.previousMastery = progress.mastery;

    // --------------------------------------
    // UPDATE CURRENT MASTERY
    // --------------------------------------
    progress.mastery = learningState.mastery || 0;

    // --------------------------------------
    // SESSION COUNT
    // --------------------------------------
    progress.sessions += 1;

    // --------------------------------------
    // UPDATE HISTORY CURVE
    // --------------------------------------
    this.updateHistory(progress, learningState, context);

    // --------------------------------------
    // DETECT DYNAMICS
    // --------------------------------------
    this.detectChanges(progress);

    // --------------------------------------
    // UPDATE VELOCITY
    // --------------------------------------
    this.computeVelocity(progress);

    // --------------------------------------
    // UPDATE PERFORMANCE PROFILE
    // --------------------------------------
    this.updatePerformance(progress);

    // --------------------------------------
    // UPDATE TREND
    // --------------------------------------
    this.updateTrend(progress);

    return progress;
  }

  /**
   * ==========================================
   * HISTORY TRACKING
   * ==========================================
   */
  updateHistory(progress, learningState, context) {

    progress.history.push({
      mastery: learningState.mastery,
      engagement: context.engagement,
      confusion: context.confusion,
      timestamp: Date.now()
    });

    if (progress.history.length > 200) {
      progress.history.shift();
    }
  }

  /**
   * ==========================================
   * CHANGE DETECTION ENGINE
   * ==========================================
   */
  detectChanges(progress) {

    const delta =
      progress.mastery - progress.previousMastery;

    if (delta > 0.02) {
      progress.improvements += 1;
    }

    if (delta < -0.02) {
      progress.regressions += 1;
    }

    if (Math.abs(delta) <= 0.02) {
      progress.stagnationCount += 1;
    }
  }

  /**
   * ==========================================
   * LEARNING VELOCITY ENGINE
   * ==========================================
   */
  computeVelocity(progress) {

    const history = progress.history;

    if (history.length < 2) {
      progress.velocity = 0;
      return;
    }

    const recent = history.slice(-10);

    const first = recent[0].mastery;
    const last = recent[recent.length - 1].mastery;

    progress.velocity =
      (last - first) / recent.length;
  }

  /**
   * ==========================================
   * PERFORMANCE TRACKER
   * ==========================================
   */
  updatePerformance(progress) {

    const history = progress.history;

    const values = history.map(h => h.mastery);

    if (values.length === 0) return;

    progress.performance.averageMastery =
      values.reduce((a, b) => a + b, 0) / values.length;

    progress.performance.bestScore =
      Math.max(...values);

    progress.performance.worstScore =
      Math.min(...values);
  }

  /**
   * ==========================================
   * TREND ANALYSIS ENGINE
   * ==========================================
   */
  updateTrend(progress) {

    const h = progress.history;

    if (h.length < 5) return;

    const recent = h.slice(-5);

    const start = recent[0].mastery;
    const end = recent[recent.length - 1].mastery;

    const diff = end - start;

    if (diff > 0.05) {
      progress.trend = "improving";
    } else if (diff < -0.05) {
      progress.trend = "declining";
    } else {
      progress.trend = "stable";
    }
  }

  /**
   * ==========================================
   * LEARNING INSIGHTS API
   * ==========================================
   */
  insights(userId) {

    const p = this.get(userId);

    return {
      mastery: p.mastery,
      trend: p.trend,
      velocity: p.velocity,
      sessions: p.sessions,
      improvements: p.improvements,
      regressions: p.regressions,
      stagnation: p.stagnationCount,
      performance: p.performance
    };
  }

  /**
   * ==========================================
   * SYSTEM OVERVIEW (ALL USERS)
   * ==========================================
   */
  systemOverview() {

    let users = this.userProgress.values();

    let total = 0;
    let count = 0;

    for (let p of users) {
      total += p.mastery;
      count++;
    }

    return {
      users: count,
      averageMastery: count ? total / count : 0
    };
  }
}

module.exports = MentorProgressTracker;
