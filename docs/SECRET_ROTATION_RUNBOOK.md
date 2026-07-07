# Runbook rotation + r�vocation des secrets

## Pr�-requis

- Firebase CLI authentifi� avec un compte owner/editor du projet
- Nouvelles cl�s d�j� r�g�n�r�es chez les fournisseurs
- Variables d'environnement inject�es localement (PowerShell) :

```powershell
$env:OPENAI_API_KEY="..."
$env:STRIPE_SECRET_KEY="..."
$env:STRIPE_WEBHOOK_SECRET="..."
$env:PAYPAL_CLIENT_ID="..."
$env:PAYPAL_CLIENT_SECRET="..."
$env:KKIAPAY_PUBLIC_KEY="..."
$env:KKIAPAY_PRIVATE_KEY="..."
$env:KKIAPAY_SECRET_KEY="..."
$env:WISE_API_TOKEN="..."
$env:WISE_PROFILE_ID="..."
$env:WISE_RECIPIENT_ACCOUNT_ID="..."
$env:CERTIFICATES_SECRET="..."
```

## Cha�ne op�rationnelle (rotation ? production)

Ordre **non n�gociable** : r�vocation c�t� fournisseurs **apr�s** injection SM + d�ploiement + smoke OK (�viter coupure trafic). R�sum� :

1. R�g�n�rer les cl�s chez les fournisseurs (nouvelles valeurs pr�tes, anciennes encore actives le temps de la bascule).
2. Injecter dans **Secret Manager** + prune (`rotate-secrets.ps1`).
3. **D�ployer** les Cloud Functions.
4. Ex�cuter les **smoke tests** automatis�s (bloquant).
5. **Valider** (script `validate-secrets` + crit�res ci-dessous) puis **r�voquer** les anciennes cl�s fournisseur.

## Ex�cution

1. **Rotation + Secret Manager** (injection nouvelles versions, prune des versions obsol�tes) :

```powershell
powershell -ExecutionPolicy Bypass -File scripts/security/rotate-secrets.ps1 -ProjectId unimentorai-pjhwn
```

2. **D�ploiement** Cloud Functions (prise en compte runtime des secrets r�f�renc�s) :

```bash
firebase deploy --only functions --project unimentorai-pjhwn
```

3. **Smoke tests fonctionnels** (voir section d�di�e) � **bloquant avant validation finale** :

```bash
cd functions
npm run smoke:post-rotation
```

4. **Validation �tat secrets** (Secret Manager + contr�les locaux) :

```powershell
powershell -ExecutionPolicy Bypass -File scripts/security/validate-secrets.ps1 -ProjectId unimentorai-pjhwn
```

5. **R�vocation fournisseur** : ex�cuter la section **R�vocation fournisseur** une fois les �tapes 3�4 au vert.

## R�vocation fournisseur (obligatoire)

- OpenAI : supprimer l'ancienne API key depuis la console OpenAI.
- Stripe : rotater secret key + webhook secret, invalider anciens secrets webhook.
- PayPal : r�g�n�rer Client Secret et invalider l'ancien app secret.
- Kkiapay : r�g�n�rer public/private/secret et invalider anciennes cl�s.
- Wise : r�g�n�rer token API + v�rifier recipient account actif attendu.
- Certificates : secret HMAC rotat� (versions pr�c�dentes inutilisables pour nouveaux tokens).

## Smoke tests post-rotation bloquant

Script unique c�t� repo : **`functions/scripts/post-rotation-smoke-tests.js`** (logique align�e sur `secretManager.js` et les modules paiements / certificats existants).

### Commande

```bash
cd functions
npm run smoke:post-rotation
```

### Pr�requis

| Pr�requis | D�tail |
|-----------|--------|
| D�pendances | `npm ci` ou `npm install` dans `functions/` |
| Secret Manager (recommand� prod) | **ADC** valide (`gcloud auth application-default login` ou variable `GOOGLE_APPLICATION_CREDENTIALS`) + **`GCLOUD_PROJECT`** ou **`GCP_PROJECT`** (ou `FIREBASE_CONFIG` JSON avec `projectId`) |
| Mode CI / local sans GCP | `FUNCTIONS_EMULATOR=true` + variables d'environnement **nomm�es comme les secrets** (`OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, etc.), comme pour l'�mulateur Functions |
| Sandbox (d�faut **strict**) | `PAYPAL_SANDBOX=true`, `KKIAPAY_SANDBOX=true`, `WISE_USE_SANDBOX=1` ; Stripe **uniquement** `sk_test_` / `rk_test_` si `SMOKE_STRICT_SANDBOX` actif (d�faut) |
| Optionnel | `SMOKE_SKIP=service1,service2` ; `SMOKE_JSON=1` (ligne JSON finale pour parsing CI) ; `SMOKE_STRICT_SANDBOX=0` uniquement si accept� explicitement |

Les secrets lus correspondent aux noms d�j� utilis�s en production (`OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `PAYPAL_*`, `KKIAPAY_*`, `WISE_*`, `CERTIFICATES_SECRET`).

### Int�gration GitHub Actions

| �l�ment | D�tail |
|---------|--------|
| Fichier workflow | **`.github/workflows/post-rotation-smoke.yml`** |
| Nom affich� | **Post-rotation smoke tests** |
| D�clenchement **recommand�** | **`workflow_dispatch`** (manuel apr�s rotation + d�ploiement) |
| D�clenchement **optionnel** | Cha�ner un `workflow_run` sur le workflow qui pousse les secrets ou d�ploie les functions, ou un d�clenchement planifi� � � adapter selon votre pipeline interne |
| Pipeline | `checkout` ? `setup-node` ? **`google-github-actions/auth`** avec le secret d�p�t **`GCP_SA_KEY_JSON`** (r�le `roles/secretmanager.secretAccessor` minimum) ? `npm ci` dans `functions/` ? `npm run smoke:post-rotation` avec `GCLOUD_PROJECT=${{ secrets.GCLOUD_PROJECT_ID }}`, `PAYPAL_SANDBOX`, `KKIAPAY_SANDBOX`, `WISE_USE_SANDBOX`, `SMOKE_JSON=1` |

### Crit�res de validation (go / no-go prod)

- **Tous les services couverts par le script** doivent �tre **OK** pour une bascule prod sans r�serve (sortie console + r�sum� global `OK`).
- **Z�ro �chec tol�r�** sur : **paiements** (Stripe, PayPal, Kkiapay, Wise), **certificats** (HMAC / URL de v�rification), **OpenAI** (appel API + rejet mod�le invalide).
- Les �tapes **r�vocation fournisseur** et **`validate-secrets.ps1`** restent obligatoires dans la cha�ne ; le smoke ne les remplace pas.

### Proc�dure en cas d'�chec

1. **Ne pas r�voquer** les anciennes cl�s fournisseur tant que la cause n'est pas identifi�e (rollback possible).
2. **Rollback applicatif** (si d�j� d�ploy�) : red�ployer la r�vision Functions pr�c�dente **ou** repointer la version � latest � du secret concern� vers la version pr�c�dente encore valide dans Secret Manager, puis red�ployer si n�cessaire.
3. **V�rifier** : nom du secret, IAM `secretAccessor`, projet `GCLOUD_PROJECT`, valeurs inject�es (sans coller les secrets dans les tickets � comparer version dans la console GCP).
4. Corriger la cause ? **r�-ex�cuter** `npm run smoke:post-rotation` jusqu'au vert, puis `validate-secrets.ps1`.
5. R�voquer les anciennes cl�s **uniquement** apr�s smoke + validation au vert.

### Tests manuels compl�mentaires (optionnel)

Pour un contr�le via les callables HTTP d�j� d�ploy�s : `createStripePaymentIntent` / `verifyStripePaymentIntent`, PayPal order + capture, Kkiapay create + status, Wise quote / transfer, `issueSecureCertificate`, `generateChatbotReply`.

### Checklist rapide (post-rotation)

- [ ] Nouvelles cl�s g�n�r�es chez tous les fournisseurs concern�s
- [ ] `rotate-secrets.ps1` ex�cut� sans erreur (versions SM � jour)
- [ ] `firebase deploy --only functions` r�ussi
- [ ] `npm run smoke:post-rotation` ? **r�sum� global OK**, aucun �chec sur paiements / certificats / OpenAI
- [ ] `validate-secrets.ps1` ex�cut� sans erreur bloquante
- [ ] Anciennes cl�s **r�voqu�es** c�t� fournisseurs
- [ ] Communication / monitoring si fen�tre de maintenance

## S�curit� continue (bonus)

- Planifier une rotation trimestrielle (ou mensuelle pour paiements)
- Ajouter alerte CI/CD si secret manquant au d�ploiement
- Audit hebdo : `firebase functions:secrets:get <SECRET>` + logs Data Access Secret Manager
