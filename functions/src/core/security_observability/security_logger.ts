import { LogCollector } from "./log_collector";
import { MetricsCollector } from "./metrics_collector";

export class SecurityLogger {

  static log(event: any) {

    LogCollector.add({
      type: "SECURITY",
      message: event.type,
      timestamp: Date.now(),
      metadata: event,
    });

    MetricsCollector.increment("security_events");
  }
}