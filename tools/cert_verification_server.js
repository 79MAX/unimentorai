const express = require('express');
const admin = require('firebase-admin');
const app = express();
const PORT = 3000;

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
const QRCode = require('qrcode');

app.get('/cert/:id', async (req, res) => {
  try {
    const doc = await db.collection('certificates').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).send('Certificat non trouvé ou invalide.');
    }
    const cert = doc.data();
    const qrDataUrl = await QRCode.toDataURL(`https://unimentorai.com/cert/${req.params.id}`);
    res.send(`
      <html lang="fr">
        <head>
          <title>Vérification Certificat UniMentorAI</title>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body { font-family: Arial, sans-serif; background: #f4f8fb; color: #222; }
            .card { max-width: 400px; margin: 40px auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 32px; }
            h1 { color: #1976d2; }
            .status { font-weight: bold; color: green; }
            .badge { display: inline-block; background: #1976d2; color: #fff; border-radius: 8px; padding: 4px 12px; font-size: 14px; margin-bottom: 12px; }
            .qr { display: block; margin: 16px auto; }
          </style>
        </head>
        <body>
          <div class="card" role="region" aria-label="Certificat vérifié">
            <span class="badge" aria-label="Certificat vérifié">✔ Vérifié</span>
            <h1>Certificat de réussite</h1>
            <p><b>Nom :</b> ${cert.userName}</p>
            <p><b>Cours :</b> ${cert.courseName}</p>
            <p><b>Date :</b> ${cert.date}</p>
            <p><b>Statut :</b> <span class="status">${cert.status}</span></p>
            <img src="${qrDataUrl}" alt="QR code de vérification du certificat" class="qr" width="120" height="120" />
            <p style="font-size:12px;color:#888;">Vérifié par UniMentorAI</p>
          </div>
        </body>
      </html>
    `);
  } catch (e) {
    res.status(500).send('Erreur serveur');
  }
});

// Export CSV de tous les certificats
app.get('/certs/export', async (req, res) => {
  try {
    const snapshot = await db.collection('certificates').get();
    let csv = 'id,userName,courseName,date,status\n';
    snapshot.forEach(doc => {
      const c = doc.data();
      csv += `${doc.id},${c.userName},${c.courseName},${c.date},${c.status}\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="certificats.csv"');
    res.send(csv);
  } catch (e) {
    res.status(500).send('Erreur export CSV');
  }
});

app.listen(PORT, () => {
  console.log(`Serveur de vérification sur http://localhost:${PORT}`);
}); 
 
 
