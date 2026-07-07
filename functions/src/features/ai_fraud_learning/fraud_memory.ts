import * as admin from "firebase-admin";

const db = admin.firestore();

export class FraudMemory {

  static async storeDecision(data: any) {
    await db.collection("fraud_decisions").add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  static async getRecentDecisions(limit = 100) {
    const snapshot = await db
      .collection("fraud_decisions")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => doc.data());
  }
}