import * as crypto from "crypto";

export class FingerprintHash {

  static generate(input: any): string {

    const raw = JSON.stringify({
      deviceId: input.deviceId || "",
      userAgent: input.userAgent || "",
      ip: input.ip || "",
      language: input.language || "",
      timezone: input.timezone || "",
    });

    return crypto
      .createHash("sha256")
      .update(raw)
      .digest("hex");
  }
}