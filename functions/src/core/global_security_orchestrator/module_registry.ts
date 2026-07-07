export class ModuleRegistry {

  private static modules = new Map<string, any>();

  static register(name: string, module: any) {
    this.modules.set(name, module);
  }

  static get(name: string) {
    return this.modules.get(name);
  }

  static getAll() {
    return Array.from(this.modules.keys());
  }
}