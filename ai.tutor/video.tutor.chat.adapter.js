/**
 * VIDEO TUTOR CHAT ADAPTER - UniMentorAI
 * Bridges chat interactions with AI tutor learning system
 */

class VideoTutorChatAdapter {
  constructor({ tutorBrain, explanationGenerator, contextAnalyzer, knowledgeBase, analytics, logger }) {
    this.tutorBrain = tutorBrain;
    this.explanationGenerator = explanationGenerator;
    this.contextAnalyzer = contextAnalyzer;
    this.knowledgeBase = knowledgeBase;
    this.analytics = analytics;
    this.logger = logger;
  }

  /**
   * 🎯 Main entry: handle chat message
   */
  async handleMessage({ userId, courseId, videoId, message }) {
    try {
      const context = await this.contextAnalyzer.analyze({
        userId,
        courseId,
        sessionData: { message }
      });

      const intent = this._detectIntent(message);

      const knowledge = await this.knowledgeBase.getRelevantKnowledge({
        courseId,
        skillId: context?.skills?.current || "general",
        query: message
      });

      const response = await this._generateResponse({
        userId,
        courseId,
        videoId,
        message,
        intent,
        context,
        knowledge
      });

      await this._trackChat(userId, courseId, intent);

      return response;

    } catch (error) {
      this.logger.error("ChatAdapter error", error);
      return this._fallback();
    }
  }

  /**
   * 🧠 Intent detection engine
   */
  _detectIntent(message) {
    const text = message.toLowerCase();

    if (text.includes("je ne comprends pas") || text.includes("confus")) {
      return { type: "confusion", urgency: "high" };
    }

    if (text.includes("exemple")) {
      return { type: "request_example", urgency: "medium" };
    }

    if (text.includes("simplifie") || text.includes("simple")) {
      return { type: "simplify", urgency: "high" };
    }

    if (text.includes("pourquoi")) {
      return { type: "why_question", urgency: "medium" };
    }

    return { type: "general_question", urgency: "low" };
  }

  /**
   * 🎯 Generate intelligent chat response
   */
  async _generateResponse({ userId, courseId, videoId, message, intent, context, knowledge }) {
    const explanation = await this.explanationGenerator.generate({
      userId,
      courseId,
      skillId: context?.skills?.current || "general",
      query: message
    });

    const adapted = this._adaptResponse({
      explanation,
      intent,
      knowledge,
      context
    });

    const decision = await this.tutorBrain.decideNextStep({
      userId,
      courseId,
      currentState: {
        type: "chat_interaction",
        intent,
        message
      }
    });

    return {
      reply: adapted.text,
      examples: adapted.examples,
      nextAction: decision.nextStep || "continue",
      confidence: decision.confidence || 0.5,
      timestamp: Date.now()
    };
  }

  /**
   * 🧠 Adapt response based on intent
   */
  _adaptResponse({ explanation, intent, knowledge, context }) {
    switch (intent.type) {
      case "confusion":
        return {
          text: `Pas de souci 👍 je vais simplifier ça : ${explanation.explanation}`,
          examples: knowledge?.knowledge?.examples || []
        };

      case "request_example":
        return {
          text: `Voici un exemple concret 👇`,
          examples: knowledge?.knowledge?.examples || []
        };

      case "simplify":
        return {
          text: `Version simple : ${explanation.explanation}`,
          examples: []
        };

      case "why_question":
        return {
          text: `Bonne question 👍 Voici pourquoi : ${explanation.explanation}`,
          examples: knowledge?.knowledge?.concepts || []
        };

      default:
        return {
          text: explanation.explanation,
          examples: []
        };
    }
  }

  /**
   * 📊 Track chat analytics
   */
  async _trackChat(userId, courseId, intent) {
    await this.analytics.track("chat_interaction", {
      userId,
      courseId,
      intent: intent.type,
      urgency: intent.urgency,
      timestamp: Date.now()
    });
  }

  /**
   * 🔄 Fallback safe response
   */
  _fallback() {
    return {
      reply: "Je n'ai pas bien compris ta question. Peux-tu reformuler ?",
      examples: [],
      nextAction: "continue",
      confidence: 0.1,
      timestamp: Date.now()
    };
  }
}

module.exports = VideoTutorChatAdapter;
