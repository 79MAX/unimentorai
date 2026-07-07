/**
 * VIDEO TUTOR DECISION ROUTER - UniMentorAI
 * Final decision engine for routing AI outcomes
 */

class VideoTutorDecisionRouter {
  constructor({
    eventBus,
    telemetry,
    debugTracer,
    monetizationEngine,
    learningEngine,
    responseEngine
  }) {
    this.eventBus = eventBus;
    this.telemetry = telemetry;
    this.debugTracer = debugTracer;

    this.monetizationEngine = monetizationEngine;
    this.learningEngine = learningEngine;
    this.responseEngine = responseEngine;
  }

  /**
   * 🎯 MAIN DECISION ENTRY
   */
  async route(context, workflowResult, traceId) {
    const decision = this._makeDecision(context, workflowResult);

    this.debugTracer.addStep(traceId, "decision_router", decision);

    switch (decision.action) {

      // =========================
      // 🎓 LEARNING PATH
      // =========================
      case "learning":
        return await this._handleLearning(context, decision);

      // =========================
      // 💬 RESPONSE ONLY
      // =========================
      case "response":
        return await this._handleResponse(context, decision);

      // =========================
      // 💰 MONETIZATION
      // =========================
      case "monetization":
        return await this._handleMonetization(context, decision);

      // =========================
      // 🆘 SUPPORT MODE
      // =========================
      case "support":
        return await this._handleSupport(context, decision);

      // =========================
      // ⚠️ ESCALATION
      // =========================
      case "escalation":
        return await this._handleEscalation(context, decision);

      default:
        return await this._handleFallback(context, decision);
    }
  }

  /**
   * 🧠 CORE DECISION ENGINE
   */
  _makeDecision(context, workflowResult) {
    const risk = context.derived.riskLevel;
    const monetization = context.derived.monetizationReadiness;
    const engagement = context.derived.engagementLevel;
    const mode = context.derived.learningMode;

    // =========================
    // ⚠️ HIGH RISK OVERRIDE
    // =========================
    if (risk === "high") {
      return {
        action: "support",
        reason: "high_risk_user"
      };
    }

    // =========================
    // 💰 MONETIZATION LOGIC
    // =========================
    if (monetization === "high" && engagement === "high") {
      return {
        action: "monetization",
        reason: "high_value_user"
      };
    }

    // =========================
    // 🎓 LEARNING PRIORITY
    // =========================
    if (mode === "accelerated" || mode === "support_mode") {
      return {
        action: "learning",
        reason: "adaptive_learning_mode"
      };
    }

    // =========================
    // 🧠 DEFAULT FLOW
    // =========================
    if (workflowResult?.output?.generate) {
      return {
        action: "response",
        reason: "standard_response_flow"
      };
    }

    // =========================
    // ⚠️ FALLBACK ESCALATION
    // =========================
    return {
      action: "escalation",
      reason: "uncertain_state"
    };
  }

  /**
   * 🎓 LEARNING HANDLER
   */
  async _handleLearning(context, decision) {
    this.telemetry.collect({
      type: "decision.learning",
      userId: context.userId
    });

    return this.learningEngine.process(context);
  }

  /**
   * 💬 RESPONSE HANDLER
   */
  async _handleResponse(context, decision) {
    this.telemetry.collect({
      type: "decision.response",
      userId: context.userId
    });

    return this.responseEngine.generate(context);
  }

  /**
   * 💰 MONETIZATION HANDLER
   */
  async _handleMonetization(context, decision) {
    this.telemetry.collect({
      type: "decision.monetization",
      userId: context.userId
    });

    return this.monetizationEngine.process(context);
  }

  /**
   * 🆘 SUPPORT HANDLER
   */
  async _handleSupport(context, decision) {
    this.eventBus.emit("user.support_mode", {
      userId: context.userId
    });

    return {
      type: "support",
      message: "We are adapting your learning experience"
    };
  }

  /**
   * ⚠️ ESCALATION HANDLER
   */
  async _handleEscalation(context, decision) {
    this.eventBus.emit("system.escalation", {
      userId: context.userId
    });

    return {
      type: "escalation",
      message: "System needs review"
    };
  }

  /**
   * 🔁 FALLBACK HANDLER
   */
  async _handleFallback(context, decision) {
    return {
      type: "fallback",
      message: "Default response triggered"
    };
  }
}

module.exports = VideoTutorDecisionRouter;
