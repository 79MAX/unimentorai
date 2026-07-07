import { EntropyCalculator } from "./entropy_calculator";

export class DeviceProfiler {

  static analyze(deviceData: any) {

    const entropy = EntropyCalculator.calculate(deviceData);

    const isBot = entropy > 60;
    const isEmulator = entropy > 70;

    const trustScore = Math.max(0, 100 - entropy);
    const riskScore = entropy;

    return {
      fingerprint: this.generateFingerprint(deviceData),
      trustScore,
      riskScore,
      isBot,
      isEmulator,
    };
  }

  static generateFingerprint(data: any): string {

    const raw = [
      data.userAgent,
      data.screen?.width,
      data.screen?.height,
      data.language,
      data.timezone,
      data.platform,
    ].join("|");

    let hash = 0;

    for (let i = 0; i < raw.length; i++) {
      hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
    }

    return `fp_${hash}`;
  }
}