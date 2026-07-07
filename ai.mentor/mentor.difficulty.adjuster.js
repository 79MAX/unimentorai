
/**
 * ==========================================
 * ⚖️ MENTOR DIFFICULTY ADJUSTER ENGINE
 * UniMentorAI Adaptive Difficulty System
 * ==========================================
 * Responsible for:
 * - real-time difficulty tuning
 * - frustration prevention
 * - learning optimization curve
 * - skill-based scaling
 */

class MentorDifficultyAdjuster {

  constructor() {

    this.levels = ["very_easy", "easy", "medium", "hard", "very_hard"];
  }

  /**
   * ==========================================
   * MAIN DIFFICULTY ADJUSTMENT ENGINE
   * ==========================================
   */
  adjust({ context, learningState, memory }) {

    let current =
      learningState.targetDifficulty || "medium";

    let index =
      this.levels.indexOf(current);

    const confusion = context.confusion || 0;
    const engagement = context.engagement || 0;

    // --------------------------------------
    // TOO HARD → DOWNGRADE DIFFICULTY
    // --------------------------------------
    if (confusion > 0.7) {

      index = Math.max(0, index - 1);

      return this.buildResult(
        this.levels[index],
        "User confusion high → decreasing difficulty"
      );
    }

    // --------------------------------------
    // TOO EASY → INCREASE DIFFICULTY
    // --------------------------------------
    if (engagement > 0.8 && confusion < 0.3) {

      index = Math.min(this.levels.length - 1, index + 1);

      return this.buildResult(
        this.levels[index],
        "High engagement → increasing difficulty"
      );
    }

    // --------------------------------------
    // LOW MOTIVATION → SOFT RESET
    // --------------------------------------
    if (memory.emotionalProfile?.motivationLevel < 0.4) {

      return this.buildResult(
        "easy",
        "Low motivation → simplifying content"
      );
    }

    // --------------------------------------
    // HIGH PERFORMANCE → CHALLENGE MODE
    // --------------------------------------
    if (learningState.mastery > 0.8) {

      return this.buildResult(
        "hard",
        "High mastery → challenge mode activated"
      );
    }

    // --------------------------------------
    // DEFAULT STABLE STATE
    // --------------------------------------
    return this.buildResult(
      current,
      "Stable difficulty maintained"
    );
  }

  /**
   * ==========================================
   * BUILD RESULT OBJECT
   * ==========================================
   */
  buildResult(level, reason) {

    return {
      difficulty: level,
      reason,
      timestamp: Date.now()
    };
  }

  /**
   * ==========================================
   * DIFFICULTY SMOOTHING (ANTI-FLUCTUATION)
   * ==========================================
   */
  smooth(previous, current) {

    const prevIndex = this.levels.indexOf(previous);
    const currIndex = this.levels.indexOf(current);

    // prevent sudden jumps
    if (Math.abs(prevIndex - currIndex) > 1) {

      return this.levels[
        prevIndex + (currIndex > prevIndex ? 1 : -1)
      ];
    }

    return current;
  }

  /**
   * ==========================================
   * OPTIMAL LEARNING ZONE DETECTOR
   * ==========================================
   */
  isInFlowState(context) {

    return (
      context.confusion < 0.5 &&
      context.engagement > 0.6
    );
  }
}

module.exports =
  MentorDifficultyAdjuster;
