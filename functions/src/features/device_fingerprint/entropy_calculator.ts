export class EntropyCalculator {

  static calculate(data: any): number {

    let entropy = 0;

    // 📱 DEVICE SIGNALS
    if (!data.userAgent) entropy += 20;

    if (data.userAgent?.toLowerCase().includes("bot")) {
      entropy += 40;
    }

    // 🧠 SCREEN / DEVICE VARIATION
    if (!data.screen || !data.screen.width) entropy += 10;

    // ⚡ TIME PATTERN ANOMALY
    if (data.sessionDuration < 1000) entropy += 25;

    // 🔥 EMULATOR PATTERN
    if (data.deviceModel?.includes("emulator")) {
      entropy += 50;
    }

    return Math.min(100, entropy);
  }
}