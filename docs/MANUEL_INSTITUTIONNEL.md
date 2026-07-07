# Manuel institutionnel – UnimentorAI

Guide pour les établissements (universités, écoles) utilisant UnimentorAI et le panneau de contrôle institutionnel.

## 1. Rôles institutionnels

- **Admin :** accès global (sécurité, traces IA, éthique, tous les établissements).  
- **Enterprise_admin :** accès limité à son établissement (entreprises/écoles) : scores, risque décrochage, éthique, configuration.

## 2. INSTITUTIONAL_CONTROL_PANEL – Vue d’ensemble

Le panneau de contrôle institutionnel s’appuie sur les Cloud Functions et Firestore. Les actions sont réalisées via l’application (écrans admin) ou via les fonctions callable documentées dans [ARCHITECTURE_CONFORMITE.md](ARCHITECTURE_CONFORMITE.md).

### 2.1 Score UnimentorAI (UNIMENTORAI_SCORE_ENGINE)

- **Paramétrage par institution :** poids des critères (performance académique, progression, soft skills, engagement, cohérence projet).  
- **Configuration :** collection `unimentorai_score_config` document ID = `institutionId`.  
- **Appel :** `computeUnimentoraiScore({ inputs, institutionId })`, `getLatestUnimentoraiScore({ userId, institutionId })`.  
- Les scores sont transparents et explicables (breakdown fourni).

### 2.2 Risque de décrochage (DROPOUT_RISK_ENGINE)

- **Activation / désactivation :** par juridiction ou établissement (collection `dropout_risk_config`, champ `disabled`).  
- **Alertes :** `getHighRiskDropout({ institutionId, limit })` retourne les évaluations à risque au-dessus du seuil.  
- **Signaux :** dernière activité, taux de complétion, engagement, échecs quiz, demandes de support.  
- **Justification :** chaque évaluation contient une justification (contribution de chaque facteur).

### 2.3 Éthique IA (AI_ETHICS_MONITOR)

- Rapports d’éthique (biais, équité) : `reportEthicsMetrics`.  
- Indicateur d’équité : stocké dans `ethics_fairness_indicator`.  
- Journal des corrections humaines : `logHumanCorrection`.  
- Versioning des modèles : enregistrement dans `model_versions`.

### 2.4 Sécurité et audit

- **Dashboard sécurité :** `getSecurityDashboard({ hoursBack })` (réservé admin).  
- **Traces IA :** `getAIDecisionTraces({ options })` pour audit des décisions IA.

### 2.5 Litigation et preuves

- Acceptation des limites IA : `recordUserAcceptance`.  
- Export certifié des interactions : `getCertifiedExport` (données prêtes pour génération PDF).  
- Export des preuves légales : `getProofExport`.

## 3. API sécurisée pour universités

- Toutes les fonctions sont exposées en **callable** (Firebase Functions), avec authentification obligatoire.  
- Les rôles sont portés par le token Firebase (custom claims) : `role = admin | enterprise_admin`.  
- Rate limiting et bonnes pratiques (TLS, validation) sont appliqués côté Firebase / infrastructure.

## 4. Multi-région et SLA

- L’hébergement Firebase (Google Cloud) permet un déploiement multi-région selon la configuration du projet.  
- Sauvegardes et reprise : selon la politique Google Cloud / Firebase.  
- Monitoring : Firebase Console, Cloud Monitoring ; alertes configurables.

## 5. Checklist déploiement institution

- [ ] Comptes admin / enterprise_admin créés avec custom claims.  
- [ ] Configuration score (`unimentorai_score_config`) pour l’institution.  
- [ ] Décision d’activer/désactiver le risque décrochage (`dropout_risk_config`).  
- [ ] Communication des CGU, politique de confidentialité et disclaimer IA aux utilisateurs.  
- [ ] Accès au dashboard sécurité et aux traces IA pour les administrateurs autorisés.

## 6. Contact

Support institutions : contact@unimentorai.com.

---

© UnimentorAI – Tous droits réservés.
