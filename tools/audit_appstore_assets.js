// tools/audit_appstore_assets.js
const fs = require('fs');
const requiredAssets = [
  'android/fastlane/',
  'ios/fastlane/',
  'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png',
  'ios/Runner/Assets.xcassets/AppIcon.appiconset/Icon-App-1024x1024@1x.png',
  'web/icons/Icon-512.png',
  'web/icons/Icon-192.png',
  'android/app/src/main/res/drawable/launch_background.xml',
  'ios/Runner/Assets.xcassets/LaunchImage.imageset/LaunchImage.png',
  'marketing/',
];

let allPresent = true;
requiredAssets.forEach(asset => {
  if (!fs.existsSync(asset)) {
    console.log(`❌ Manquant : ${asset}`);
    allPresent = false;
  } else {
    console.log(`✅ Présent : ${asset}`);
  }
});
if (allPresent) {
  console.log('🎉 Tous les assets/app store requis sont présents.');
} 
 
 
