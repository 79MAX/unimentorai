import * as admin from "firebase-admin";
import { SecurityAlert } from "./alert_types";

const db = admin.firestore();

export class AlertDispatcher {

  static async dispatch(alert: SecurityAlert) {

    // 💾 STORE ALERT
    await db.collection("security_alerts").add({
      ...alert,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // ⚡ LOG SOC STREAM
    console.log("[SECURITY_ALERT]", alert);

    return true;
  }
}