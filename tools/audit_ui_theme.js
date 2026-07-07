// tools/audit_ui_theme.js
const fs = require('fs');
const { glob } = require('glob');

const interactiveWidgets = [
  'ElevatedButton', 'TextButton', 'OutlinedButton', 'IconButton',
  'TextFormField', 'DropdownButtonFormField', 'RadioListTile', 'CheckboxListTile',
  'ListTile', 'SwitchListTile', 'Slider', 'GestureDetector', 'InkWell'
];

glob("lib/features/**/*.dart", {}, (er, files) => {
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    interactiveWidgets.forEach(widget => {
      const regex = new RegExp(widget + '\\s*\\(', 'g');
      const matches = content.match(regex);
      if (matches) {
        // Vérifie la présence de Semantics, textScaleFactor, FocusNode
        if (!content.includes('Semantics')) {
          console.log(`⚠️  ${file} : ${widget} sans Semantics`);
        }
        if (widget.includes('Text') && !content.includes('textScaleFactor')) {
          console.log(`⚠️  ${file} : ${widget} sans textScaleFactor`);
        }
        if ((widget.includes('TextFormField') || widget.includes('Button')) && !content.includes('FocusNode')) {
          console.log(`⚠️  ${file} : ${widget} sans FocusNode`);
        }
      }
    });
  });
}); 
