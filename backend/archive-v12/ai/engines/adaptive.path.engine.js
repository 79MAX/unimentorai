
// =========================
// 🧠 ADAPTIVE PATH ENGINE V2
// UNI MENTOR AI LEARNING GRAPH NAVIGATION CORE
// =========================

export const generateAdaptivePath = async ({
  user,
  course,
  analytics = {},
  history = [],
  mastery = {}
}) => {

  const currentTopic = course?.topic || "general"
  const currentMastery = mastery?.masteryLevel || 50
  const fatigue = analytics.fatigueLevel || 0
  const streak = analytics.streak || 0

  // =========================
  // 1. LEARNING GRAPH BASE STRUCTURE
  // =========================

  const graph = buildLearningGraph(course)

  // =========================
  // 2. CURRENT NODE POSITION
  // =========================

  const currentNode = findCurrentNode(graph, currentTopic)

  // =========================
  // 3. MASTERY-BASED ROUTING
  // =========================

  let direction = "forward"

  if (currentMastery < 40) {
    direction = "backward" // return to fundamentals
  } else if (currentMastery > 80) {
    direction = "accelerate" // skip ahead
  }

  // =========================
  // 4. ERROR-BASED ADJUSTMENT
  // =========================

  const lastMistakes = history.filter(h => h.score < 60).length

  if (lastMistakes > 3) {
    direction = "reinforce"
  }

  // =========================
  // 5. FATIGUE-AWARE ROUTING
  // =========================

  if (fatigue > 75) {
    direction = "light_review"
  }

  // =========================
  // 6. PATH GENERATION LOGIC
  // =========================

  let path = []

  switch (direction) {

    case "backward":
      path = getPrerequisites(graph, currentNode)
      break

    case "forward":
      path = getNextNodes(graph, currentNode)
      break

    case "accelerate":
      path = getAdvancedNodes(graph, currentNode)
      break

    case "reinforce":
      path = getWeakConcepts(history, graph)
      break

    case "light_review":
      path = getEasyReviewNodes(graph)
      break
  }

  // =========================
  // 7. PRIORITY SCORING SYSTEM
  // =========================

  const scoredPath = path.map(node => {

    const score =
      (node.importance * 0.4) +
      (node.difficultyFit(currentMastery) * 0.3) +
      (node.errorRelevance(history) * 0.2) +
      (node.engagementScore || 0)

    return {
      ...node,
      priorityScore: score
    }
  })

  // =========================
  // 8. SORTING + OPTIMIZATION
  // =========================

  scoredPath.sort((a, b) => b.priorityScore - a.priorityScore)

  const optimizedPath = scoredPath.slice(0, 5)

  // =========================
  // 9. LEARNING STATE DETECTION
  // =========================

  let learningState = "balanced"

  if (currentMastery < 40) learningState = "foundation"
  else if (currentMastery > 80) learningState = "mastery"
  else if (fatigue > 70) learningState = "recovery"
  else if (streak > 5) learningState = "flow"

  // =========================
  // 10. NEXT BEST ACTION
  // =========================

  const nextStep = optimizedPath[0] || null

  // =========================
  // 11. KNOWLEDGE GAP DETECTION
  // =========================

  const gaps = detectKnowledgeGaps(history, graph)

  // =========================
  // 12. FINAL OUTPUT
  // =========================

  return {

    currentTopic,

    learningState,

    direction,

    nextStep,

    path: optimizedPath,

    knowledgeGaps: gaps,

    insights: generatePathInsights({
      learningState,
      fatigue,
      currentMastery,
      streak
    })
  }
}

// =========================
// 🧠 LEARNING GRAPH BUILDER
// =========================

function buildLearningGraph(course) {

  return {
    nodes: course?.topics || [],
    edges: course?.dependencies || []
  }
}

// =========================
// 📍 CURRENT NODE FINDER
// =========================

function findCurrentNode(graph, topic) {

  return graph.nodes.find(n => n.topic === topic) || graph.nodes[0]
}

// =========================
// 🔙 PREREQUISITES
// =========================

function getPrerequisites(graph, node) {
  return graph.nodes.filter(n =>
    node.prerequisites?.includes(n.topic)
  )
}

// =========================
// ➡️ NEXT NODES
// =========================

function getNextNodes(graph, node) {
  return graph.nodes.filter(n =>
    node.next?.includes(n.topic)
  )
}

// =========================
// 🚀 ADVANCED NODES
// =========================

function getAdvancedNodes(graph, node) {
  return graph.nodes.filter(n =>
    n.level === "advanced"
  )
}

// =========================
// 🔁 WEAK CONCEPTS
// =========================

function getWeakConcepts(history, graph) {

  const weakTopics = history
    .filter(h => h.score < 50)
    .map(h => h.topic)

  return graph.nodes.filter(n =>
    weakTopics.includes(n.topic)
  )
}

// =========================
// 🟢 EASY REVIEW
// =========================

function getEasyReviewNodes(graph) {
  return graph.nodes.filter(n =>
    n.difficulty === "easy"
  )
}

// =========================
// 📉 GAP DETECTION
// =========================

function detectKnowledgeGaps(history, graph) {

  return history
    .filter(h => h.score < 60)
    .map(h => ({
      topic: h.topic,
      severity: "medium"
    }))
}

// =========================
// 🧠 INSIGHTS ENGINE
// =========================

function generatePathInsights({
  learningState,
  fatigue,
  currentMastery,
  streak
}) {

  const insights = []

  if (learningState === "recovery") {
    insights.push("Reduce difficulty and reinforce fundamentals")
  }

  if (learningState === "flow") {
    insights.push("Increase challenge level")
  }

  if (currentMastery < 40) {
    insights.push("User needs foundational reinforcement")
  }

  if (fatigue > 70) {
    insights.push("Risk of cognitive overload detected")
  }

  if (streak > 5) {
    insights.push("User ready for accelerated learning path")
  }

  return insights
}
