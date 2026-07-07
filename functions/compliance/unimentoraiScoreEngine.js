/**
 * UNIMENTORAI_SCORE_ENGINE™
 * Score combinant : performance académique, progression, soft skills, engagement, cohérence projet.
 * Transparent, explicable, non discriminatoire, paramétrable par institution.
 */

const admin = require('firebase-admin');

const SCORES_COLLECTION = 'unimentorai_scores';
const SCORE_CONFIG_COLLECTION = 'unimentorai_score_config';

const DEFAULT_WEIGHTS = {
  academicPerformance: 0.30,
  progression: 0.25,
  softSkills: 0.20,
  engagement: 0.15,
  projectCoherence: 0.10,
};

/**
 * Récupère la config de score par institution (ou défaut)
 */
async function getScoreConfig(institutionId = null) {
  const db = admin.firestore();
  if (institutionId) {
    const doc = await db.collection(SCORE_CONFIG_COLLECTION).doc(institutionId).get();
    if (doc.exists) {
      return { institutionId, ...doc.data() };
    }
  }
  const defaultDoc = await db.collection(SCORE_CONFIG_COLLECTION).doc('default').get();
  if (defaultDoc.exists) {
    return { institutionId: 'default', ...defaultDoc.data() };
  }
  return { weights: DEFAULT_WEIGHTS, minScores: {}, maxScores: {} };
}

/**
 * Calcule le score UnimentorAI pour un utilisateur
 * @param {string} userId
 * @param {Object} inputs - métriques brutes (0-1 ou valeurs à normaliser)
 * @param {number} [inputs.academicPerformance] - 0-1
 * @param {number} [inputs.progression] - 0-1
 * @param {number} [inputs.softSkills] - 0-1
 * @param {number} [inputs.engagement] - 0-1
 * @param {number} [inputs.projectCoherence] - 0-1
 * @param {string} [institutionId]
 */
async function computeScore(userId, inputs = {}, institutionId = null) {
  const config = await getScoreConfig(institutionId);
  const weights = config.weights || DEFAULT_WEIGHTS;

  const normalize = (v) => (v == null || Number.isNaN(v) ? 0 : Math.max(0, Math.min(1, Number(v))));

  const academicPerformance = normalize(inputs.academicPerformance);
  const progression = normalize(inputs.progression);
  const softSkills = normalize(inputs.softSkills);
  const engagement = normalize(inputs.engagement);
  const projectCoherence = normalize(inputs.projectCoherence);

  const total =
    weights.academicPerformance * academicPerformance +
    weights.progression * progression +
    weights.softSkills * softSkills +
    weights.engagement * engagement +
    weights.projectCoherence * projectCoherence;

  const score = Math.round(total * 1000) / 1000;
  const breakdown = {
    academicPerformance,
    progression,
    softSkills,
    engagement,
    projectCoherence,
    weights,
  };

  const db = admin.firestore();
  const record = {
    userId,
    institutionId: institutionId || 'default',
    score,
    breakdown,
    inputs: { ...inputs },
    computedAt: admin.firestore.FieldValue.serverTimestamp(),
    configVersion: config.version || 1,
  };

  const ref = await db.collection(SCORES_COLLECTION).add(record);
  return { scoreId: ref.id, score, breakdown, ...record };
}

/**
 * Récupère le dernier score d'un utilisateur
 */
async function getLatestScore(userId, institutionId = null) {
  const db = admin.firestore();
  let query = db.collection(SCORES_COLLECTION).where('userId', '==', userId).orderBy('computedAt', 'desc').limit(1);
  if (institutionId) {
    query = query.where('institutionId', '==', institutionId);
  }
  const snap = await query.get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
}

/**
 * Définit la config de score pour une institution (admin)
 */
async function setScoreConfig(institutionId, config) {
  const db = admin.firestore();
  const doc = {
    ...config,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  await db.collection(SCORE_CONFIG_COLLECTION).doc(institutionId).set(doc, { merge: true });
  return doc;
}

module.exports = {
  computeScore,
  getLatestScore,
  getScoreConfig,
  setScoreConfig,
  DEFAULT_WEIGHTS,
  SCORES_COLLECTION,
  SCORE_CONFIG_COLLECTION,
};

