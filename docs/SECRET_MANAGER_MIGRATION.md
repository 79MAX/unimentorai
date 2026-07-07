# Migration Secret Manager — UniMentorAI

## Secrets identifies (serveur)

- OPENAI_API_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- PAYPAL_CLIENT_ID
- PAYPAL_CLIENT_SECRET
- KKIAPAY_PUBLIC_KEY
- KKIAPAY_PRIVATE_KEY
- KKIAPAY_SECRET_KEY
- WISE_API_TOKEN
- WISE_PROFILE_ID
- WISE_RECIPIENT_ACCOUNT_ID
- CERTIFICATES_SECRET

## Architecture cible

- Source de verite unique: **Google Secret Manager**
- Acces runtime via `functions/src/security/secretManager.js`
- Cache memoire par secret pour limiter les appels reseau
- Fallback `process.env` autorise uniquement en emulateur local

## Modules refactorises

- `functions/index.js` (OpenAI + Translate ADC)
- `functions/src/payments/stripePaymentsModule.js`
- `functions/src/payments/paypalPaymentsModule.js`
- `functions/src/payments/kkiapayPaymentsModule.js`
- `functions/src/payments/wisePaymentsModule.js`
- `functions/src/startup/startupArchitectureModule.js`

## Provisionnement (exemple)

```bash
gcloud secrets create OPENAI_API_KEY --replication-policy=automatic
echo -n "<value>" | gcloud secrets versions add OPENAI_API_KEY --data-file=-
```

Reproduire pour chaque secret liste ci-dessus.

## IAM (least privilege)

Attribuer uniquement:

- Runtime Functions SA: `roles/secretmanager.secretAccessor`
- Equipe SRE/Platform: `roles/secretmanager.admin`
- Aucune permission Secret Manager cote client mobile/web

Exemple:

```bash
gcloud projects add-iam-policy-binding unimentorai-pjhwn \
  --member="serviceAccount:unimentorai-pjhwn@appspot.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

## Audit logs

Activer Data Access logs sur Secret Manager:

```bash
gcloud logging sinks describe _Default
# puis verifier que Admin Read / Data Read sont actifs pour secretmanager.googleapis.com
```

## Nettoyage local effectue

- Secret expose supprime de `functions/.env`
- `.env` racine nettoye (sans secrets)
- `serviceAccountKey.json` supprime
- `test_extract/serviceAccountKey.json` supprime

## Validation securite

- Plus aucun `functions.config()` dans le backend
- Plus aucun `keyFilename: 'serviceAccountKey.json'`
- Secrets charges dynamiquement via Secret Manager
- Aucun secret en clair conserve dans les fichiers locaux suivis
