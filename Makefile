# Makefile pour UniMentorAI

.PHONY: help install clean test test-unit test-widget test-integration test-coverage test-all build deploy audit

# Variables
FLUTTER := flutter
DART := dart
NODE := node

# Aide
help:
	@echo "🚀 UniMentorAI - Commandes Disponibles"
	@echo ""
	@echo "📦 Installation:"
	@echo "  install          Installer les dépendances"
	@echo "  clean            Nettoyer le projet"
	@echo ""
	@echo "🧪 Tests:"
	@echo "  test             Lancer tous les tests"
	@echo "  test-unit        Tests unitaires uniquement"
	@echo "  test-widget      Tests de widgets uniquement"
	@echo "  test-integration Tests d'intégration uniquement"
	@echo "  test-coverage    Tests avec couverture"
	@echo "  test-performance Tests de performance"
	@echo ""
	@echo "🏗️  Build:"
	@echo "  build            Build pour toutes les plateformes"
	@echo "  build-android    Build Android"
	@echo "  build-ios        Build iOS"
	@echo "  build-web        Build Web"
	@echo ""
	@echo "🔍 Audit:"
	@echo "  audit            Audit global"
	@echo "  audit-arch       Audit architecture"
	@echo "  audit-security   Audit sécurité"
	@echo ""
	@echo "🚀 Déploiement:"
	@echo "  deploy           Déployer l'application"

# Installation
install:
	@echo "📦 Installation des dépendances..."
	$(FLUTTER) pub get
	$(NODE) npm install
	@echo "✅ Dépendances installées"

clean:
	@echo "🧹 Nettoyage du projet..."
	$(FLUTTER) clean
	$(FLUTTER) pub get
	@echo "✅ Projet nettoyé"

# Tests
test: test-unit test-widget test-integration test-coverage
	@echo "🎉 Tous les tests terminés avec succès !"

test-unit:
	@echo "🧪 Tests unitaires..."
	$(FLUTTER) test test/unit/
	@echo "✅ Tests unitaires terminés"

test-widget:
	@echo "🧪 Tests de widgets..."
	$(FLUTTER) test test/widgets/
	@echo "✅ Tests de widgets terminés"

test-integration:
	@echo "🧪 Tests d'intégration..."
	$(FLUTTER) test integration_test/
	@echo "✅ Tests d'intégration terminés"

test-coverage:
	@echo "📊 Tests avec couverture..."
	$(DART) pub global activate coverage
	$(FLUTTER) test --coverage
	genhtml coverage/lcov.info -o coverage/html
	@echo "✅ Couverture générée: coverage/html/index.html"

test-performance:
	@echo "⚡ Tests de performance..."
	$(FLUTTER) test test/performance/
	@echo "✅ Tests de performance terminés"

test-all: test test-performance
	@echo "🎯 Tous les tests (incluant performance) terminés !"

# Build
build: build-android build-ios build-web
	@echo "🏗️  Builds terminés pour toutes les plateformes"

build-android:
	@echo "📱 Build Android..."
	$(FLUTTER) build apk --release
	@echo "✅ Build Android terminé"

build-ios:
	@echo "🍎 Build iOS..."
	$(FLUTTER) build ios --release --no-codesign
	@echo "✅ Build iOS terminé"

build-web:
	@echo "🌐 Build Web..."
	$(FLUTTER) build web
	@echo "✅ Build Web terminé"

# Audit
audit: audit-arch audit-security
	@echo "🔍 Audit global terminé"

audit-arch:
	@echo "🏗️  Audit architecture..."
	$(NODE) tools/audit_architecture.js
	@echo "✅ Audit architecture terminé"

audit-security:
	@echo "🛡️  Audit sécurité..."
	$(NODE) tools/audit_security.js
	@echo "✅ Audit sécurité terminé"

# Déploiement
deploy: test build
	@echo "🚀 Déploiement..."
	@echo "✅ Application prête pour le déploiement"

# CI/CD
ci: install test audit build
	@echo "🔄 CI/CD terminé avec succès"

# Développement
dev:
	@echo "🚀 Lancement en mode développement..."
	$(FLUTTER) run

# Documentation
docs:
	@echo "📚 Génération de la documentation..."
	$(DART) doc
	@echo "✅ Documentation générée"

# Formatage
format:
	@echo "🎨 Formatage du code..."
	$(DART) format .
	$(FLUTTER) format .
	@echo "✅ Code formaté"

# Analyse
analyze:
	@echo "🔍 Analyse statique..."
	$(FLUTTER) analyze
	@echo "✅ Analyse terminée"

# Linting
lint:
	@echo "🔍 Linting..."
	$(DART) analyze
	@echo "✅ Linting terminé"

# Validation complète
validate: format lint analyze test
	@echo "✅ Validation complète terminée"

# Nettoyage complet
clean-all: clean
	@echo "🧹 Nettoyage complet..."
	rm -rf build/
	rm -rf coverage/
	rm -rf .dart_tool/
	@echo "✅ Nettoyage complet terminé"

# Aide rapide
quick-test:
	@echo "⚡ Test rapide..."
	$(FLUTTER) test test/unit/ --reporter=compact
	@echo "✅ Test rapide terminé"

# Monitoring
monitor:
	@echo "📊 Monitoring..."
	$(FLUTTER) run --profile
	@echo "✅ Monitoring terminé" 