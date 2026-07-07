/**
 * 🔗 DATABASE INDEX STRATEGY — UNIMENTORAI (PRODUCTION READY)
 * Optimized for Firebase / Mongo / AWS DynamoDB
 */

export const DatabaseIndexes = {

  // 👤 USERS INDEXES
  users: {
    primary: ["id"],

    search: [
      "email",
      "role",
      "country",
      "language"
    ],

    analytics: [
      "role",
      "subscription.status",
      "createdAt"
    ],

    enterprise: [
      "organizationId",
      "role"
    ]
  },

  // 📚 COURSES INDEXES
  courses: {
    primary: ["id"],

    search: [
      "title",
      "level",
      "language",
      "tags"
    ],

    filtering: [
      "level",
      "language",
      "isPublished",
      "category"
    ],

    enterprise: [
      "organizationId",
      "visibility"
    ],

    analytics: [
      "createdAt",
      "stats.enrollments"
    ]
  },

  // 💰 PAYMENTS INDEXES
  payments: {
    primary: ["id"],

    search: [
      "userId",
      "reference",
      "provider"
    ],

    financial: [
      "status",
      "plan",
      "currency"
    ],

    analytics: [
      "createdAt",
      "amount",
      "status"
    ],

    enterprise: [
      "organizationId",
      "billingType"
    ]
  },

  // 📈 PROGRESS INDEXES
  progress: {
    primary: [
      "userId",
      "courseId"
    ],

    tracking: [
      "userId",
      "progressPercent"
    ],

    analytics: [
      "completionStatus",
      "updatedAt"
    ],

    enterprise: [
      "organizationId"
    ]
  },

  // 🤖 AI LOGS INDEXES
  ai_logs: {
    primary: ["id"],

    search: [
      "userId",
      "intent",
      "language"
    ],

    ai_cost: [
      "aiProvider",
      "model",
      "createdAt"
    ],

    analytics: [
      "tokensUsed",
      "usage.estimatedCost",
      "intent"
    ],

    learning: [
      "learningContext.level",
      "learningContext.helpedUser"
    ]
  }
};

---

# ⚙️ BONUS — QUERY OPTIMIZATION LAYER

```javascript id="index2"
/**
 * ⚡ QUERY HELPER — FAST ACCESS LAYER
 */

export const QueryOptimizer = {

  // 🔍 USER SEARCH
  userByEmail: (email) => ({
    field: "email",
    operator: "==",
    value: email
  }),

  // 📚 COURSES FILTER
  coursesByLevel: (level) => ({
    field: "level",
    operator: "==",
    value: level
  }),

  coursesByLanguage: (lang) => ({
    field: "language",
    operator: "==",
    value: lang
  }),

  // 💰 PAYMENTS
  paymentsByUser: (userId) => ({
    field: "userId",
    operator: "==",
    value: userId
  }),

  paymentsByStatus: (status) => ({
    field: "status",
    operator: "==",
    value: status
  }),

  // 📈 PROGRESS
  progressByUser: (userId) => ({
    field: "userId",
    operator: "==",
    value: userId
  }),

  progressByCourse: (courseId) => ({
    field: "courseId",
    operator: "==",
    value: courseId
  }),

  // 🤖 AI LOGS
  aiLogsByUser: (userId) => ({
    field: "userId",
    operator: "==",
    value: userId
  }),

  aiLogsByIntent: (intent) => ({
    field: "intent",
    operator: "==",
    value: intent
  })
};

