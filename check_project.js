const fs = require('fs');
const path = require('path');

const root = process.cwd();
const pkgPath = path.join(root, 'package.json');
const nodeModulesPath = path.join(root, 'node_modules');

function checkPackageJson() {
  if (!fs.existsSync(pkgPath)) {
    console.error('❌ package.json NOT FOUND dans ce dossier :', root);
    process.exit(1);
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

  if (!pkg.scripts || !pkg.scripts.start) {
    console.error('❌ Le script "start" est manquant dans package.json');
    process.exit(1);
  }

  console.log('✅ package.json trouvé avec script "start"');
  return pkg;
}

function checkNodeModules() {
  if (!fs.existsSync(nodeModulesPath)) {
    console.error('❌ Le dossier node_modules est manquant');
    console.log('➡️ Lance "npm install" pour installer les dépendances');
    process.exit(1);
  }
  console.log('✅ node_modules présent');
}

function main() {
  checkPackageJson();
  checkNodeModules();
  console.log('\n👍 Tout semble OK. Lance maintenant : npm start');
}

main();

