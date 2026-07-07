
// ======================================
// 🧠 AI LEARNING GRAPH ENGINE
// UniMentorAI - COGNITIVE PATH SYSTEM
// ======================================

export class LearningGraphEngine {

  constructor({ db }) {
    this.db = db
  }

  // ======================================
  // 🌐 BUILD LEARNING GRAPH
  // ======================================

  async buildGraph({ userId, courseId }) {

    const nodes = await this.db.skills.find({ courseId })

    const progress = await this.db.progress.find({ userId, courseId })

    const graph = nodes.map(node => {

      const userProgress = progress.find(p => p.skillId === node._id)

      return {
        id: node._id,
        label: node.title,
        difficulty: node.difficulty || 50,

        mastery: userProgress?.mastery || 0,

        status: this.getNodeStatus(userProgress),

        dependencies: node.dependencies || [],

        x: node.position?.x || 0,
        y: node.position?.y || 0,

        recommended: false
      }
    })

    return this.optimizeGraph(graph)
  }

  // ======================================
  // 🧠 NODE STATUS ENGINE
  // ======================================

  getNodeStatus(progress) {

    if (!progress) return "locked"

    if (progress.mastery >= 80) return "completed"

    if (progress.mastery > 0) return "active"

    return "locked"
  }

  // ======================================
  // ⚡ GRAPH OPTIMIZATION ENGINE
  // ======================================

  optimizeGraph(graph) {

    return graph.map(node => {

      const isUnlocked =
        node.status === "active" || node.status === "completed"

      return {
        ...node,

        // IA recommendation logic
        recommended:
          isUnlocked &&
          node.mastery < 80
      }
    })
  }

  // ======================================
  // 🎯 GET ACTIVE LEARNING PATH
  // ======================================

  async getOptimalPath({ userId, courseId }) {

    const graph = await this.buildGraph({ userId, courseId })

    const activeNodes = graph.filter(n => n.status !== "locked")

    // tri IA simple : priorité aux faiblesses
    return activeNodes.sort((a, b) => {

      const scoreA = a.mastery - a.difficulty
      const scoreB = b.mastery - b.difficulty

      return scoreA - scoreB
    })
  }

  // ======================================
  // 🧠 NEXT BEST NODE (AI CORE)
  // ======================================

  async getNextNode({ userId, courseId }) {

    const path = await this.getOptimalPath({ userId, courseId })

    if (!path.length) return null

    return path[0]
  }

  // ======================================
  // 🌊 UPDATE NODE PROGRESS (REAL-TIME STREAM)
  // ======================================

  async updateNodeProgress({ userId, skillId, mastery }) {

    return await this.db.progress.updateOne(
      { userId, skillId },
      {
        $set: {
          mastery,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    )
  }

  // ======================================
  // 🎯 MARK NODE AS RECOMMENDED (CAMERA AI SUPPORT)
  // ======================================

  async markRecommendations({ userId, courseId }) {

    const graph = await this.buildGraph({ userId, courseId })

    const next = await this.getNextNode({ userId, courseId })

    return graph.map(node => ({
      ...node,
      recommended: node.id === next?.id
    }))
  }
}
