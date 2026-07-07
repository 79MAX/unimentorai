/**
 * AI_DECISION_TRACE_ENGINE
 * Chaque recommandation IA : traçable, datée, versionnée, auditable.
 * Conformité : explicabilité, revue humaine, limitation des réponses sensibles.
 */

const admin = require('firebase-admin');

const SENSITIVE_DOMAINS = ['juridique', 'médical', 'financier', 'legal', 'medical', 'financial'];
const MIN_CONFIDENCE_FOR_SENSITIVE = 0.85;
const MODEL_VERSION = '1.0.0';

/**
 * Enregistre une décision/recommandation IA avec trace complète
 * @param {Object} params
 * @param {string} params.userId - ID utilisateur
 * @param {string} params.decisionType - type (recommendation, course_suggestion, chatbot_reply, etc.)
 * @param {string} params.inputSummary - résumé de l'entrée (anonymisé si besoin)
 * @param {string} params.outputSummary - résumé de la sortie
 * @param {number} params.confidenceScore - score de confiance 0-1
 * @param {string[]} params.sources - IDs ou URLs des sources utilisées (RAG)
 * @param {string} [params.explanation] - explicabilité : pourquoi cette recommandation
 * @param {string} [params.modelId] - identifiant du modèle
 * @param {boolean} [params.sensitiveDomain] - domaine sensible (juridique, médical, financier)
 * @param {boolean} [params.requiresHumanReview] - soumis à revue humaine
 */
async function recordDecisionTrace(params) {
  const db = admin.firestore();
  const {
    userId,
    decisionType,
    inputSummary,
    outputSummary,
    confidenceScore,
    sources = [],
    explanation = '',
    modelId = 'default',
    sensitiveDomain = false,
    requiresHumanReview = false,
  } = params;

  const trace = {
    userId,
    decisionType,
    inputSummary,
    outputSummary,
    confidenceScore: Math.max(0, Math.min(1, confidenceScore)),
    sources,
    explanation,
    modelId,
    modelVersion: MODEL_VERSION,
    sensitiveDomain,
    requiresHumanReview: requiresHumanReview || (sensitiveDomain && confidenceScore < MIN_CONFIDENCE_FOR_SENSITIVE),
    recordedAt: admin.firestore.FieldValue.serverTimestamp(),
    version: 1,
    auditStatus: requiresHumanReview ? 'pending_review' : 'logged',
  };

  const ref = await db.collection('ai_decision_traces').add(trace);
  return { traceId: ref.id, ...trace };
}

/**
 * Détecte si un sujet est sensible (juridique, médical, financier)
 */
function detectSensitiveDomain(text) {
  const lower = (text || '').toLowerCase();
  return SENSITIVE_DOMAINS.some((d) => lower.includes(d));
}

/**
 * Calcule un score de confiance indicatif à partir des sources RAG
 * @param {string[]} sources - liste des sources utilisées
 * @param {boolean} hasExactMatch - au moins une source avec forte similarité
 */
function computeConfidenceFromRAG(sources, hasExactMatch = false) {
  if (!sources || sources.length === 0) return 0.3;
  let score = Math.min(0.95, 0.4 + sources.length * 0.15);
  if (hasExactMatch) score = Math.min(0.95, score + 0.2);
  return score;
}

/**
 * Vérifie si une réponse doit être limitée (domaine sensible + faible confiance)
 */
function shouldLimitSensitiveResponse(confidenceScore, sensitiveDomain) {
  return sensitiveDomain && confidenceScore < MIN_CONFIDENCE_FOR_SENSITIVE;
}

/**
 * Récupère les traces pour audit (admin)
 */
async function getTracesForAudit(options = {}) {
  const db = admin.firestore();
  let query = db.collection('ai_decision_traces').orderBy('recordedAt', 'desc');
  if (options.limit) query = query.limit(options.limit);
  if (options.userId) query = query.where('userId', '==', options.userId);
  if (options.decisionType) query = query.where('decisionType', '==', options.decisionType);
  if (options.pendingReview) query = query.where('auditStatus', '==', 'pending_review');
  const snap = await query.get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Marque une trace comme revue par un humain
 */
async function markTraceReviewed(traceId, reviewerId, outcome) {
  const db = admin.firestore();
  await db.collection('ai_decision_traces').doc(traceId).update({
    auditStatus: 'reviewed',
    reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
    reviewerId,
    reviewOutcome: outcome,
  });
}

module.exports = {
  recordDecisionTrace,
  detectSensitiveDomain,
  computeConfidenceFromRAG,
  shouldLimitSensitiveResponse,
  getTracesForAudit,
  markTraceReviewed,
  SENSITIVE_DOMAINS,
  MIN_CONFIDENCE_FOR_SENSITIVE,
  MODEL_VERSION,
};

