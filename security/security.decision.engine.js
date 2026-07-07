import { securityObservability } from "./security.observability.js";
import { quarantineService } from "./security.enforcement.layer.js";
import { securityIntelligence } from "./security.intelligence.core.js";

/**
 * ==================================================
 * SECURITY DECISION ENGINE V2
 * UniMentorAI Core Security Brain
 * ==================================================
 */

class SecurityDecisionEngine {
  /**
   * ==================================================
   * MAIN ENTRY POINT
   * ==================================================
   */
  async evaluate(context) {
    const enrichedContext = await this._enrichContext(context);

    const riskProfile = await this._buildRiskProfile(enrichedContext);

    const decision = this._decide(riskProfile);

    await this._execute(decision, enrichedContext);

    await this._log(enrichedContext, riskProfile, decision);

    return {
      risk: riskProfile.score,
      level: riskProfile.level,
      decision,
    };
  }

  /**
   * ==================================================
   * CONTEXT ENRICHMENT LAYER
   * ==================================================
   */
  async _enrichContext(context) {
    const { userId, ip, action } = context;

    const intelligenceSignals =
      await securityIntelligence.getSignals({
        userId,
        ip,
        action,
      });

    return {
      ...context,
      intelligenceSignals,
      timestamp: Date.now(),
    };
  }

  /**
   * ==================================================
   * RISK PROFILE BUILDER
   * ==================================================
   */
  async _buildRiskProfile(context) {
    let score = 0;

    const signals = context.intelligenceSignals || {};

    // Base signals
    score += signals.ipReputation || 0;
    score += signals.behaviorAnomaly || 0;
    score += signals.deviceRisk || 0;

    // Action-based risk
    if (this._isHighRiskAction(context.action)) {
      score += 25;
    }

    // Velocity / spam detection
    if (signals.requestBurst) {
      score += 30;
    }

    const normalizedScore = Math.min(score, 100);

    return {
      score: normalizedScore,
      level: this._getRiskLevel(normalizedScore),
      signals,
    };
  }

  /**
   * ==================================================
   * DECISION ENGINE
   * ==================================================
   */
  _decide(riskProfile) {
    const { score, level } = riskProfile;

    if (score >= 85) {
      return {
        action: "BLOCK",
        reason: "Critical risk threshold exceeded",
      };
    }

    if (score >= 65) {
      return {
        action: "QUARANTINE",
        reason: "High risk behavior detected",
      };
    }

    if (score >= 45) {
      return {
        action: "THROTTLE",
        reason: "Moderate anomaly detected",
      };
    }

    if (score >= 25) {
      return {
        action: "CHALLENGE",
        reason: "Verification required",
      };
    }

    return {
      action: "ALLOW",
      reason: "Clean behavior",
    };
  }

  /**
   * ==================================================
   * EXECUTION LAYER
   * ==================================================
   */
  async _execute(decision, context) {
    const { userId, ip } = context;

    switch (decision.action) {
      case "BLOCK":
        await quarantineService.blockUser(userId, {
          reason: decision.reason,
          ip,
        });
        break;

      case "QUARANTINE":
        await quarantineService.quarantineUser(userId, {
          reason: decision.reason,
          ip,
        });
        break;

      case "THROTTLE":
        await quarantineService.throttleUser(userId);
        break;

      case "CHALLENGE":
        // future: MFA / OTP / captcha trigger
        break;

      case "ALLOW":
      default:
        break;
    }
  }

  /**
   * ==================================================
   * OBSERVABILITY / AUDIT LOGGING
   * ==================================================
   */
  async _log(context, riskProfile, decision) {
    await securityObservability.log({
      userId: context.userId,
      ip: context.ip,
      action: context.action,
      riskScore: riskProfile.score,
      riskLevel: riskProfile.level,
      decision: decision.action,
      signals: riskProfile.signals,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * ==================================================
   * HELPERS
   * ==================================================
   */
  _isHighRiskAction(action) {
    const risky = ["payment", "withdraw", "refund", "admin_access"];
    return risky.includes(action);
  }

  _getRiskLevel(score) {
    if (score >= 85) return "CRITICAL";
    if (score >= 65) return "HIGH";
    if (score >= 45) return "MEDIUM";
    if (score >= 25) return "LOW";
    return "SAFE";
  }
}

export const securityDecisionEngine =
  new SecurityDecisionEngine();
