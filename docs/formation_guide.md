# Guide de formation – Équipes UniMentorAI

## 1. Prise en main de l’admin panel
- Accès sécurisé (compte admin requis)
- Consultation des souscriptions et factures (filtres par segment, email, date)
- Accès direct aux factures PDF
- Export CSV des souscriptions/factures
- Suppression d’une souscription/facture (conformité RGPD)

## 2. Gestion des souscriptions/factures
- Vérifier le statut d’une souscription (payée, en attente, annulée)
- Relancer un client (email automatique ou manuel)
- Générer une nouvelle facture si besoin (Cloud Function)
- Suivi des paiements (Stripe/Firebase Billing)

## 3. Export RGPD et conformité
- Exporter toutes les données d’un utilisateur (script export_rgpd.js)
- Répondre à une demande d’export ou de suppression sous 30 jours (obligation légale)
- Supprimer les données sur demande (admin panel ou script)
- Tenir un registre des consentements et des exports

## 4. Bonnes pratiques RGPD
- Toujours obtenir le consentement explicite avant toute souscription
- Ne jamais transmettre de données personnelles sans chiffrement
- Utiliser les exports uniquement pour répondre à une demande légale
- Documenter toute suppression/export dans le registre RGPD

## 5. Support & sécurité
- En cas de problème technique, contacter support@unimentor.ai
- Ne jamais partager les accès admin sans autorisation
- Changer régulièrement les mots de passe/admins
- Activer la double authentification sur tous les comptes sensibles

## 6. Process de publication/appels d’offres
- Préparer un dossier avec :
  - Grille tarifaire exportée (PDF)
  - CGU/RGPD signées
  - Exemples de factures
  - Rapport d’audit qualité (audit_report.md)
  - Présentation de la plateforme (PDF/PowerPoint)
- Utiliser le simulateur pour générer des devis personnalisés
- Exporter les factures et données sur demande pour les appels d’offres publics/privés

## 7. FAQ
- **Comment réinitialiser un accès admin ?**
  Utiliser la console Firebase Auth ou contacter le support.
- **Comment prouver la conformité RGPD ?**
  Fournir le registre des consentements, les exports, et le rapport d’audit.
- **Comment ajouter un nouveau segment/tarif ?**
  Modifier le JSON de pricing ou utiliser l’admin panel (si disponible).

---

**Ce guide doit être lu et appliqué par toute personne ayant accès à l’admin panel ou aux données sensibles UniMentorAI.** 