
/**
 * ==========================================
 * 📈 MENTOR PROGRESS TRACKER ENGINE
 * UniMentorAI Learning Trajectory System
 * ==========================================
 * Responsible for:
 * - tracking long-term learning progression
 * - detecting improvement or regression
 * - measuring skill consolidation
 * - building learning trajectory curves
 * - supporting adaptive decision engines
 */

class MentorProgressTracker {

  constructor() {

    this.userProgress = new Map();
  }

  /**
   * ==========================================
   * MAIN PROGRESS UPDATE
   * ==========================================
   */
  update(userId, learningState, context) {

    const progress =
      this.getOrCreateProgress(userId);

    // --------------------------------------
    // 1. UPDATE CORE METRICS
    // --------------------------------------
    this.updateCore(progress, learningState, context);

    // --------------------------------------
    // 2. UPDATE TRAJECTORY
    // --------------------------------------
    this.updateTrajectory(progress);

    // --------------------------------------
    // 3. DETECT PATTERNS
    // --------------------------------------
    const patterns =
      this.detectPatterns(progress);

    return {
      progress,
      patterns,
      summary: this.generateSummary(progress)
    };
  }

  /**
   * ==========================================
   * PROGRESS INITIALIZATION
   * ==========================================
   */
  getOrCreateProgress(userId) {

    if (!this.userProgress.has(userId)) {

      this.userProgress.set(userId, {
        userId,
        totalMastery: 0,
        previousMastery: 0,
        sessions: 0,
        improvements: 0,
        regressions: 0,
        stagnationCount: 0,
        history: []
      });
    }

    return this.userProgress.get(userId);
  }

  /**
   * ==========================================
   * CORE METRICS UPDATE
   * ==========================================
   */
  updateCore(progress, learningState, context) {

    progress.sessions += 1;

    const currentMastery =
      learningState.mastery || 0;

    progress.previousMastery =
      progress.totalMastery;

    progress.totalMastery =
      currentMastery;

    // --------------------------------------
    // IMPROVEMENT DETECTION
    // --------------------------------------
    if (currentMastery > progress.previousMastery) {
      progress.improvements += 1;
    }

    // --------------------------------------
    // REGRESSION DETECTION
    // --------------------------------------
    if (currentMastery < progress.previousMastery) {
      progress.regressions += 1;
    }

    // --------------------------------------
    // STAGNATION DETECTION
    // --------------------------------------
    if (Math.abs(currentMastery - progress.previousMastery) < 0.02) {
      progress.stagnationCount += 1;
    }

    // --------------------------------------
    // HISTORY UPDATE
    // --------------------------------------
    progress.history.push({
      mastery: currentMastery,
      engagement: context.engagement,
      confusion: context.confusion,
      timestamp: Date.now()
    });

    if (progress.history.length > 300) {
      progress.history.shift();
    }
  }

  /**
   * ==========================================
   * TRAJECTORY ANALYSIS ENGINE
   * ==========================================
   */
  updateTrajectory(progress) {

    const history = progress.history;

    if (history.length < 5) return;

    const recent = history.slice(-5);

    const trend =
      this.calculateTrend(recent);

    progress.trend = trend;

    if (trend === "improving") {
      progress.velocity = "positive";
    }

    if (trend === "declining") {
      progress.velocity = "negative";
    }

    if (trend === "stable") {
      progress.velocity = "neutral";
    }
  }

  /**
   * ==========================================
   * TREND CALCULATION
   * ==========================================
   */
  calculateTrend(data) {

    const first = data[0].mastery;
    const last = data[data.length - 1].mastery;

    if (last > first + 0.05) return "improving";
    if (last < first - 0.05) return "declining";

    return "stable";
  }

  /**
   * ==========================================
   * PATTERN DETECTION ENGINE
   * ==========================================
   */
  detectPatterns(progress) {

    return {
      isStuck: progress.stagnationCount > 5,
      isImproving: progress.improvements > progress.regressions,
      isDeclining: progress.regressions > progress.improvements,
      isStable: progress.stagnationCount < 3
    };
  }

  /**
   * ==========================================
   * PROGRESS SUMMARY GENERATOR
   * ==========================================
   */
  generateSummary(progress) {

    const totalChanges =
      progress.improvements + progress.regressions;

    return {
      mastery: progress.totalMastery,
      sessions: progress.sessions,
      trend: progress.trend,
      velocity: progress.velocity,
      stability:
        progress.stagnationCount < 3 ? "stable" : "unstable",
      improvementRatio:
        totalChanges === 0 ? 0 :
        progress.improvements / totalChanges
    };
  }

  /**
   * ==========================================
   * GLOBAL INSIGHT (ALL USERS)
   * ==========================================
   */
  systemProgressOverview() {

    let totalUsers = this.userProgress.size;

    let avgMastery = 0;
    let totalSessions = 0;

    for (let p of this.userProgress.values()) {

      avgMastery += p.totalMastery;
      totalSessions += p.sessions;
    }

    return {
      users: totalUsers,
      averageMastery: avgMastery / totalUsers,
      averageSessions: totalSessions / totalUsers
    };
  }
}

module.exports = MentorProgressTracker;
