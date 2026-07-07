export class PatternAnalyzer {

  static detectPatterns(events: any[]) {

    let fraudCluster = 0;
    let botCluster = 0;
    let deviceSpoofing = 0;

    for (const e of events) {

      if (e.score >= 80) fraudCluster++;

      if (e.userAgent?.includes("bot")) botCluster++;

      if (e.metadata?.deviceSpoof) deviceSpoofing++;
    }

    return {
      fraudCluster,
      botCluster,
      deviceSpoofing,
      total: events.length,
    };
  }
}