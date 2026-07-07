# Architecture conformité – UnimentorAI

Vue d’ensemble des modules de conformité, traçabilité et défense juridique.

## 1. Schéma des modules (backend Firebase Functions)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        UNIMENTORAI – BACKEND CONFORMITÉ                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  AI_DECISION_TRACE_ENGINE     │  Chaque décision IA : traçable, datée,      │
│  (aiDecisionTraceEngine.js)   │  versionnée, auditable. Score confiance,   │
│                                │  explicabilité, limitation domaines sensibles│
├─────────────────────────────────────────────────────────────────────────────┤
│  LEGAL_LOGGER_SYSTEM           │  Consentements versionnés, horodatage,     │
│  (legalLoggerSystem.js)        │  preuve en cas de litige, logs chiffrés    │
├─────────────────────────────────────────────────────────────────────────────┤
│  SECURITY_AUDIT_DASHBOARD      │  Événements sécurité, accès admin,         │
│  (securityAuditDashboard.js)   │  agrégations pour dashboard                │
├─────────────────────────────────────────────────────────────────────────────┤
│  AI_ETHICS_MONITOR             │  Biais, équité algorithmique, corrections   │
│  (aiEthicsMonitor.js)          │  humaines, versioning modèles               │
├─────────────────────────────────────────────────────────────────────────────┤
│  UNIMENTORAI_SCORE_ENGINE      │  Score transparent, paramétrable par        │
│  (unimentoraiScoreEngine.js)   │  institution, non discriminatoire           │
├─────────────────────────────────────────────────────────────────────────────┤
│  DROPOUT_RISK_ENGINE           │  Risque décrochage %, alertes,              │
│  (dropoutRiskEngine.js)        │  désactivation par juridiction             │
├─────────────────────────────────────────────────────────────────────────────┤
│  LITIGATION_DEFENSE_MODULE     │  Acceptation limites IA, avertissements    │
│  (litigationDefenseModule.js)  │  sensibles, archivage interactions,        │
│                                │  export certifié (PDF-ready)                │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 2. Flux IA (création de cours avec RAG et trace)

1. Déclencheur : création d’un document `course_searches`.  
2. RAG : récupération de cours similaires (sources vérifiables).  
3. Génération contenu OpenAI avec contexte des sources.  
4. Calcul score de confiance et détection domaine sensible.  
5. Si domaine sensible et confiance < seuil → limitation de la réponse, pas de création de cours.  
6. Sinon : création du cours, puis enregistrement trace (AI_DECISION_TRACE_ENGINE).  
7. Notification utilisateur.

## 3. Flux juridique (consentement / preuve)

1. Utilisateur accepte CGU / confidentialité / disclaimer IA (version document).  
2. `archiveConsent` (LEGAL_LOGGER_SYSTEM) : enregistrement horodaté.  
3. `logLegalAction` pour actions sensibles (export, suppression compte, etc.).  
4. En cas de litige : `generateProofExport` pour preuves (consentements + logs).

## 4. Sécurité

- Toutes les Cloud Functions sensibles vérifient `context.auth`.  
- Rôles admin / enterprise_admin pour dashboard sécurité, traces IA, risques décrochage.  
- Firestore Rules : lecture/écriture par collection selon propriété et rôle.  
- Chiffrement des détails sensibles dans legal_logs (AES-256-GCM).

## 5. Endpoints callable (résumé)

| Nom | Rôle requis | Description |
|-----|-------------|-------------|
| recordAIDecisionTrace | Utilisateur | Enregistrer une trace de décision IA |
| archiveConsent | Utilisateur | Archiver un consentement |
| getProofExport | Utilisateur (ou admin pour un autre user) | Export preuves |
| getSecurityDashboard | Admin | Stats sécurité |
| recordSecurityEvent | Utilisateur | Enregistrer un événement sécurité |
| reportEthicsMetrics | Admin / Enterprise | Rapport éthique IA |
| logHumanCorrection | Utilisateur | Correction humaine sur sortie IA |
| computeUnimentoraiScore | Utilisateur | Calculer score |
| getLatestUnimentoraiScore | Utilisateur / Admin | Dernier score |
| assessDropoutRisk | Utilisateur | Évaluer risque décrochage |
| getHighRiskDropout | Admin / Enterprise | Liste risques élevés |
| recordUserAcceptance | Utilisateur | Accepter limites IA |
| getCertifiedExport | Utilisateur / Admin | Export certifié interactions |
| archiveUserInteraction | Utilisateur | Archiver une interaction |
| getAIDecisionTraces | Admin | Liste traces pour audit |

## 6. Fichiers

- **Backend :** `functions/compliance/*.js`, `functions/index.js`.  
- **Règles :** `firestore.rules`, `firestore.indexes.json`.  
- **Documentation :** `docs/CGU.md`, `docs/POLITIQUE_CONFIDENTIALITE.md`, `docs/DISCLAIMER_IA.md`, `docs/CARTOGRAPHIE_DONNEES.md`, `docs/POLITIQUE_SECURITE.md`, `docs/ARCHITECTURE_CONFORMITE.md`, `docs/MANUEL_INSTITUTIONNEL.md`.

---

© UnimentorAI – Tous droits réservés.
