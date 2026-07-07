# Audit qualité sans compromis – UnimentorAI

**Date :** 2025  
**Périmètre :** Application Flutter, Cloud Functions, Firestore, sécurité, tests, documentation.

---

## 1. Résumé exécutif

| Critère | Note | Statut |
|--------|------|--------|
| **Architecture & structure** | 5/10 | Problèmes majeurs (duplication, 2 points d’entrée, incohérences) |
| **Sécurité** | 4/10 | Critiques (faux chiffrement, clé IA côté client, .env en asset) |
| **Qualité du code** | 5/10 | print() en prod, duplication, dépendance manquante |
| **Dépendances** | 6/10 | flutter_secure_storage absent du pubspec, analyse_options dupliquée |
| **Tests** | 6/10 | Présents mais mocks masquent des bugs réels |
| **Documentation** | 6/10 | README vs code (Riverpod vs Provider), règles dupliquées |

**Verdict :** L’application n’est **pas prête pour une mise en production sans correctifs**. Plusieurs points sont **bloquants** (sécurité et cohérence).

---

## 2. Architecture et structure

### 2.1 Deux points d’entrée (critique)

- **`lib/main.dart`** : `UniMentorAIApp` → SplashScreen, **sans** Firebase, sans consentement, sans thème avancé.
- **`lib/app/main.dart`** : `MyApp` avec Firebase.initializeApp(), consentement analytics, LocalAuthService, go_router.

**Problème :** Selon la cible de build, l’app peut démarrer avec ou sans Firebase. Risque de crash ou de comportement incohérent. Le README indique Flutter + Firebase : un seul point d’entrée (avec Firebase) doit être utilisé.

**Recommandation :** Supprimer ou déprécier `lib/main.dart` et n’utiliser que `lib/app/main.dart` (ou inversement, en documentant clairement).

### 2.2 Duplication de code (majeur)

- **Auth :**  
  - `lib/core/services/auth_service.dart` (FlutterSecureStorage, refresh token)  
  - `lib/services/auth_service.dart` (duplication de signUp/login)  
  → Deux implémentations d’auth, risque de divergence.

- **Écrans dupliqués :**  
  - `lib/screens/` (login, signup, home, profile, courses, quiz, etc.)  
  - `lib/features/` (mêmes domaines en presentation/)  
  → Doublons (screens vs features), maintenance difficile.

- **Modules orphelins :**  
  - `lib/modules/admin/`, `lib/modules/localizations/`  
  - Équivalents dans `lib/features/` (translation_validator_screen, translation_service, verified_text_widget)  
  → Structure incohérente (features vs modules).

- **Services :**  
  - `lib/services/` (user_service, course_progress_service, certificat_service, firestore_translation_service, auth_service)  
  - `lib/features/*/services/` et `lib/core/services/`  
  → Même logique éclatée à plusieurs endroits.

**Recommandation :** Un seul emplacement par domaine (ex. `features/auth/`, `features/courses/`), suppression ou migration des doublons vers cette structure.

### 2.3 Incohérence state management

- **README :** « Riverpod pour la gestion d’état ».
- **pubspec.yaml :** `provider: ^6.1.1` (pas de Riverpod).
- **Code :** Utilisation de `Provider` (provider/), pas de package `flutter_riverpod`.

**Recommandation :** Aligner README et code : soit documenter Provider, soit migrer vers Riverpod et mettre à jour le pubspec.

### 2.4 analysis_options.yaml

- Règles dupliquées : `prefer_typing_uninitialized_variables`, `prefer_void_to_null`, `prefer_inlined_adds`, `prefer_is_empty`, `prefer_is_not_empty`, `prefer_iterable_whereType`, `prefer_null_aware_operators`, `prefer_relative_imports` apparaissent deux fois.
- `avoid_print` est commenté : les `print()` restent autorisés alors qu’ils ne doivent pas être utilisés en production.

**Recommandation :** Supprimer les doublons et activer `avoid_print: true` (et remplacer les print par un logger).

---

## 3. Sécurité

### 3.1 Faux chiffrement dans SecurityService (bloquant)

**Fichier :** `lib/core/services/security_service.dart`

- **`encryptSensitiveData`** : fait `sha256.convert(bytes)` puis `base64Encode(digest.bytes)` → c’est un **hash** (irréversible), pas un chiffrement.
- **`decryptSensitiveData`** : fait `base64Decode` puis `utf8.decode` → ne peut **pas** retrouver la donnée d’origine à partir d’un hash SHA256.

**Conséquence :** Les clés API stockées via `storeApiKey` ne sont **jamais** récupérables correctement avec `getApiKey` (les octets du hash ne sont en général pas du UTF-8 valide). Comportement incorrect et risque de perte de clés / échecs silencieux.

**Recommandation :** Utiliser un vrai chiffrement symétrique (ex. AES avec package dédié ou point d’API sécurisé) pour stocker/récupérer les secrets. Ne pas utiliser SHA256 pour « déchiffrer ».

### 3.2 Clé OpenAI exposée côté client (bloquant)

**Fichier :** `lib/features/chatbot/services/chatbot_service.dart`

- Le chatbot lit `chatbot_config` dans Firestore (`getConfig()`) et récupère `openai_api_key`.
- Il envoie ensuite la requête **depuis l’app Flutter** avec `Authorization: Bearer $apiKey`.

**Problème :** Si une règle Firestore autorise la lecture de `chatbot_config` (ou si elle est ajoutée plus tard), la clé OpenAI est exposée à tout client ayant accès. De plus, les clés secrètes ne doivent jamais être utilisées dans une app cliente (reverse engineering, proxy, logs).

**Recommandation :** Déplacer l’appel OpenAI dans une **Cloud Function** (callable). L’app n’envoie que le message ; la Function lit la clé (config Firebase ou env) et appelle l’API.

### 3.3 Fichier .env dans les assets (risque élevé)

**Fichier :** `pubspec.yaml`

```yaml
assets:
  - .env
```

- `.env` est inclus comme asset et peut être livré dans le build (APK/IPA/web).
- Même si `.env` est dans `.gitignore`, un développeur peut avoir un `.env` local avec des clés ; elles se retrouveraient dans l’app compilée.

**Recommandation :** Retirer `.env` des assets. Utiliser des variables d’environnement de build (--dart-define / flutter_dotenv chargé hors assets) ou un backend pour les secrets, jamais de fichier .env embarqué.

### 3.4 SecurityService et SharedPreferences

- **Ligne 13 :** `final SharedPreferences _prefs = SharedPreferences.getInstance() as SharedPreferences;`  
  `getInstance()` retourne un **Future<SharedPreferences>**, pas SharedPreferences. Le cast est faux et peut provoquer des erreurs à l’exécution.

**Recommandation :** Rendre l’initialisation asynchrone (ex. `await SharedPreferences.getInstance()` dans `initialize()`) et conserver la référence dans un champ après init.

### 3.5 Règles Firestore et chatbot_config

- Aucune règle explicite pour la collection `chatbot_config` dans `firestore.rules`. Par défaut, accès refusé. Si plus tard une règle est ajoutée pour permettre la lecture (ex. pour admin), il faudra s’assurer que le document ne contient **pas** la clé API côté client. La solution sûre reste d’appeler l’IA uniquement depuis une Cloud Function.

---

## 4. Qualité du code

### 4.1 Utilisation de print() / debugPrint

- **Fichiers concernés (entre autres) :**  
  - `lib/core/security/secure_config.dart` (plusieurs print)  
  - `lib/core/services/auth_service.dart`  
  - `lib/services/user_service.dart`, `lib/services/firestore_translation_service.dart`  
  - `lib/features/admin/presentation/subscriptions_admin_screen.dart`  
  - `lib/services/auth_service.dart`

**Problème :** En production, les print peuvent exposer des informations sensibles (erreurs, chemins, tokens) et polluent les logs. Ils ne sont pas désactivables par niveau (debug vs release).

**Recommandation :** Utiliser un logger (ex. `logger`, `logging`) avec niveaux et désactiver les logs sensibles en release. Activer la règle `avoid_print` dans `analysis_options.yaml`.

### 4.2 Gestion des erreurs

- Beaucoup de `catch (e)` qui font uniquement `print('...')` ou renvoient null sans remonter l’erreur ni la logger correctement.
- L’utilisateur peut ne pas être informé (pas de message, pas de SnackBar/dialog).

**Recommandation :** Centraliser la gestion d’erreurs (ex. zone ou wrapper), logger de façon structurée, et afficher un message utilisateur adapté (et non technique).

### 4.3 Dépendance manquante

- **`flutter_secure_storage`** est importé dans :  
  - `lib/core/services/auth_service.dart`  
  - `lib/services/auth/local_auth_service.dart`  
- Il **n’apparaît pas** dans `pubspec.yaml`.

**Conséquence :** `flutter pub get` / build échouent tant que la dépendance n’est pas ajoutée.

**Recommandation :** Ajouter `flutter_secure_storage` dans `pubspec.yaml` (avec une version compatible).

---

## 5. Dépendances et performances

### 5.1 pubspec.yaml

- Dépendances globalement à jour (SDK >=3.4.0, Firebase récent).
- Pas de `flutter_secure_storage` alors qu’il est utilisé (voir ci‑dessus).

### 5.2 Cloud Functions

- `functions/package.json` (si c’est celui lu) ressemble à un projet React (react-scripts, etc.) et non à un projet Node pour Firebase Functions. À vérifier : le vrai `package.json` des functions doit contenir `firebase-functions`, `firebase-admin`, etc.
- `keyFilename: 'serviceAccountKey.json'` dans `functions/index.js` : ce fichier ne doit **jamais** être versionné. Vérifier qu’il est bien dans `.gitignore` et utilisé uniquement en local/CI sécurisé.

### 5.3 Performances

- Pas de détection évidente de N+1 Firestore dans les extraits audités ; à valider sur les écrans listant beaucoup de documents (pagination, limit).
- `lib/app/main.dart` : une requête Firestore au démarrage (consentement user) peut ralentir le premier affichage ; envisager cache ou chargement asynchrone sans bloquer la première frame.

---

## 6. Tests

### 6.1 Couverture

- Présence de tests (unitaires, widgets, accessibilité, performance) dans `test/`.
- Tests dupliqués possibles (ex. plusieurs `auth_service_test.dart` dans différents dossiers).

### 6.2 Qualité des tests

- **Exemple `security_service_test.dart` :** Les tests mockent `SecurityService` et vérifient que le mock renvoie des valeurs données. Ils ne testent **pas** le comportement réel de `encryptSensitiveData` / `decryptSensitiveData`. Le bug du faux chiffrement ne serait donc pas détecté.
- **Recommandation :** Ajouter des tests **sans mock** sur la logique critique (ex. chiffrement/déchiffrement avec une vraie implémentation, ou tests d’intégration sur un service de sécurité corrigé).

### 6.3 Tests d’intégration / E2E

- Présence de `integration_test` dans le SDK. À confirmer que des scénarios critiques (auth, parcours cours, paiement) sont couverts par des tests d’intégration ou E2E.

---

## 7. Documentation

- **README vs code :** README indique Riverpod ; le projet utilise Provider. À corriger pour éviter toute confusion.
- **Architecture :** La structure réelle (screens + features + modules + services à la racine) ne correspond pas entièrement au schéma « features/ avec presentation|services|provider » décrit. Mettre à jour le README ou la structure.
- **Audits existants :** `audit_report.md` et outils dans `tools/` sont utiles ; les recommandations (fichiers hors structure, features incomplètes) restent valables et complémentaires à ce rapport.

---

## 8. Synthèse des actions prioritaires

### Bloquant (à traiter avant toute mise en production)

1. **Sécurité – Chiffrement :** Corriger `SecurityService` (vrai chiffrement symétrique pour stocker/récupérer les clés, ou supprimer l’usage de « déchiffrement » si le besoin est uniquement du hash).
2. **Sécurité – Clé OpenAI :** Ne plus jamais utiliser la clé OpenAI dans l’app Flutter. Exposer un callable Cloud Function qui reçoit le message, appelle OpenAI côté serveur, et renvoie la réponse.
3. **Assets :** Retirer `.env` de la section `assets` de `pubspec.yaml` et ne plus embarquer de secrets dans l’app.
4. **SecurityService :** Corriger l’utilisation de `SharedPreferences` (async init, pas de cast sur `getInstance()`).
5. **Dépendance :** Ajouter `flutter_secure_storage` au `pubspec.yaml` (ou supprimer son usage si non voulu).

### Majeur (sous quelques sprints)

6. **Point d’entrée :** Un seul `main.dart` (avec Firebase), documenter et supprimer/déprécier l’autre.
7. **Duplication :** Unifier auth, écrans et services (une structure features/ cohérente, migration ou suppression de `lib/screens/` et `lib/modules/`).
8. **Logging :** Remplacer tous les `print()` par un logger et activer `avoid_print`.
9. **Règles d’analyse :** Nettoyer `analysis_options.yaml` (doublons, `avoid_print` activé).
10. **README / doc :** Aligner avec l’état du code (Provider, structure réelle).

### Important (qualité continue)

11. **Tests :** Tests unitaires sur la logique réelle de sécurité (sans mocker le service testé pour ces cas).
12. **Gestion d’erreurs :** Centraliser et améliorer le retour utilisateur et les logs.
13. **Règles Firestore :** Documenter et sécuriser l’usage de `chatbot_config` (idéalement : pas de clé API dans des documents lisibles par le client).

---

## 9. Grille de score détaillée

| Thème | Détail | Note |
|-------|--------|------|
| Architecture | Double main, duplication screens/features/modules, incohérence state management | 5/10 |
| Sécurité | Faux chiffrement, clé IA client, .env en asset, SharedPreferences mal utilisé | 4/10 |
| Code | print(), erreurs avalées, dépendance manquante | 5/10 |
| Dépendances | pubspec cohérent sauf flutter_secure_storage, analysis_options dupliquée | 6/10 |
| Tests | Présence de tests mais mocks cachent les vrais bugs | 6/10 |
| Documentation | README vs code (Riverpod/Provider, structure) | 6/10 |

**Note globale estimée : 5,3/10** – À faire monter par les correctifs bloquants et majeurs ci‑dessus.

---

**Conclusion :** Cet audit qualité sans compromis identifie des **blocants de sécurité et de cohérence** qui doivent être traités avant une mise en production. Une fois les points bloquants et majeurs corrigés, une ré-audit ciblé (sécurité + structure) est recommandé.

---

© UnimentorAI – Audit interne – Tous droits réservés.
