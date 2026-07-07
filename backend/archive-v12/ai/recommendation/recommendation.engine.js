// ==========================================
// 🧠 RECOMMENDATION ENGINE V4
// UniMentorAI
// ==========================================

const DEFAULT_WEIGHTS = {
  mastery: 0.30,
  behavior: 0.20,
  engagement: 0.15,
  retention: 0.15,
  goalAlignment: 0.10,
  difficultyFit: 0.10
}

// ==========================================
// MAIN ENGINE
// ==========================================

export async function generateRecommendations({

  learnerProfile,

  behavior,

  analytics,

  mastery,

  adaptivePath,

  catalog = [],

  goals = []

}) {

  const recommendations = []

  for (const item of catalog) {

    const score =
      calculateRecommendationScore({

        item,

        learnerProfile,

        behavior,

        analytics,

        mastery,

        goals
      })

    recommendations.push({
      ...item,
      recommendationScore: score
    })
  }

  recommendations.sort(
    (a, b) =>
      b.recommendationScore -
      a.recommendationScore
  )

  return {

    nextBestLesson:
      recommendations[0] || null,

    topRecommendations:
      recommendations.slice(0, 10),

    mentorRecommendation:
      recommendMentor({
        learnerProfile,
        behavior
      }),

    revisionRecommendations:
      recommendRevision({
        analytics,
        mastery
      }),

    challengeRecommendations:
      recommendChallenges({
        mastery,
        learnerProfile
      }),

    generatedAt: Date.now()
  }
}

// ==========================================
// SCORING ENGINE
// ==========================================

function calculateRecommendationScore({

  item,

  learnerProfile,

  behavior,

  analytics,

  mastery,

  goals
}) {

  const weights = DEFAULT_WEIGHTS

  const masteryFit =
    calculateMasteryFit(
      item,
      mastery
    )

  const behaviorFit =
    calculateBehaviorFit(
      item,
      behavior
    )

  const engagementFit =
    calculateEngagementFit(
      item,
      analytics
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

  const difficultyFit =
    calculateDifficultyFit(
      item,
      learnerProfile
    )

  return (

    masteryFit *
      weights.mastery +

    behaviorFit *
      weights.behavior +

    engagementFit *
      weights.engagement +

    retentionFit *
      weights.retention +

    goalFit *
      weights.goalAlignment +

    difficultyFit *
      weights.difficultyFit

  )
}

// ==========================================
// MASTERY FIT
// ==========================================

function calculateMasteryFit(
  item,
  mastery
) {

  const current =
    mastery.masteryLevel || 50

  const difficulty =
    item.difficulty || 50

  return Math.max(
    0,
    100 -
    Math.abs(
      current - difficulty
    )
  )
}

// ==========================================
// BEHAVIOR FIT
// ==========================================

function calculateBehaviorFit(
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

// ==========================================
// ENGAGEMENT FIT
// ==========================================

function calculateEngagementFit(
  item,
  analytics
) {

  const engagement =
    analytics.engagementScore || 50

  if (engagement > 80)
    return 100

  if (
    item.duration &&
    item.duration < 15
  ) {
    return 90
  }

  return 60
}

// ==========================================
// RETENTION FIT
// ==========================================

function calculateRetentionFit(
  item,
  analytics
) {

  const retention =
    analytics.retentionScore || 50

  if (
    retention < 50 &&
    item.category === "revision"
  ) {
    return 100
  }

  return retention
}

// ==========================================
// GOAL FIT
// ==========================================

function calculateGoalFit(
  item,
  goals
) {

  if (
    goals.includes(item.topic)
  ) {
    return 100
  }

  return 50
}

// ==========================================
// DIFFICULTY FIT
// ==========================================

function calculateDifficultyFit(
  item,
  learnerProfile
) {

  const adaptability =
    learnerProfile.adaptability || 50

  const difficulty =
    item.difficulty || 50

  return Math.max(
    0,
    100 -
    Math.abs(
      adaptability -
      difficulty
    )
  )
}

// ==========================================
// MENTOR RECOMMENDER
// ==========================================

function recommendMentor({
  learnerProfile,
  behavior
}) {

  if (
    behavior.learningStyle ===
    "guided"
  ) {

    return {
      type: "mentor",
      persona:
        "patient_teacher"
    }
  }

  if (
    learnerProfile.segment ===
    "advanced_learner"
  ) {

    return {
      type: "mentor",
      persona:
        "elite_coach"
    }
  }

  return {
    type: "mentor",
    persona:
      "balanced_mentor"
  }
}

// ==========================================
// REVISION RECOMMENDER
// ==========================================

function recommendRevision({
  analytics,
  mastery
}) {

  const revisions = []

  const topics =
    analytics.topicScores || {}

  for (const [topic, score]
    of Object.entries(topics)) {

    if (score < 60) {

      revisions.push({
        topic,
        priority:
          100 - score
      })
    }
  }

  return revisions.sort(
    (a,b)=>
      b.priority-a.priority
  )
}

// ==========================================
// CHALLENGE RECOMMENDER
// ==========================================

function recommendChallenges({
  mastery,
  learnerProfile
}) {

  const challenges = []

  if (
    mastery.masteryLevel > 80
  ) {

    challenges.push({
      type:
        "advanced_exercise",

      difficulty:
        mastery.masteryLevel + 10
    })
  }

  if (
    learnerProfile.segment ===
    "advanced_learner"
  ) {

    challenges.push({
      type:
        "expert_project",

      difficulty: 95
    })
  }

  return challenges
}
