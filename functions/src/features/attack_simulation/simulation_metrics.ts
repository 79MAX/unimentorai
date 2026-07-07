export class SimulationMetrics {

  static results = {
    totalAttacks: 0,
    blocked: 0,
    missed: 0,
  };

  static record(event: any, blocked: boolean) {

    this.results.totalAttacks++;

    if (blocked) this.results.blocked++;
    else this.results.missed++;
  }

  static getReport() {

    return {
      ...this.results,
      successRate:
        this.results.totalAttacks === 0
          ? 0
          : (this.results.blocked / this.results.totalAttacks) * 100,
    };
  }
}