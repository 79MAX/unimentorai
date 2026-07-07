import * as admin from "firebase-admin";

const db = admin.firestore();

export class FraudMemoryStore {

  // 📥 STORE FRAUD CASE
  static async store(event: any) {

    await db.collection("fraud_memory").add({
      ...event,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  // 📊 GET HISTORICAL PATTERNS
  static async getRecent(limit = 200) {

    const snap = await db
      .collection("fraud_memory")
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    return snap.docs.map(d => d.data());
  }
}