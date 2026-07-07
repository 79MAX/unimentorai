export class MetricsCollector {

  private static metrics: Record<string, number> = {};

  static increment(name: string, value = 1) {
    this.metrics[name] = (this.metrics[name] || 0) + value;
  }

  static set(name: string, value: number) {
    this.metrics[name] = value;
  }

  static getAll() {
    return this.metrics;
  }
}