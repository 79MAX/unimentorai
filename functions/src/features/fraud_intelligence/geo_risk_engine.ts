export class GeoRiskEngine {

  static getRiskScore(country?: string): number {

    if (!country) return 20;

    const highRisk = ["XX", "YY"]; // placeholder zones à risque
    const mediumRisk = ["ZZ"];

    if (highRisk.includes(country)) return 80;
    if (mediumRisk.includes(country)) return 50;

    return 10;
  }
}