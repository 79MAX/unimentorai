// Script Node.js pour exporter une collection Firestore en JSON et CSV
// Usage : node export_firestore_collection.js collectionName
// npm install firebase-admin csv-writer
const admin = require('firebase-admin');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS to access Firestore.');
  process.exit(1);
}

if (process.argv.length < 3) {
  console.log('Usage: node export_firestore_collection.js collectionName');
  process.exit(1);
}

const collectionName = process.argv[2];
admin.initializeApp();
const db = admin.firestore();

async function exportCollection() {
  const snap = await db.collection(collectionName).get();
  const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  fs.writeFileSync(`export_${collectionName}.json`, JSON.stringify(data, null, 2));
  if (data.length) {
    const csvWriter = createCsvWriter({
      path: `export_${collectionName}.csv`,
      header: Object.keys(data[0]).map(k => ({ id: k, title: k }))
    });
    await csvWriter.writeRecords(data);
  }
  console.log(`Exported ${data.length} documents from ${collectionName} to export_${collectionName}.json/.csv`);
}

exportCollection(); 
