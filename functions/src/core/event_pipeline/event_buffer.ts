export class EventBuffer {

  private static buffer: any[] = [];

  static add(event: any) {
    this.buffer.push(event);

    if (this.buffer.length > 1000) {
      this.flush();
    }
  }

  static flush() {
    console.log("🧹 Flushing event buffer:", this.buffer.length);
    this.buffer = [];
  }

  static getAll() {
    return this.buffer;
  }
}