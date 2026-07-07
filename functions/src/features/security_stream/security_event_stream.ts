import { EventEmitter } from "./event_emitter";
import { SecurityEvent } from "./event_types";

type EventInput = {
  userId?: string;
  deviceId?: string;
  certificateId?: string;
  score?: number;
  metadata?: any;
};

export class SecurityEventStream {

  // ─────────────────────────────────────────────
  // 🧠 CORE EVENT BUILDER (SINGLE SOURCE OF TRUTH)
  // ─────────────────────────────────────────────

  private static buildEvent(
    type: SecurityEvent["type"],
    severity: SecurityEvent["severity"],
    message: string,
    data: EventInput
  ): SecurityEvent {

    return {
      type,
      severity,
      userId: data.userId,
      deviceId: data.deviceId,
      certificateId: data.certificateId,
      score: data.score,
      message,
      timestamp: Date.now(),
      metadata: data.metadata ?? data,
    };
  }

  // ─────────────────────────────────────────────
  // 🚨 FRAUD DETECTED
  // ─────────────────────────────────────────────

  static async fraudDetected(data: EventInput) {

    const score = data.score ?? 0;

    const event = this.buildEvent(
      "FRAUD_DETECTED",
      score >= 90 ? "CRITICAL" : "HIGH",
      "Fraud detected by AI engine",
      data
    );

    return EventEmitter.emit(event);
  }

  // ─────────────────────────────────────────────
  // ✅ VERIFICATION SUCCESS
  // ─────────────────────────────────────────────

  static async verificationSuccess(data: EventInput) {

    const event = this.buildEvent(
      "VERIFICATION_SUCCESS",
      "LOW",
      "Certificate verified successfully",
      data
    );

    return EventEmitter.emit(event);
  }

  // ─────────────────────────────────────────────
  // 🚫 AUTO BAN EVENT
  // ─────────────────────────────────────────────

  static async autoBan(data: EventInput) {

    const event = this.buildEvent(
      "AUTO_BAN",
      "CRITICAL",
      "Automatic ban triggered by system",
      data
    );

    return EventEmitter.emit(event);
  }

  // ─────────────────────────────────────────────
  // ⚡ GENERIC EXTENSION (FUTURE-PROOF)
  // ─────────────────────────────────────────────

  static async emitCustom(
    type: SecurityEvent["type"],
    severity: SecurityEvent["severity"],
    message: string,
    data: EventInput
  ) {
    const event = this.buildEvent(type, severity, message, data);
    return EventEmitter.emit(event);
  }
}