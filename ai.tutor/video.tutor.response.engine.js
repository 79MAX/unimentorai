/**
 * VIDEO TUTOR RESPONSE ENGINE - UniMentorAI
 * Final aggregation layer for all tutor AI outputs
 */

class VideoTutorResponseEngine {
  constructor({ analytics, logger }) {
    this.analytics = analytics;
    this.logger = logger;
  }

  /**
   * 🎯 Main entry: build final unified response
   */
  async buildResponse({ userId, courseId, videoId, inputs }) {
    try {
      const merged = this._mergeInputs(inputs);

      const optimized = this._optimizeResponse(merged);

      const formatted = this._formatOutput(optimized);

      await this._trackResponse(userId, courseId, optimized);

      return formatted;

    } catch (error) {
      this.logger.error("ResponseEngine error", error);
      return this._fallback();
    }
  }

  /**
   * 🧠 Merge all AI subsystems outputs
   */
  _mergeInputs(inputs) {
    return {
      chat: inputs.chat || null,
      voice: inputs.voice || null,
      lesson: inputs.lesson || null,
      realtime: inputs.realtime || null,
      explanation: inputs.explanation || null,
      attention: inputs.attention || null,
      signals: inputs.signals || {}
    };
  }

  /**
   * ⚡ Optimize response coherence
   */
  _optimizeResponse(data) {
    const attention = data.attention?.attentionScore || 50;

    let tone = "neutral";

    if (attention < 30) tone = "simplified_supportive";
    if (attention > 75) tone = "advanced_confident";

    const baseText =
      data.chat?.reply ||
      data.voice?.speech ||
      data.explanation?.explanation ||
      data.lesson?.content?.explanation ||
      "Continuons ton apprentissage.";

    return {
      text: this._adaptTone(baseText, tone),
      tone,
      examples: this._collectExamples(data),
      nextAction: this._resolveNextAction(data),
      confidence: this._computeConfidence(data),
      attentionState: data.attention?.state || "unknown"
    };
  }

  /**
   * 🧠 Tone adaptation engine
   */
  _adaptTone(text, tone) {
    switch (tone) {
      case "simplified_supportive":
        return `👍 Pas d'inquiétude, on va simplifier : ${text}`;

      case "advanced_confident":
        return `🚀 Niveau avancé : ${text}`;

      default:
        return text;
    }
  }

  /**
   * 📦 Collect examples from all subsystems
   */
  _collectExamples(data) {
    return [
      ...(data.chat?.examples || []),
      ...(data.explanation?.examples || []),
      ...(data.lesson?.content?.example ? [data.lesson.content.example] : [])
    ];
  }

  /**
   * 🎯 Resolve next system action
   */
  _resolveNextAction(data) {
    if (data.realtime?.action) return data.realtime.action;
    if (data.lesson?.action?.nextStep) return data.lesson.action.nextStep;
    if (data.voice?.action) return data.voice.action;
    return "continue";
  }

  /**
   * 📊 Compute global confidence score
   */
  _computeConfidence(data) {
    const values = [
      data.voice?.confidence,
      data.lesson?.metadata?.confidence,
      data.explanation?.confidence
    ].filter(v => v != null);

    if (!values.length) return 0.5;

    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * 📤 Final output formatting (UI / Voice / Chat ready)
   */
  _formatOutput(data) {
    return {
      response: data.text,
      tone: data.tone,
      examples: data.examples,
      nextAction: data.nextAction,
      attentionState: data.attentionState,
      confidence: data.confidence,
      ui: {
        highlight: data.tone === "advanced_confident",
        simplify: data.tone === "simplified_supportive"
      },
      timestamp: Date.now()
    };
  }

  /**
   * 📊 Analytics tracking
   */
  async _trackResponse(userId, courseId, data) {
    await this.analytics.track("tutor_response", {
      userId,
      courseId,
      tone: data.tone,
      confidence: data.confidence,
      attentionState: data.attentionState,
      timestamp: Date.now()
    });
  }

  /**
   * 🔄 Fallback safe response
   */
  _fallback() {
    return {
      response: "Continuons ton apprentissage étape par étape.",
      tone: "neutral",
      examples: [],
      nextAction: "continue",
      attentionState: "unknown",
      confidence: 0.1,
      ui: {
        highlight: false,
        simplify: false
      },
      timestamp: Date.now()
    };
  }
}

module.exports = VideoTutorResponseEngine;
