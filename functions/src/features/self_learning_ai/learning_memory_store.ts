import * as admin from "firebase-admin";

const db = admin.firestore();

export class LearningMemoryStore {

  static async saveEvent(event: any, decision: any) {

    await db.collection("security_learning_memory").add({
      event,
      decision,
      timestamp: Date.now(),
    });
  }

  static async getRecentEvents(limit = 500) {

    const snap = await db
      .collection("security_learning_memory")
      .orderBy("timestamp", "desc")
      .limit(limit)
      .get();

    return snap.docs.map(d => d.data());
  }
}