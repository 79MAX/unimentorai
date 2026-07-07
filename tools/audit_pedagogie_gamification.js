// tools/audit_pedagogie_gamification.js
const fs = require('fs');
const { glob } = require('glob');

const gamificationElements = [
  'progress', 'score', 'badge', 'achievement', 'level', 'points',
  'leaderboard', 'challenge', 'reward', 'milestone', 'streak'
];

const pedagogicalElements = [
  'feedback', 'hint', 'explanation', 'example', 'practice',
  'assessment', 'quiz', 'exercise', 'tutorial', 'guide'
];

glob("lib/{core,features}/**/*.dart", {}, (er, files) => {
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Vérifie les éléments de gamification
    const hasGamification = gamificationElements.some(element => 
      content.includes(element) || content.includes(element + 's')
    );
    
    if (!hasGamification) {
      console.log(`⚠️  ${file} : pas d'éléments de gamification`);
    }
    
    // Vérifie les éléments pédagogiques
    const hasPedagogical = pedagogicalElements.some(element => 
      content.includes(element) || content.includes(element + 's')
    );
    
    if (!hasPedagogical) {
      console.log(`⚠️  ${file} : pas d'éléments pédagogiques`);
    }
  });
}); 
