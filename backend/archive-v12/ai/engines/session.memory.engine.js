
// ======================================
// 🧠 SESSION MEMORY ENGINE V3
// UniMentorAI - COGNITIVE WORKING MEMORY
// ======================================

export class SessionMemoryEngine {

  constructor({ db, config }) {

    this.db = db

    this.config = config

    this.buffer = new Map()
  }

  // ======================================
  // 🧠 STORE LIVE EVENT
  // ======================================

  async recordEvent(userId, event) {

    if (!this.buffer.has(userId)) {

      this.buffer.set(userId, [])
    }

    const session = this.buffer.get(userId)

    session.push({

      ...event,

      timestamp: Date.now()
    })

    // limit memory size
    if (session.length > 100) {

      await this.compressSession(userId)
    }
  }

  // ======================================
  // 🧠 COMPRESS SESSION MEMORY
  // ======================================

  async compressSession(userId) {

    const session = this.buffer.get(userId)

    if (!session || session.length === 0) return

    const summary = this.generateSummary(session)

    await this.storeLongTermMemory(userId, summary)

    // clear buffer partially
    this.buffer.set(userId, session.slice(-20))
  }

  // ======================================
  // 🧠 GENERATE INTELLIGENT SUMMARY
  // ======================================

  generateSummary(session) {

    return {

      totalEvents: session.length,

      correctAnswers:
        session.filter(e => e.type === "ANSWER" && e.correct).length,

      mistakes:
        session.filter(e => e.type === "ANSWER" && !e.correct),

      topics:
        this.extractTopics(session),

      engagementScore:
        this.computeEngagement(session),

      fatigueSignals:
        this.detectFatigue(session),

      difficultyFeedback:
        this.computeDifficultyFeedback(session),

      timestamp: Date.now()
    }
  }

  // ======================================
  // 🧠 TOPIC EXTRACTION
  // ======================================

  extractTopics(session) {

    const map = new Map()

    session.forEach(e => {

      if (e.topic) {

        map.set(
          e.topic,
          (map.get(e.topic) || 0) + 1
        )
      }
    })

    return [...map.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([topic]) => topic)
  }

  // ======================================
  // ⚡ ENGAGEMENT SCORE
  // ======================================

  computeEngagement(session) {

    const interactions =
      session.filter(e =>
        e.type === "ANSWER" ||
        e.type === "QUESTION"
      )

    if (!interactions.length) return 50

    const active =
      interactions.length

    const correct =
      session.filter(e => e.correct).length

    return Math.min(
      100,
      (correct / active) * 100
    )
  }

  // ======================================
  // ⚠️ FATIGUE DETECTION
  // ======================================

  detectFatigue(session) {

    let fatigue = 0

    const recent = session.slice(-10)

    const wrongStreak =
      this.detectWrongStreak(recent)

    if (wrongStreak > 3) fatigue += 40

    if (recent.length > 20) fatigue += 20

    const slowResponses =
      recent.filter(e => e.timeSpent > 60).length

    if (slowResponses > 5) fatigue += 40

    return Math.min(fatigue, 100)
  }

  // ======================================
  // ❌ WRONG STREAK DETECTION
  // ======================================

  detectWrongStreak(session) {

    let streak = 0
    let max = 0

    session.forEach(e => {

      if (e.type === "ANSWER" && !e.correct) {

        streak++

        max = Math.max(max, streak)

      } else {

        streak = 0
      }
    })

    return max
  }

  // ======================================
  // ⚙️ DIFFICULTY FEEDBACK LOOP
  // ======================================

  computeDifficultyFeedback(session) {

    const wrong = session.filter(e => !e.correct).length

    const total = session.length || 1

    const ratio = wrong / total

    if (ratio > 0.6) return "too_hard"

    if (ratio < 0.2) return "too_easy"

    return "balanced"
  }

  // ======================================
  // 🧠 STORE LONG TERM MEMORY
  // ======================================

  async storeLongTermMemory(userId, summary) {

    await this.db.saveMemory(userId, summary)
  }

  // ======================================
  // 🧠 GET CONTEXT FOR AI ENGINE
  // ======================================

  async getContext(userId) {

    const shortTerm =
      this.buffer.get(userId) || []

    const longTerm =
      await this.db.getMemory(userId)

    return {

      shortTerm,

      longTerm,

      combinedContext:

        this.buildAIContext(shortTerm, longTerm)
    }
  }

  // ======================================
  // 🧠 BUILD AI CONTEXT (CRITICAL)
  // ======================================

  buildAIContext(shortTerm, longTerm) {

    return {

      recentTopics:
        this.extractTopics(shortTerm),

      weakSignals:
        longTerm?.map(m => m.difficultyFeedback),

      engagementTrend:
        longTerm?.map(m => m.engagementScore),

      fatigueHistory:
        longTerm?.map(m => m.fatigueSignals)
    }
  }

  // ======================================
  // 🧠 RESET SESSION
  // ======================================

  clearSession(userId) {

    this.buffer.delete(userId)
  }
}
