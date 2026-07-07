// ========================================
// 🧠 USAGE TRACKER V3
// UniMentorAI
// ========================================

const usageStore = new Map()

const DEFAULT_USAGE = {
  userId: null,

  sessions: 0,

  pageViews: 0,

  apiCalls: 0,

  aiRequests: 0,

  aiTokensUsed: 0,

  lessonsStarted: 0,

  lessonsCompleted: 0,

  quizzesCompleted: 0,

  certificatesGenerated: 0,

  mentorInteractions: 0,

  forumInteractions: 0,

  videoMinutesWatched: 0,

  totalActiveTime: 0,

  lastSeenAt: null,

  firstSeenAt: null,

  deviceTypes: {},

  browsers: {},

  countries: {},

  featureUsage: {},

  errors: [],

  anomalies: [],

  insights: []
}

// ========================================
// INITIALIZE
// ========================================

export function initializeUsage(userId) {

  if (!usageStore.has(userId)) {

    usageStore.set(userId, {
      ...structuredClone(DEFAULT_USAGE),
      userId,
      firstSeenAt: Date.now()
    })
  }

  return usageStore.get(userId)
}

// ========================================
// TRACK EVENT
// ========================================

export function trackUsage({
  userId,
  event,
  metadata = {}
}) {

  const usage = initializeUsage(userId)

  usage.lastSeenAt = Date.now()

  switch (event) {

    case "SESSION_START":
      usage.sessions++
      break

    case "PAGE_VIEW":
      usage.pageViews++
      break

    case "API_CALL":
      usage.apiCalls++
      break

    case "AI_REQUEST":
      usage.aiRequests++
      usage.aiTokensUsed += metadata.tokens || 0
      break

    case "LESSON_STARTED":
      usage.lessonsStarted++
      break

    case "LESSON_COMPLETED":
      usage.lessonsCompleted++
      break

    case "QUIZ_COMPLETED":
      usage.quizzesCompleted++
      break

    case "CERTIFICATE_GENERATED":
      usage.certificatesGenerated++
      break

    case "MENTOR_INTERACTION":
      usage.mentorInteractions++
      break

    case "FORUM_INTERACTION":
      usage.forumInteractions++
      break

    case "VIDEO_WATCHED":
      usage.videoMinutesWatched +=
        metadata.minutes || 0
      break

    case "ACTIVE_TIME":
      usage.totalActiveTime +=
        metadata.seconds || 0
      break

    case "ERROR":
      recordError(usage, metadata)
      break
  }

  updateFeatureUsage(usage, metadata.feature)

  updateEnvironment(usage, metadata)

  detectAnomalies(usage)

  generateInsights(usage)

  return usage
}

// ========================================
// FEATURE USAGE
// ========================================

function updateFeatureUsage(
  usage,
  feature
) {

  if (!feature) return

  usage.featureUsage[feature] =
    (usage.featureUsage[feature] || 0) + 1
}

// ========================================
// ENVIRONMENT TRACKING
// ========================================

function updateEnvironment(
  usage,
  metadata
) {

  incrementCounter(
    usage.deviceTypes,
    metadata.device
  )

  incrementCounter(
    usage.browsers,
    metadata.browser
  )

  incrementCounter(
    usage.countries,
    metadata.country
  )
}

// ========================================
// ERROR RECORDING
// ========================================

function recordError(
  usage,
  metadata
) {

  usage.errors.push({
    timestamp: Date.now(),
    code: metadata.code,
    message: metadata.message,
    severity:
      metadata.severity || "medium"
  })

  if (usage.errors.length > 100) {
    usage.errors.shift()
  }
}

// ========================================
// ANOMALY DETECTION
// ========================================

function detectAnomalies(usage) {

  usage.anomalies = []

  if (
    usage.aiRequests > 1000
  ) {
    usage.anomalies.push(
      "High AI request volume"
    )
  }

  if (
    usage.errors.length > 20
  ) {
    usage.anomalies.push(
      "Excessive error activity"
    )
  }

  if (
    usage.totalActiveTime > 43200
  ) {
    usage.anomalies.push(
      "Abnormally long activity"
    )
  }
}

// ========================================
// INSIGHTS ENGINE
// ========================================

function generateInsights(usage) {

  const insights = []

  if (
    usage.lessonsCompleted >
    usage.lessonsStarted * 0.8
  ) {
    insights.push(
      "Excellent completion behavior"
    )
  }

  if (
    usage.aiRequests > 100
  ) {
    insights.push(
      "Heavy AI user"
    )
  }

  if (
    usage.videoMinutesWatched > 500
  ) {
    insights.push(
      "Highly engaged learner"
    )
  }

  usage.insights = insights
}

// ========================================
// USER SUMMARY
// ========================================

export function getUsageSummary(
  userId
) {

  const usage =
    usageStore.get(userId)

  if (!usage) return null

  return {

    sessions:
      usage.sessions,

    activeHours:
      (
        usage.totalActiveTime / 3600
      ).toFixed(2),

    completionRate:
      calculateCompletionRate(
        usage
      ),

    aiRequests:
      usage.aiRequests,

    aiTokensUsed:
      usage.aiTokensUsed,

    mentorInteractions:
      usage.mentorInteractions,

    anomalies:
      usage.anomalies,

    insights:
      usage.insights
  }
}

// ========================================
// COMPLETION RATE
// ========================================

function calculateCompletionRate(
  usage
) {

  if (
    usage.lessonsStarted === 0
  ) {
    return 0
  }

  return (
    usage.lessonsCompleted /
    usage.lessonsStarted
  ) * 100
}

// ========================================
// HELPER
// ========================================

function incrementCounter(
  obj,
  key
) {

  if (!key) return

  obj[key] =
    (obj[key] || 0) + 1
}
