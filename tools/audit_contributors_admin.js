// tools/audit_contributors_admin.js
const fs = require('fs');
const { glob } = require('glob');

const contributorFeatures = [
  'contributor', 'author', 'creator', 'editor', 'reviewer',
  'content_creation', 'submission', 'approval', 'collaboration'
];

const adminManagement = [
  'user_roles', 'permissions', 'access_control', 'moderation',
  'content_approval', 'quality_control', 'review_process'
];

glob("lib/features/**/*.dart", {}, (er, files) => {
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Vérifie les fonctionnalités contributeur
    const hasContributorFeatures = contributorFeatures.some(feature => 
      content.includes(feature) || content.includes(feature.replace('_', ' '))
    );
    
    if (!hasContributorFeatures) {
      console.log(`⚠️  ${file} : pas de fonctionnalités contributeur`);
    }
    
    // Vérifie la gestion admin
    const hasAdminManagement = adminManagement.some(element => 
      content.includes(element) || content.includes(element.replace('_', ' '))
    );
    
    if (!hasAdminManagement) {
      console.log(`⚠️  ${file} : pas de gestion admin`);
    }
  });
}); 
