export class TraceCollector {

  private static traces: any[] = [];

  static start(traceId: string) {
    this.traces.push({
      traceId,
      start: Date.now(),
      events: []
    });
  }

  static addEvent(traceId: string, event: string) {
    const trace = this.traces.find(t => t.traceId === traceId);
    if (trace) {
      trace.events.push({
        event,
        timestamp: Date.now()
      });
    }
  }

  static end(traceId: string) {
    const trace = this.traces.find(t => t.traceId === traceId);

    if (trace) {
      trace.duration = Date.now() - trace.start;
    }
  }
}