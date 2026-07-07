// tools/audit_rgpd_links.js
const fs = require('fs');
const { glob } = require('glob');

const rgpdRequirements = [
  'privacy', 'terms', 'cookies', 'gdpr', 'consent', 'data_protection',
  'personal_data', 'user_rights', 'data_retention', 'data_processing'
];

glob("lib/features/**/*.dart", {}, (er, files) => {
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Vérifie la présence de liens RGPD
    const hasRgpdLinks = rgpdRequirements.some(req => 
      content.includes(req) || content.includes(req.replace('_', ' '))
    );
    
    if (!hasRgpdLinks) {
      console.log(`⚠️  ${file} : pas de liens RGPD détectés`);
    }
    
    // Vérifie la gestion des cookies
    if (content.includes('cookies') && !content.includes('consent')) {
      console.log(`⚠️  ${file} : cookies sans consentement`);
    }
  });
}); 
