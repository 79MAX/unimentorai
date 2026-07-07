export class BehaviorAnalyzer {

  static analyze(input: any): number {
    let score = 0;

    // 🔥 Device missing
    if (!input.deviceId) score += 20;

    // 🔥 Suspicious user agent
    if (input.userAgent && input.userAgent.includes("bot")) {
      score += 30;
    }

    // 🔥 No userId (anonymous abuse risk)
    if (!input.userId) score += 15;

    // 🔥 Rapid requests pattern (placeholder logic)
    const randomSpike = Math.random() * 20;
    score += randomSpike;

    return Math.min(score, 100);
  }
}