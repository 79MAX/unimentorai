export class OrchestrationMemory {

  private static history: any[] = [];

  static add(event: any) {
    this.history.push(event);
  }

  static getAll() {
    return this.history;
  }

  static latest() {
    return this.history[this.history.length - 1];
  }
}