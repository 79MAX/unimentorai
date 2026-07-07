// tools/audit_form_validators.js
const fs = require('fs');
const { glob } = require('glob');

const formValidators = [
  'TextFormField', 'DropdownButtonFormField', 'RadioListTile', 'CheckboxListTile',
  'Form', 'FormField', 'FormFieldValidator'
];

glob("lib/features/**/*.dart", {}, (er, files) => {
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    formValidators.forEach(widget => {
      const regex = new RegExp(widget + '\\s*\\(', 'g');
      const matches = content.match(regex);
      if (matches) {
        // Vérifie la présence de validateurs
        if (!content.includes('validator:') && !content.includes('autovalidateMode:')) {
          console.log(`⚠️  ${file} : ${widget} sans validation`);
        }
        // Vérifie la gestion des erreurs
        if (!content.includes('onChanged:') && !content.includes('onSaved:')) {
          console.log(`⚠️  ${file} : ${widget} sans gestion des changements`);
        }
      }
    });
  });
}); 
