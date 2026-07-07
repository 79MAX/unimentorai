// Script Node.js pour exporter plusieurs collections Firestore en JSON et CSV
// Usage : node export_firestore_multi.js subscriptions users consents
// npm install firebase-admin csv-writer
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS to access Firestore.');
  process.exit(1);
}

if (process.argv.length < 3) {
  console.log('Usage: node export_firestore_multi.js collection1 collection2 ...');
  process.exit(1);
}

const collections = process.argv.slice(2);
admin.initializeApp();
const db = admin.firestore();
const exportDir = `export_${new Date().toISOString().replace(/[:.]/g, '-')}`;
fs.mkdirSync(exportDir, { recursive: true });

async function exportCollection(name) {
  const snap = await db.collection(name).get();
  const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  fs.writeFileSync(path.join(exportDir, `export_${name}.json`), JSON.stringify(data, null, 2));
  if (data.length) {
    const csvWriter = createCsvWriter({
      path: path.join(exportDir, `export_${name}.csv`),
      header: Object.keys(data[0]).map(k => ({ id: k, title: k }))
    });
    await csvWriter.writeRecords(data);
  }
  console.log(`Exported ${data.length} documents from ${name} to ${exportDir}/export_${name}.json/.csv`);
}

(async () => {
  for (const name of collections) {
    await exportCollection(name);
  }
  console.log(`All exports done in ${exportDir}`);
})(); 
