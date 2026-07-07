/**
 * Backup Firestore quotidien via Cloud Scheduler.
 * Utilise l'API Admin Firestore exportDocuments vers un bucket GCS.
 *
 * Prérequis :
 * - Variable d'environnement FIRESTORE_BACKUP_BUCKET (ex: gs://unimentorai-backups)
 * - Compte de service des Functions avec le rôle datastore.importExportAdmin
 */

const { google } = require('googleapis');

async function exportFirestore() {
  const projectId = process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT;
  const bucket = process.env.FIRESTORE_BACKUP_BUCKET;
  if (!projectId || !bucket) {
    console.error('Firestore backup: GCLOUD_PROJECT et/ou FIRESTORE_BACKUP_BUCKET manquants.');
    return null;
  }

  const client = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/datastore'],
  });

  const firestore = google.firestore({
    version: 'v1',
    auth: client,
  });

  const databaseName = `projects/${projectId}/databases/(default)`;
  const outputUriPrefix = `${bucket}/firestore-backup-${new Date().toISOString().split('T')[0]}`;

  console.log(`Lancement backup Firestore vers ${outputUriPrefix}`);

  const request = {
    name: databaseName,
    requestBody: {
      outputUriPrefix,
    },
  };

  try {
    const res = await firestore.projects.databases.exportDocuments(request);
    console.log('Export Firestore déclenché:', JSON.stringify(res.data));
    return res.data;
  } catch (err) {
    console.error('Erreur export Firestore:', err);
    return null;
  }
}

module.exports = {
  exportFirestore,
};


