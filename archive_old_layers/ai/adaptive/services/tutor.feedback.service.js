export class TutorFeedbackService {

  /* =========================
     📊 ANALYZE USER FEEDBACK (AI READY)
  ========================= */
  static analyze(feedback = {}) {

    /* =========================
       🔐 SAFE INPUT NORMALIZATION
    ========================= */
    const difficulty = feedback?.difficulty || "OK";
    const rating = typeof feedback?.rating === "number"
      ? feedback.rating
      : 0;

    const confusedTopics = Array.isArray(feedback?.confusedTopics)
      ? feedback.confusedTopics
      : [];

    /* =========================
       🧠 DERIVED AI SIGNALS
    ========================= */
    const satisfactionLevel = this.computeSatisfactionLevel(rating);
    const frustrationLevel = this.computeFrustrationLevel(difficulty, rating);

    const needsSupport =
      difficulty === "HARD" || rating <= 2 || confusedTopics.length > 0;

    /* =========================
       📊 NORMALIZED FEEDBACK OBJECT
    ========================= */
    return {
      raw: {
        difficulty,
        rating,
        confusedTopics
      },

      signals: {
        satisfactionLevel,
        frustrationLevel,
        needsSupport
      },

      insights: {
        isPositive: rating >= 4,
        isNegative: rating <= 2,
        isNeutral: rating === 3
      },

      confusionAreas: confusedTopics,

      meta: {
        processedAt: new Date().toISOString()
      }
    };
  }

  /* =========================
     📈 SATISFACTION MAPPING
  ========================= */
  static computeSatisfactionLevel(rating) {

    if (rating >= 4) return "HIGH";
    if (rating === 3) return "MEDIUM";
    if (rating > 0) return "LOW";

    return "UNKNOWN";
  }

  /* =========================
     ⚠️ FRUSTRATION DETECTION
  ========================= */
  static computeFrustrationLevel(difficulty, rating) {

    if (difficulty === "HARD" && rating <= 2) {
      return "HIGH";
    }

    if (difficulty === "HARD" || rating <= 2) {
      return "MEDIUM";
    }

    return "LOW";
  }
}
