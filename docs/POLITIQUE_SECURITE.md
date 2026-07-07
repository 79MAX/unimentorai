# Politique de sécurité – UnimentorAI

Document de référence pour la sécurité technique et organisationnelle (niveau institutionnel).

## 1. Principes

- **Confidentialité :** chiffrement des données sensibles et des preuves légales.  
- **Intégrité :** contrôles d’accès, validation des entrées, logs d’audit.  
- **Disponibilité :** sauvegardes, plan de reprise, monitoring.

## 2. Chiffrement

- **Au repos :** clés et données sensibles (preuves légales) chiffrées (AES-256).  
- **En transit :** TLS 1.3 pour toutes les communications (API, web, mobile).  
- **Mots de passe :** hashage bcrypt ou argon2 (pas de stockage en clair).

## 3. Authentification et accès

- Authentification forte (Firebase Auth, possibilité 2FA).  
- Rôles : utilisateur, admin, enterprise_admin.  
- RBAC : accès aux données selon rôle et propriété (règles Firestore).  
- Journalisation des accès admin (Security Audit Dashboard).

## 4. Protection des applications

- **Injection :** validation/sanitization des entrées ; requêtes paramétrées.  
- **XSS / CSRF :** en-têtes sécurisés, tokens CSRF, politique de contenu.  
- **Rate limiting :** limitation des appels API et des actions sensibles pour éviter abus et déni de service.

## 5. Dépendances et vulnérabilités

- Mise à jour régulière des dépendances.  
- Audit des vulnérabilités (npm audit, outils CI) avant déploiement.  
- Correction prioritaire des failles critiques.

## 6. Données et conformité

- Données personnelles traitées selon la [Politique de confidentialité](POLITIQUE_CONFIDENTIALITE.md) et le RGPD/CCPA.  
- Logs anonymisés lorsque requis (RGPD).  
- Séparation logique des données par contexte (cours, utilisateurs, conformité, audit).

## 7. Incidents et signalement

- Signalement des vulnérabilités : contact sécurisé (email ou processus dédié).  
- Gestion des incidents : identification, confinement, correction, communication si nécessaire.

## 8. Révision

Cette politique est révisée périodiquement et à chaque changement majeur d’infrastructure ou de réglementation.

---

© UnimentorAI – Tous droits réservés.
