export class ReasoningEngine {

  /* =========================
     🧠 CONTEXT ANALYSIS
  ========================= */
  static analyze({
    user,
    memory,
    course,
    message = ""
  }) {

    const userLevel =
      memory?.learning?.level || "BEGINNER";

    const weakAreas =
      memory?.cognitive?.weakAreas || [];

    const strongAreas =
      memory?.cognitive?.strongAreas || [];

    const courseLevel =
      course?.level || "BEGINNER";

    const messageLength =
      message?.length || 0;

    return {
      userLevel,
      courseLevel,

      weakAreas,
      strongAreas,

      signals: {
        isBeginner:
          userLevel === "BEGINNER",

        isAdvanced:
          userLevel === "ADVANCED",

        isMismatch:
          this.detectLevelMismatch(
            userLevel,
            courseLevel
          ),

        isConfused:
          messageLength < 20,

        weakIntensity:
          weakAreas.length
      }
    };
  }

  /* =========================
     🎯 CORE DECISION ENGINE
  ========================= */
  static decide(context = {}) {

    const weak = context?.weakAreas?.length || 0;
    const strong = context?.strongAreas?.length || 0;

    const isBeginner =
      context?.signals?.isBeginner;

    const isMismatch =
      context?.signals?.isMismatch;

    /* =========================
       🧠 HIGH PRIORITY CASES
    ========================= */

    if (weak >= 5 || isBeginner) {
      return {
        mode: "REMEDIAL_MODE",
        intensity: "HIGH",
        teachingStyle: "GUIDED_STEP_BY_STEP"
      };
    }

    if (strong >= 5 && !isBeginner) {
      return {
        mode: "REVERSE_MENTORING_MODE",
        intensity: "HIGH",
        teachingStyle: "CHALLENGE_BASED"
      };
    }

    if (isMismatch) {
      return {
        mode: "ADAPTIVE_BRIDGE_MODE",
        intensity: "MEDIUM",
        teachingStyle: "SCAFFOLDING"
      };
    }

    /* =========================
       🧠 DEFAULT MODE
    ========================= */

    return {
      mode: "STANDARD_LEARNING_MODE",
      intensity: "MEDIUM",
      teachingStyle: "BALANCED_EXPLANATION"
    };
  }

  /* =========================
     ⚖️ LEVEL COMPATIBILITY CHECK
  ========================= */
  static detectLevelMismatch(userLevel, courseLevel) {

    const levels = {
      BEGINNER: 1,
      INTERMEDIATE: 2,
      ADVANCED: 3
    };

    return Math.abs(
      (levels[userLevel] || 1) -
      (levels[courseLevel] || 1)
    ) >= 2;
  }

  /* =========================
     🧠 FULL REASONING PIPELINE
  ========================= */
  static process(payload = {}) {

    const context =
      this.analyze(payload);

    const decision =
      this.decide(context);

    return {
      context,
      decision,
      timestamp: new Date().toISOString()
    };
  }
}
