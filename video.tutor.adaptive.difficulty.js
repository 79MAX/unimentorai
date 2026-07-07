/**
 * video.tutor.adaptive.difficulty.js
 * UniMentorAI - Adaptive Difficulty Engine
 */

class VideoTutorAdaptiveDifficulty {
  constructor({
    eventBus,
    telemetry,
    logger
  }) {
    this.eventBus = eventBus;
    this.telemetry = telemetry;
    this.logger = logger;

    this.userDifficultyState = new Map();
  }

  /**
   * 🎯 MAIN ENTRY
   */
  calculate(userId, context = {}) {
    const state = this._getState(userId);

    const signals = this._extractSignals(context);

    const newDifficulty = this._computeDifficulty(state, signals);

    this._updateState(userId, newDifficulty, signals);

    this._emit(userId, newDifficulty);

    return newDifficulty;
  }

  /**
   * 📊 Extract learning signals
   */
  _extractSignals(context) {
    return {
      accuracy: context.performance?.accuracy || 0,
      responseTime: context.performance?.responseTime || 0,
      errorRate: context.performance?.errorRate || 0,
      engagement: context.engagement?.score || 50,
      frustration: context.behavior?.frustrationLevel || 0,
      mastery: context.mastery || 0
    };
  }

  /**
   * 🧠 Core difficulty engine
   */
  _computeDifficulty(state, s) {
    let difficulty = state.current || 0.5;

    // =========================
    // 🎯 Performance adjustment
    // =========================
    if (s.accuracy > 0.85) {
      difficulty += 0.1;
    }

    if (s.accuracy < 0.5) {
      difficulty -= 0.15;
    }

    // =========================
    // ⚡ Speed factor
    // =========================
    if (s.responseTime < 3000) {
      difficulty += 0.05;
    }

    if (s.responseTime > 10000) {
      difficulty -= 0.1;
    }

    // =========================
    // 😤 Frustration protection
    // =========================
    if (s.frustration > 0.7) {
      difficulty -= 0.2;
    }

    // =========================
    // 🔥 Engagement boost
    // =========================
    if (s.engagement > 80) {
      difficulty += 0.05;
    }

    // =========================
    // 🧠 Mastery scaling
    // =========================
    difficulty += (s.mastery - 0.5) * 0.2;

    // =========================
    // 🧯 Clamp values
    // =========================
    difficulty = Math.max(0.1, Math.min(1, difficulty));

    return this._mapToLevel(difficulty);
  }

  /**
   * 📚 Map numeric → human difficulty
   */
  _mapToLevel(value) {
    if (value < 0.3) return "easy";
    if (value < 0.7) return "medium";
    return "hard";
  }

  /**
   * 📦 State getter
   */
  _getState(userId) {
    if (!this.userDifficultyState.has(userId)) {
      this.userDifficultyState.set(userId, {
        current: 0.5,
        history: []
      });
    }

    return this.userDifficultyState.get(userId);
  }

  /**
   * 🔄 State update
   */
  _updateState(userId, difficulty, signals) {
    const state = this._getState(userId);

    state.current =
      difficulty === "easy"
        ? 0.3
        : difficulty === "medium"
        ? 0.6
        : 0.85;

    state.history.push({
      difficulty,
      signals,
      timestamp: Date.now()
    });

    if (state.history.length > 50) {
      state.history.shift();
    }
  }

  /**
   * 📡 Emit event
   */
  _emit(userId, difficulty) {
    this.eventBus.emit(
      "difficulty.updated",
      {
        userId,
        difficulty
      }
    );

    this.telemetry.collect({
      type: "adaptive.difficulty",
      userId,
      difficulty
    });

    this.logger.info(
      "difficulty_adjusted",
      {
        userId,
        difficulty
      }
    );
  }

  /**
   * 📊 Get difficulty snapshot
   */
  getState(userId) {
    return this._getState(userId);
  }
}

module.exports =
  VideoTutorAdaptiveDifficulty;
