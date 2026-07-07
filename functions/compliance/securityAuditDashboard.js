/**
 * SECURITY_AUDIT_DASHBOARD
 * Agrégation des événements de sécurité : accès admin, rate limit, auth, etc.
 * À consommer par un tableau de bord admin.
 */

const admin = require('firebase-admin');

const SECURITY_EVENTS_COLLECTION = 'security_audit_events';
const ADMIN_ACCESS_COLLECTION = 'admin_access_logs';

const EVENT_TYPES = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILURE: 'login_failure',
  ADMIN_ACCESS: 'admin_access',
  RATE_LIMIT_HIT: 'rate_limit_hit',
  SENSITIVE_DATA_ACCESS: 'sensitive_data_access',
  ROLE_CHANGE: 'role_change',
  PASSWORD_RESET: 'password_reset',
  API_KEY_ACCESS: 'api_key_access',
  EXPORT_DATA: 'export_data',
  DELETE_ACCOUNT: 'delete_account',
};

/**
 * Enregistre un événement de sécurité
 * @param {Object} params
 * @param {string} params.eventType - un des EVENT_TYPES
 * @param {string} params.userId - uid ou 'system' ou 'anonymous'
 * @param {string} [params.resource] - ressource concernée
 * @param {Object} [params.metadata] - métadonnées (anonymisées, pas de PII)
 */
async function recordSecurityEvent(params) {
  const db = admin.firestore();
  const { eventType, userId, resource = '', metadata = {} } = params;

  const event = {
    eventType,
    userId: userId || 'anonymous',
    resource,
    metadata,
    recordedAt: admin.firestore.FieldValue.serverTimestamp(),
    env: process.env.NODE_ENV || 'production',
  };

  const ref = await db.collection(SECURITY_EVENTS_COLLECTION).add(event);

  if (eventType === EVENT_TYPES.ADMIN_ACCESS) {
    await db.collection(ADMIN_ACCESS_COLLECTION).add({
      ...event,
      securityEventId: ref.id,
    });
  }
  return { eventId: ref.id };
}

/**
 * Journalisation des accès admin (obligatoire)
 */
async function logAdminAccess(adminUserId, action, resource, details = {}) {
  return recordSecurityEvent({
    eventType: EVENT_TYPES.ADMIN_ACCESS,
    userId: adminUserId,
    resource,
    metadata: { action, ...details },
  });
}

/**
 * Agrégations pour le dashboard (dernières 24h par défaut)
 */
async function getSecurityDashboardStats(hoursBack = 24) {
  const db = admin.firestore();
  const since = new Date();
  since.setHours(since.getHours() - hoursBack);

  const snapshot = await db
    .collection(SECURITY_EVENTS_COLLECTION)
    .where('recordedAt', '>=', since)
    .get();

  const byType = {};
  snapshot.docs.forEach((doc) => {
    const type = doc.data().eventType || 'unknown';
    byType[type] = (byType[type] || 0) + 1;
  });

  const adminAccessSnapshot = await db
    .collection(ADMIN_ACCESS_COLLECTION)
    .where('recordedAt', '>=', since)
    .orderBy('recordedAt', 'desc')
    .limit(100)
    .get();

  return {
    since: since.toISOString(),
    totalEvents: snapshot.size,
    byEventType: byType,
    recentAdminAccess: adminAccessSnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })),
  };
}

/**
 * Liste des événements (pour dashboard paginé)
 */
async function getSecurityEvents(options = {}) {
  const db = admin.firestore();
  let query = db
    .collection(SECURITY_EVENTS_COLLECTION)
    .orderBy('recordedAt', 'desc');
  if (options.limit) query = query.limit(options.limit);
  if (options.eventType) query = query.where('eventType', '==', options.eventType);
  if (options.userId) query = query.where('userId', '==', options.userId);
  const snap = await query.get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

module.exports = {
  recordSecurityEvent,
  logAdminAccess,
  getSecurityDashboardStats,
  getSecurityEvents,
  EVENT_TYPES,
  SECURITY_EVENTS_COLLECTION,
  ADMIN_ACCESS_COLLECTION,
};

