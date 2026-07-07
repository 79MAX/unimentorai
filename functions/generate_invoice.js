// Cloud Function Node.js pour générer une facture PDF, stocker dans Firebase Storage, et retourner l’URL
// npm install express pdfkit @google-cloud/storage firebase-admin sendgrid/mail stripe

const functions = require('firebase-functions');
const express = require('express');
const PDFDocument = require('pdfkit');
const { Storage } = require('@google-cloud/storage');
const admin = require('firebase-admin');
const sendgrid = require('@sendgrid/mail');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

admin.initializeApp();
const db = admin.firestore();
const storage = new Storage();
const app = express();
app.use(express.json());

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

// Rate limit in-memory (anti-abus)
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_CALLS_PER_WINDOW = 30;
const buckets = new Map();
function getKey(req) {
  return req?.ip ? `ip:${req.ip}` : 'anonymous';
}
function checkRateLimit(key) {
  const now = Date.now();
  const bucket = buckets.get(key) || { count: 0, windowStart: now };
  if (now - bucket.windowStart > WINDOW_MS) {
    bucket.count = 0;
    bucket.windowStart = now;
  }
  bucket.count += 1;
  buckets.set(key, bucket);
  return bucket.count <= MAX_CALLS_PER_WINDOW;
}

app.post('/generate-invoice', async (req, res) => {
  try {
    const key = getKey(req);
    if (!checkRateLimit(key)) {
      return res.status(429).json({ error: 'rate_limit', message: 'Trop de requêtes. Réessayez plus tard.' });
    }
    const { segment, tier, users, region, addons, email, pricing, paymentIntentId } = req.body;

    // Validation stricte minimale (anti-abus + anti-erreurs)
    if (!email || typeof email !== 'string' || email.length < 5 || email.length > 120) {
      return res.status(400).json({ error: 'Email invalide' });
    }
    if (!segment || typeof segment !== 'string') return res.status(400).json({ error: 'Segment invalide' });
    if (!tier || typeof tier !== 'string') return res.status(400).json({ error: 'Tier invalide' });
    const safeUsers = Number(users);
    if (!Number.isFinite(safeUsers) || safeUsers <= 0 || safeUsers > 1000000) {
      return res.status(400).json({ error: 'users invalide' });
    }
    if (!pricing || typeof pricing !== 'object') return res.status(400).json({ error: 'pricing invalide' });

    // 1. Vérifier le paiement Stripe (optionnel, si paymentIntentId fourni)
    if (paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        return res.status(402).json({ error: 'Paiement non validé.' });
      }
    }
    // 2. Générer la facture PDF
    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);
      // 3. Stocker dans Firebase Storage
      const fileName = `invoices/invoice_${Date.now()}_${email}.pdf`;
      const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET || admin.storage().bucket().name);
      const file = bucket.file(fileName);
      await file.save(pdfData, { contentType: 'application/pdf' });

      // Sécurité RGPD : ne pas rendre public (URL signée à durée limitée)
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 1000 * 60 * 30, // 30 minutes
      });
      const url = signedUrl;
      // 4. Stocker la souscription et la facture dans Firestore
      await db.collection('subscriptions').add({
        segment, tier, users: safeUsers, region, addons, email, url, createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      // 5. Envoyer la facture par email (SendGrid)
      await sendgrid.send({
        to: email,
        from: 'facturation@unimentor.ai',
        subject: 'Votre facture UniMentorAI',
        text: `Merci pour votre souscription. Votre facture est disponible ici : ${url}`,
        attachments: [{
          content: pdfData.toString('base64'),
          filename: 'facture_unimentorai.pdf',
          type: 'application/pdf',
          disposition: 'attachment',
        }],
      });
      // 6. Réponse RGPD-friendly
      res.json({ url });
    });
    // Contenu PDF
    doc.fontSize(20).text('Facture UniMentorAI', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Client : ${email}`);
    doc.text(`Segment : ${segment}`);
    doc.text(`Offre : ${tier}`);
    doc.text(`Nombre d’utilisateurs : ${users}`);
    doc.text(`Région : ${region}`);
    doc.text(`Options : ${(addons||[]).join(', ')}`);
    doc.moveDown();
    doc.text('Détail du calcul :');
    doc.text(`Prix estimé : ${pricing?.total || 'N/A'} EUR/an`);
    doc.moveDown();
    doc.text('Conditions Générales d’Utilisation (CGU) et politique RGPD : https://unimentor.ai/cgu');
    doc.end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

exports.api = functions.https.onRequest(app); 
