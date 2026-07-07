import { securityEventPipeline } from "./security_event_pipeline";

export class EventStream {

  static listen(callback: (event: any) => void) {

    securityEventPipeline.subscribe((event) => {
      callback(event);
    });
  }
}