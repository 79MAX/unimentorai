// tools/audit_test_coverage.js
const fs = require('fs');
const { glob } = require('glob');

const directories = ['lib/features', 'lib/core', 'lib/shared'];

directories.forEach(dir => {
  glob(`${dir}**/*.dart`, {}, (er, files) => {
    files.forEach(file => {
      const testFile = file.replace('.dart', '_test.dart').replace('lib/', 'test/');
      
      if (!fs.existsSync(testFile)) {
        console.log(`❌ ${file} : test manquant`);
      } else {
        const testContent = fs.readFileSync(testFile, 'utf8');
        if (!testContent.includes('test(') && !testContent.includes('group(')) {
          console.log(`⚠️  ${file} : test vide ou incomplet`);
        }
      }
    });
  });
}); 
