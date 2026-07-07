/**
 * VIDEO TUTOR VOICE BRIDGE - UniMentorAI
 * Bridges AI tutor system with voice input/output (TTS/STT)
 */

class VideoTutorVoiceBridge {
  constructor({ tutorBrain, audioProcessor, attentionTracker, analytics, logger }) {
    this.tutorBrain = tutorBrain;
    this.audioProcessor = audioProcessor;
    this.attentionTracker = attentionTracker;
    this.analytics = analytics;
    this.logger = logger;
  }

  /**
   * 🎯 Main entry: handle voice interaction cycle
   */
  async handleVoice({ userId, courseId, videoId, voiceEvent }) {
    try {
      const audioSignal = await this.audioProcessor.process({
        userId,
        courseId,
        videoId,
        audioEvent: voiceEvent
      });

      const intent = this._interpretVoiceIntent(voiceEvent);

      const response = await this._generateVoiceResponse({
        userId,
        courseId,
        videoId,
        intent,
        audioSignal
      });

      await this._trackVoiceInteraction(userId, courseId, intent, response);

      return response;

    } catch (error) {
      this.logger.error("VoiceBridge error", error);
      return this._fallback();
    }
  }

  /**
   * 🧠 Interpret user voice intent
   */
  _interpretVoiceIntent(voiceEvent) {
    const text = voiceEvent.transcript?.toLowerCase() || "";

    if (text.includes("répète") || text.includes("repeat")) {
      return { type: "repeat_explanation", urgency: "medium" };
    }

    if (text.includes("je ne comprends pas") || text.includes("i don't understand")) {
      return { type: "confusion_help", urgency: "high" };
    }

    if (text.includes("plus simple") || text.includes("simplify")) {
      return { type: "simplify_explanation", urgency: "high" };
    }

    if (text.includes("exemple")) {
      return { type: "request_example", urgency: "medium" };
    }

    return { type: "general_query", urgency: "low" };
  }

  /**
   * 🎯 Generate voice response via tutor brain
   */
  async _generateVoiceResponse({ userId, courseId, videoId, intent, audioSignal }) {
    const brainResponse = await this.tutorBrain.decideNextStep({
      userId,
      courseId,
      currentState: {
        type: "voice_interaction",
        intent,
        audioSignal
      }
    });

    return {
      speech: this._formatSpeech(brainResponse, intent),
      action: brainResponse.nextStep || "continue",
      emotion: this._selectVoiceTone(audioSignal),
      timestamp: Date.now()
    };
  }

  /**
   * 🗣 Format speech output (TTS ready)
   */
  _formatSpeech(brainResponse, intent) {
    switch (intent.type) {
      case "confusion_help":
        return `Pas de souci. Je vais simplifier cela pour toi : ${brainResponse.explanation}`;

      case "repeat_explanation":
        return `Très bien, je vais répéter plus simplement : ${brainResponse.explanation}`;

      case "request_example":
        return `Voici un exemple concret : ${brainResponse.example || "je vais t'en donner un immédiatement."}`;

      default:
        return brainResponse.explanation || "Continuons ensemble.";
    }
  }

  /**
   * 🎙 Select voice tone (emotion-aware TTS layer)
   */
  _selectVoiceTone(audioSignal) {
    if (audioSignal?.signal?.type === "high_cognitive_load") {
      return "calm_supportive";
    }

    if (audioSignal?.signal?.type === "fast_learner") {
      return "energetic_confident";
    }

    return "neutral_guiding";
  }

  /**
   * 📊 Track voice interactions
   */
  async _trackVoiceInteraction(userId, courseId, intent, response) {
    await this.analytics.track("voice_interaction", {
      userId,
      courseId,
      intent: intent.type,
      urgency: intent.urgency,
      timestamp: Date.now()
    });
  }

  /**
   * 🔄 Safe fallback
   */
  _fallback() {
    return {
      speech: "Je n'ai pas bien compris, peux-tu répéter ?",
      action: "continue",
      emotion: "neutral_guiding",
      timestamp: Date.now()
    };
  }
}

module.exports = VideoTutorVoiceBridge;
