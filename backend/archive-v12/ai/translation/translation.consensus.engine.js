
// ======================================
// 🧠 TRANSLATION CONSENSUS ENGINE
// UniMentorAI - MULTI-HUMAN VALIDATION SYSTEM
// ======================================

import crypto from "crypto"

export class TranslationConsensusEngine {

  constructor({ db }) {

    this.db = db
  }

  // ======================================
  // 🔑 CONTENT HASH (CRITICAL CORE LOGIC)
  // ======================================

  generateHash(content) {

    return crypto
      .createHash("sha256")
      .update(content)
      .digest("hex")
  }

  // ======================================
  // 🧠 ADD REVIEW VOTE
  // ======================================

  async addVote({

    translationId,
    reviewerId,
    decision, // "approve" | "reject"
    content

  }) {

    const translation =
      await this.db.translation.findById(translationId)

    if (!translation) {

      throw new Error("TRANSLATION_NOT_FOUND")
    }

    const contentHash =
      this.generateHash(content)

    // ==================================
    // 🗳️ STORE VOTE
    // ==================================

    await this.db.translationVotes.create({

      translationId,
      reviewerId,
      decision,
      contentHash,
      createdAt: new Date()
    })

    // ==================================
    // 🧠 CHECK CONSENSUS AFTER VOTE
    // ==================================

    return await this.evaluateConsensus(translationId)
  }

  // ======================================
  // 📊 CONSENSUS EVALUATION ENGINE
  // ======================================

  async evaluateConsensus(translationId) {

    const votes =
      await this.db.translationVotes.find({

        translationId

      })

    // ==================================
    // FILTER APPROVALS ONLY
    // ==================================

    const approvals =
      votes.filter(v => v.decision === "approve")

    if (approvals.length < 3) {

      return {
        status: "NO_CONSENSUS",
        approved: false,
        approvals: approvals.length
      }
    }

    // ==================================
    // 🔥 GROUP BY CONTENT HASH
    // ==================================

    const hashGroups = {}

    approvals.forEach(v => {

      if (!hashGroups[v.contentHash]) {

        hashGroups[v.contentHash] = []
      }

      hashGroups[v.contentHash].push(v)
    })

    // ==================================
    // FIND STRONGEST CONSENSUS GROUP
    // ==================================

    let bestHash = null
    let bestGroup = []

    for (const hash in hashGroups) {

      if (hashGroups[hash].length > bestGroup.length) {

        bestHash = hash
        bestGroup = hashGroups[hash]
      }
    }

    // ==================================
    // ❌ NO VALID CONSENSUS
    // ==================================

    if (bestGroup.length < 3) {

      return {
        status: "CONFLICTING_VOTES",
        approved: false,
        message: "No stable consensus reached"
      }
    }

    // ==================================
    // 🚀 CONSENSUS ACHIEVED (3–5 VALIDATORS)
    // ==================================

    const finalContent =
      await this.db.translation.findById(translationId)

    // ==================================
    // 🔒 LOCK TRANSLATION
    // ==================================

    await this.db.translation.updateOne(

      { _id: translationId },

      {
        status: "archived",
        locked: true,
        finalContentHash: bestHash,
        consensusCount: bestGroup.length,
        archivedAt: new Date()
      }
    )

    // ==================================
    // 💾 ARCHIVE SNAPSHOT
    // ==================================

    await this.db.translationArchive.create({

      translationId,
      content: finalContent.content,
      hash: bestHash,
      approvedBy: bestGroup.map(v => v.reviewerId),
      archivedAt: new Date()
    })

    // ==================================
    // 🧠 AUDIT LOG
    // ==================================

    await this.db.translationAudit.create({

      translationId,
      action: "CONSENSUS_REACHED_AND_ARCHIVED",
      reviewers: bestGroup.length,
      timestamp: new Date()
    })

    return {

      status: "CONSENSUS_REACHED",

      approved: true,

      reviewers: bestGroup.length,

      finalHash: bestHash
    }
  }

  // ======================================
  // 📊 GET CONSENSUS STATUS
  // ======================================

  async getStatus(translationId) {

    const votes =
      await this.db.translationVotes.find({ translationId })

    const approvals =
      votes.filter(v => v.decision === "approve")

    const rejections =
      votes.filter(v => v.decision === "reject")

    return {

      translationId,

      approvals: approvals.length,

      rejections: rejections.length,

      totalVotes: votes.length,

      status:
        approvals.length >= 3 ? "READY_FOR_CONSENSUS" : "PENDING"
    }
  }
}
