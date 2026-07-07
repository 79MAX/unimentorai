
import express from "express"

// ======================================
// 🧠 AI LEARNING GRAPH API ROUTER
// UniMentorAI - COGNITIVE GRAPH GATEWAY
// ======================================

export function LearningGraphRouter({

  graphEngine,
  graphRules

}) {

  const router = express.Router()

  // ======================================
  // 🌐 GET FULL LEARNING GRAPH
  // ======================================

  router.get("/graph", async (req, res) => {

    try {

      const { userId, courseId } = req.query

      const graph =
        await graphEngine.buildGraph({ userId, courseId })

      return res.json({
        status: "OK",
        data: graph
      })

    } catch (error) {

      return res.status(500).json({
        status: "ERROR",
        message: error.message
      })
    }
  })

  // ======================================
  // 🎯 GET OPTIMAL LEARNING PATH
  // ======================================

  router.get("/path", async (req, res) => {

    try {

      const { userId, courseId } = req.query

      const path =
        await graphEngine.getOptimalPath({ userId, courseId })

      return res.json({
        status: "OK",
        data: path
      })

    } catch (error) {

      return res.status(500).json({
        status: "ERROR",
        message: error.message
      })
    }
  })

  // ======================================
  // 🚀 GET NEXT AI NODE (CAMERA TARGET)
  // ======================================

  router.get("/next-node", async (req, res) => {

    try {

      const { userId, courseId } = req.query

      const node =
        await graphEngine.getNextNode({ userId, courseId })

      return res.json({
        status: "OK",
        data: node
      })

    } catch (error) {

      return res.status(500).json({
        status: "ERROR",
        message: error.message
      })
    }
  })

  // ======================================
  // 🧠 RESOLVE NODE STATE (RULES ENGINE)
  // ======================================

  router.post("/node/state", async (req, res) => {

    try {

      const {

        node,
        userProgress,
        context

      } = req.body

      const state =
        graphRules.resolveNodeState(
          node,
          userProgress,
          context
        )

      return res.json({
        status: "OK",
        data: state
      })

    } catch (error) {

      return res.status(500).json({
        status: "ERROR",
        message: error.message
      })
    }
  })

  // ======================================
  // 🎯 GET CAMERA FOCUS (AI CAMERA SYSTEM)
  // ======================================

  router.get("/camera/focus", async (req, res) => {

    try {

      const { userId, courseId } = req.query

      const nextNode =
        await graphEngine.getNextNode({ userId, courseId })

      return res.json({
        status: "OK",
        data: {
          focusNode: nextNode,
          zoom: nextNode?.difficulty > 70 ? 1.2 : 1.0
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
  // 🔁 UPDATE PROGRESS (REAL-TIME STREAM)
  // ======================================

  router.post("/progress/update", async (req, res) => {

    try {

      const {

        userId,
        skillId,
        mastery

      } = req.body

      const result =
        await graphEngine.updateNodeProgress({
          userId,
          skillId,
          mastery
        })

      return res.json({
        status: "UPDATED",
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
  // 📊 GET GRAPH INSIGHTS (AI ANALYTICS)
  // ======================================

  router.get("/insights", async (req, res) => {

    try {

      const { userId, courseId } = req.query

      const graph =
        await graphEngine.buildGraph({ userId, courseId })

      const total = graph.length

      const completed =
        graph.filter(n => n.status === "completed").length

      const active =
        graph.filter(n => n.status === "active").length

      const locked =
        graph.filter(n => n.status === "locked").length

      const recommended =
        graph.filter(n => n.recommended).length

      return res.json({
        status: "OK",
        data: {
          total,
          completed,
          active,
          locked,
          recommended
        }
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
