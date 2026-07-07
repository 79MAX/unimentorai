/**
 * AI_ETHICS_MONITOR
 * Détection de biais, indicateur d'équité algorithmique, paramétrage neutralité,
 * journal de correction humaine, versioning des modèles IA.
 */

const admin = require('firebase-admin');

const ETHICS_REPORTS_COLLECTION = 'ethics_reports';
const HUMAN_CORRECTIONS_COLLECTION = 'human_correction_log';
const MODEL_VERSIONS_COLLECTION = 'model_versions';

/**
 * Enregistre une version de modèle (déploiement)
 */
async function registerModelVersion(modelId, version, metadata = {}) {
  const db = admin.firestore();
  const doc = {
    modelId,
    version,
    deployedAt: admin.firestore.FieldValue.serverTimestamp(),
    metadata,
  };
  const ref = await db.collection(MODEL_VERSIONS_COLLECTION).add(doc);
  return { versionId: ref.id, ...doc };
}

/**
 * Signale un rapport d'éthique (biais détecté, équité, etc.)
 * @param {Object} params
 * @param {string} params.reportType - 'bias_detection' | 'fairness_metric' | 'neutrality_audit'
 * @param {string} params.modelId
 * @param {string} [params.modelVersion]
 * @param {Object} params.metrics - ex: { demographicParity: 0.02, equalizedOdds: 0.01 }
 * @param {string} [params.description]
 */
async function reportEthicsMetrics(params) {
  const db = admin.firestore();
  const {
    reportType,
    modelId,
    modelVersion = '',
    metrics = {},
    description = '',
  } = params;

  const report = {
    reportType,
    modelId,
    modelVersion,
    metrics,
    description,
    recordedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const ref = await db.collection(ETHICS_REPORTS_COLLECTION).add(report);
  return { reportId: ref.id, ...report };
}

/**
 * Indicateur d'équité algorithmique (score 0-1, 1 = parfait)
 * Stocke la dernière valeur et l'historique
 */
async function setFairnessIndicator(modelId, score, breakdown = {}) {
  const db = admin.firestore();
  const doc = {
    modelId,
    score: Math.max(0, Math.min(1, score)),
    breakdown,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  await db.collection('ethics_fairness_indicator').doc(modelId).set(doc, { merge: true });
  return doc;
}

/**
 * Journal de correction humaine : un humain a modifié ou invalidé une sortie IA
 */
async function logHumanCorrection(params) {
  const db = admin.firestore();
  const {
    userId,
    traceId,
    decisionType,
    originalOutput,
    correctedOutput,
    reason,
  } = params;

  const entry = {
    userId,
    traceId,
    decisionType,
    originalOutput: originalOutput?.substring?.(0, 500) ?? String(originalOutput).substring(0, 500),
    correctedOutput: correctedOutput?.substring?.(0, 500) ?? String(correctedOutput).substring(0, 500),
    reason: reason || '',
    recordedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const ref = await db.collection(HUMAN_CORRECTIONS_COLLECTION).add(entry);
  return { correctionId: ref.id, ...entry };
}

/**
 * Récupère les indicateurs d'équité pour le dashboard
 */
async function getFairnessIndicators() {
  const db = admin.firestore();
  const snap = await db.collection('ethics_fairness_indicator').get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Récupère les derniers rapports d'éthique
 */
async function getRecentEthicsReports(limit = 50) {
  const db = admin.firestore();
  const snap = await db
    .collection(ETHICS_REPORTS_COLLECTION)
    .orderBy('recordedAt', 'desc')
    .limit(limit)
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

module.exports = {
  registerModelVersion,
  reportEthicsMetrics,
  setFairnessIndicator,
  logHumanCorrection,
  getFairnessIndicators,
  getRecentEthicsReports,
  ETHICS_REPORTS_COLLECTION,
  HUMAN_CORRECTIONS_COLLECTION,
  MODEL_VERSIONS_COLLECTION,
};

