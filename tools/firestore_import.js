const admin = require('firebase-admin');
const fs = require('fs');

if (!fs.existsSync('courses_enriched.json')) {
  console.error('Fichier courses_enriched.json introuvable. Lancez d\'abord le script Python.');
  process.exit(1);
}

const serviceAccount = require('./serviceAccountKey.json'); // Placez votre clé ici
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const data = JSON.parse(fs.readFileSync('courses_enriched.json', 'utf-8'));
const courses = data.courses;

async function importCourses() {
  for (const course of courses) {
    try {
      await db.collection('courses').doc(course.id).set(course);
      console.log(`✅ Importé : ${course.id} - ${course.title.fr}`);
    } catch (e) {
      console.error(`❌ Erreur sur ${course.id} :`, e);
    }
  }
  console.log('Import Firestore terminé.');
  process.exit(0);
}

importCourses(); 
 
 
