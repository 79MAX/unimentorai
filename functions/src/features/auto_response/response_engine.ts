import { ResponseRules } from "./response_rules";
import { ResponseActions } from "./response_actions";
import { SecurityAction } from "./response_types";

export class AutoResponseEngine {

  static async process(event: any) {

    const score = event.score || 0;

    // 🚨 NO ACTION NEEDED
    if (score < 50) return;

    // 📊 DECISION TREE
    if (ResponseRules.shouldBan(score)) {

      await ResponseActions.banUser(
        event.userId,
        "Auto-ban triggered by AI Security Engine"
      );

      await ResponseActions.logAction({
        type: "BAN_USER",
        userId: event.userId,
        deviceId: event.deviceId,
        reason: "High fraud score",
        severity: "CRITICAL",
        timestamp: Date.now(),
      });

      return;
    }

    if (ResponseRules.shouldFlagDevice(score)) {

      await ResponseActions.flagDevice(
        event.deviceId,
        "Suspicious behavior detected"
      );
    }

    if (ResponseRules.shouldRateLimit(score)) {

      await ResponseActions.rateLimit(event.userId);
    }

    if (ResponseRules.shouldEscalate(score)) {

      console.log("🚨 ESCALATION TRIGGERED TO SOC DASHBOARD");
    }

    // 📡 ALWAYS LOG EVENT
    await ResponseActions.logAction({
      type: "LOG_ONLY",
      userId: event.userId,
      deviceId: event.deviceId,
      reason: "Security evaluation completed",
      severity: "LOW",
      timestamp: Date.now(),
    });
  }
}