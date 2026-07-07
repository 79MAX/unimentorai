// ======================================
// 🌍 AI TRANSLATION GOVERNANCE ENGINE
// UniMentorAI - PRODUCTION SAFE VERSION
// ======================================

export class TranslationGovernanceEngine {

  constructor({ db, ai, cache }) {

    this.db = db
    this.ai = ai
    this.cache = cache
  }

  // ======================================
  // 🔑 IDEMPOTENCY KEY (CRITICAL FIX)
  // ======================================

  buildKey(courseId, targetLang) {

    return `${courseId}:${targetLang}`
  }

  // ======================================
  // 🚀 MAIN ENTRY POINT (SAFE)
  // ======================================

  async translateCourse({
    courseId,
    sourceLang = "en",
    targetLang,
    requestedBy = "system"
  }) {

    const key = this.buildKey(courseId, targetLang)

    // ======================================
    // 🔒 CACHE CHECK FIRST (FAST PATH)
    // ======================================

    const cached = await this.cache?.get(key)

    if (cached?.status === "approved") {

      return {
        status: "CACHED",
        data: cached
      }
    }

    // ======================================
    // 🔐 LOCK TO PREVENT PARALLEL GENERATION
    // ======================================

    const lockKey = `lock:${key}`

    const alreadyLocked = await this.cache?.get(lockKey)

    if (alreadyLocked) {

      return {
        status: "IN_PROGRESS",
        message: "Translation already being generated"
      }
    }

    await this.cache?.set(lockKey, true, 30) // 30s lock

    try {

      // ======================================
      // 🔍 FETCH EXISTING TRANSLATION
      // ======================================

      let existing =
        await this.db.translation.findOne({
          courseId,
          targetLang
        })

      // ======================================
      // 🚫 HARD RULE: MAX 2 GENERATIONS
      // ======================================

      if (existing?.translationCount >= 2) {

        return {
          status: "BLOCKED",
          reason: "MAX_TRANSLATION_LIMIT_REACHED",
          data: existing
        }
      }

      // ======================================
      // 🔄 INCREMENT COUNT SAFELY
      // ======================================

      if (existing) {

        await this.db.translation.updateOne(
          { _id: existing._id },
          {
            $inc: { translationCount: 1 },
            updatedAt: new Date()
          }
        )
      }

      // ======================================
      // 🤖 AI TRANSLATION
      // ======================================

      const translatedContent =
        await this.generateTranslation({
          courseId,
          targetLang
        })

      // ======================================
      // 💾 UPSERT (FIXED RETURN BUG)
      // ======================================

      const record =
        await this.db.translation.findOneAndUpdate(
          { courseId, targetLang },

          {
            $set: {
              content: translatedContent,
              status: "pending_review",
              updatedAt: new Date()
            },
            $setOnInsert: {
              courseId,
              sourceLang,
              targetLang,
              translationCount: 1,
              createdAt: new Date()
            }
          },

          {
            upsert: true,
            new: true
          }
        )

      // ======================================
      // 🧠 AUDIT LOG (FIXED STRUCTURE)
      // ======================================

      await this.db.translationAudit.create({

        courseId,
        targetLang,
        action: "TRANSLATION_GENERATED",
        requestedBy,
        timestamp: new Date()
      })

      // ======================================
      // 💾 UPDATE CACHE
      // ======================================

      await this.cache?.set(key, record)

      return {
        status: "GENERATED",
        data: record
      }

    } finally {

      // ======================================
      // 🔓 RELEASE LOCK (CRITICAL FIX)
      // ======================================

      await this.cache?.delete(lockKey)
    }
  }

  // ======================================
  // 🤖 AI TRANSLATION LAYER (OPTIMIZED)
  // ======================================

  async generateTranslation({
    courseId,
    targetLang
  }) {

    const course =
      await this.db.course.findById(courseId)

    if (!course) {

      throw new Error("COURSE_NOT_FOUND")
    }

    const prompt = `
You are a professional educational translator.

Translate this course into: ${targetLang}

Rules:
- preserve meaning
- keep pedagogy simple
- do not add extra content
- maintain structure

COURSE:
${course.content}
    `.trim()

    return await this.ai.generate(prompt)
  }

  // ======================================
  // 👨‍🏫 HUMAN REVIEW (SIMPLIFIED)
  // ======================================

  async submitHumanReview({
    translationId,
    correctedContent,
    reviewerId
  }) {

    const translation =
      await this.db.translation.findById(translationId)

    if (!translation) {

      throw new Error("TRANSLATION_NOT_FOUND")
    }

    const updated =
      await this.db.translation.findOneAndUpdate(
        { _id: translationId },

        {
          $set: {
            content: correctedContent,
            status: "approved",
            locked: true,
            reviewedBy: reviewerId,
            reviewedAt: new Date()
          }
        },

        { new: true }
      )

    await this.db.translationAudit.create({

      courseId: translation.courseId,
      targetLang: translation.targetLang,
      action: "HUMAN_APPROVED",
      reviewerId,
      timestamp: new Date()
    })

    return updated
  }

  // ======================================
  // 🔒 LOCK CHECK
  // ======================================

  async isLocked(courseId, targetLang) {

    const record =
      await this.db.translation.findOne({
        courseId,
        targetLang,
        locked: true
      })

    return !!record
  }

  // ======================================
  // 📊 SAFE FETCH
  // ======================================

  async getTranslation(courseId, targetLang) {

    const record =
      await this.db.translation.findOne({
        courseId,
        targetLang
      })

    if (!record) return null

    return {
      content: record.content,
      status: record.status,
      locked: record.locked,
      translationCount: record.translationCount
    }
  }
}
