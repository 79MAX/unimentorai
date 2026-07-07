# GitHub Actions - UniMentorAI

## 📋 Workflows Disponibles

### 1. CI (Continuous Integration) - `ci.yml`
**Déclenchement** : Push sur `main` et Pull Requests

**Étapes** :
- ✅ Installation Flutter 3.22.x
- ✅ Installation des dépendances
- ✅ Tests Dart
- ✅ Analyse statique (`flutter analyze`)
- ✅ Vérification couverture > 80%
- ✅ Audit global de qualité
- ✅ Audit d'architecture
- ✅ Audit de sécurité
- ✅ Audit internationalisation
- ✅ Tests de build (Android, iOS, Web)
- ✅ Upload rapport couverture

### 2. Deploy (Déploiement) - `deploy.yml`
**Déclenchement** : Tags `v*` (ex: v1.0.0)

**Plateformes** :
- 📱 **Android** : Play Store
- 🍎 **iOS** : App Store Connect
- 🌐 **Web** : Firebase Hosting

### 3. Security Audit (Audit Sécurité) - `security-audit.yml`
**Déclenchement** : Hebdomadaire (lundi 2h) + manuel

**Vérifications** :
- 🔍 Scan des secrets dans le code
- 🔍 Audit des dépendances
- 🔍 Vérification des permissions
- 🔍 Scan des URLs non sécurisées
- 📊 Génération rapport de sécurité

## 🔐 Security & Secret Rotation

⚠️ **Ces tests sont bloquants avant toute mise en production.**

Procédure de **rotation des secrets** (Secret Manager / fournisseurs) + **validation post-rotation** (smoke tests automatisés).

**Environnement** : `sandbox` / `staging` uniquement — **interdiction** d’exécution non contrôlée sur la production (pas de smoke « prod » hors cadre validé : secrets isolés, fenêtre, rollback).

`Rotate → Deploy → Smoke tests → Validate`

→ **[Runbook — rotation, smoke tests, critères go/no-go](../docs/SECRET_ROTATION_RUNBOOK.md#smoke-tests-post-rotation-bloquant)** · workflow [`post-rotation-smoke.yml`](workflows/post-rotation-smoke.yml) (`workflow_dispatch`).

## 🔐 Secrets Requis

### Pour le Déploiement Android
```bash
ANDROID_KEYSTORE          # Keystore encodé en base64
ANDROID_STORE_PASSWORD    # Mot de passe du keystore
ANDROID_KEY_ALIAS         # Alias de la clé
ANDROID_KEY_PASSWORD      # Mot de passe de la clé
PLAY_STORE_CONFIG_JSON    # Configuration Google Play
```

### Pour le Déploiement iOS
```bash
APPLE_API_KEY            # Clé API Apple
APPLE_API_KEY_ID         # ID de la clé API
APPLE_ISSUER_ID          # ID de l'émetteur
```

### Pour le Déploiement Web
```bash
FIREBASE_SERVICE_ACCOUNT # Configuration Firebase
```

## 🚀 Utilisation

### Déclencher un Build
```bash
# Push sur main
git push origin main

# Créer une Pull Request
gh pr create --title "Feature" --body "Description"
```

### Déployer une Version
```bash
# Créer un tag
git tag v1.0.0
git push origin v1.0.0
```

### Audit Manuel
```bash
# Via GitHub Actions UI
# Ou via GitHub CLI
gh workflow run security-audit.yml
```

## 📊 Métriques de Qualité

### Seuils Minimums
- **Couverture de tests** : > 80%
- **Analyse statique** : 0 erreurs
- **Sécurité** : 0 vulnérabilités
- **Architecture** : Conformité Clean Architecture

### Badges
```markdown
![CI](https://github.com/username/unimentorai/workflows/UniMentorAI%20CI/badge.svg)
![Security](https://github.com/username/unimentorai/workflows/UniMentorAI%20Security%20Audit/badge.svg)
![Coverage](https://codecov.io/gh/username/unimentorai/branch/main/graph/badge.svg)
```

## 🔧 Configuration Locale

### Prérequis
```bash
# Installer Flutter
flutter --version

# Installer Node.js
node --version

# Installer les outils d'audit
npm install -g glob
```

### Tests Locaux
```bash
# Tests Dart
dart test

# Analyse statique
flutter analyze

# Audit global
dart run tools/audit_all.dart

# Audit architecture
node tools/audit_architecture.js
```

## 📝 Logs et Rapports

### Artifacts Générés
- `coverage.lcov` : Rapport de couverture
- `security_report.md` : Rapport de sécurité
- `build/` : Builds des plateformes

### Accès aux Logs
1. Aller sur GitHub Actions
2. Sélectionner le workflow
3. Cliquer sur le job
4. Télécharger les logs

## 🆘 Dépannage

### Erreurs Communes
1. **Couverture insuffisante** : Ajouter des tests
2. **Secrets détectés** : Utiliser des variables d'environnement
3. **Build échoué** : Vérifier les dépendances
4. **Permissions manquantes** : Configurer les secrets

### Support
- 📧 Issues GitHub
- 📖 Documentation Flutter
- 🔗 GitHub Actions Docs 