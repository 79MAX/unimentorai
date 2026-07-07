export class ResponseRules {

  static shouldBan(score: number): boolean {
    return score >= 85;
  }

  static shouldFlagDevice(score: number): boolean {
    return score >= 70;
  }

  static shouldRateLimit(score: number): boolean {
    return score >= 50;
  }

  static shouldEscalate(score: number): boolean {
    return score >= 90;
  }
}