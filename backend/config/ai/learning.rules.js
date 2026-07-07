
// ======================================
// 🧠 LEARNING RULES V3
// UniMentorAI - PEDAGOGICAL DECISION ENGINE
// ======================================

export const LEARNING_RULES = [

  // ======================================
  // 🧠 RULE 1 - FATIGUE PROTECTION
  // ======================================

  {
    id: "fatigue_protection",

    priority: 100,

    condition: (ctx) =>
      ctx.behavior?.fatigueScore > 70,

    action: (ctx) => ({

      difficultyAdjustment: -30,

      enableBreakSuggestion: true,

      mode: "light_learning",

      message:
        "Reduce cognitive load and simplify content"
    })
  },

  // ======================================
  // 🧠 RULE 2 - HIGH PERFORMANCE BOOST
  // ======================================

  {
    id: "high_performance_unlock",

    priority: 90,

    condition: (ctx) =>
      ctx.mastery?.masteryLevel > 85,

    action: () => ({

      unlockAdvancedContent: true,

      difficultyAdjustment: +25,

      mode: "challenge",

      message:
        "User ready for advanced concepts"
    })
  },

  // ======================================
  // 🧠 RULE 3 - ERROR REINFORCEMENT
  // ======================================

  {
    id: "mistake_reinforcement",

    priority: 95,

    condition: (ctx) =>
      ctx.mistakes?.recentErrors > 3,

    action: (ctx) => ({

      enableReinforcementMode: true,

      repeatConcepts: true,

      difficultyAdjustment: -20,

      message:
        "Reinforce weak concepts before progression"
    })
  },

  // ======================================
  // 🧠 RULE 4 - LOW ENGAGEMENT FIX
  // ======================================

  {
    id: "engagement_boost",

    priority: 85,

    condition: (ctx) =>
      ctx.behavior?.engagementScore < 40,

    action: () => ({

      switchToInteractiveMode: true,

      injectGamification: true,

      difficultyAdjustment: -10,

      message:
        "Boost engagement with interactive content"
    })
  },

  // ======================================
  // 🧠 RULE 5 - ADAPTIVE PATH OVERRIDE
  // ======================================

  {
    id: "adaptive_path_control",

    priority: 80,

    condition: (ctx) =>
      ctx.adaptivePath?.riskLevel > 60,

    action: () => ({

      recomputePath: true,

      prioritizeWeakTopics: true,

      message:
        "Recomputing optimal learning path"
    })
  },

  // ======================================
  // 🧠 RULE 6 - MASTERY PROGRESSION
  // ======================================

  {
    id: "mastery_progression",

    priority: 70,

    condition: (ctx) =>
      ctx.mastery?.masteryLevel > 60 &&
      ctx.behavior?.fatigueScore < 50,

    action: () => ({

      increaseDifficulty: true,

      introduceNewConcepts: true,

      message:
        "Progressing to next mastery level"
    })
  },

  // ======================================
  // 🧠 RULE 7 - DROPOUT PREVENTION
  // ======================================

  {
    id: "dropout_prevention",

    priority: 110,

    condition: (ctx) =>
      ctx.behavior?.dropoutRisk > 60,

    action: () => ({

      simplifyContent: true,

      switchToMentorMode: true,

      reduceDifficulty: true,

      message:
        "Preventing learner dropout"
    })
  },

  // ======================================
  // 🧠 RULE 8 - COGNITIVE OVERLOAD PROTECTION
  // ======================================

  {
    id: "cognitive_overload",

    priority: 120,

    condition: (ctx) =>
      ctx.analytics?.cognitiveLoad > 80,

    action: () => ({

      pauseNewContent: true,

      reinforcePreviousLessons: true,

      reduceDifficulty: true,

      message:
        "Prevent cognitive overload"
    })
  }
]

// ======================================
// 🧠 RULE ENGINE EXECUTOR
// ======================================

export function evaluateLearningRules(context) {

  // sort by priority (highest first)
  const sorted =
    [...LEARNING_RULES]
      .sort((a, b) => b.priority - a.priority)

  for (const rule of sorted) {

    if (rule.condition(context)) {

      return {

        ruleId: rule.id,

        result: rule.action(context)
      }
    }
  }

  return {
    ruleId: "default",

    result: {

      mode: "normal_learning",

      difficultyAdjustment: 0,

      message:
        "Continue standard adaptive learning"
    }
  }
}

// ======================================
// 🧠 RULE INSPECTOR (DEBUG TOOL)
// ======================================

export function debugRules(context) {

  return LEARNING_RULES.map(rule => ({

    id: rule.id,

    triggered: rule.condition(context)
  }))
}
