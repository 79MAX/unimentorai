
// ======================================
// 🧠 AI CONFIG V3
// UniMentorAI - GLOBAL INTELLIGENCE CONTROL PLANE
// ======================================

export const AI_CONFIG = {

  // ======================================
  // 🧠 GLOBAL AI BEHAVIOR
  // ======================================

  aiMode: "adaptive", 
  // adaptive | strict | creative | mentor

  intelligenceLevel: "high",
  // low | medium | high | expert

  responseStyle: "socratic",
  // direct | explanatory | socratic | mentor

  // ======================================
  // 🎯 LEARNING BEHAVIOR CONTROL
  // ======================================

  learning: {

    adaptationSpeed: 0.7,
    // how fast system adapts (0-1)

    difficultyBias: 0.2,
    // + = harder, - = easier

    masteryThreshold: 80,

    allowSkipEasyContent: true,

    enforceRevisionModeAt: 50,

    reinforcementRate: 0.3
  },

  // ======================================
  // 🧠 QUESTION ENGINE CONTROL
  // ======================================

  questionEngine: {

    frequency: "medium",
    // low | medium | high | adaptive

    difficultyScaling: true,

    maxQuestionsPerSession: 20,

    adaptiveQuestioning: true,

    reinforceMistakes: true,

    socraticMode: true
  },

  // ======================================
  // 🧭 ADAPTIVE PATH CONTROL
  // ======================================

  adaptivePath: {

    enabled: true,

    recomputeInterval: 5000,

    allowDynamicReordering: true,

    fatigueAwareRouting: true,

    engagementOptimization: true,

    dropoutPrevention: true
  },

  // ======================================
  // 🧠 MASTERY ENGINE CONTROL
  // ======================================

  mastery: {

    weightErrorHistory: 0.4,

    weightRecentPerformance: 0.6,

    decayFactor: 0.95,

    levelingCurve: "logarithmic",

    unlockThresholds: {
      basic: 40,
      intermediate: 70,
      advanced: 85,
      expert: 95
    }
  },

  // ======================================
  // 🧠 SESSION MEMORY CONTROL
  // ======================================

  sessionMemory: {

    maxHistory: 50,

    retentionStrategy: "sliding-window",

    importanceWeighting: true,

    errorMemoryBoost: 1.5
  },

  // ======================================
  // 🧠 MENTOR MODE CONTROL
  // ======================================

  mentor: {

    enabled: true,

    tone: "supportive",

    interventionThreshold: 60,
    // triggers mentor intervention

    proactiveHints: true,

    emotionalAwareness: true
  },

  // ======================================
  // ⚡ PERFORMANCE CONTROL
  // ======================================

  performance: {

    caching: true,

    debounceRecompute: 3000,

    batchEvents: true,

    offlineMode: true,

    syncInterval: 5000
  },

  // ======================================
  // 🔐 SAFETY & PEDAGOGY
  // ======================================

  safety: {

    preventOverload: true,

    maxCognitiveLoad: 75,

    enforceBreakSuggestions: true,

    antiFrustrationMode: true
  },

  // ======================================
  // 🎨 UX INTELLIGENCE
  // ======================================

  ux: {

    showDifficultyMeter: true,

    showMasteryInsights: true,

    showAIRecommendations: true,

    simplifyWhenFatigued: true
  },

  // ======================================
  // 🧠 EXPERIMENTAL FEATURES
  // ======================================

  experimental: {

    realTimePathMutation: true,

    liveQuestionRewriting: true,

    predictiveDropoutPrevention: true,

    aiSelfEvaluationLoop: true
  }
}

// ======================================
// 🧠 HELPER ACCESSORS
// ======================================

export const getAIConfig = () => AI_CONFIG

export const isFeatureEnabled = (path) => {

  const keys = path.split(".")

  let value = AI_CONFIG

  for (const k of keys) {
    value = value?.[k]
  }

  return Boolean(value)
}
