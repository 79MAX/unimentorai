
/**
 * ==========================================
 * 🧠 MENTOR ADAPTIVE PATH ENGINE
 * UniMentorAI Dynamic Learning Path System
 * ==========================================
 * Responsible for:
 * - personalized learning paths
 * - dynamic re-routing based on mastery
 * - prerequisite enforcement
 * - real-time adaptation
 * - optimal learning sequencing
 */

class MentorAdaptivePath {

  constructor(skillGraph) {
    this.skillGraph = skillGraph;
  }

  /**
   * ==========================================
   * MAIN PATH GENERATION
   * ==========================================
   */
  generate(userId, context, memory) {

    const basePath =
      this.skillGraph.generateLearningPath(userId);

    const adaptedPath =
      this.adaptPath(basePath, context, memory);

    return {
      path: adaptedPath.sequence,
      mode: adaptedPath.mode,
      next: adaptedPath.next,
      reason: adaptedPath.reason
    };
  }

  /**
   * ==========================================
   * ADAPT PATH BASED ON USER STATE
   * ==========================================
   */
  adaptPath(basePath, context, memory) {

    let sequence = [...basePath.path];

    let mode = "STANDARD";
    let reason = [];

    // --------------------------------------
    // HIGH CONFUSION → SIMPLIFY PATH
    // --------------------------------------
    if (context.confusion > 0.7) {

      mode = "SIMPLIFIED";

      sequence = sequence.slice(0, 2);

      reason.push("User confusion high → path shortened");
    }

    // --------------------------------------
    // HIGH ENGAGEMENT → SPEED UP
    // --------------------------------------
    if (context.engagement > 0.75) {

      mode = "ACCELERATED";

      sequence = [
        ...sequence,
        ...this.skillGraph.getNextSkills(memory.userId || context.userId)
      ];

      reason.push("High engagement → accelerated path");
    }

    // --------------------------------------
    // LOW PERFORMANCE → BACK TO BASICS
    // --------------------------------------
    if (memory.progress < 30) {

      mode = "FOUNDATION";

      sequence = this.filterFoundationalSkills(sequence);

      reason.push("Low progress → foundation mode activated");
    }

    // --------------------------------------
    // REPEATED FAILURE DETECTED
    // --------------------------------------
    if (context.repetition > 0.6) {

      mode = "REINFORCEMENT";

      sequence = this.insertRevisionSteps(sequence);

      reason.push("Repetition detected → reinforcement inserted");
    }

    return {
      sequence,
      mode,
      reason,
      next: sequence[0] || null
    };
  }

  /**
   * ==========================================
   * FILTER FOUNDATION SKILLS
   * ==========================================
   */
  filterFoundationalSkills(sequence) {

    return sequence.filter(skill =>
      !skill.includes("advanced") &&
      !skill.includes("expert")
    ).slice(0, 3);
  }

  /**
   * ==========================================
   * INSERT REVISION STEPS
   * ==========================================
   */
  insertRevisionSteps(sequence) {

    const revised = [];

    sequence.forEach(skill => {

      revised.push(skill);

      // Insert reinforcement step
      revised.push(`${skill}_REVIEW`);
    });

    return revised;
  }

  /**
   * ==========================================
   * REAL-TIME PATH REBALANCING
   * ==========================================
   */
  rebalance(userId, currentState) {

    const path =
      this.skillGraph.generateLearningPath(userId);

    if (currentState.mastery > 0.8) {

      return {
        action: "SKIP_AHEAD",
        newPath: path.recommended
      };
    }

    if (currentState.mastery < 0.4) {

      return {
        action: "REPEAT_PREVIOUS",
        newPath: this.filterFoundationalSkills(path.path)
      };
    }

    return {
      action: "CONTINUE",
      newPath: path.path
    };
  }

  /**
   * ==========================================
   * PATH OPTIMIZATION SCORE
   * ==========================================
   */
  scorePath(path, userProfile) {

    let score = 0;

    if (userProfile.motivation > 0.7) score += 0.3;
    if (path.length < 5) score += 0.2;
    if (userProfile.frustration < 0.3) score += 0.5;

    return Math.min(score, 1);
  }
}

module.exports = MentorAdaptivePath;
