export class IncidentStore {

  private static incidents: any[] = [];

  static save(incident: any) {
    this.incidents.push(incident);
  }

  static getAll() {
    return this.incidents;
  }

  static getOpen() {
    return this.incidents.filter(i => i.status === "OPEN");
  }
}