# Politique de rotation des clés – UniMentorAI

Ce document définit les bonnes pratiques de **rotation des clés de sécurité** pour la plateforme UniMentorAI.

## Fréquences recommandées

| Clé                      | Fréquence recommandée |
| ------------------------ | --------------------- |
| OpenAI                   | 90 jours              |
| Stripe                   | 180 jours             |
| Firebase service account | 180 jours             |

Ces valeurs correspondent à un niveau « production institutionnelle » (universités, organismes publics, grandes entreprises).

## Principes généraux

- **Aucune clé ne doit être stockée dans le dépôt Git.**  
  - Pas de clés dans le code source, les fichiers `.env`, ni les assets embarqués.  
  - Les exemples de config doivent utiliser des valeurs factices (placeholders).

- **Toutes les clés sensibles doivent être gérées via un secret manager.**  
  - Pour UniMentorAI, la solution recommandée est **Firebase / Google Cloud Secret Manager**.  
  - Les Cloud Functions lisent les secrets via la configuration sécurisée (ex : `functions.config()` ou accès Secret Manager).

- **La rotation doit être planifiée et testée.**  
  - Documentation des procédures de rotation par environnement (dev, staging, prod).  
  - Vérification des intégrations (paiement, IA, envoi d’emails, etc.) après chaque rotation.

## Processus type de rotation

1. **Créer une nouvelle clé** dans le fournisseur (OpenAI, Stripe, GCP service account).  
2. **Mettre à jour le secret** correspondant dans Firebase / Google Cloud Secret Manager.  
3. **Redémarrer / redéployer** les services dépendants (Cloud Functions, backend, etc.).  
4. **Vérifier les journaux** pour s’assurer qu’il n’y a pas d’erreur d’authentification.  
5. **Révoquer l’ancienne clé** une fois la nouvelle confirmée en production.

## Points de contrôle

- Revue régulière des clés actives dans chaque fournisseur.  
- Vérification que les droits associés aux clés sont **limités au strict nécessaire** (principe du moindre privilège).  
- Traçabilité des rotations (qui, quand, justification).

En appliquant ces règles, UniMentorAI maintient un niveau de sécurité compatible avec les exigences d’une plateforme EdTech mondiale.

