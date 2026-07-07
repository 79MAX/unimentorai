/**
 * 🔥 FIREBASE CONFIG — UNIMENTORAI (PRODUCTION READY)
 */

import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

---

# 🔐 CONFIG SECURISÉE VIA ENV VARIABLES

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  appId: process.env.FIREBASE_APP_ID
};

---

# 🧠 VALIDATION CONFIG (IMPORTANT)

function validateConfig(config) {

  const requiredFields = [
    "apiKey",
    "authDomain",
    "projectId"
  ];

  for (let field of requiredFields) {
    if (!config[field]) {
      throw new Error(`FIREBASE_MISSING_${field.toUpperCase()}`);
    }
  }
}

validateConfig(firebaseConfig);

---

# 🚀 SAFE INITIALIZATION (ANTI-DUPLICATE)

const app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

---

# 📦 FIRESTORE EXPORT

export const db = getFirestore(app);

---

# 🧠 BONUS : SAFE HELPER (OPTIONNEL PRODUCTION)

export const FirebaseStatus = {
  isReady: !!app,
  projectId: firebaseConfig.projectId || null
};

