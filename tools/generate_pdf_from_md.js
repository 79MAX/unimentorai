// Script Node.js pour convertir un fichier Markdown en PDF et DOCX
// npm install markdown-pdf
const fs = require('fs');
const { execSync } = require('child_process');
const markdownpdf = require('markdown-pdf');

if (process.argv.length < 3) {
  console.log('Usage: node generate_pdf_from_md.js fichier.md');
  process.exit(1);
}

const mdFile = process.argv[2];
const base = mdFile.replace(/\.md$/, '');

// PDF
markdownpdf().from(mdFile).to(`${base}.pdf`, () => {
  console.log(`PDF généré: ${base}.pdf`);
});

// DOCX (si pandoc installé)
try {
  execSync(`pandoc "${mdFile}" -o "${base}.docx"`);
  console.log(`DOCX généré: ${base}.docx`);
} catch (e) {
  console.warn('Pandoc non trouvé ou erreur lors de la génération DOCX.');
} 
