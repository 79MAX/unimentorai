import * as admin from "firebase-admin";

const db = admin.firestore();

export class CertificateLedger {

  static async storeCertificateHash(data: {
    certificateId: string;
    hash: string;
    userId: string;
  }) {

    await db.collection("certificate_ledger").doc(data.certificateId).set({
      hash: data.hash,
      userId: data.userId,
      createdAt: Date.now(),
      version: "v1-blockchain-engine",
    });
  }

  static async getCertificateHash(certificateId: string) {
    const doc = await db.collection("certificate_ledger").doc(certificateId).get();
    return doc.exists ? doc.data() : null;
  }
}