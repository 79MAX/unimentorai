import { LogCollector } from "./log_collector";
import { MetricsCollector } from "./metrics_collector";
import { TraceCollector } from "./trace_collector";

export class ObservabilityEngine {

  static recordSecurityEvent(event: any) {

    // 🧾 LOG
    LogCollector.add({
      type: "SECURITY",
      message: event.type,
      timestamp: Date.now(),
      metadata: event,
    });

    // 📊 METRICS
    MetricsCollector.increment("security_events_total");

    if (event.severity === "CRITICAL") {
      MetricsCollector.increment("critical_alerts");
    }

    // 🧠 TRACE
    if (event.traceId) {
      TraceCollector.addEvent(event.traceId, event.type);
    }
  }

  static getSnapshot() {
    return {
      logs: LogCollector.getAll(),
      metrics: MetricsCollector.getAll(),
    };
  }
}