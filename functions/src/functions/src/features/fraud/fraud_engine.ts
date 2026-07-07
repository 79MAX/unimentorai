import { FraudInput, FraudResult } from "./fraud_types";
import { FraudRules } from "./fraud_rules";
import { AiFraudAnalyzer } from "./ai_fraud_analyzer";
import { computeLevel } from "./fraud_score";

export class FraudEngineV2 {

  static async analyze(input: FraudInput): Promise<FraudResult> {

    let score = 0;
    const reasons: string[] = [];

    // 1. Missing data
    if (!input.certificateId || !input.qrHash) {
      return {
        isFraud: true,
        score: 100,
        level: "FRAUD",
        reasons: ["Missing certificate or QR hash"]
      };
    }

    // 2. Hash integrity
    if (input.qrHash.length < FraudRules.MIN_HASH_LENGTH) {
      score += 40;
      reasons.push("Invalid QR hash length");
    }

    // 3. Time anomaly
    if (Date.now() - input.timestamp < FraudRules.SUSPICIOUS_TIME_WINDOW_MS) {
      score += 25;
      reasons.push("Suspicious fast verification request");
    }

    // 4. AI analysis layer
    const aiRisk = await AiFraudAnalyzer.analyze(input);
    score += aiRisk;

    // 5. Demo/test detection
    if (input.userId.includes("test") || input.certificateId.includes("demo")) {
      score += 50;
      reasons.push("Test environment detected");
    }

    const finalScore = Math.min(score, 100);
    const level = computeLevel(finalScore);

    return {
      isFraud: finalScore >= 80,
      score: finalScore,
      level,
      reasons
    };
  }
}