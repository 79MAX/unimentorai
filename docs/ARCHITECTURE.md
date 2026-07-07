# Architecture globale – UniMentorAI

Ce document résume l’architecture Flutter et Firebase de UniMentorAI à un niveau « plateforme EdTech mondiale ».

---

## 1. Architecture Flutter

Structure officielle :

```text
lib/
  app/        # Entrée app, theming, navigation globale, consentement analytics
  core/       # Services partagés (auth, sécurité, paiement, gamification…), modèles, config
  features/   # Fonctionnalités métier (auth, courses, pricing, mentoring, chatbot, settings…)
  shared/     # Widgets et utilitaires génériques (présent ou à compléter)
```

### 1.1. Pattern par feature

```text
lib/features/<domaine>/
  presentation/   # UI, écrans, widgets
  services/       # Services métier spécifiques
  provider/       # State management (Provider / Riverpod)
```

Exemples :

- `features/auth/…` : inscription, connexion, login sécurisé local.  
- `features/courses/…` : liste de cours, détail, progression, feedback.  
- `features/chatbot/…` : écran chatbot, service IA.  
- `features/pricing/…` : gestion de la facturation, comparaison offres.  
- `features/mentoring/…` : reverse mentoring, dashboard mentoring.  

### 1.2. Entrée applicative (`lib/app/main.dart`)

- Initialisation Firebase (`Firebase.initializeApp`).  
- Performance Monitoring (`FirebasePerformance`).  
- Lecture du consentement analytics dans `users/<uid>.privacy_consent`.  
- Routage initial selon mot de passe local sécurisé (`LocalAuthService`).  
- Thème clair/sombre (toggle dans `HomeScreen`) et palette `AppColors`.

---

## 2. Architecture Firebase

Services principaux utilisés :

```text
Auth         # Authentification (email/mot de passe, Google)
Firestore    # Données métier (users, courses, payments, mentoring, chatbot_sessions, etc.)
Functions    # Backend sécurisé (IA, conformité, scoring, backups…)
Storage      # Fichiers (certificats, assets pédagogiques, uploads)
Hosting      # Frontends web / assets statiques
Analytics    # Statistiques d’usage (respect du consentement)
Performance  # Mesure des performances en production
Crashlytics  # Suivi des crashs et erreurs
```

### 2.1. Collections critiques (exemples)

- `users` : profils, préférences, consentements, rôle (apprenant, mentor, admin).  
- `courses` + sous‑collections : contenu de cours, étapes, traductions, progression.  
- `payments` / `subscriptions` : paiements et abonnements.  
- `certificates` : certificats numériques, métadonnées de vérification.  
- `mentoring_sessions` : sessions de mentoring, liens mentor–apprenant.  
- `chatbot_sessions` : conversations IA par session utilisateur.  
- Collections de conformité : `ai_decision_traces`, `legal_consents`, `legal_logs`, `security_audit_events`, etc.

### 2.2. Cloud Functions

Fonctions principales (non exhaustif) :

- Génération automatique de cours manquants (IA + RAG).  
- Traduction de contenus pédagogiques.  
- Moteurs de conformité :  
  - `AI_DECISION_TRACE_ENGINE`  
  - `LEGAL_LOGGER_SYSTEM`  
  - `SECURITY_AUDIT_DASHBOARD`  
  - `AI_ETHICS_MONITOR`  
  - `UNIMENTORAI_SCORE_ENGINE`  
  - `DROPOUT_RISK_ENGINE`  
  - `LITIGATION_DEFENSE_MODULE`  
- Chatbot IA (`generateChatbotReply`), appelé depuis Flutter via `FirebaseFunctions`.  
- Backups programmés (Cloud Scheduler + Firestore export).

---

## 3. Sécurité

### 3.1. Côté client (Flutter)

- **Chiffrement local AES‑256** via `SecurityService` (lib `encrypt`) pour les données sensibles.  
- **Clés API** : stockées chiffrées, jamais en clair dans le code ni dans les assets.  
- **Stockage sécurisé** : `flutter_secure_storage` (Android EncryptedSharedPreferences, Keychain iOS…).  
- **Gestion de session** : possibilité de stocker un token rafraîchi de manière sécurisée.  
- **Interdiction des `print()`** en production (`analysis_options.yaml` impose `avoid_print`).

### 3.2. IA côté serveur

- Toutes les intégrations IA critiques (OpenAI, génération de cours, chatbot) sont exécutées **côté serveur** via Cloud Functions.  
- Les clés IA (OpenAI) résident uniquement dans la configuration Functions / Secret Manager.  
- Les décisions IA sont tracées (AI_DECISION_TRACE_ENGINE) avec score de confiance, sources et explicabilité.

### 3.3. Règles Firestore

- Règles fines par collection (`users`, `courses`, `payments`, `mentoring_sessions`, `chatbot_conversations`, logs, conformité…).  
- Rôles `admin` / `enterprise_admin` via custom claims pour l’accès aux dashboards et données sensibles.  
- Validation des données d’entrée (taille, formats, clés obligatoires).  
- Limitations de requêtes et collections spéciales pour les données supprimées / backups.

### 3.4. Crashlytics & Performance

- **Crashlytics** : configuration de `FlutterError.onError` pour remonter les erreurs globales.  
- **Performance Monitoring** : trace `app_startup` et possibilité de tracer les écrans/flows critiques.

---

## 4. Bonnes pratiques de contribution

- Nouvelle fonctionnalité : créer une feature dédiée dans `lib/features/<domaine>/…`.  
- Pas de nouveau code métier dans `lib/screens/` ou `lib/modules/` (legacy documenté dans `docs/LEGACY.md`).  
- Aucune clé ou secret dans le code ou les assets (voir `docs/SECURITY_ROTATION.md`).  
- Respect des règles de lint (`analysis_options.yaml`) et des workflows CI/CD (`.github/workflows/*.yml`).

Cette architecture est conçue pour supporter une montée en charge vers **10M+ utilisateurs** tout en restant maintenable et conforme aux exigences institutionnelles.

