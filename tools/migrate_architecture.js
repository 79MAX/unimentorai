#!/usr/bin/env node
// tools/migrate_architecture.js - Migration automatique vers Clean Architecture
const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🔄 MIGRATION AUTOMATIQUE - CLEAN ARCHITECTURE\n');

// Mapping des fichiers à migrer
const migrationMap = {
  'lib/screens/auth/': 'lib/features/auth/presentation/',
  'lib/screens/courses/': 'lib/features/courses/presentation/',
  'lib/screens/quiz/': 'lib/features/quiz/presentation/',
  'lib/screens/profile/': 'lib/features/profile/presentation/',
  'lib/services/auth/': 'lib/features/auth/services/',
  'lib/services/courses/': 'lib/features/courses/services/',
  'lib/services/quiz/': 'lib/features/quiz/services/',
  'lib/models/': 'lib/core/models/',
  'lib/widgets/': 'lib/shared/widgets/'
};

// Créer les dossiers nécessaires
const requiredDirs = [
  'lib/app',
  'lib/app/colors',
  'lib/app/env',
  'lib/core',
  'lib/core/services',
  'lib/core/models',
  'lib/core/constants',
  'lib/shared',
  'lib/shared/widgets',
  'lib/shared/services'
];

console.log('📁 Création des dossiers requis...');
requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`  ✅ Créé: ${dir}`);
  }
});

// Migration des fichiers
console.log('\n📦 Migration des fichiers...');
Object.entries(migrationMap).forEach(([from, to]) => {
  if (fs.existsSync(from)) {
    const files = glob.sync(`${from}**/*.dart`);
    files.forEach(file => {
      const relativePath = path.relative(from, file);
      const newPath = path.join(to, relativePath);
      
      // Créer le dossier de destination
      const newDir = path.dirname(newPath);
      if (!fs.existsSync(newDir)) {
        fs.mkdirSync(newDir, { recursive: true });
      }
      
      // Déplacer le fichier
      fs.renameSync(file, newPath);
      console.log(`  ✅ Migré: ${file} → ${newPath}`);
    });
    
    // Supprimer le dossier source s'il est vide
    if (fs.readdirSync(from).length === 0) {
      fs.rmdirSync(from);
      console.log(`  🗑️  Supprimé (vide): ${from}`);
    }
  }
});

// Supprimer les dossiers orphelins
const orphanDirs = ['lib/pages', 'lib/screens', 'lib/widgets', 'lib/config', 'lib/models', 'lib/languages'];
console.log('\n🗑️  Nettoyage des dossiers orphelins...');
orphanDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = glob.sync(`${dir}/**/*.dart`);
    if (files.length === 0) {
      fs.rmdirSync(dir);
      console.log(`  ✅ Supprimé (vide): ${dir}`);
    } else {
      console.log(`  ⚠️  Gardé (contient ${files.length} fichiers): ${dir}`);
    }
  }
});

console.log('\n🎉 Migration terminée !');
console.log('📋 Prochaines étapes:');
console.log('  1. Vérifier les imports dans les fichiers migrés');
console.log('  2. Lancer: make audit-arch');
console.log('  3. Corriger les erreurs de compilation'); 
