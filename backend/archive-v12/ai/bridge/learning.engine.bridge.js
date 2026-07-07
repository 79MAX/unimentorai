
// ======================================
// 🧠 LEARNING ENGINE BRIDGE V3
// UniMentorAI - COGNITIVE EVENT BUS
// ======================================

import { evaluateLearningRules } from "../rules/learning.rules.js"

import { learningOrchestrator } from "../orchestrator/learning.orchestrator.js"

// ======================================
// 🧠 CORE EVENT BUS
// ======================================

export class LearningEngineBridge {

  constructor({
    orchestrator,
    memoryEngine,
    profileEngine,
    masteryEngine,
    questionEngine,
    pathEngine,
    mentorEngine
  }) {

    this.orchestrator = orchestrator
    this.memoryEngine = memoryEngine
    this.profileEngine = profileEngine
    this.masteryEngine = masteryEngine
    this.questionEngine = questionEngine
    this.pathEngine = pathEngine
    this.mentorEngine = mentorEngine
  }

  // ======================================
  // 🚀 MAIN ENTRY POINT
  // ======================================

  async emit(event) {

    // ==================================
    // 🧠 1. NORMALIZE EVENT
    // ==================================

    const normalized =
      this.normalizeEvent(event)

    // ==================================
    // 🧠 2. STORE IN MEMORY
    // ==================================

    await this.memoryEngine.recordEvent(
      normalized.userId,
      normalized
    )

    // ==================================
    // 🧠 3. BUILD CONTEXT
    // ==================================

    const context =
      await this.buildContext(normalized.userId)

    // ==================================
    // 🧠 4. APPLY LEARNING RULES
    // ==================================

    const ruleResult =
      evaluateLearningRules(context)

    // ==================================
    // 🧠 5. EXECUTE RULE ACTIONS
    // ==================================

    const executionResult =
      await this.executeRules(
        ruleResult,
        context
      )

    // ==================================
    // 🧠 6. UPDATE SYSTEMS
    // ==================================

    await this.syncEngines(
      normalized.userId,
      executionResult
    )

    // ==================================
    // 🧠 7. RETURN STATE
    // ==================================

    return {

      event: normalized,

      rule: ruleResult.ruleId,

      execution: executionResult
    }
  }

  // ======================================
  // 🧠 EVENT NORMALIZATION
  // ======================================

  normalizeEvent(event) {

    return {

      userId: event.userId,

      type: event.type,

      timestamp: Date.now(),

      topic: event.topic || null,

      correct: event.correct || false,

      timeSpent: event.timeSpent || 0,

      metadata: event.metadata || {}
    }
  }

  // ======================================
  // 🧠 CONTEXT BUILDER
  // ======================================

  async buildContext(userId) {

    const [

      memory,

      profile,

      mastery

    ] = await Promise.all([

      this.memoryEngine.getContext(userId),

      this.profileEngine.buildProfile(userId),

      this.masteryEngine.getMastery(userId)

    ])

    return {

      memory,

      learnerProfile: profile,

      mastery,

      behavior: profile.behavior || {},

      analytics: memory.combinedContext
    }
  }

  // ======================================
  // 🧠 RULE EXECUTION ENGINE
  // ======================================

  async executeRules(ruleResult, context) {

    const action = ruleResult.result

    // ----------------------------------
    // PATH ENGINE
    // ----------------------------------

    if (action.recomputePath) {

      await this.pathEngine.recompute(context)
    }

    // ----------------------------------
    // QUESTION ENGINE
    // ----------------------------------

    if (action.enableReinforcementMode) {

      this.questionEngine.setMode("reinforcement")
    }

    if (action.increaseDifficulty) {

      this.questionEngine.adjustDifficulty(+10)
    }

    if (action.reduceDifficulty) {

      this.questionEngine.adjustDifficulty(-10)
    }

    // ----------------------------------
    // MENTOR ENGINE
    // ----------------------------------

    if (action.switchToMentorMode) {

      this.mentorEngine.activate({
        mode: "supportive",
        reason: ruleResult.ruleId
      })
    }

    // ----------------------------------
    // MASTER UPDATE
    // ----------------------------------

    await this.masteryEngine.update(context)

    return action
  }

  // ======================================
  // 🧠 ENGINE SYNCHRONIZATION
  // ======================================

  async syncEngines(userId, execution) {

    await this.memoryEngine.recordEvent(userId, {
      type: "SYSTEM_UPDATE",
      execution
    })

    await this.profileEngine.buildProfile(userId)
  }
}
