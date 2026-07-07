export class MentorEngine {

  /* =========================
     🧠 SYSTEM PROMPT BUILDER
  ========================= */
  static buildSystemPrompt(user) {

    const level = user?.level || "BEGINNER";

    return `
You are UniMentorAI, an advanced AI mentoring system.

CORE ROLE:
- Act as a personal mentor and teacher
- Adapt explanations to user level: ${level}
- Focus on practical learning
- Guide step-by-step learning

MENTORING MODES:
- BEGINNER → simple explanations + examples
- INTERMEDIATE → structured learning + exercises
- ADVANCED → reverse mentoring (user teaches back + challenges)

RULES:
- Be concise but deep
- Always explain with examples
- Always encourage practice
- Never be robotic
`;
  }

  /* =========================
     📦 CONTEXT BUILDER
  ========================= */
  static buildInput({ user, message, context }) {

    return {
      user: {
        id: user.id,
        level: user.level || "BEGINNER",
        goals: user.goals || [],
        weakAreas: user.weakAreas || [],
        strongAreas: user.strongAreas || []
      },

      message: message?.trim(),

      context: context || {},

      timestamp: new Date().toISOString()
    };
  }

  /* =========================
     🤖 MAIN GENERATION ENGINE
  ========================= */
  static async generateResponse({
    user,
    message,
    context,
    aiProvider
  }) {

    try {

      /* =========================
         🧠 BUILD PROMPT
      ========================= */
      const system = this.buildSystemPrompt(user);

      const input = this.buildInput({
        user,
        message,
        context
      });

      /* =========================
         🤖 AI CALL
      ========================= */
      const response = await aiProvider.generate({
        system,
        input
      });

      /* =========================
         📤 RESPONSE WRAPPER
      ========================= */
      return {
        success: true,
        reply: response,
        mode: "MENTOR_AI_V2",
        meta: {
          level: user.level || "BEGINNER",
          timestamp: input.timestamp
        }
      };

    } catch (error) {

      console.error("[MENTOR_ENGINE_ERROR]", error);

      /* =========================
         🔄 FALLBACK RESPONSE
      ========================= */
      return {
        success: false,
        reply: "I’m having trouble generating a response right now. Please try again.",
        mode: "MENTOR_AI_FALLBACK"
      };
    }
  }
}
