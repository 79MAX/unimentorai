// Script Node.js pour compresser les images PNG en WebP et optimiser les PNG
// npm install imagemin imagemin-webp imagemin-pngquant fast-glob

const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const imageminPngquant = require('imagemin-pngquant');
const fg = require('fast-glob');
const fs = require('fs');
const path = require('path');

const assetDirs = [
  'web/icons/*.png',
  'web/favicon.png',
  'android/app/src/main/res/mipmap-*/ic_launcher.png',
  'ios/Runner/Assets.xcassets/AppIcon.appiconset/*.png',
  'macos/Runner/Assets.xcassets/AppIcon.appiconset/*.png',
];

(async () => {
  const files = await fg(assetDirs, { dot: false });
  let totalOriginal = 0, totalOptimized = 0, report = [];

  for (const file of files) {
    const origSize = fs.statSync(file).size;
    totalOriginal += origSize;
    // Optimisation PNG
    const optimized = await imagemin([file], {
      destination: path.dirname(file),
      plugins: [imageminPngquant({ quality: [0.6, 0.8] })],
    });
    const optSize = fs.statSync(file).size;
    totalOptimized += optSize;
    // Conversion WebP (dans le même dossier, même nom mais .webp)
    await imagemin([file], {
      destination: path.dirname(file),
      plugins: [imageminWebp({ quality: 80 })],
      rename: { extname: '.webp' },
    });
    report.push({
      file,
      origSize,
      optSize,
      gain: origSize - optSize,
      webp: file.replace(/\.png$/, '.webp'),
    });
    console.log(`Optimisé: ${file} (${(origSize/1024).toFixed(1)} KB → ${(optSize/1024).toFixed(1)} KB)`);
  }
  // Rapport global
  console.log('\n--- Rapport de compression ---');
  report.forEach(r => {
    console.log(`${r.file}: -${((r.gain/r.origSize)*100).toFixed(1)}% (${(r.origSize/1024).toFixed(1)} KB → ${(r.optSize/1024).toFixed(1)} KB), WebP: ${r.webp}`);
  });
  console.log(`\nGain total: -${((totalOriginal-totalOptimized)/1024).toFixed(1)} KB (${((1-totalOptimized/totalOriginal)*100).toFixed(1)}%)`);
})();

// Extension vidéo possible: utiliser fluent-ffmpeg pour mp4/webm plus tard 
