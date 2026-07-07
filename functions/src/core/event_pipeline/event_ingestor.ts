import { securityEventPipeline } from "./security_event_pipeline";

export class EventIngestor {

  static push(event: any) {

    const normalized = {
      type: event.type || "UNKNOWN",
      severity: event.severity || "LOW",
      timestamp: Date.now(),
      payload: event,
    };

    securityEventPipeline.ingest(normalized);
  }
}