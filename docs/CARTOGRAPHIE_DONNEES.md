# Cartographie des données – UnimentorAI

Document de référence pour la conformité RGPD/CCPA et l’audit des traitements.

## 1. Collections principales (Firestore)

| Collection / Donnée | Finalité | Base légale | Durée | Partagé / Sous-traitants |
|--------------------|----------|-------------|-------|---------------------------|
| users | Compte, profil, préférences | Exécution contrat | Durée compte + légal | Firebase (hébergement) |
| courses, steps, translations | Contenus pédagogiques | Exécution contrat | Tant que pertinent | Firebase |
| progress, course_progress | Progression, scores | Exécution contrat | Durée compte | Firebase |
| certificates | Délivrance certificats | Exécution contrat | 10 ans (preuve) | Firebase |
| payments, subscriptions | Paiements, abonnements | Exécution contrat + légal | 5–10 ans | Firebase, Stripe/PayPal/Kkiapay |
| chatbot_sessions, messages | Conversations IA | Intérêt légitime + consentement | 2 ans puis anonymisation | Firebase |
| legal_consents | Consentements versionnés | Obligation légale | 5 ans (preuve) | Firebase |
| legal_logs | Preuve actions (horodatage) | Obligation légale | 5 ans | Firebase (chiffré) |
| ai_decision_traces | Traçabilité décisions IA | Intérêt légitime + preuve | 5 ans | Firebase |
| user_interaction_archive | Historique interactions (litigation) | Intérêt légitime | 5 ans | Firebase |
| security_audit_events, admin_access_logs | Sécurité, audit admin | Intérêt légitime | 2 ans | Firebase |
| unimentorai_scores, dropout_risk_assessments | Scores et risque décrochage | Exécution contrat / intérêt légitime | Durée compte | Firebase |
| ethics_reports, human_correction_log | Éthique IA, corrections humaines | Intérêt légitime | 5 ans | Firebase |

## 2. Données sensibles / particulières

- **Mineurs :** âge, consentement parent si requis ; accès limité, pas de profilage commercial sensible.  
- **Santé / juridique / finance :** pas de stockage de données sensibles au sens strict sauf si nécessaire et sécurisé ; réponses IA limitées en cas de faible confiance.

## 3. Flux et export

- **Export utilisateur :** données de compte, consentements, preuves (Legal Logger), interactions (Litigation Defense).  
- **Droit à l’oubli :** suppression ou anonymisation selon demande et exceptions légales (preuves, facturation).

## 4. Sous-traitants principaux

- **Firebase (Google) :** hébergement, base de données, auth, functions.  
- **Paiement :** Stripe, PayPal, Kkiapay (données strictement nécessaires).  
- **IA / Traduction :** OpenAI, Google Translate (données minimisées, pas de réutilisation pour entraînement sans accord).

## 5. Mise à jour

Cette cartographie est mise à jour lors de l’ajout de nouvelles collections ou finalités. Dernière révision : 2025.

---

© UnimentorAI – Tous droits réservés.
