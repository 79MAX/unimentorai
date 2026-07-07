import * as admin from "firebase-admin";

const db = admin.firestore();

export class EventStore {

  static async save(event: any) {
    await db.collection("security_events").add({
      ...event,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
}