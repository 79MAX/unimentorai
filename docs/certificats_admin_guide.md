# Guide Administrateur & Utilisateur – Certificats UniMentorAI

## Sommaire
- [1. Génération d’un certificat (utilisateur)](#1-génération-dun-certificat-utilisateur)
- [2. Vérification d’un certificat (tiers)](#2-vérification-dun-certificat-tiers)
- [3. Export CSV des certificats (admin)](#3-export-csv-des-certificats-admin)
- [4. Automatisation CI/CD](#4-automatisation-cicd)
- [5. Accessibilité et bonnes pratiques](#5-accessibilité-et-bonnes-pratiques)

---

## 1. Génération d’un certificat (utilisateur)
- L’utilisateur termine un cours dans l’application.
- Il clique sur **« Générer mon certificat »**.
- Le certificat est créé dans Firestore, un QR code unique est généré.
- L’utilisateur peut afficher, télécharger ou imprimer son certificat (PDF avec QR code, logo, signature).

## 2. Vérification d’un certificat (tiers)
- Scanner le QR code du certificat (ou ouvrir le lien).
- La page web de vérification s’ouvre et affiche :
  - Nom, cours, date, statut, badge « Vérifié », QR code.
  - Accessibilité garantie (contraste, ARIA, responsive).

## 3. Export CSV des certificats (admin)
- Se connecter au serveur Node.js.
- Accéder à l’URL :
  - `http://localhost:3000/certs/export`
  - ou `https://unimentorai.com/certs/export`
- Télécharger le fichier `certificats.csv` contenant : ID, nom, cours, date, statut.

## 4. Automatisation CI/CD
- Un workflow GitHub Actions (`.github/workflows/certificat-ci.yml`) automatise :
  - Les tests Flutter (widget + intégration) sur la partie certificat.
  - L’export CSV automatique après chaque push.
- Pour lancer manuellement :
  - Pousser une modification sur la branche principale ou sur un fichier lié aux certificats.
  - Le CSV est généré et téléchargeable dans les artefacts du workflow.

## 5. Accessibilité et bonnes pratiques
- La page de vérification est accessible (balises ARIA, contraste, responsive, navigation clavier).
- Le PDF du certificat est lisible, imprimable, et compatible avec les lecteurs d’écran.
- Le QR code permet une vérification instantanée et infalsifiable.

---

## FAQ
- **Comment ajouter un logo ?**
  - Placez votre logo dans `assets/logo.png` et déclarez-le dans `pubspec.yaml`.
- **Comment personnaliser la signature ?**
  - Modifiez la fonction `createCertificatePdf` pour utiliser une image de signature.
- **Comment ajouter un certificat manuellement ?**
  - Ajoutez un document dans la collection `certificates` de Firestore avec les champs requis.
- **Comment révoquer un certificat ?**
  - Modifiez le champ `status` à `révoqué` dans Firestore.

---

Pour toute question, contactez l’équipe UniMentorAI ou ouvrez une issue sur GitHub. 

## Sommaire
- [1. Génération d’un certificat (utilisateur)](#1-génération-dun-certificat-utilisateur)
- [2. Vérification d’un certificat (tiers)](#2-vérification-dun-certificat-tiers)
- [3. Export CSV des certificats (admin)](#3-export-csv-des-certificats-admin)
- [4. Automatisation CI/CD](#4-automatisation-cicd)
- [5. Accessibilité et bonnes pratiques](#5-accessibilité-et-bonnes-pratiques)

---

## 1. Génération d’un certificat (utilisateur)
- L’utilisateur termine un cours dans l’application.
- Il clique sur **« Générer mon certificat »**.
- Le certificat est créé dans Firestore, un QR code unique est généré.
- L’utilisateur peut afficher, télécharger ou imprimer son certificat (PDF avec QR code, logo, signature).

## 2. Vérification d’un certificat (tiers)
- Scanner le QR code du certificat (ou ouvrir le lien).
- La page web de vérification s’ouvre et affiche :
  - Nom, cours, date, statut, badge « Vérifié », QR code.
  - Accessibilité garantie (contraste, ARIA, responsive).

## 3. Export CSV des certificats (admin)
- Se connecter au serveur Node.js.
- Accéder à l’URL :
  - `http://localhost:3000/certs/export`
  - ou `https://unimentorai.com/certs/export`
- Télécharger le fichier `certificats.csv` contenant : ID, nom, cours, date, statut.

## 4. Automatisation CI/CD
- Un workflow GitHub Actions (`.github/workflows/certificat-ci.yml`) automatise :
  - Les tests Flutter (widget + intégration) sur la partie certificat.
  - L’export CSV automatique après chaque push.
- Pour lancer manuellement :
  - Pousser une modification sur la branche principale ou sur un fichier lié aux certificats.
  - Le CSV est généré et téléchargeable dans les artefacts du workflow.

## 5. Accessibilité et bonnes pratiques
- La page de vérification est accessible (balises ARIA, contraste, responsive, navigation clavier).
- Le PDF du certificat est lisible, imprimable, et compatible avec les lecteurs d’écran.
- Le QR code permet une vérification instantanée et infalsifiable.

---

## FAQ
- **Comment ajouter un logo ?**
  - Placez votre logo dans `assets/logo.png` et déclarez-le dans `pubspec.yaml`.
- **Comment personnaliser la signature ?**
  - Modifiez la fonction `createCertificatePdf` pour utiliser une image de signature.
- **Comment ajouter un certificat manuellement ?**
  - Ajoutez un document dans la collection `certificates` de Firestore avec les champs requis.
- **Comment révoquer un certificat ?**
  - Modifiez le champ `status` à `révoqué` dans Firestore.

---

Pour toute question, contactez l’équipe UniMentorAI ou ouvrez une issue sur GitHub. 
 