
/**
 * ==========================================
 * 🔁 MENTOR FEEDBACK LOOP ENGINE
 * UniMentorAI Continuous Improvement System
 * ==========================================
 * Responsible for:
 * - learning from user interactions
 * - improving future responses
 * - adjusting teaching strategies
 * - reinforcing successful behaviors
 * - reducing ineffective patterns
 */

class MentorFeedbackLoop {

  constructor({
    memory,
    learningEngine,
    brain,
    personalityEngine,
    skillGraph
  }) {

    this.memory = memory;
    this.learningEngine = learningEngine;
    this.brain = brain;
    this.personalityEngine = personalityEngine;
    this.skillGraph = skillGraph;
  }

  /**
   * ==========================================
   * MAIN FEEDBACK PROCESSOR
   * ==========================================
   */
  process(userId, interaction) {

    const memory = this.memory.get(userId);

    // --------------------------------------
    // 1. EXTRACT FEEDBACK SIGNALS
    // --------------------------------------
    const signals =
      this.extractSignals(interaction, memory);

    // --------------------------------------
    // 2. UPDATE LEARNING ENGINE
    // --------------------------------------
    this.learningEngine.update(userId, signals.context);

    // --------------------------------------
    // 3. UPDATE MEMORY INSIGHTS
    // --------------------------------------
    this.updateMemory(memory, signals);

    // --------------------------------------
    // 4. ADJUST BRAIN PARAMETERS
    // --------------------------------------
    this.adjustBrain(signals);

    // --------------------------------------
    // 5. ADAPT PERSONALITY
    // --------------------------------------
    this.adjustPersonality(memory, signals);

    // --------------------------------------
    // 6. UPDATE SKILL GRAPH WEIGHTS
    // --------------------------------------
    this.adjustSkillGraph(userId, signals);

    return {
      status: "FEEDBACK_PROCESSED",
      signals
    };
  }

  /**
   * ==========================================
   * SIGNAL EXTRACTION ENGINE
   * ==========================================
   */
  extractSignals(interaction, memory) {

    const context = interaction.context || {};

    return {
      context,

      success: context.confusion < 0.4,

      frustration: memory.emotionalProfile?.frustrationLevel > 0.6,

      engagement: context.engagement || 0.5,

      masteryGain: interaction.learningState?.mastery || 0,

      repetition: this.detectRepetition(memory, context)
    };
  }

  /**
   * ==========================================
   * MEMORY UPDATE BASED ON FEEDBACK
   * ==========================================
   */
  updateMemory(memory, signals) {

    // Reduce frustration if success
    if (signals.success) {
      memory.emotionalProfile.motivationLevel += 0.05;
      memory.emotionalProfile.frustrationLevel -= 0.05;
    }

    // Increase frustration if repeated failure
    if (signals.repetition > 0.7) {
      memory.emotionalProfile.frustrationLevel += 0.1;
    }

    // Clamp values
    memory.emotionalProfile.motivationLevel =
      this.clamp(memory.emotionalProfile.motivationLevel);

    memory.emotionalProfile.frustrationLevel =
      this.clamp(memory.emotionalProfile.frustrationLevel);
  }

  /**
   * ==========================================
   * BRAIN ADAPTATION SIGNALS
   * ==========================================
   */
  adjustBrain(signals) {

    if (signals.frustration) {
      this.brain.mode = "simplify";
    }

    if (signals.engagement > 0.8) {
      this.brain.mode = "challenge";
    }
  }

  /**
   * ==========================================
   * PERSONALITY ADAPTATION LOOP
   * ==========================================
   */
  adjustPersonality(memory, signals) {

    if (signals.success && signals.engagement > 0.6) {
      memory.personalityProfile.tone = "encouraging";
    }

    if (signals.frustration) {
      memory.personalityProfile.tone = "supportive";
    }
  }

  /**
   * ==========================================
   * SKILL GRAPH REINFORCEMENT
   * ==========================================
   */
  adjustSkillGraph(userId, signals) {

    if (signals.masteryGain > 0.7) {
      const next = this.skillGraph.getNextSkills(userId);
      // reinforce unlock probability
      next.forEach(skill => {
        // pseudo reinforcement signal
        skill.weight = (skill.weight || 1) + 0.1;
      });
    }
  }

  /**
   * ==========================================
   * REPETITION DETECTION
   * ==========================================
   */
  detectRepetition(memory, context) {

    const history = memory.history || [];

    const recent = history.slice(-5);

    const count =
      recent.filter(h =>
        h.context?.topic === context.topic
      ).length;

    return count / 5;
  }

  /**
   * ==========================================
   * UTILITY
   * ==========================================
   */
  clamp(value) {

    return Math.max(0, Math.min(1, value));
  }
}

module.exports = MentorFeedbackLoop;
