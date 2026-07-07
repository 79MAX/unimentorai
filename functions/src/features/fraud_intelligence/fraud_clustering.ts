export class FraudClustering {

  static cluster(logs: any[]) {

    const clusters: Record<string, number> = {};

    for (const log of logs) {
      const key = log.country || "UNKNOWN";

      if (!clusters[key]) clusters[key] = 0;

      if (log.status === "FRAUD") {
        clusters[key] += 1;
      }
    }

    return clusters;
  }
}