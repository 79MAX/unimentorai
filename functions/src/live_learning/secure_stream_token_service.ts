import * as crypto from "crypto";

export class SecureStreamTokenService {

  static generate(
    sessionId: string,
    userId: string
  ): string {

    return crypto
      .createHmac("sha256", process.env.STREAM_SECRET || "fallback_secret")
      .update(`${sessionId}:${userId}:${Date.now()}`)
      .digest("hex");
  }
}