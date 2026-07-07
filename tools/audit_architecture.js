#!/usr/bin/env node
// tools/audit_architecture.js - Audit et correction automatique de l'architecture
const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🏗️ AUDIT ARCHITECTURE - CLEAN ARCHITECTURE & FEATURE-FIRST\n');

const allowedRoots = ['core', 'features', 'app', 'shared'];
const orphanDirs = ['pages', 'screens', 'widgets', 'config', 'models', 'languages'];
const issues = [];

// 1. Détecter les fichiers hors structure
console.log('📋 Vérification de la structure...');
const libFiles = glob.sync('lib/**/*.dart', { ignore: ['lib/l10n/**'] });
libFiles.forEach(file => {
  const parts = file.split(path.sep);
  if (parts.length > 1 && !allowedRoots.includes(parts[1])) {
    issues.push(`Fichier hors structure: ${file}`);
  }
});

// 2. Détecter les dossiers orphelins
orphanDirs.forEach(dir => {
  const dirPath = path.join('lib', dir);
  if (fs.existsSync(dirPath)) {
    const files = glob.sync(`${dirPath}/**/*.dart`);
    if (files.length > 0) {
      issues.push(`Dossier orphelin avec fichiers: ${dirPath} (${files.length} fichiers)`);
    }
  }
});

// 3. Vérifier la structure features
const features = glob.sync('lib/features/*/');
features.forEach(feature => {
  const featureName = path.basename(feature.slice(0, -1));
  const expectedDirs = ['presentation', 'services', 'provider'];
  expectedDirs.forEach(expectedDir => {
    const dirPath = path.join(feature, expectedDir);
    if (!fs.existsSync(dirPath)) {
      issues.push(`Feature ${featureName} manque: ${expectedDir}/`);
    }
  });
});

// 4. Vérifier la centralisation
if (!fs.existsSync('lib/app/')) {
  issues.push('Dossier lib/app/ manquant (config globale)');
}
if (!fs.existsSync('lib/shared/widgets/')) {
  issues.push('Dossier lib/shared/widgets/ manquant (widgets transverses)');
}

// Rapport
if (issues.length > 0) {
  console.log('❌ PROBLÈMES D\'ARCHITECTURE DÉTECTÉS:');
  issues.forEach(issue => console.log(`  - ${issue}`));
  console.log('\n🔧 CORRECTIONS RECOMMANDÉES:');
  console.log('  1. Migrer les fichiers orphelins vers features/<domaine>/');
  console.log('  2. Supprimer les dossiers vides');
  console.log('  3. Créer lib/app/ et lib/shared/widgets/ si manquants');
  console.log('  4. Vérifier la structure features/<nom>/presentation|services|provider/');
} else {
  console.log('✅ Architecture conforme aux standards Clean Architecture');
}

console.log(`\n📊 Résumé: ${issues.length} problème(s) d'architecture détecté(s)`); 
