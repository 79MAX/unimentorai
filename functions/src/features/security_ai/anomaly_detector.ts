export class AnomalyDetector {

  static detect(ip: string | undefined): number {
    if (!ip) return 25;

    let score = 0;

    // fake heuristic patterns
    if (ip.startsWith("127")) score += 50;
    if (ip.includes("::1")) score += 40;

    // random anomaly simulation (AI placeholder)
    score += Math.random() * 15;

    return Math.min(score, 100);
  }
}