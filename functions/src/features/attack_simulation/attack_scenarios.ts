export class AttackScenarios {

  static BOT_ATTACK = {
    type: "BOT_ATTACK",
    intensity: "HIGH",
    frequency: 50,
  };

  static FRAUD_BURST = {
    type: "FRAUD_BURST",
    intensity: "CRITICAL",
    frequency: 100,
  };

  static DEVICE_SPOOFING = {
    type: "DEVICE_SPOOFING",
    intensity: "MEDIUM",
    frequency: 30,
  };

  static COORDINATED_ATTACK = {
    type: "COORDINATED_ATTACK",
    intensity: "CRITICAL",
    frequency: 200,
  };
}