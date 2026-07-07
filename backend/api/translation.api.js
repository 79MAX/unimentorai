
import express from "express"

export function TranslationAPI({

  governanceEngine,
  cacheEngine,
  reviewEngine

}) {

  const router = express.Router()

  // ======================================
  // 🛡️ BASIC VALIDATION MIDDLEWARE
  // ======================================

  const validate = (req, res, next) => {

    const { courseId, targetLang } = req.body || req.query

    if (!courseId || !targetLang) {

      return res.status(400).json({

        status: "ERROR",
        message: "courseId and targetLang are required"
      })
    }

    next()
  }

  // ======================================
  // 🌍 TRANSLATE COURSE (OPTIMIZED FLOW)
  // ======================================

  router.post("/translate", validate, async (req, res) => {

    try {

      const { courseId, targetLang } = req.body

      const userId =
        req.user?.id || "anonymous"

      // ==================================
      // ⚡ 1. CACHE FIRST (FAST PATH)
      // ==================================

      const cached =
        await cacheEngine.getCachedTranslation({

          courseId,
          targetLang

        })

      if (cached?.status === "CACHE_HIT") {

        return res.json({

          status: "CACHE_HIT",

          source: "cache",

          data: cached.data

        })
      }

      // ==================================
      // 🧠 2. GOVERNANCE ENGINE
      // ==================================

      const result =
        await governanceEngine.translateCourse({

          courseId,
          targetLang,
          requestedBy: userId

        })

      // ==================================
      // 🚫 BLOCKED FLOW
      // ==================================

      if (result.status === "BLOCKED") {

        return res.status(403).json({

          status: "BLOCKED",

          reason: result.reason,

          message: result.message
        })
      }

      // ==================================
      // 💾 STORE CACHE (SAFE FORMAT)
      // ==================================

      await cacheEngine.storeTranslation({

        courseId,

        targetLang,

        content: result.data.content || result.data,

        status: result.data.status || "pending_review"

      })

      // ==================================
      // 📦 RESPONSE STANDARDIZED
      // ==================================

      return res.json({

        status: "SUCCESS",

        source: "ai_generated",

        data: result.data

      })

    } catch (error) {

      return res.status(500).json({

        status: "ERROR",

        message: error.message

      })
    }
  })

  // ======================================
  // 👨‍🏫 GET PENDING REVIEWS (OPTIMIZED)
  // ======================================

  router.get("/reviews/pending", async (req, res) => {

    try {

      const { lang } = req.query

      if (!lang) {

        return res.status(400).json({

          status: "ERROR",
          message: "lang is required"
        })
      }

      const data =
        await reviewEngine.getPendingReviews({ lang })

      return res.json({

        status: "SUCCESS",

        count: data.length,

        data

      })

    } catch (error) {

      return res.status(500).json({

        status: "ERROR",

        message: error.message

      })
    }
  })

  // ======================================
  // ✅ APPROVE (SAFE + CLEAN RESPONSE)
  // ======================================

  router.post("/reviews/approve", async (req, res) => {

    try {

      const { translationId } = req.body

      const reviewerId = req.user?.id

      const result =
        await reviewEngine.approveTranslation({

          translationId,
          reviewerId

        })

      return res.json({

        status: "SUCCESS",

        action: "APPROVED",

        data: result

      })

    } catch (error) {

      return res.status(500).json({

        status: "ERROR",

        message: error.message

      })
    }
  })

  // ======================================
  // ❌ REJECT (STANDARDIZED)
  // ======================================

  router.post("/reviews/reject", async (req, res) => {

    try {

      const { translationId, reason } = req.body

      const reviewerId = req.user?.id

      const result =
        await reviewEngine.rejectTranslation({

          translationId,
          reviewerId,
          reason

        })

      return res.json({

        status: "SUCCESS",

        action: "REJECTED",

        data: result

      })

    } catch (error) {

      return res.status(500).json({

        status: "ERROR",

        message: error.message

      })
    }
  })

  // ======================================
  // ✏️ EDIT TRANSLATION
  // ======================================

  router.post("/reviews/edit", async (req, res) => {

    try {

      const { translationId, correctedContent } = req.body

      const reviewerId = req.user?.id

      const result =
        await reviewEngine.editTranslation({

          translationId,
          correctedContent,
          reviewerId

        })

      return res.json({

        status: "SUCCESS",

        action: "EDITED",

        data: result

      })

    } catch (error) {

      return res.status(500).json({

        status: "ERROR",

        message: error.message

      })
    }
  })

  // ======================================
  // 📊 STATUS CHECK (CLEAN API)
  // ======================================

  router.get("/status", validate, async (req, res) => {

    try {

      const { courseId, targetLang } = req.query

      const data =
        await cacheEngine.getCacheInfo({

          courseId,
          targetLang

        })

      return res.json({

        status: "SUCCESS",

        data

      })

    } catch (error) {

      return res.status(500).json({

        status: "ERROR",

        message: error.message

      })
    }
  })

  return router
}
