/**
 * Tests unitaires des moteurs de conformité (logique pure, sans Firestore).
 * Exécution depuis functions/ : node compliance/compliance.test.js
 */

const assert = (cond, msg) => {
  if (!cond) throw new Error(msg || 'Assertion failed');
};
const path = require('path');
const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id) {
  if (id === 'firebase-admin') {
    const mockFV = { serverTimestamp: () => ({}) };
    return {
      firestore: () => ({
        collection: () => ({
          add: async () => ({ id: 'mock' }),
          doc: () => ({ get: async () => ({ exists: false }), update: async () => {} }),
          where: () => ({ orderBy: () => ({ limit: () => ({ get: async () => ({ docs: [], empty: true }) }) }) }),
          orderBy: () => ({ limit: () => ({ get: async () => ({ docs: [] }) }) }),
        }),
        FieldValue: mockFV,
      }),
      initializeApp: () => {},
    };
  }
  return originalRequire.apply(this, arguments);
};

// Test AI Decision Trace (logique sans DB)
const aiTrace = require('./aiDecisionTraceEngine');
assert(aiTrace.detectSensitiveDomain('conseil juridique') === true, 'sensitive juridique');
assert(aiTrace.detectSensitiveDomain('mathématiques') === false, 'non sensitive');
assert(aiTrace.shouldLimitSensitiveResponse(0.5, true) === true, 'limit sensitive low confidence');
assert(aiTrace.shouldLimitSensitiveResponse(0.9, true) === false, 'no limit high confidence');
const conf = aiTrace.computeConfidenceFromRAG(['s1', 's2'], true);
assert(conf >= 0.5 && conf <= 1, 'confidence from RAG');

// Test Litigation Defense (logique)
const litigation = require('./litigationDefenseModule');
assert(litigation.isCriticalDecision('grade') === true, 'grade is critical');
assert(litigation.isCriticalDecision('course_suggestion') === false, 'suggestion not critical');

// Test Dropout Risk (logique - getRiskConfig peut nécessiter Firestore, on teste les constantes)
const dropout = require('./dropoutRiskEngine');
assert(dropout.DEFAULT_FACTORS.completionRate !== undefined, 'default factors');

// Test UnimentorAI Score (poids par défaut)
const scoreEngine = require('./unimentoraiScoreEngine');
const w = scoreEngine.DEFAULT_WEIGHTS;
assert(Math.abs((w.academicPerformance + w.progression + w.softSkills + w.engagement + w.projectCoherence) - 1) < 0.01, 'weights sum to 1');

console.log('Tous les tests de conformité (logique) ont réussi.');
process.exit(0);

