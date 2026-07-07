// ============================================
// 🧠 BEHAVIOR ANALYTICS ENGINE V3
// UniMentorAI
// ============================================

const DEFAULT_BEHAVIOR = {
  engagementScore: 50,

  focusScore: 50,

  motivationScore: 50,

  persistenceScore: 50,

  fatigueScore: 0,

  dropoutRisk: 0,

  learningStyle: "unknown",

  activityPattern: "unknown",

  preferredLearningTime: null,

  strongestTopic: null,

  weakestTopic: null,

  sessionPatterns: [],

  topicPerformance: {},

  trendHistory: [],

  insights: [],

  lastUpdated: null
}

// ============================================
// MAIN ENGINE
// ============================================

export async function analyzeBehavior({
  behavior = DEFAULT_BEHAVIOR,
  session,
  analytics,
  usage
}) {

  const result = structuredClone(behavior)

  result.lastUpdated = Date.now()

  result.engagementScore =
    computeEngagement(
      analytics,
      usage
    )

  result.focusScore =
    computeFocus(
      session,
      analytics
    )

  result.motivationScore =
    computeMotivation(
      usage,
      analytics
    )

  result.persistenceScore =
    computePersistence(
      usage
    )

  result.fatigueScore =
    computeFatigue(
      analytics,
      session
    )

  result.dropoutRisk =
    computeDropoutRisk(
      result
    )

  result.learningStyle =
    detectLearningStyle(
      usage,
      analytics
    )

  result.activityPattern =
    detectActivityPattern(
      usage
    )

  result.preferredLearningTime =
    detectPreferredLearningTime(
      usage
    )

  updateTopicPerformance(
    result,
    analytics
  )

  generateBehaviorInsights(
    result
  )

  return result
}

// ============================================
// ENGAGEMENT
// ============================================

function computeEngagement(
  analytics,
  usage
) {

  const completion =
    analytics.completionRate || 0

  const activity =
    usage.sessions || 0

  const mentor =
    usage.mentorInteractions || 0

  return Math.min(
    100,
    completion * 0.5 +
    activity * 2 +
    mentor * 0.3
  )
}

// ============================================
// FOCUS
// ============================================

function computeFocus(
  session,
  analytics
) {

  const fatigue =
    analytics.fatigueScore || 0

  const confusion =
    session?.cognitive
      ?.confusionTrend?.slice(-5)
      ?.reduce((a,b)=>a+b,0) || 0

  return Math.max(
    0,
    100 -
    fatigue -
    confusion
  )
}

// ============================================
// MOTIVATION
// ============================================

function computeMotivation(
  usage,
  analytics
) {

  return Math.min(
    100,
    (usage.lessonsCompleted || 0) * 3 +
    (analytics.engagementScore || 0) * 0.5
  )
}

// ============================================
// PERSISTENCE
// ============================================

function computePersistence(
  usage
) {

  const started =
    usage.lessonsStarted || 0

  const completed =
    usage.lessonsCompleted || 0

  if (!started) return 0

  return (
    completed / started
  ) * 100
}

// ============================================
// FATIGUE
// ============================================

function computeFatigue(
  analytics,
  session
) {

  const time =
    analytics.totalTimeSpent || 0

  const confusion =
    session?.cognitive
      ?.confusionTrend?.slice(-10)
      ?.reduce((a,b)=>a+b,0) || 0

  return Math.min(
    100,
    time / 120 +
    confusion * 5
  )
}

// ============================================
// DROPOUT RISK
// ============================================

function computeDropoutRisk(
  behavior
) {

  let risk = 0

  if (
    behavior.engagementScore < 40
  ) risk += 30

  if (
    behavior.motivationScore < 40
  ) risk += 30

  if (
    behavior.persistenceScore < 50
  ) risk += 20

  if (
    behavior.fatigueScore > 70
  ) risk += 20

  return Math.min(risk,100)
}

// ============================================
// LEARNING STYLE
// ============================================

function detectLearningStyle(
  usage,
  analytics
) {

  const mentor =
    usage.mentorInteractions || 0

  const videos =
    usage.videoMinutesWatched || 0

  const quizzes =
    usage.quizzesCompleted || 0

  if (
    videos >
    mentor &&
    videos > quizzes
  ) {
    return "visual"
  }

  if (
    mentor >
    videos &&
    mentor > quizzes
  ) {
    return "guided"
  }

  if (
    quizzes >
    mentor &&
    quizzes > videos
  ) {
    return "practice"
  }

  return "balanced"
}

// ============================================
// ACTIVITY PATTERN
// ============================================

function detectActivityPattern(
  usage
) {

  if (
    usage.sessions > 30
  ) {
    return "power_user"
  }

  if (
    usage.sessions > 10
  ) {
    return "regular"
  }

  return "casual"
}

// ============================================
// PREFERRED LEARNING TIME
// ============================================

function detectPreferredLearningTime(
  usage
) {

  const hours =
    usage.learningHours || []

  if (!hours.length)
    return null

  const counter = {}

  for (const h of hours) {
    counter[h] =
      (counter[h] || 0) + 1
  }

  return Object.entries(counter)
    .sort((a,b)=>b[1]-a[1])[0]?.[0]
}

// ============================================
// TOPIC PERFORMANCE
// ============================================

function updateTopicPerformance(
  behavior,
  analytics
) {

  const topics =
    analytics.topicScores || {}

  behavior.topicPerformance =
    topics

  let strongest = null
  let weakest = null

  let max = -1
  let min = 999

  for (const [topic,score]
    of Object.entries(topics)
  ) {

    if (score > max) {
      max = score
      strongest = topic
    }

    if (score < min) {
      min = score
      weakest = topic
    }
  }

  behavior.strongestTopic =
    strongest

  behavior.weakestTopic =
    weakest
}

// ============================================
// INSIGHTS
// ============================================

function generateBehaviorInsights(
  behavior
) {

  const insights = []

  if (
    behavior.dropoutRisk > 70
  ) {
    insights.push(
      "High dropout risk detected."
    )
  }

  if (
    behavior.engagementScore > 80
  ) {
    insights.push(
      "Highly engaged learner."
    )
  }

  if (
    behavior.learningStyle ===
    "visual"
  ) {
    insights.push(
      "Learner prefers visual content."
    )
  }

  if (
    behavior.learningStyle ===
    "practice"
  ) {
    insights.push(
      "Learner improves through exercises."
    )
  }

  behavior.insights = insights
}
