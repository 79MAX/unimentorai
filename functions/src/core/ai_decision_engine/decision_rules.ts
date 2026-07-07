export class DecisionRules {

  static decide(score: number) {

    if (score >= 90) {
      return "AUTO_BAN";
    }

    if (score >= 75) {
      return "BLOCK";
    }

    if (score >= 50) {
      return "CHALLENGE";
    }

    if (score >= 20) {
      return "ESCALATE";
    }

    return "ALLOW";
  }
}