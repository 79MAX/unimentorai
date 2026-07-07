
// ======================================
// 🧠 AI LEARNING GRAPH RULES ENGINE
// UniMentorAI - COGNITIVE POLICY LAYER
// ======================================

export const LearningGraphRules = {

  // ======================================
  // 🔒 NODE LOCK LOGIC
  // ======================================

  isLocked(node, userProgress) {

    if (!userProgress) return true

    const mastery = userProgress.mastery || 0

    // node verrouillé si dépendances non validées
    if (node.dependencies?.length > 0) {
      if (!userProgress.completedDependencies) {
        return true
      }
    }

    return mastery < 20
  },

  // ======================================
  // 🎯 NODE ACTIVE LOGIC
  // ======================================

  isActive(node, userProgress) {

    if (!userProgress) return false

    const mastery = userProgress.mastery || 0

    return mastery > 0 && mastery < 80
  },

  // ======================================
  // 🏆 NODE COMPLETION LOGIC
  // ======================================

  isCompleted(node, userProgress) {

    if (!userProgress) return false

    return (userProgress.mastery || 0) >= 80
  },

  // ======================================
  // 🚀 AI RECOMMENDATION ENGINE
  // ======================================

  isRecommended(node, userProgress, context) {

    const mastery = userProgress?.mastery || 0
    const errorRate = context?.errorRate || 0
    const fatigue = context?.fatigue || 0

    // ❌ pas recommandé si fatigue élevée
    if (fatigue > 80) return false

    // ❌ pas recommandé si déjà maîtrisé
    if (mastery > 85) return false

    // ⚠️ priorité aux nodes faibles
    if (mastery < 50 && errorRate > 30) return true

    // 🚀 progression normale
    if (mastery < 70) return true

    return false
  },

  // ======================================
  // 🧠 NODE DIFFICULTY ADAPTATION
  // ======================================

  adaptDifficulty(node, userState) {

    const base = node.difficulty || 50

    const mastery = userState?.mastery || 50
    const fatigue = userState?.fatigue || 0

    let adjusted = base

    // fatigue → réduire difficulté
    if (fatigue > 70) adjusted -= 20

    // haute maîtrise → augmenter difficulté
    if (mastery > 80) adjusted += 15

    // faible maîtrise → réduire légèrement
    if (mastery < 40) adjusted -= 10

    return Math.max(10, Math.min(100, adjusted))
  },

  // ======================================
  // 🎯 PRIORITY SCORE ENGINE (CORE AI)
  // ======================================

  getPriorityScore(node, userProgress, context) {

    const mastery = userProgress?.mastery || 0
    const difficulty = node.difficulty || 50
    const fatigue = context?.fatigue || 0
    const errorRate = context?.errorRate || 0

    let score = 100

    // priorité forte aux faiblesses
    score -= mastery * 0.8

    // ajustement difficulté
    score += difficulty * 0.3

    // pénalité fatigue
    score -= fatigue * 0.5

    // boost si erreurs
    score += errorRate * 0.7

    return Math.max(0, score)
  },

  // ======================================
  // 🧠 NODE STATE RESOLVER (MAIN BRAIN)
  // ======================================

  resolveNodeState(node, userProgress, context = {}) {

    const locked = this.isLocked(node, userProgress)
    const completed = this.isCompleted(node, userProgress)
    const active = this.isActive(node, userProgress)

    return {
      status:
        locked ? "locked"
        : completed ? "completed"
        : active ? "active"
        : "idle",

      recommended: this.isRecommended(node, userProgress, context),

      difficulty: this.adaptDifficulty(node, context),

      priority: this.getPriorityScore(node, userProgress, context)
    }
  }
}
