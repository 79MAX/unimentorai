// tools/audit_accessibility.js
const fs = require('fs');
const { glob } = require('glob');

const accessibilityWidgets = [
  'Semantics', 'ExcludeSemantics', 'MergeSemantics', 'IndexedStack',
  'Focus', 'FocusScope', 'FocusNode', 'FocusTraversalGroup'
];

const requiredProperties = [
  'label', 'hint', 'value', 'increasedValue', 'decreasedValue',
  'textDirection', 'sortKey', 'excludeSemantics', 'enabled'
];

glob("lib/features/**/*.dart", {}, (er, files) => {
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Vérifie les widgets interactifs sans Semantics
    const interactiveWidgets = content.match(/ElevatedButton|TextButton|IconButton|ListTile/g);
    if (interactiveWidgets && !content.includes('Semantics')) {
      console.log(`⚠️  ${file} : widgets interactifs sans Semantics`);
    }
    
    // Vérifie les images sans alt text
    const images = content.match(/Image\.asset|Image\.network/g);
    if (images && !content.includes('semanticLabel:')) {
      console.log(`⚠️  ${file} : images sans semanticLabel`);
    }
    
    // Vérifie les textes sans textScaleFactor
    const textWidgets = content.match(/Text\(/g);
    if (textWidgets && !content.includes('textScaleFactor:')) {
      console.log(`⚠️  ${file} : Text sans textScaleFactor`);
    }
  });
}); 
