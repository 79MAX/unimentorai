class PromptEngine {

  /**
   * 🧠 MAIN BUILDER
   * Converts raw input → optimized AI prompt
   */
  async build({ input, type, userProfile = {}, context = {} }) {

    const systemContext = this.buildSystemContext(userProfile);
    const taskContext = this.buildTaskContext(type, input);
    const memoryContext = this.buildMemoryContext(userProfile);
    const extraContext = this.buildExtraContext(context);

    const optimizedPrompt = `
${systemContext}

${taskContext}

${memoryContext}

${extraContext}

USER INPUT:
${input}

RESPONSE FORMAT:
Be clear, structured, and educational.
`;

    return {
      input,
      optimizedPrompt,
      metadata: {
        type,
        timestamp: Date.now(),
      },
    };
  }

  // ========================
  // 🧠 SYSTEM CONTEXT
  // ========================
  buildSystemContext(userProfile) {
    return `
You are UniMentorAI, an advanced AI learning assistant.

Your goal:
- Teach clearly
- Adapt to user level
- Be concise but structured
- Focus on learning outcomes

User level: ${userProfile.level || "beginner"}
Language preference: ${userProfile.language || "fr"}
`;
  }

  // ========================
  // 🎯 TASK CONTEXT
  // ========================
  buildTaskContext(type, input) {
    switch (type) {

      case "course_generation":
        return `
TASK: Generate a structured course lesson.
Topic: ${input}
Include:
- Introduction
- Key concepts
- Examples
- Summary
`;

      case "quiz_generation":
        return `
TASK: Create a quiz.
Topic: ${input}
Format:
- 5 MCQ questions
- 4 options each
- 1 correct answer
`;

      case "assessment":
        return `
TASK: Evaluate user's knowledge.
Topic: ${input}
Provide:
- Score estimation
- Strengths
- Weaknesses
`;

      case "recommendation":
        return `
TASK: Suggest next learning step.
Based on topic: ${input}
Focus on progression path.
`;

      default:
        return `
TASK: Answer clearly and simply.
Topic: ${input}
`;
    }
  }

  // ========================
  // 🧠 MEMORY CONTEXT
  // ========================
  buildMemoryContext(userProfile) {

    const history = userProfile.history || [];

    if (history.length === 0) {
      return "No previous learning history available.";
    }

    const lastInteractions = history.slice(-5);

    return `
USER LEARNING HISTORY:
${lastInteractions.map((h, i) =>
      `${i + 1}. ${h.type} - ${h.input}`
    ).join("\n")}
`;
  }

  // ========================
  // ⚡ EXTRA CONTEXT (RAG / SYSTEM / MARKET)
  // ========================
  buildExtraContext(context) {

    if (!context || Object.keys(context).length === 0) {
      return "";
    }

    return `
ADDITIONAL CONTEXT:
${JSON.stringify(context, null, 2)}
`;
  }
}

module.exports = PromptEngine;
