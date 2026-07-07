export class DeviceSignals {

  static computeRisk(input: any): number {
    let score = 0;

    if (!input.deviceId) score += 20;
    if (!input.userAgent) score += 15;

    if (input.userAgent?.includes("bot")) {
      score += 40;
    }

    if (!input.ip) score += 10;

    return Math.min(score, 100);
  }
}