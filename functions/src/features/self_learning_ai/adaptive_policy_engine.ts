export class AdaptivePolicyEngine {

  static adjustThresholds(patterns: any) {

    const rules: any = {
      fraudThreshold: 80,
      trustThreshold: 60,
    };

    // 🧠 SI beaucoup de fraude → durcir sécurité
    if (patterns.fraudCluster > 50) {
      rules.fraudThreshold = 70;
      rules.trustThreshold = 65;
    }

    // 🤖 SI bot attack → renforcer zero trust
    if (patterns.botCluster > 30) {
      rules.fraudThreshold = 65;
    }

    // 🧱 SI spoofing → ultra strict
    if (patterns.deviceSpoofing > 20) {
      rules.fraudThreshold = 60;
      rules.trustThreshold = 70;
    }

    return rules;
  }
}