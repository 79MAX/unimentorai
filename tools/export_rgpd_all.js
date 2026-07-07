// Script Node.js d’export RGPD global (multi-utilisateurs) pour UniMentorAI
// npm install firebase-admin csv-writer
const admin = require('firebase-admin');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS to access Firestore.');
  process.exit(1);
}

admin.initializeApp();
const db = admin.firestore();

async function exportAllUsers() {
  const subsSnap = await db.collection('subscriptions').get();
  const byEmail = {};
  subsSnap.docs.forEach(d => {
    const data = d.data();
    if (!byEmail[data.email]) byEmail[data.email] = [];
    byEmail[data.email].push(data);
  });
  const globalExport = [];
  for (const email of Object.keys(byEmail)) {
    const userData = { email, subscriptions: byEmail[email] };
    fs.writeFileSync(`export_rgpd_${email}.json`, JSON.stringify(userData, null, 2));
    if (byEmail[email].length) {
      const csvWriter = createCsvWriter({
        path: `export_rgpd_${email}.csv`,
        header: Object.keys(byEmail[email][0]).map(k => ({ id: k, title: k }))
      });
      await csvWriter.writeRecords(byEmail[email]);
    }
    globalExport.push(userData);
  }
  fs.writeFileSync('export_rgpd_all.json', JSON.stringify(globalExport, null, 2));
  console.log(`Export RGPD global généré pour ${Object.keys(byEmail).length} utilisateurs.`);
}

exportAllUsers(); 
