/**
 * LEGAL_LOGGER_SYSTEM
 * Archive consentements, horodate actions, preuve en cas de litige, logs chiffres.
 * Conformite RGPD, CCPA, droit a l'oubli, exportabilite, consentement versionne.
 */

const admin = require('firebase-admin');
const crypto = require('crypto');

const CONSENT_COLLECTION = 'legal_consents';
const LEGAL_LOGS_COLLECTION = 'legal_logs';
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;

function getEncryptionKey() {
  const key = process.env.LEGAL_LOG_ENCRYPTION_KEY || process.env.ENCRYPTION_KEY;
  if (!key || key.length < 32) {
    throw new Error('LEGAL_LOG_ENCRYPTION_KEY or ENCRYPTION_KEY (32+ chars) required');
  }
  return crypto.scryptSync(key, 'legal_log_salt', KEY_LENGTH);
}

function encryptPayload(payload) {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
  const str = typeof payload === 'string' ? payload : JSON.stringify(payload);
  let encrypted = cipher.update(str, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return {
    encrypted: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    algorithm: ENCRYPTION_ALGORITHM,
  };
}

function decryptPayload(blob) {
  const key = getEncryptionKey();
  const decipher = crypto.createDecipheriv(
    ENCRYPTION_ALGORITHM,
    key,
    Buffer.from(blob.iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(blob.authTag, 'hex'));
  let decrypted = decipher.update(blob.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  try {
    return JSON.parse(decrypted);
  } catch {
    return decrypted;
  }
}

async function archiveConsent(params) {
  const db = admin.firestore();
  const {
    userId,
    consentType,
    version,
    granted,
    ipAddress = '',
    userAgent = '',
  } = params;

  const record = {
    userId,
    consentType,
    version,
    granted: Boolean(granted),
    ipAddress,
    userAgent,
    recordedAt: admin.firestore.FieldValue.serverTimestamp(),
    documentVersion: version,
  };

  const ref = await db.collection(CONSENT_COLLECTION).add(record);
  await logLegalAction({
    action: 'consent_recorded',
    userId,
    resource: CONSENT_COLLECTION,
    resourceId: ref.id,
    details: { consentType, version, granted },
  });
  return { consentId: ref.id, ...record };
}

async function logLegalAction(params) {
  const db = admin.firestore();
  const {
    action,
    userId,
    resource = '',
    resourceId = '',
    details = {},
    encrypt = true,
  } = params;

  const logEntry = {
    action,
    userId,
    resource,
    resourceId,
    recordedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (encrypt && Object.keys(details).length > 0) {
    logEntry.encryptedDetails = encryptPayload(details);
  } else if (Object.keys(details).length > 0) {
    logEntry.details = details;
  }

  const ref = await db.collection(LEGAL_LOGS_COLLECTION).add(logEntry);
  return { logId: ref.id, ...logEntry };
}

async function getConsentsForUser(userId) {
  const db = admin.firestore();
  const snap = await db
    .collection(CONSENT_COLLECTION)
    .where('userId', '==', userId)
    .orderBy('recordedAt', 'desc')
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function getLegalLogsForUser(userId, limit) {
  const db = admin.firestore();
  const lim = limit || 500;
  const snap = await db
    .collection(LEGAL_LOGS_COLLECTION)
    .where('userId', '==', userId)
    .orderBy('recordedAt', 'desc')
    .limit(lim)
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function generateProofExport(userId) {
  const consents = await getConsentsForUser(userId);
  const logs = await getLegalLogsForUser(userId);
  return {
    userId,
    generatedAt: new Date().toISOString(),
    consents,
    legalLogs: logs.map((l) => {
      const { encryptedDetails, ...rest } = l;
      if (encryptedDetails) {
        try {
          rest.detailsDecrypted = decryptPayload(encryptedDetails);
        } catch {
          rest.detailsDecrypted = null;
        }
      }
      return rest;
    }),
  };
}

module.exports = {
  archiveConsent,
  logLegalAction,
  getConsentsForUser,
  getLegalLogsForUser,
  generateProofExport,
  encryptPayload,
  decryptPayload,
  CONSENT_COLLECTION,
  LEGAL_LOGS_COLLECTION,
};

