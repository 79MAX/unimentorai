export class TutorStrategyService {

  /* =========================
     🧠 BUILD TEACHING STRATEGY (AI CORE)
  ========================= */
  static build({
    userMemory = {},
    course = {},
    feedback = {}
  }) {

    /* =========================
       🔐 SAFE EXTRACTION
    ========================= */
    const level = userMemory?.learning?.level || "BEGINNER";

    const weakAreas = userMemory?.cognitive?.weakAreas || [];
    const strongAreas = userMemory?.cognitive?.strongAreas || [];

    const difficulty = course?.level || "BEGINNER";

    const frustration = feedback?.signals?.frustrationLevel || "LOW";
    const satisfaction = feedback?.signals?.satisfactionLevel || "MEDIUM";

    /* =========================
       📊 COMPUTED INTELLIGENCE SCORES
    ========================= */
    const cognitiveScore = this.computeCognitiveScore({
      weakAreas,
      strongAreas
    });

    const emotionalScore = this.computeEmotionalScore({
      frustration,
      satisfaction
    });

    const levelScore = this.computeLevelScore(level, difficulty);

    /* =========================
       🎯 BASE STRATEGY (SMART MODE)
    ========================= */
    const baseStrategy = this.selectBaseStrategy(levelScore);

    /* =========================
       🧠 COGNITIVE STRATEGY
    ========================= */
    const cognitiveStrategy = this.selectCognitiveStrategy(cognitiveScore);

    /* =========================
       📊 EMOTIONAL STRATEGY
    ========================= */
    const emotionalStrategy = this.selectEmotionalStrategy(emotionalScore);

    /* =========================
       ⚙️ FINAL STRATEGY FUSION ENGINE
    ========================= */
    return {
      mode: baseStrategy.mode,

      teachingStyle: {
        ...baseStrategy,
        ...cognitiveStrategy,
        ...emotionalStrategy
      },

      signals: {
        cognitiveScore,
        emotionalScore,
        levelScore
      },

      metadata: {
        level,
        difficulty,
        adaptedAt: new Date().toISOString()
      }
    };
  }

  /* =========================
     📊 LEVEL SCORING SYSTEM (0 → 100)
  ========================= */
  static computeLevelScore(level, difficulty) {

    const map = {
      BEGINNER: 1,
      INTERMEDIATE: 2,
      ADVANCED: 3
    };

    const user = map[level] || 1;
    const course = map[difficulty] || 1;

    const diff = course - user;

    return 50 + (diff * 20); // center at 50
  }

  /* =========================
     🧠 COGNITIVE SCORING ENGINE
  ========================= */
  static computeCognitiveScore({ weakAreas, strongAreas }) {

    const weak = weakAreas.length;
    const strong = strongAreas.length;

    return (strong * 10) - (weak * 8);
  }

  /* =========================
     📊 EMOTIONAL SCORING ENGINE
  ========================= */
  static computeEmotionalScore({ frustration, satisfaction }) {

    let score = 50;

    if (frustration === "HIGH") score -= 30;
    if (frustration === "MEDIUM") score -= 15;

    if (satisfaction === "HIGH") score += 25;
    if (satisfaction === "LOW") score -= 10;

    return Math.max(0, Math.min(100, score));
  }

  /* =========================
     🎯 BASE STRATEGY ENGINE (INTELLIGENT)
  ========================= */
  static selectBaseStrategy(levelScore) {

    if (levelScore < 40) {
      return {
        mode: "GUIDED_LEARNING",
        explanationDepth: "HIGH",
        pace: "SLOW",
        examples: true
      };
    }

    if (levelScore < 70) {
      return {
        mode: "ACTIVE_LEARNING",
        explanationDepth: "MEDIUM",
        pace: "NORMAL",
        examples: true
      };
    }

    return {
      mode: "REVERSE_MENTORING",
      explanationDepth: "LOW",
      pace: "FAST",
      examples: false
    };
  }

  /* =========================
     🧠 COGNITIVE ADAPTATION ENGINE
  ========================= */
  static selectCognitiveStrategy(score) {

    if (score < -10) {
      return {
        focus: "REMEDIATION",
        hintLevel: "HIGH",
        repetition: true
      };
    }

    if (score > 20) {
      return {
        focus: "EXTENSION",
        hintLevel: "LOW",
        challengeMode: true
      };
    }

    return {
      focus: "BALANCED",
      hintLevel: "MEDIUM"
    };
  }

  /* =========================
     📊 EMOTIONAL ADAPTATION ENGINE
  ========================= */
  static selectEmotionalStrategy(score) {

    if (score < 30) {
      return {
        tone: "SUPPORTIVE",
        encouragementLevel: "HIGH",
        simplify: true
      };
    }

    if (score > 70) {
      return {
        tone: "MOTIVATIONAL",
        encouragementLevel: "MEDIUM",
        unlockNextLevel: true
      };
    }

    return {
      tone: "NEUTRAL",
      encouragementLevel: "MEDIUM"
    };
  }
}
