export class FakeEventGenerator {

  static generateAttackEvent(scenario: any) {

    const baseScore =
      scenario.intensity === "CRITICAL" ? 95 :
      scenario.intensity === "HIGH" ? 80 : 60;

    return {
      type: "SIMULATED_ATTACK",
      attackType: scenario.type,
      score: baseScore + Math.random() * 5,
      userId: `bot_${Math.floor(Math.random() * 100000)}`,
      deviceId: `device_fake_${Date.now()}`,
      certificateId: null,
      timestamp: Date.now(),
      metadata: {
        simulated: true,
        scenario,
      },
    };
  }
}