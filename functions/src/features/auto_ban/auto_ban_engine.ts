import { BanRules } from "./ban_rules";
import { BanStore } from "./ban_store";
import { BanDecision, BanLevel } from "./ban_types";

export class AutoBanEngine {

  static async evaluate(entityId: string, riskScore: number, reasons: string[]): Promise<BanDecision> {

    let level: BanLevel = "NONE";
    let isBanned = false;
    let expiresAt: number | undefined;

    // ⚡ SOFT BAN
    if (riskScore >= BanRules.SOFT_BAN_THRESHOLD) {
      level = "SOFT";
      isBanned = true;
      expiresAt = Date.now() + BanRules.SOFT_BAN_DURATION;
    }

    // 🚨 HARD BAN
    if (riskScore >= BanRules.HARD_BAN_THRESHOLD) {
      level = "HARD";
      expiresAt = Date.now() + BanRules.HARD_BAN_DURATION;
    }

    // 🔥 PERMANENT BAN
    if (riskScore >= BanRules.PERMANENT_THRESHOLD) {
      level = "PERMANENT";
      expiresAt = undefined;
    }

    const decision: BanDecision = {
      isBanned,
      level,
      reason: reasons,
      expiresAt,
    };

    // 🗄️ STORE DECISION
    if (isBanned) {
      await BanStore.ban(entityId, decision);
    }

    return decision;
  }
}