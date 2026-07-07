#!/usr/bin/env node
// Audit global automatisé UniMentorAI
// npm install fast-glob fs-extra
const fg = require('fast-glob');
const fs = require('fs-extra');

const report = [];

async function auditArchitecture() {
  const orphanFiles = await fg(['lib/**/*.dart', '!lib/features/**', '!lib/core/**', '!lib/app/**', '!lib/shared/**']);
  if (orphanFiles.length) {
    report.push(`❌ Architecture: Fichiers orphelins hors features/core/app/shared: ${orphanFiles.join(', ')}`);
  } else {
    report.push('✅ Architecture: Tous les fichiers sont bien organisés.');
  }
}

async function auditSecurity() {
  const secrets = await fg(['**/*.dart', '**/*.js', '**/*.json', '!**/node_modules/**']);
  let found = false;
  for (const file of secrets) {
    const content = await fs.readFile(file, 'utf8');
    if (/api[_-]?key\s*[:=]\s*["'][A-Za-z0-9\-_]{16,}/i.test(content)) {
      report.push(`❌ Sécurité: Clé/API potentielle trouvée dans ${file}`);
      found = true;
    }
  }
  if (!found) report.push('✅ Sécurité: Pas de clé/API exposée détectée.');
  // Vérifier Firestore rules
  if (fs.existsSync('firestore.rules')) {
    const rules = await fs.readFile('firestore.rules', 'utf8');
    if (/allow\s+read:\s*if\s*true;/.test(rules) || /allow\s+write:\s*if\s*true;/.test(rules)) {
      report.push('❌ Sécurité: Firestore rules trop permissives.');
    } else {
      report.push('✅ Sécurité: Firestore rules OK.');
    }
  }
}

async function auditAccessibility() {
  const dartFiles = await fg(['lib/**/*.dart']);
  let foundSemantics = false;
  for (const file of dartFiles) {
    const content = await fs.readFile(file, 'utf8');
    if (/Semantics\s*\(/.test(content)) foundSemantics = true;
  }
  if (foundSemantics) {
    report.push('✅ Accessibilité: Widgets Semantics détectés.');
  } else {
    report.push('❌ Accessibilité: Aucun widget Semantics détecté.');
  }
  // Vérifier présence de tests accessibilité
  const accTest = await fg(['test/**/*.dart']);
  let foundTest = false;
  for (const file of accTest) {
    const content = await fs.readFile(file, 'utf8');
    if (/accessibility/i.test(content) || /Semantics/.test(content)) foundTest = true;
  }
  if (foundTest) {
    report.push('✅ Accessibilité: Tests d’accessibilité présents.');
  } else {
    report.push('❌ Accessibilité: Pas de tests d’accessibilité détectés.');
  }
}

async function auditRGPD() {
  // Vérifier liens RGPD/CGU
  const dartFiles = await fg(['lib/**/*.dart']);
  let foundLink = false, foundConsent = false;
  for (const file of dartFiles) {
    const content = await fs.readFile(file, 'utf8');
    if (/RGPD|GDPR|cgu|consentement|consent/i.test(content)) foundLink = true;
    if (/CheckboxListTile|SwitchListTile/.test(content) && /cgu|rgpd|consent/i.test(content)) foundConsent = true;
  }
  if (foundLink) report.push('✅ RGPD: Liens RGPD/CGU détectés.');
  else report.push('❌ RGPD: Aucun lien RGPD/CGU détecté.');
  if (foundConsent) report.push('✅ RGPD: Consentement explicite détecté.');
  else report.push('❌ RGPD: Consentement explicite manquant.');
  // Vérifier export/suppression (admin panel ou script)
  const adminFiles = await fg(['lib/features/admin/**/*.dart', 'tools/**/*export*.js']);
  if (adminFiles.length) report.push('✅ RGPD: Fonction export/suppression détectée.');
  else report.push('❌ RGPD: Pas de fonction export/suppression détectée.');
}

async function auditTests() {
  // Couverture de tests (présence de tests unitaires, widget, intégration, accessibilité)
  const testFiles = await fg(['test/**/*.dart']);
  let foundWidget = false, foundIntegration = false, foundAcc = false;
  for (const file of testFiles) {
    const content = await fs.readFile(file, 'utf8');
    if (/testWidgets/.test(content)) foundWidget = true;
    if (/integration/i.test(file)) foundIntegration = true;
    if (/accessibility/i.test(file)) foundAcc = true;
  }
  if (foundWidget) report.push('✅ Tests: Tests widget présents.');
  else report.push('❌ Tests: Pas de tests widget.');
  if (foundIntegration) report.push('✅ Tests: Tests d’intégration présents.');
  else report.push('❌ Tests: Pas de tests d’intégration.');
  if (foundAcc) report.push('✅ Tests: Tests d’accessibilité présents.');
  else report.push('❌ Tests: Pas de tests d’accessibilité.');
}

async function auditAssets() {
  // Vérifier présence d’assets optimisés (webp, png, etc.)
  const webp = await fg(['**/*.webp']);
  if (webp.length) report.push('✅ Assets: Images WebP détectées.');
  else report.push('❌ Assets: Pas d’images WebP détectées.');
}

async function auditAppStores() {
  // Vérifier présence d’assets App Store (icônes, splash, marketing)
  const icons = await fg(['android/app/src/main/res/mipmap-*/ic_launcher.png', 'ios/Runner/Assets.xcassets/AppIcon.appiconset/*.png']);
  if (icons.length) report.push('✅ App Stores: Icônes détectées.');
  else report.push('❌ App Stores: Icônes manquantes.');
}

async function main() {
  await auditArchitecture();
  await auditSecurity();
  await auditAccessibility();
  await auditRGPD();
  await auditTests();
  await auditAssets();
  await auditAppStores();
  // Générer rapport
  const out = report.join('\n');
  console.log('\n--- Audit global UniMentorAI ---\n' + out);
  fs.writeFileSync('audit_report.md', '# Audit global UniMentorAI\n\n' + out.replace(/✅/g, ':white_check_mark:').replace(/❌/g, ':x:'));
}

main(); 
