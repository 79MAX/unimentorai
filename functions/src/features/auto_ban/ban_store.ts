import * as admin from "firebase-admin";

const db = admin.firestore();

export class BanStore {

  static async ban(entityId: string, data: any) {
    await db.collection("bans").doc(entityId).set({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  static async isBanned(entityId: string) {
    const doc = await db.collection("bans").doc(entityId).get();
    return doc.exists ? doc.data() : null;
  }

  static async removeBan(entityId: string) {
    await db.collection("bans").doc(entityId).delete();
  }
}