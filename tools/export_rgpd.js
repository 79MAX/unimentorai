// Script Node.js d’export RGPD/factures pour UniMentorAI
// npm install firebase-admin csv-writer
const admin = require('firebase-admin');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Définir GOOGLE_APPLICATION_CREDENTIALS pour accéder à Firestore.');
  process.exit(1);
}

admin.initializeApp();
const db = admin.firestore();

async function exportUserData(email) {
  const result = { email, subscriptions: [], consents: [], logs: [] };
  // Souscriptions/factures
  const subsSnap = await db.collection('subscriptions').where('email', '==', email).get();
  result.subscriptions = subsSnap.docs.map(d => d.data());
  // Consentements (si collection dédiée)
  try {
    const consSnap = await db.collection('consents').where('email', '==', email).get();
    result.consents = consSnap.docs.map(d => d.data());
  } catch {}
  // Logs (si collection dédiée)
  try {
    const logsSnap = await db.collection('logs').where('email', '==', email).get();
    result.logs = logsSnap.docs.map(d => d.data());
  } catch {}
  // Générer JSON
  fs.writeFileSync(`export_rgpd_${email}.json`, JSON.stringify(result, null, 2));
  // Générer CSV (souscriptions)
  if (result.subscriptions.length) {
    const csvWriter = createCsvWriter({
      path: `export_rgpd_${email}.csv`,
      header: Object.keys(result.subscriptions[0]).map(k => ({ id: k, title: k }))
    });
    await csvWriter.writeRecords(result.subscriptions);
  }
  console.log(`Export RGPD généré pour ${email} : export_rgpd_${email}.json / .csv`);
}

if (process.argv.length < 3) {
  console.log('Usage: node export_rgpd.js user@email.com');
  process.exit(1);
}

exportUserData(process.argv[2]); 
