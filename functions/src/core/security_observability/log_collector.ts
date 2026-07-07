export class LogCollector {

  private static logs: any[] = [];

  static add(log: any) {
    this.logs.push(log);

    if (this.logs.length > 500) {
      this.flush();
    }
  }

  static flush() {
    console.log("🧾 LOG FLUSH:", this.logs.length);
    this.logs = [];
  }

  static getAll() {
    return this.logs;
  }
}