/**
 * LITIGATION_DEFENSE_MODULE
 * Acceptation explicite des limites IA, avertissement avant recommandation sensible,
 * blocage IA pour décisions critiques, archivage historique interactions,
 * export PDF certifié des interactions.
 */

const admin = require('firebase-admin');

const USER_ACCEPTANCES_COLLECTION = 'litigation_user_acceptances';
const INTERACTION_ARCHIVE_COLLECTION = 'user_interaction_archive';
const SENSITIVE_WARNINGS_COLLECTION = 'sensitive_warning_logs';

const CRITICAL_DECISION_TYPES = ['grade', 'certification', 'expulsion', 'scholarship', 'admission'];

/**
 * Enregistre l'acceptation explicite des limites IA par l'utilisateur
 * @param {string} userId
 * @param {string} acceptanceType - 'ai_limits' | 'disclaimer_pedagogical' | 'non_human_substitution'
 * @param {string} documentVersion
 * @param {string} [ipAddress]
 */
async function recordUserAcceptance(userId, acceptanceType, documentVersion, ipAddress = '') {
  const db = admin.firestore();
  const record = {
    userId,
    acceptanceType,
    documentVersion,
    ipAddress,
    acceptedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  const ref = await db.collection(USER_ACCEPTANCES_COLLECTION).add(record);
  return { acceptanceId: ref.id, ...record };
}

/**
 * Vérifie si l'utilisateur a accepté les limites IA (requis avant recommandations sensibles)
 */
async function hasUserAcceptedLimits(userId, acceptanceType = 'ai_limits') {
  const db = admin.firestore();
  const snap = await db
    .collection(USER_ACCEPTANCES_COLLECTION)
    .where('userId', '==', userId)
    .where('acceptanceType', '==', acceptanceType)
    .orderBy('acceptedAt', 'desc')
    .limit(1)
    .get();
  return !snap.empty;
}

/**
 * Archive une interaction utilisateur (pour preuve et export)
 */
async function archiveUserInteraction(params) {
  const db = admin.firestore();
  const {
    userId,
    sessionId,
    channel, // 'chatbot' | 'recommendation' | 'course_suggestion'
    inputSummary,
    outputSummary,
    traceId,
    sensitiveWarningShown = false,
  } = params;

  const record = {
    userId,
    sessionId,
    channel,
    inputSummary: (inputSummary || '').substring(0, 2000),
    outputSummary: (outputSummary || '').substring(0, 2000),
    traceId,
    sensitiveWarningShown,
    recordedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const ref = await db.collection(INTERACTION_ARCHIVE_COLLECTION).add(record);
  return { archiveId: ref.id, ...record };
}

/**
 * Log qu'un avertissement sensible a été affiché (preuve)
 */
async function logSensitiveWarning(userId, context, decisionType) {
  const db = admin.firestore();
  const record = {
    userId,
    context,
    decisionType,
    shownAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  const ref = await db.collection(SENSITIVE_WARNINGS_COLLECTION).add(record);
  return { logId: ref.id };
}

/**
 * Vérifie si une décision est critique (doit être bloquée par l'IA)
 */
function isCriticalDecision(decisionType) {
  return CRITICAL_DECISION_TYPES.some((t) => (decisionType || '').toLowerCase().includes(t));
}

/**
 * Génère les données pour un export PDF certifié des interactions (à passer à un service de génération PDF)
 */
async function getCertifiedExportData(userId, fromDate = null, toDate = null) {
  const db = admin.firestore();
  let query = db.collection(INTERACTION_ARCHIVE_COLLECTION).where('userId', '==', userId).orderBy('recordedAt', 'asc');
  if (fromDate) query = query.where('recordedAt', '>=', fromDate);
  if (toDate) query = query.where('recordedAt', '<=', toDate);
  const snap = await query.get();

  const acceptances = await db
    .collection(USER_ACCEPTANCES_COLLECTION)
    .where('userId', '==', userId)
    .orderBy('acceptedAt', 'asc')
    .get();

  return {
    userId,
    generatedAt: new Date().toISOString(),
    fromDate: fromDate ? fromDate.toISOString() : null,
    toDate: toDate ? toDate.toISOString() : null,
    interactions: snap.docs.map((d) => ({ id: d.id, ...d.data() })),
    acceptances: acceptances.docs.map((d) => ({ id: d.id, ...d.data() })),
    certificationNote: 'Export généré par UnimentorAI - Litigation Defense Module - Ne constitue pas un avis juridique.',
  };
}

module.exports = {
  recordUserAcceptance,
  hasUserAcceptedLimits,
  archiveUserInteraction,
  logSensitiveWarning,
  isCriticalDecision,
  getCertifiedExportData,
  CRITICAL_DECISION_TYPES,
  USER_ACCEPTANCES_COLLECTION,
  INTERACTION_ARCHIVE_COLLECTION,
  SENSITIVE_WARNINGS_COLLECTION,
};

