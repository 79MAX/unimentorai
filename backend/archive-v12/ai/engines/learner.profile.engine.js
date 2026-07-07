
// ======================================
// 🧠 LEARNER PROFILE ENGINE V3
// UniMentorAI - COGNITIVE IDENTITY SYSTEM
// ======================================

export class LearnerProfileEngine {

  constructor({ db, analytics }) {

    this.db = db

    this.analytics = analytics
  }

  // ======================================
  // 🧠 BUILD FULL COGNITIVE PROFILE
  // ======================================

  async buildProfile(userId) {

    const [

      sessionHistory,

      mistakes,

      mastery,

      behavior,

      analytics

    ] = await Promise.all([

      this.db.getSessionHistory(userId),

      this.db.getMistakes(userId),

      this.db.getMastery(userId),

      this.db.getBehavior(userId),

      this.db.getAnalytics(userId)

    ])

    return {

      userId,

      // =================================
      // 🧠 CORE COGNITIVE METRICS
      // =================================

      masteryLevel:
        this.computeMasteryLevel(mastery),

      learningSpeed:
        this.computeLearningSpeed(sessionHistory),

      retentionRate:
        this.computeRetention(sessionHistory),

      cognitiveLoadTolerance:
        this.computeCognitiveLoadTolerance(behavior),

      adaptability:
        this.computeAdaptability(sessionHistory),

      // =================================
      // 🧠 LEARNING STYLE DETECTION
      // =================================

      learningStyle:
        this.detectLearningStyle(behavior),

      // visual | auditory | practice | mixed

      // =================================
      // 🧠 PERFORMANCE PATTERNS
      // =================================

      weakTopics:
        this.extractWeakTopics(mistakes),

      strongTopics:
        this.extractStrongTopics(mastery),

      errorPatterns:
        this.detectErrorPatterns(mistakes),

      // =================================
      // 🧠 TEMPORAL EVOLUTION
      // =================================

      progressTrend:
        this.computeProgressTrend(sessionHistory),

      fatigueTrend:
        this.computeFatigueTrend(behavior),

      // =================================
      // 🧠 PREDICTION ENGINE
      // =================================

      dropoutRisk:
        this.predictDropoutRisk({

          behavior,

          mastery,

          sessionHistory

        }),

      successProbability:
        this.predictSuccessProbability({

          mastery,

          behavior

        }),

      // =================================
      // 🧠 FINAL PROFILE SCORE
      // =================================

      profileScore:
        this.computeProfileScore({

          mastery,

          behavior,

          sessionHistory

        })
    }
  }

  // ======================================
  // 🧠 MASTERY COMPUTATION
  // ======================================

  computeMasteryLevel(mastery) {

    if (!mastery) return 0

    return Math.min(100,

      mastery.averageScore * 0.6 +

      mastery.consistency * 0.4

    )
  }

  // ======================================
  // ⚡ LEARNING SPEED
  // ======================================

  computeLearningSpeed(sessionHistory) {

    if (!sessionHistory?.length) return 50

    const recent = sessionHistory.slice(-10)

    const avgTime =
      recent.reduce((sum, s) => sum + s.timeSpent, 0) /
      recent.length

    return Math.max(10, 100 - avgTime / 2)
  }

  // ======================================
  // 🧠 RETENTION RATE
  // ======================================

  computeRetention(sessionHistory) {

    const correct = sessionHistory.filter(s => s.correct).length

    return sessionHistory.length
      ? (correct / sessionHistory.length) * 100
      : 0
  }

  // ======================================
  // ⚡ COGNITIVE LOAD TOLERANCE
  // ======================================

  computeCognitiveLoadTolerance(behavior) {

    const fatigue = behavior?.fatigueScore || 0

    return Math.max(0, 100 - fatigue)
  }

  // ======================================
  // 🧠 ADAPTABILITY SCORE
  // ======================================

  computeAdaptability(sessionHistory) {

    const changes =
      sessionHistory.filter(s => s.adapted).length

    return Math.min(100, changes * 10)
  }

  // ======================================
  // 🧠 LEARNING STYLE DETECTION
  // ======================================

  detectLearningStyle(behavior) {

    if (behavior.visual > 70) return "visual"

    if (behavior.practice > 70) return "practice"

    if (behavior.audio > 70) return "auditory"

    return "mixed"
  }

  // ======================================
  // ❌ WEAK TOPICS
  // ======================================

  extractWeakTopics(mistakes) {

    const map = new Map()

    mistakes.forEach(m => {

      map.set(
        m.topic,
        (map.get(m.topic) || 0) + 1
      )
    })

    return [...map.entries()]
      .filter(([_, v]) => v > 2)
      .map(([topic]) => topic)
  }

  // ======================================
  // 🧠 STRONG TOPICS
  // ======================================

  extractStrongTopics(mastery) {

    return mastery?.topics
      ?.filter(t => t.score > 80)
      ?.map(t => t.name) || []
  }

  // ======================================
  // ⚠️ ERROR PATTERNS
  // ======================================

  detectErrorPatterns(mistakes) {

    const patterns = {}

    mistakes.forEach(m => {

      patterns[m.type] =
        (patterns[m.type] || 0) + 1
    })

    return patterns
  }

  // ======================================
  // 📈 PROGRESS TREND
  // ======================================

  computeProgressTrend(sessionHistory) {

    const points =
      sessionHistory.slice(-10)

    return points.map(p => p.score || 0)
  }

  // ======================================
  // ⚠️ FATIGUE TREND
  // ======================================

  computeFatigueTrend(behavior) {

    return behavior?.fatigueHistory || []
  }

  // ======================================
  // 🚨 DROPOUT RISK PREDICTION
  // ======================================

  predictDropoutRisk({ behavior, mastery, sessionHistory }) {

    let risk = 0

    if (behavior?.fatigueScore > 70) risk += 30

    if (mastery?.masteryLevel < 40) risk += 30

    if (sessionHistory?.length < 5) risk += 20

    if (behavior?.engagementScore < 40) risk += 20

    return Math.min(risk, 100)
  }

  // ======================================
  // 🏆 SUCCESS PROBABILITY
  // ======================================

  predictSuccessProbability({ mastery, behavior }) {

    return Math.max(
      0,
      (mastery?.masteryLevel || 50) +
      (behavior?.engagementScore || 50) * 0.5
    )
  }

  // ======================================
  // 🧠 PROFILE SCORE GLOBAL
  // ======================================

  computeProfileScore({ mastery, behavior, sessionHistory }) {

    const base =
      (mastery?.masteryLevel || 50) * 0.5

    const engagement =
      (behavior?.engagementScore || 50) * 0.3

    const activity =
      Math.min(100, (sessionHistory?.length || 0) * 2)

    return base + engagement + activity * 0.2
  }
}
