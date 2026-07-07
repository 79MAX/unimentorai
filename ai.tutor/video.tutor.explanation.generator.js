/**
 * VIDEO TUTOR EXPLANATION GENERATOR - UniMentorAI
 * Generates adaptive, structured and pedagogical explanations
 */

class VideoTutorExplanationGenerator {
  constructor({ knowledgeBase, contextAnalyzer, logger }) {
    this.knowledgeBase = knowledgeBase;
    this.contextAnalyzer = contextAnalyzer;
    this.logger = logger;
  }

  /**
   * 🎯 Main entry: generate explanation
   */
  async generate({ userId, courseId, skillId, query }) {
    try {
      const context = await this.contextAnalyzer.analyze({
        userId,
        courseId,
        sessionData: { query }
      });

      const knowledge = await this.knowledgeBase.getRelevantKnowledge({
        courseId,
        skillId,
        query
      });

      const explanation = this._buildExplanation({
        context,
        knowledge,
        query
      });

      return {
        explanation,
        level: context.insights?.difficultyTolerance || "medium",
        examples: this._extractExamples(knowledge),
        summary: this._generateSummary(explanation),
        timestamp: Date.now()
      };

    } catch (error) {
      this.logger.error("ExplanationGenerator error", error);
      return this._fallback();
    }
  }

  /**
   * 🧠 Build adaptive explanation
   */
  _buildExplanation({ context, knowledge, query }) {
    const level = context.insights?.difficultyTolerance || "medium";

    const baseConcepts = knowledge?.knowledge?.concepts || [];
    const explanations = knowledge?.knowledge?.explanations || [];

    if (level === "beginner") {
      return this._buildBeginnerExplanation(baseConcepts, explanations, query);
    }

    if (level === "advanced") {
      return this._buildAdvancedExplanation(baseConcepts, explanations, query);
    }

    return this._buildIntermediateExplanation(baseConcepts, explanations, query);
  }

  /**
   * 🟢 Beginner explanation (simple, step-by-step)
   */
  _buildBeginnerExplanation(concepts, explanations, query) {
    return `
🧠 SIMPLE EXPLANATION

👉 Concept:
${concepts[0]?.content || "Basic concept not available"}

👉 Explanation:
${explanations[0]?.content || "Simple breakdown not available"}

👉 Step-by-step:
1. Understand the idea
2. Observe the example
3. Practice slowly

👉 Key idea:
Focus on understanding, not memorization.
    `.trim();
  }

  /**
   * 🟡 Intermediate explanation
   */
  _buildIntermediateExplanation(concepts, explanations, query) {
    return `
🧠 INTERMEDIATE EXPLANATION

👉 Core concept:
${concepts[0]?.content || "Concept not available"}

👉 Detailed explanation:
${explanations[0]?.content || "Explanation not available"}

👉 Practical example:
${explanations[1]?.content || "Example not available"}

👉 Key insight:
Try to connect theory with real usage.
    `.trim();
  }

  /**
   * 🔴 Advanced explanation
   */
  _buildAdvancedExplanation(concepts, explanations, query) {
    return `
🧠 ADVANCED EXPLANATION

👉 Concept framework:
${concepts.map(c => c.content).join("\n")}

👉 Deep explanation:
${explanations.map(e => e.content).join("\n")}

👉 Edge cases:
Think about limitations and real-world constraints.

👉 Expert insight:
Focus on optimization and trade-offs.
    `.trim();
  }

  /**
   * 💡 Extract examples
   */
  _extractExamples(knowledge) {
    return knowledge?.knowledge?.examples || [];
  }

  /**
   * 🧾 Generate short summary
   */
  _generateSummary(explanation) {
    return explanation.split("\n")[0] || "No summary available";
  }

  /**
   * 🔄 Safe fallback
   */
  _fallback() {
    return {
      explanation: "System temporarily unavailable",
      level: "unknown",
      examples: [],
      summary: "Fallback mode activated",
      timestamp: Date.now()
    };
  }
}

module.exports = VideoTutorExplanationGenerator;
