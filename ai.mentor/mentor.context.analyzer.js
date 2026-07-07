
/**
 * ==========================================
 * 🧠 MENTOR CONTEXT ANALYZER ENGINE
 * UniMentorAI Cognitive Context Layer
 * ==========================================
 * Extracts learning intelligence from raw inputs:
 * - engagement signals
 * - confusion detection
 * - intent classification
 * - learning state inference
 */

class MentorContextAnalyzer {

  /**
   * ==========================================
   * MAIN ANALYSIS PIPELINE
   * ==========================================
   */
  analyze(input, memory) {

    return {
      topic: this.detectTopic(input),

      engagement: this.detectEngagement(input),

      confusion: this.detectConfusion(input, memory),

      intent: this.detectIntent(input),

      difficulty: this.estimateDifficulty(input),

      emotionalSignal: this.detectEmotion(input),

      repetition: this.detectRepetition(input, memory),

      summary: "Context analyzed for AI mentor decision engine"
    };
  }

  /**
   * ==========================================
   * TOPIC DETECTION
   * ==========================================
   */
  detectTopic(input) {

    if (input.topic) return input.topic;

    const text = this.getText(input);

    if (text.includes("math")) return "mathematics";
    if (text.includes("code") || text.includes("js")) return "programming";
    if (text.includes("business")) return "business";

    return "general";
  }

  /**
   * ==========================================
   * ENGAGEMENT SIGNALS
   * ==========================================
   */
  detectEngagement(input) {

    let score = 0.5;

    const text = this.getText(input);

    if (text.length > 50) score += 0.1;
    if (input.chat?.length > 3) score += 0.2;
    if (input.video?.attention > 0.6) score += 0.3;
    if (input.audio?.responseTime < 2000) score += 0.1;

    return Math.min(score, 1);
  }

  /**
   * ==========================================
   * CONFUSION DETECTION
   * ==========================================
   */
  detectConfusion(input, memory) {

    let score = 0.2;

    const text = this.getText(input);

    if (text.includes("??") || text.includes("???")) score += 0.3;
    if (text.includes("je ne comprends pas")) score += 0.4;
    if (input.audio?.hesitation > 0.5) score += 0.2;

    const lastTopics =
      memory?.history?.slice(-3)
        .map(h => h.context?.topic);

    if (lastTopics?.filter(t => t === input.topic).length > 2) {
      score += 0.3;
    }

    return Math.min(score, 1);
  }

  /**
   * ==========================================
   * INTENT DETECTION
   * ==========================================
   */
  detectIntent(input) {

    const text = this.getText(input);

    if (text.includes("explique")) return "LEARN";
    if (text.includes("exercice")) return "PRACTICE";
    if (text.includes("corrige")) return "REVIEW";

    return "UNKNOWN";
  }

  /**
   * ==========================================
   * DIFFICULTY ESTIMATION
   * ==========================================
   */
  estimateDifficulty(input) {

    const text = this.getText(input);

    if (text.length < 20) return "easy";
    if (text.length < 80) return "medium";

    return "hard";
  }

  /**
   * ==========================================
   * EMOTIONAL SIGNAL DETECTION
   * ==========================================
   */
  detectEmotion(input) {

    const text = this.getText(input);

    if (text.includes("😞")) return "frustrated";
    if (text.includes("😃")) return "positive";
    if (text.includes("😡")) return "angry";

    if (input.audio?.stressLevel > 0.7) return "stressed";

    return "neutral";
  }

  /**
   * ==========================================
   * REPETITION DETECTION
   * ==========================================
   */
  detectRepetition(input, memory) {

    const history = memory?.history || [];

    const recentTopics =
      history.slice(-5)
        .map(h => h.context?.topic);

    const count =
      recentTopics.filter(t => t === input.topic).length;

    return count / 5;
  }

  /**
   * ==========================================
   * UTILITY: TEXT EXTRACTOR
   * ==========================================
   */
  getText(input) {

    return (
      input.text ||
      input.message ||
      input.chatMessage ||
      ""
    ).toLowerCase();
  }
}

module.exports = MentorContextAnalyzer;
