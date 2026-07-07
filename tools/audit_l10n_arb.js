// tools/audit_l10n_arb.js
const fs = require('fs');
const path = require('path');

const l10nDir = 'lib/l10n/';
const files = fs.readdirSync(l10nDir).filter(f => f.endsWith('.arb'));

// Collecte toutes les clés de tous les fichiers ARB
let allKeys = new Set();
const fileKeys = {};
files.forEach(file => {
  const content = JSON.parse(fs.readFileSync(path.join(l10nDir, file), 'utf8'));
  const keys = Object.keys(content).filter(k => !k.startsWith('@'));
  fileKeys[file] = keys;
  keys.forEach(k => allKeys.add(k));
});

// Vérifie les clés manquantes dans chaque fichier
files.forEach(file => {
  const missing = Array.from(allKeys).filter(k => !fileKeys[file].includes(k));
  if (missing.length > 0) {
    console.log(`❌ ${file} : clés manquantes -> ${missing.join(', ')}`);
  }
});

// Vérifie la présence d'au moins une langue RTL
const rtlLangs = ['ar', 'he', 'fa', 'ur'];
const hasRTL = files.some(f => rtlLangs.some(lang => f.includes(`_${lang}.arb`)));
if (!hasRTL) {
  console.log('⚠️  Aucune langue RTL détectée dans lib/l10n/');
} else {
  console.log('✅ Langue RTL détectée.');
} 
 
 
