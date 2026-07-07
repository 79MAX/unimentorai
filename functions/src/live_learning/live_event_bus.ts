type Listener = (event: any) => void;

export class LiveEventBus {

  private static listeners: Listener[] = [];

  static subscribe(listener: Listener) {
    this.listeners.push(listener);
  }

  static publish(event: any) {

    for (const listener of this.listeners) {
      listener(event);
    }
  }
}