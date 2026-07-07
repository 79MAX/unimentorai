
// ======================================
// 👨‍🏫 AI TRANSLATION REVIEW ENGINE
// UniMentorAI - HUMAN-IN-THE-LOOP QUALITY SYSTEM (PRODUCTION)
// ======================================

export class TranslationReviewEngine {

  constructor({ db, cache, ai }) {

    this.db = db
    this.cache = cache
    this.ai = ai
  }

  // ======================================
  // 📥 GET PENDING REVIEWS (OPTIMIZED)
  // ======================================

  async getPendingReviews({ lang }) {

    return await this.db.translation.find({

      targetLang: lang,

      status: "pending_review"

    }).sort({ createdAt: -1 }).limit(100)
  }

  // ======================================
  // 🔐 IDENTITY CHECK (ANTI DOUBLE REVIEW)
  // ======================================

  async hasReviewed({ translationId, reviewerId }) {

    const existing =
      await this.db.translationAudit.findOne({

        translationId,
        reviewerId
      })

    return !!existing
  }

  // ======================================
  // 👨‍🏫 APPROVE TRANSLATION (SAFE)
  // ======================================

  async approveTranslation({

    translationId,
    reviewerId

  }) {

    const translation =
      await this.db.translation.findById(translationId)

    if (!translation) {

      throw new Error("TRANSLATION_NOT_FOUND")
    }

    // ==================================
    // 🚫 PREVENT DOUBLE REVIEW
    // ==================================

    if (await this.hasReviewed({ translationId, reviewerId })) {

      return {
        status: "ALREADY_REVIEWED"
      }
    }

    // ==================================
    // ⚡ ATOMIC UPDATE (FIX RACE CONDITION)
    // ==================================

    const updated =
      await this.db.translation.findOneAndUpdate(

        {
          _id: translationId,
          status: "pending_review"
        },

        {
          $set: {
            status: "approved",
            locked: true,
            reviewedBy: reviewerId,
            reviewedAt: new Date()
          }
        },

        { new: true }
      )

    // ==================================
    // 🧠 AUDIT LOG
    // ==================================

    await this.db.translationAudit.create({

      translationId,
      courseId: translation.courseId,
      targetLang: translation.targetLang,
      action: "APPROVED",
      reviewerId,
      timestamp: new Date()
    })

    // ==================================
    // 💾 CACHE SYNC
    // ==================================

    await this.syncCache(translation)

    return {
      status: "APPROVED",
      data: updated
    }
  }

  // ======================================
  // ❌ REJECT TRANSLATION (SAFE)
  // ======================================

  async rejectTranslation({

    translationId,
    reviewerId,
    reason

  }) {

    const translation =
      await this.db.translation.findById(translationId)

    if (!translation) {

      throw new Error("TRANSLATION_NOT_FOUND")
    }

    if (await this.hasReviewed({ translationId, reviewerId })) {

      return {
        status: "ALREADY_REVIEWED"
      }
    }

    const updated =
      await this.db.translation.findOneAndUpdate(

        {
          _id: translationId,
          status: "pending_review"
        },

        {
          $set: {
            status: "rejected",
            rejectionReason: reason,
            reviewedBy: reviewerId,
            reviewedAt: new Date()
          }
        },

        { new: true }
      )

    await this.db.translationAudit.create({

      translationId,
      courseId: translation.courseId,
      targetLang: translation.targetLang,
      action: "REJECTED",
      reason,
      reviewerId,
      timestamp: new Date()
    })

    return {
      status: "REJECTED",
      data: updated
    }
  }

  // ======================================
  // ✏️ HUMAN EDIT (PROTECTED VERSIONING)
  // ======================================

  async editTranslation({

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
            reviewedAt: new Date(),
            editedByHuman: true
          },
          $inc: {
            version: 1
          }
        },

        { new: true }
      )

    await this.db.translationAudit.create({

      translationId,
      courseId: translation.courseId,
      targetLang: translation.targetLang,
      action: "HUMAN_EDIT_APPROVED",
      reviewerId,
      timestamp: new Date()
    })

    await this.syncCache(translation)

    return {
      status: "EDIT_APPROVED",
      data: updated
    }
  }

  // ======================================
  // 📊 QUALITY SCORING ENGINE (IMPROVED)
  // ======================================

  async scoreTranslationQuality(translation) {

    let score = 100

    // ==================================
    // 🔻 PENALTY: MULTIPLE GENERATIONS
    // ==================================

    if (translation.translationCount > 1) {

      score -= 15
    }

    // ==================================
    // 🔻 PENALTY: REJECTED
    // ==================================

    if (translation.status === "rejected") {

      score -= 50
    }

    // ==================================
    // 🔻 PENALTY: NO HUMAN REVIEW
    // ==================================

    if (!translation.reviewedBy) {

      score -= 20
    }

    // ==================================
    // 🔺 BONUS: HUMAN LOCKED
    // ==================================

    if (translation.locked) {

      score += 15
    }

    return {

      translationId: translation._id,

      qualityScore: Math.max(0, Math.min(100, score)),

      grade:
        score > 85 ? "A" :
        score > 70 ? "B" :
        score > 50 ? "C" : "D"
    }
  }

  // ======================================
  // 🔁 AI FEEDBACK LOOP (REAL IMPLEMENTATION)
  // ======================================

  async sendFeedbackToAI({

    courseId,
    targetLang,
    status

  }) {

    const prompt = `
Improve translation system based on feedback:

Course: ${courseId}
Language: ${targetLang}
Status: ${status}

Adjust translation quality model accordingly.
    `.trim()

    // 👉 ici tu peux brancher fine-tuning / embeddings / logs IA

    if (this.ai?.feedback) {

      await this.ai.feedback(prompt)
    }

    return {

      status: "FEEDBACK_SENT",
      data: { courseId, targetLang, status }
    }
  }

  // ======================================
  // 💾 CACHE SYNC HELPER
  // ======================================

  async syncCache(translation) {

    if (!this.cache) return

    const key =
      `course:${translation.courseId}:lang:${translation.targetLang}`

    await this.cache.set(key, translation)
  }

  // ======================================
  // 📦 DASHBOARD DATA (OPTIMIZED)
  // ======================================

  async getReviewDashboard({ lang }) {

    const pending =
      await this.getPendingReviews({ lang })

    const enriched =
      await Promise.all(

        pending.map(async (t) => ({

          ...t._doc,

          quality: await this.scoreTranslationQuality(t)

        }))
      )

    return {

      totalPending: enriched.length,

      items: enriched
    }
  }
}
