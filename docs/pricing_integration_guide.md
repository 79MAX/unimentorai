# Guide d’intégration – Souscription & Facturation UniMentorAI

## 1. Architecture générale

- **Flutter** : UI de souscription, simulateur, paiement Stripe, breakdown dynamique, validation CGU/RGPD
- **Cloud Functions Node.js** : génération de facture PDF, stockage Firebase Storage, enregistrement Firestore, envoi email, vérification paiement Stripe
- **Firestore** : suivi des souscriptions et factures

## 2. Configuration & déploiement

### Prérequis
- Compte Firebase (Firestore, Storage, Functions activés)
- Compte Stripe (clés API)
- Compte SendGrid (clé API pour l’emailing)
- Flutter 3.22+, Node.js 18+, npm

### Déploiement backend
1. Cloner le repo et installer les dépendances dans `functions/` :
   ```bash
   cd functions
   npm install
   ```
2. Configurer les variables d’environnement :
   - `STRIPE_SECRET_KEY` (clé secrète Stripe)
   - `SENDGRID_API_KEY` (clé API SendGrid)
   - `GCLOUD_STORAGE_BUCKET` (nom du bucket Firebase Storage)
3. Déployer la Cloud Function :
   ```bash
   firebase deploy --only functions
   ```

### Déploiement Flutter
1. Installer les dépendances :
   ```bash
   flutter pub get
   ```
2. Configurer les URLs des Cloud Functions dans `billing_screen.dart`
3. Ajouter les clés Stripe dans le projet Flutter (`flutter_stripe`)
4. Lancer l’app :
   ```bash
   flutter run
   ```

## 3. Personnalisation
- Modifier la grille tarifaire dans `lib/core/constants/pricing_config.json` ou via Firestore
- Adapter les emails envoyés (template SendGrid)
- Ajouter des options ou des services annexes dans le JSON
- Personnaliser le PDF (logo, mentions légales, etc.)

## 4. RGPD & conformité
- Consentement explicite CGU/RGPD obligatoire avant paiement
- Factures stockées de façon sécurisée (Firebase Storage)
- Export/suppression des données sur demande (admin panel ou script)
- Logs d’accès et d’actions dans Firestore

## 5. Tests & qualité
- Tests unitaires, widget, intégration et accessibilité fournis (`test/features/pricing/`)
- CI/CD recommandée (GitHub Actions, voir `.github/workflows/`)
- Audit RGPD et accessibilité automatisés possibles

## 6. FAQ
- **Comment changer la devise ?**
  Modifier le champ `currencies` dans le JSON de pricing et adapter Stripe.
- **Comment ajouter un segment ou une offre ?**
  Ajouter une entrée dans le JSON ou Firestore, puis relancer l’app.
- **Comment personnaliser le PDF ?**
  Modifier la Cloud Function dans `functions/generate_invoice.js`.
- **Comment exporter toutes les factures ?**
  Utiliser Firebase Storage ou un script d’export.
- **Comment assurer la conformité RGPD ?**
  Activer l’export/suppression sur demande, tenir un registre des consentements.

## 7. Support
- Contact : support@unimentor.ai
- Documentation technique : [https://unimentor.ai/docs](https://unimentor.ai/docs) 