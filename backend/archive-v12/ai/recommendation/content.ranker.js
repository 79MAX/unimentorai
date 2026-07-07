// =========================================
// 🧠 CONTENT RANKER ENGINE V4
// UniMentorAI
// =========================================

const RANKING_WEIGHTS = {

  relevance: 0.25,

  masteryFit: 0.20,

  difficultyFit: 0.15,

  engagementFit: 0.10,

  retentionFit: 0.10,

  goalFit: 0.10,

  freshness: 0.05,

  popularity: 0.05
}

// =========================================
// MAIN RANKER
// =========================================

export async function rankContent({

  content = [],

  learnerProfile,

  behavior,

  analytics,

  mastery,

  goals = []

}) {

  const ranked = content.map(item => {

    const score =
      computeContentScore({

        item,

        learnerProfile,

        behavior,

        analytics,

        mastery,

        goals
      })

    return {
      ...item,
      rankingScore: score
    }
  })

  ranked.sort(
    (a,b) =>
      b.rankingScore -
      a.rankingScore
  )

  return {

    recommended:
      ranked.slice(0,20),

    bestContent:
      ranked[0] || null,

    generatedAt:
      Date.now()
  }
}

// =========================================
// SCORE ENGINE
// =========================================

function computeContentScore({

  item,

  learnerProfile,

  behavior,

  analytics,

  mastery,

  goals
}) {

  const relevance =
    calculateRelevance(
      item,
      learnerProfile
    )

  const masteryFit =
    calculateMasteryFit(
      item,
      mastery
    )

  const difficultyFit =
    calculateDifficultyFit(
      item,
      learnerProfile
    )

  const engagementFit =
    calculateEngagementFit(
      item,
      behavior
    )

  const retentionFit =
    calculateRetentionFit(
      item,
      analytics
    )

  const goalFit =
    calculateGoalFit(
      item,
      goals
    )

  const freshness =
    calculateFreshness(item)

  const popularity =
    calculatePopularity(item)

  return (

    relevance *
      RANKING_WEIGHTS.relevance +

    masteryFit *
      RANKING_WEIGHTS.masteryFit +

    difficultyFit *
      RANKING_WEIGHTS.difficultyFit +

    engagementFit *
      RANKING_WEIGHTS.engagementFit +

    retentionFit *
      RANKING_WEIGHTS.retentionFit +

    goalFit *
      RANKING_WEIGHTS.goalFit +

    freshness *
      RANKING_WEIGHTS.freshness +

    popularity *
      RANKING_WEIGHTS.popularity

  )
}

// =========================================
// RELEVANCE
// =========================================

function calculateRelevance(
  item,
  learnerProfile
) {

  const strengths =
    learnerProfile.strongestTopics || []

  const weaknesses =
    learnerProfile.weakestTopics || []

  if (
    weaknesses.includes(
      item.topic
    )
  ) {
    return 100
  }

  if (
    strengths.includes(
      item.topic
    )
  ) {
    return 70
  }

  return 50
}

// =========================================
// MASTERY FIT
// =========================================

function calculateMasteryFit(
  item,
  mastery
) {

  const current =
    mastery.masteryLevel || 50

  const required =
    item.requiredMastery || 50

  return Math.max(
    0,
    100 -
    Math.abs(
      current - required
    )
  )
}

// =========================================
// DIFFICULTY FIT
// =========================================

function calculateDifficultyFit(
  item,
  learnerProfile
) {

  const adaptability =
    learnerProfile.adaptability || 50

  return Math.max(
    0,
    100 -
    Math.abs(
      adaptability -
      (item.difficulty || 50)
    )
  )
}

// =========================================
// ENGAGEMENT FIT
// =========================================

function calculateEngagementFit(
  item,
  behavior
) {

  const style =
    behavior.learningStyle

  if (
    style === "visual" &&
    item.type === "video"
  ) {
    return 100
  }

  if (
    style === "practice" &&
    item.type === "exercise"
  ) {
    return 100
  }

  if (
    style === "guided" &&
    item.type === "mentor"
  ) {
    return 100
  }

  return 60
}

// =========================================
// RETENTION FIT
// =========================================

function calculateRetentionFit(
  item,
  analytics
) {

  const retention =
    analytics.retentionScore || 50

  if (
    retention < 60 &&
    item.category ===
    "revision"
  ) {
    return 100
  }

  return retention
}

// =========================================
// GOAL FIT
// =========================================

function calculateGoalFit(
  item,
  goals
) {

  return goals.includes(
    item.topic
  )
    ? 100
    : 50
}

// =========================================
// FRESHNESS
// =========================================

function calculateFreshness(
  item
) {

  if (!item.createdAt)
    return 50

  const ageDays =
    (
      Date.now() -
      new Date(
        item.createdAt
      ).getTime()
    ) /
    86400000

  return Math.max(
    0,
    100 - ageDays
  )
}

// =========================================
// POPULARITY
// =========================================

function calculatePopularity(
  item
) {

  return Math.min(
    100,
    item.popularity || 50
  )
}
