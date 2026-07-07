import { IncidentClassifier } from "./incident_classifier";
import { ResponseActions } from "./response_actions";

export class IncidentEngine {

  static process(event: any) {

    const severity = IncidentClassifier.classify(event.score || 0);
    const type = IncidentClassifier.detectType(event);

    const incident = {
      id: `inc_${Date.now()}`,
      type,
      severity,
      score: event.score,
      userId: event.userId,
      deviceId: event.deviceId,
      status: "OPEN",
      timestamp: Date.now(),
    };

    // 🚨 EXECUTE RESPONSE
    ResponseActions.execute(incident);

    return incident;
  }
}