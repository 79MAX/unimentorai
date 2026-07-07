const LearningEngine = require("../ai.adaptive.learning.service");
const AIMetricsService = require("../ai.metrics.service");
const PromptEngine = require("../ai.prompt.engine");

/**
 * AI MENTOR AGENT - UniMentorAI
 * Behavioral + motivational + strategic guidance agent
 * Role: Coach mindset, guide progression, unlock potential
 */

class AIMentorAgent {

  constructor() {
    this.learningEngine = LearningEngine;
    this.metrics = AIMetricsService;
    this.promptEngine = new PromptEngine();
  }

  /**
   * 🧠 MAIN MENTOR ENTRY
   */
  async run({ userId, goal, context = {} }) {

    const startTime = Date.now();

    try {

      // ========================
      // 1. USER PROFILE LOADING
      // ========================
      const profile = await this.learningEngine.getUserProfile(userId);

      // ========================
      // 2. ANALYZE USER STATE
      // ========================
      const state = this.analyzeUserState(profile);

      // ========================
      // 3. BUILD MENTORING PROMPT
      // ========================
      const promptPackage = await this.promptEngine.build({
        input: goal,
        type: "recommendation",
        userProfile: profile,
        context: {
          mode: "mentor_agent",
          emotionalState: state.emotion,
          motivationLevel: state.motivation,
          ...context,
        },
      });

      // ========================
      // 4. GENERATE MENTOR RESPONSE
      // ========================
      const advice = await this.generateMentorship(
        promptPackage.optimizedPrompt,
        state
      );

      // ========================
      // 5. BUILD ACTION PLAN
      // ========================
      const actionPlan = this.generateActionPlan(profile, goal);

      // ========================
      // 6. UPDATE LEARNING MEMORY
      // ========================
      await this.learningEngine.update(userId, {
        input: goal,
        response: advice,
        type: "mentor",
      });

      // ========================
      // 7. METRICS LOGGING
      // ========================
      await this.metrics.logInteraction({
        userId,
        prompt: goal,
        response: advice,
        type: "mentor",
        latencyMs: Date.now() - startTime,
        success: true,
      });

      // ========================
      // 8. FINAL RESPONSE
      // ========================
      return {
        success: true,
        data: {
          advice,
          actionPlan,
          state,
        },
      };

    } catch (error) {

      await this.metrics.logInteraction({
        userId,
        prompt: goal,
        response: null,
        type: "mentor",
        success: false,
        errorMessage: error.message,
        latencyMs: Date.now() - startTime,
      });

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 🧠 USER STATE ANALYSIS (VERY IMPORTANT)
   */
  analyzeUserState(profile) {

    const history = profile.history || [];
    const streak = profile.streak || 0;

    let motivation = "medium";
    let emotion = "neutral";

    // motivation logic
    if (streak >= 5) motivation = "high";
    if (history.length < 3) motivation = "low";

    // emotional inference (simple heuristic)
    if (history.length === 0) emotion = "confused";
    if (history.length > 20) emotion = "focused";

    return {
      motivation,
      emotion,
    };
  }

  /**
   * 🤝 MENTOR RESPONSE GENERATION
   */
  async generateMentorship(prompt, state) {

    return `
🧠 MENTOR INSIGHT

Based on your current state:
- Motivation: ${state.motivation}
- Emotional state: ${state.emotion}

Advice:
${prompt}

💡 Remember: consistency beats intensity.
`;
  }

  /**
   * 🎯 ACTION PLAN GENERATION
   */
  generateActionPlan(profile, goal) {

    const plan = [];

    // step 1
    plan.push({
      step: 1,
      action: "Define clear micro-goal",
      type: "planning",
    });

    // step 2
    plan.push({
      step: 2,
      action: "Practice daily for 20 minutes",
      type: "execution",
    });

    // step 3
    if (profile.level === "beginner") {
      plan.push({
        step: 3,
        action: "Take beginner assessment",
        type: "evaluation",
      });
    }

    if (profile.level === "intermediate") {
      plan.push({
        step: 3,
        action: "Build small project",
        type: "execution",
      });
    }

    if (profile.level === "advanced") {
      plan.push({
        step: 3,
        action: "Teach someone else",
        type: "mastery",
      });
    }

    return plan;
  }

  /**
   * ⚡ QUICK MOTIVATION MODE
   */
  async quickMotivation(userId, goal) {

    return this.run({
      userId,
      goal,
      context: { mode: "quick" },
    });
  }

  /**
   * 🔥 DEEP COACHING MODE
   */
  async deepCoaching(userId, goal) {

    return this.run({
      userId,
      goal,
      context: { mode: "deep" },
    });
  }
}

module.exports = new AIMentorAgent();
