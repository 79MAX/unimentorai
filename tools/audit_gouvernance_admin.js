// tools/audit_gouvernance_admin.js
const fs = require('fs');
const { glob } = require('glob');

const adminFeatures = [
  'admin', 'moderator', 'supervisor', 'manager', 'dashboard',
  'user_management', 'content_moderation', 'analytics', 'reports'
];

const governanceElements = [
  'role', 'permission', 'access_control', 'audit_log', 'compliance',
  'policy', 'guidelines', 'standards', 'monitoring', 'oversight'
];

glob("lib/features/**/*.dart", {}, (er, files) => {
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Vérifie les fonctionnalités admin
    const hasAdminFeatures = adminFeatures.some(feature => 
      content.includes(feature) || content.includes(feature.replace('_', ' '))
    );
    
    if (!hasAdminFeatures) {
      console.log(`⚠️  ${file} : pas de fonctionnalités admin`);
    }
    
    // Vérifie les éléments de gouvernance
    const hasGovernance = governanceElements.some(element => 
      content.includes(element) || content.includes(element.replace('_', ' '))
    );
    
    if (!hasGovernance) {
      console.log(`⚠️  ${file} : pas d'éléments de gouvernance`);
    }
  });
}); 
