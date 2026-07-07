
/**
 * ==========================================
 * 🧭 MENTOR ADAPTIVE PATH ENGINE
 * UniMentorAI Dynamic Learning Navigation
 * ==========================================
 * Responsible for:
 * - dynamic learning path generation
 * - personalization based on mastery + emotion + context
 * - skill graph navigation optimization
 * - real-time path adaptation
 * - next-step decision sequencing
 */

class MentorAdaptivePath {

  constructor({ skillGraph, memory, progressTracker }) {

    this.skillGraph = skillGraph;
    this.memory = memory;
    this.progressTracker = progressTracker;
  }

  /**
   * ==========================================
   * MAIN PATH GENERATION ENGINE
   * ==========================================
   */
  generate(userId, context, profile) {

    const memory = this.memory.get(userId);
    const progress = this.progressTracker.get(userId);

    // --------------------------------------
    // 1. CURRENT POSITION DETECTION
    // --------------------------------------
    const currentNode =
      this.detectCurrentPosition(memory, profile);

    // --------------------------------------
    // 2. AVAILABLE OPTIONS
    // --------------------------------------
    const availableSkills =
      this.skillGraph.getAvailableSkills();

    // --------------------------------------
    // 3. NEXT BEST STEP
    // --------------------------------------
    const nextStep =
      this.selectNextStep(currentNode, availableSkills, profile, context);

    // --------------------------------------
    // 4. PATH GENERATION
    // --------------------------------------
    const path =
      this.buildPath(currentNode, nextStep, profile);

    // --------------------------------------
    // 5. ADAPTATION STRATEGY
    // --------------------------------------
    const adaptation =
      this.computeAdaptation(profile, context);

    return {
      currentNode,
      nextStep,
      path,
      adaptation
    };
  }

  /**
   * ==========================================
   * CURRENT POSITION DETECTION
   * ==========================================
   */
  detectCurrentPosition(memory, profile) {

    if (memory.learning?.currentTopic) {
      return memory.learning.currentTopic;
    }

    if (memory.learning?.weakAreas?.length > 0) {
      return memory.learning.weakAreas[0];
    }

    return "foundation_core";
  }

  /**
   * ==========================================
   * NEXT STEP SELECTION ENGINE
   * ==========================================
   */
  selectNextStep(currentNode, availableSkills, profile, context) {

    if (!availableSkills || availableSkills.length === 0) {
      return null;
    }

    // --------------------------------------
    // PRIORITY 1: WEAK AREAS FIRST
    // --------------------------------------
    const weakSkill = availableSkills.find(s =>
      profile.learning?.weakAreas?.includes(s.skillId)
    );

    if (weakSkill) return weakSkill;

    // --------------------------------------
    // PRIORITY 2: LOW MASTERY SKILLS
    // --------------------------------------
    const lowest = availableSkills.sort((a, b) =>
      a.mastery - b.mastery
    )[0];

    // --------------------------------------
    // PRIORITY 3: CONTEXT MATCH
    // --------------------------------------
    if (context?.topic) {
      const match = availableSkills.find(s =>
        s.skillId === context.topic
      );

      if (match) return match;
    }

    return lowest;
  }

  /**
   * ==========================================
   * PATH BUILDER ENGINE
   * ==========================================
   */
  buildPath(currentNode, nextStep, profile) {

    const path = [];

    // --------------------------------------
    // STEP 1: REVIEW IF NEEDED
    // --------------------------------------
    if (profile.cognition?.comprehension < 0.4) {
      path.push({
        type: "REVIEW",
        node: currentNode,
        intensity: "high"
      });
    }

    // --------------------------------------
    // STEP 2: NEXT SKILL INTRO
    // --------------------------------------
    if (nextStep) {
      path.push({
        type: "LEARN",
        node: nextStep.skillId,
        difficulty: this.mapDifficulty(profile)
      });
    }

    // --------------------------------------
    // STEP 3: PRACTICE LOOP
    // --------------------------------------
    path.push({
      type: "PRACTICE",
      node: nextStep?.skillId || currentNode,
      repetitions: this.computeRepetition(profile)
    });

    // --------------------------------------
    // STEP 4: VALIDATION CHECK
    // --------------------------------------
    path.push({
      type: "QUIZ",
      node: nextStep?.skillId || currentNode,
      adaptive: true
    });

    return path;
  }

  /**
   * ==========================================
   * ADAPTATION ENGINE
   * ==========================================
   */
  computeAdaptation(profile, context) {

    let adaptation = "balanced";

    if (profile.flags?.atRisk) {
      adaptation = "supportive";
    }

    if (context.confusion > 0.7) {
      adaptation = "simplified";
    }

    if (profile.identity?.globalMastery > 0.8) {
      adaptation = "advanced";
    }

    if (context.engagement > 0.7) {
      adaptation = "accelerated";
    }

    return adaptation;
  }

  /**
   * ==========================================
   * DIFFICULTY MAPPER
   * ==========================================
   */
  mapDifficulty(profile) {

    if (profile.identity.globalMastery < 0.3) return "easy";
    if (profile.identity.globalMastery < 0.7) return "medium";
    return "hard";
  }

  /**
   * ==========================================
   * REPETITION ENGINE
   * ==========================================
   */
  computeRepetition(profile) {

    if (profile.cognition?.retention < 0.4) {
      return 5;
    }

    if (profile.cognition?.retention < 0.7) {
      return 3;
    }

    return 1;
  }

  /**
   * ==========================================
   * PATH INSIGHTS
   * ==========================================
   */
  insights(userId, profile) {

    const progress = this.progressTracker.get(userId);

    return {
      currentLevel: profile.identity.level,
      adaptation: this.computeAdaptation(profile, {}),
      velocity: progress.velocity,
      dropoutRisk: profile.behavior.dropoutRisk
    };
  }
}

module.exports = MentorAdaptivePath;
