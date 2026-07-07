export class AiFraudAnalyzer {

  static analyze(input: any): number {
    let risk = 0;

    // Bot detection
    if (input.userAgent?.toLowerCase().includes("bot")) {
      risk += 50;
    }

    // Emulator detection
    if (input.deviceId?.includes("emulator")) {
      risk += 60;
    }

    // Fake timing attack (too fast scan)
    if (Date.now() - input.timestamp < 1500) {
      risk += 25;
    }

    // Suspicious repeated user
    if (input.failedAttempts && input.failedAttempts > 3) {
      risk += 40;
    }

    return Math.min(risk, 100);
  }
}