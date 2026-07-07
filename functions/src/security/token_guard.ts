import * as admin from "firebase-admin";

export const verifyFirebaseToken = async (
  authorization?: string
) => {
  try {
    if (!authorization) return null;

    const token = authorization.replace("Bearer ", "");

    const decoded = await admin.auth().verifyIdToken(token);

    return decoded;
  } catch (e) {
    return null;
  }
};