/**
 * DROPOUT_RISK_ENGINE
 * Modèle prédictif multi-variables, score de risque %, alertes automatiques,
 * justification des prédictions, option désactivation selon juridiction.
 */

const admin = require('firebase-admin');

const RISK_ASSESSMENTS_COLLECTION = 'dropout_risk_assessments';
const RISK_CONFIG_COLLECTION = 'dropout_risk_config';

/**
 * Variables prédictives (poids par défaut, ajustables par institution)
 */
const DEFAULT_FACTORS = {
  lastActivityDaysAgo: 0.25,
  completionRate: 0.25,
  engagementScore: 0.20,
  failedQuizzesRatio: 0.15,
  supportRequestsCount: 0.15,
};

/**
 * Récupère la config (désactivation par juridiction / institution)
 */
async function getRiskConfig(institutionId = null) {
  const db = admin.firestore();
  const id = institutionId || 'default';
  const doc = await db.collection(RISK_CONFIG_COLLECTION).doc(id).get();
  if (doc.exists && doc.data().disabled === true) {
    return { enabled: false, institutionId: id };
  }
  return {
    enabled: true,
    institutionId: id,
    factors: doc.exists && doc.data().factors ? doc.data().factors : DEFAULT_FACTORS,
    alertThreshold: doc.exists && doc.data().alertThreshold != null ? doc.data().alertThreshold : 0.6,
  };
}

/**
 * Calcule un score de risque de décrochage (0-1)
 * @param {string} userId
 * @param {Object} signals
 * @param {number} [signals.lastActivityDaysAgo] - jours depuis dernière activité
 * @param {number} [signals.completionRate] - 0-1
 * @param {number} [signals.engagementScore] - 0-1
 * @param {number} [signals.failedQuizzesRatio] - 0-1
 * @param {number} [signals.supportRequestsCount] - normalisé ou seuil
 */
async function assessDropoutRisk(userId, signals = {}, institutionId = null) {
  const config = await getRiskConfig(institutionId);
  if (!config.enabled) {
    return { userId, riskScore: null, disabled: true, message: 'Dropout risk engine disabled for this institution.' };
  }

  const factors = config.factors || DEFAULT_FACTORS;
  const normalize = (v, max = 1) => (v == null || Number.isNaN(v) ? 0.5 : Math.max(0, Math.min(1, Number(v) / max)));

  // Plus lastActivityDaysAgo est élevé, plus le risque monte (cap 30 jours = 1)
  const lastActivityRisk = Math.min(1, (signals.lastActivityDaysAgo ?? 0) / 30);
  const completionRate = 1 - normalize(signals.completionRate); // faible complétion = risque
  const engagementRisk = 1 - normalize(signals.engagementScore);
  const failedQuizzesRisk = normalize(signals.failedQuizzesRatio ?? 0);
  const supportRisk = Math.min(1, (signals.supportRequestsCount ?? 0) / 5);

  const riskScore =
    (factors.lastActivityDaysAgo || 0) * lastActivityRisk +
    (factors.completionRate || 0) * completionRate +
    (factors.engagementScore || 0) * engagementRisk +
    (factors.failedQuizzesRatio || 0) * failedQuizzesRisk +
    (factors.supportRequestsCount || 0) * supportRisk;

  const score = Math.round(Math.min(1, riskScore) * 1000) / 1000;
  const justification = {
    lastActivityDaysAgo: { value: signals.lastActivityDaysAgo, contribution: lastActivityRisk * (factors.lastActivityDaysAgo || 0) },
    completionRate: { value: signals.completionRate, contribution: completionRate * (factors.completionRate || 0) },
    engagementScore: { value: signals.engagementScore, contribution: engagementRisk * (factors.engagementScore || 0) },
    failedQuizzesRatio: { value: signals.failedQuizzesRatio, contribution: failedQuizzesRisk * (factors.failedQuizzesRatio || 0) },
    supportRequestsCount: { value: signals.supportRequestsCount, contribution: supportRisk * (factors.supportRequestsCount || 0) },
  };

  const shouldAlert = config.alertThreshold != null ? score >= config.alertThreshold : score >= 0.6;

  const db = admin.firestore();
  const record = {
    userId,
    institutionId: institutionId || 'default',
    riskScore: score,
    riskPercent: Math.round(score * 100),
    justification,
    signals,
    shouldAlert,
    computedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const ref = await db.collection(RISK_ASSESSMENTS_COLLECTION).add(record);
  return { assessmentId: ref.id, ...record };
}

/**
 * Récupère les dernières évaluations à risque (pour alertes)
 */
async function getHighRiskAssessments(institutionId = null, limit = 50) {
  const db = admin.firestore();
  let query = db
    .collection(RISK_ASSESSMENTS_COLLECTION)
    .where('shouldAlert', '==', true)
    .orderBy('computedAt', 'desc')
    .limit(limit);
  if (institutionId) {
    query = query.where('institutionId', '==', institutionId);
  }
  const snap = await query.get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Désactive le moteur pour une juridiction/institution
 */
async function setRiskConfigDisabled(institutionId, disabled) {
  const db = admin.firestore();
  await db.collection(RISK_CONFIG_COLLECTION).doc(institutionId || 'default').set(
    { disabled: !!disabled, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
    { merge: true }
  );
  return { institutionId: institutionId || 'default', disabled: !!disabled };
}

module.exports = {
  assessDropoutRisk,
  getRiskConfig,
  getHighRiskAssessments,
  setRiskConfigDisabled,
  DEFAULT_FACTORS,
  RISK_ASSESSMENTS_COLLECTION,
  RISK_CONFIG_COLLECTION,
};

