
import express from "express"

export function ConsensusTranslationAPI({

  consensusEngine

}) {

  const router = express.Router()

  // ======================================
  // 🗳️ SUBMIT VOTE (CORE ENDPOINT)
  // ======================================

  router.post("/vote", async (req, res) => {

    try {

      const {

        translationId,
        decision, // approve | reject
        content

      } = req.body

      const reviewerId = req.user?.id

      // ==================================
      // 🚫 VALIDATION BASIC
      // ==================================

      if (!translationId || !decision) {

        return res.status(400).json({

          status: "ERROR",
          message: "Missing required fields"
        })
      }

      // ==================================
      // 🧠 ADD VOTE TO CONSENSUS ENGINE
      // ==================================

      const result =
        await consensusEngine.addVote({

          translationId,
          reviewerId,
          decision,
          content

        })

      // ==================================
      // 🚀 RETURN LIVE CONSENSUS STATE
      // ==================================

      return res.json({

        status: result.status,

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
  // 📊 GET CONSENSUS STATUS
  // ======================================

  router.get("/status/:translationId", async (req, res) => {

    try {

      const { translationId } = req.params

      const status =
        await consensusEngine.getStatus(translationId)

      return res.json({

        status: "OK",

        data: status

      })

    } catch (error) {

      return res.status(500).json({

        status: "ERROR",
        message: error.message

      })
    }
  })

  // ======================================
  // 🔍 GET FULL CONSENSUS RESULT (DEBUG)
  // ======================================

  router.get("/result/:translationId", async (req, res) => {

    try {

      const { translationId } = req.params

      const status =
        await consensusEngine.getStatus(translationId)

      return res.json({

        status: "OK",

        data: {

          translationId,

          consensusStatus: status.status,

          approvals: status.approvals,

          rejections: status.rejections,

          totalVotes: status.totalVotes

        }
      })

    } catch (error) {

      return res.status(500).json({

        status: "ERROR",
        message: error.message

      })
    }
  })

  // ======================================
  // 🚀 FORCE RE-EVALUATION (ADMIN ONLY)
  // ======================================

  router.post("/recalculate", async (req, res) => {

    try {

      const { translationId } = req.body

      const result =
        await consensusEngine.evaluateConsensus(translationId)

      return res.json({

        status: "RECALCULATED",

        data: result

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
