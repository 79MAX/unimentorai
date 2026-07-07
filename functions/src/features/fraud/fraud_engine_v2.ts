import { FraudInput, FraudResult } from "./fraud_types";
import { computeFraudLevel } from "./fraud_score";
import { FraudRules } from "./fraud_rules";
import { AiFraudAnalyzer } from "./ai_fraud_analyzer";

type Signal = { score: number; reasons: string[] };

type SignalsMap = {
  hash: Signal;
  time: Signal;
  device: Signal;
  userAgent: Signal;
  repeat: Signal;
};

export class FraudEngineV2 {

  // ─────────────────────────────────────────────
  // 🚀 MAIN ENTRY (OPTIMIZED FLOW)
  // ─────────────────────────────────────────────

  static async analyze(input: FraudInput): Promise<FraudResult> {

    // 🧠 SAFE INIT (minimal allocation)
    const reasons: string[] = [];

    // 🔐 FAST FAIL (critical optimization)
    if (!input?.certificateId || !input?.qrHash) {
      return this.result(100, ["Missing required fields"], true);
    }

    const now = Date.now();
    const timeDiff = now - (input.timestamp ?? now);

    // ⚡ SIGNAL ENGINE (single pass creation)
    const signals = this.buildSignals(input, timeDiff);

    // 🧠 WEIGHT MODEL (constant reference = faster + cleaner)
    const W = FraudEngineV2.WEIGHTS;

    let score =
      signals.hash.score * W.hash +
      signals.time.score * W.time +
      signals.device.score * W.device +
      signals.userAgent.score * W.userAgent +
      signals.repeat.score * W.repeat;

    // 🧹 reasons flatten (faster than Object.values)
    reasons.push(
      ...signals.hash.reasons,
      ...signals.time.reasons,
      ...signals.device.reasons,
      ...signals.userAgent.reasons,
      ...signals.repeat.reasons
    );

    // 🤖 AI LAYER (isolated impact)
    const aiScore = await AiFraudAnalyzer.analyze({
      userId: input.userId,
      deviceId: input.deviceId,
      userAgent: input.userAgent,
      timestamp: now,
    });

    if (aiScore > 0) {
      score += aiScore;

      if (aiScore >= 50) {
        reasons.push("AI behavioral anomaly detected");
      }
    }

    // 📊 FINALIZATION
    const finalScore = this.clamp(score);
    const isFraud = finalScore >= 80;

    return {
      isFraud,
      score: finalScore,
      level: computeFraudLevel(finalScore),
      reasons: reasons.length ? reasons : ["No anomalies detected"],
    };
  }

  // ─────────────────────────────────────────────
  // ⚙️ SIGNAL BUILDER (OPTIMIZED)
  // ─────────────────────────────────────────────

  private static buildSignals(input: FraudInput, timeDiff: number): SignalsMap {

    return {
      hash: this.hashSignal(input.qrHash),
      time: this.timeSignal(timeDiff),
      device: this.deviceSignal(input.deviceId),
      userAgent: this.userAgentSignal(input.userAgent),
      repeat: this.repeatSignal((input as any)?.failedAttempts),
    };
  }

  // ─────────────────────────────────────────────
  // 🧠 SIGNALS (LIGHT + FAST)
  // ─────────────────────────────────────────────

  private static hashSignal(qrHash?: string): Signal {
    if (!qrHash) return S(30, "Missing QR hash");

    if (qrHash.length < FraudRules.MIN_HASH_LENGTH) {
      return S(25, "QR hash too short (tampering risk)");
    }

    return S(0);
  }

  private static timeSignal(diff: number): Signal {
    if (diff < 1500) {
      return S(20, "Bot-like fast request detected");
    }

    if (diff > 1000 * 60 * 60 * 24 * 365 * 5) {
      return S(15, "Replay or outdated request detected");
    }

    return S(0);
  }

  private static deviceSignal(deviceId?: string): Signal {
    const d = (deviceId || "").toLowerCase();

    if (FraudRules.EMULATOR_KEYWORDS.some(k => d.includes(k))) {
      return S(40, "Emulator or spoofed device detected");
    }

    return S(0);
  }

  private static userAgentSignal(userAgent?: string): Signal {
    if (!userAgent) return S(10, "Missing user-agent");

    if (userAgent.toLowerCase().includes("bot")) {
      return S(50, "Bot user-agent detected");
    }

    return S(0);
  }

  private static repeatSignal(failed?: number): Signal {
    if (failed && failed > 3) {
      return S(30, "Repeated failed attempts detected");
    }

    return S(0);
  }

  // ─────────────────────────────────────────────
  // 🧱 UTILITIES (HIGH PERFORMANCE)
  // ─────────────────────────────────────────────

  private static clamp(n: number): number {
    return n > 100 ? 100 : n < 0 ? 0 : Math.round(n);
  }

  private static result(
    score: number,
    reasons: string[],
    isFraud: boolean
  ): FraudResult {
    const s = this.clamp(score);

    return {
      isFraud,
      score: s,
      level: computeFraudLevel(s),
      reasons,
    };
  }

  // ⚡ CONSTANT WEIGHTS (no re-allocation)
  private static WEIGHTS = {
    hash: 1.0,
    time: 0.9,
    device: 1.3,
    userAgent: 1.4,
    repeat: 1.2,
  };
}

// ─────────────────────────────────────────────
// 🧩 SIGNAL FACTORY (micro-optimization helper)
// ─────────────────────────────────────────────

function S(score: number, reason?: string): Signal {
  return {
    score,
    reasons: reason ? [reason] : [],
  };
}