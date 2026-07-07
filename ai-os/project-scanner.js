import fs from "fs";
import path from "path";

class ProjectScanner {

  constructor() {
    this.root = process.cwd();

    // 🚀 PERFORMANCE: dossiers ignorés
    this.ignoreDirs = new Set([
      "node_modules",
      ".git",
      ".dart_tool",
      "build",
      "dist",
      ".idea",
      ".vscode"
    ]);

    // 📦 fichiers utiles UNI MENTOR AI
    this.extensions = new Set([
      ".js",
      ".ts",
      ".dart",
      ".json",
      ".yaml",
      ".md"
    ]);
  }

  isValidFile(filePath) {
    return this.extensions.has(path.extname(filePath));
  }

  scanDirectory(dirPath) {
    const results = [];
    const stack = [dirPath];

    while (stack.length) {
      const current = stack.pop();

      if (!fs.existsSync(current)) continue;

      let items;
      try {
        items = fs.readdirSync(current);
      } catch {
        continue;
      }

      for (const item of items) {
        const fullPath = path.join(current, item);

        let stat;
        try {
          stat = fs.statSync(fullPath);
        } catch {
          continue;
        }

        if (stat.isDirectory()) {
          const dirName = path.basename(fullPath);

          if (!this.ignoreDirs.has(dirName)) {
            stack.push(fullPath);
          }

        } else {
          if (this.isValidFile(fullPath)) {
            results.push(fullPath);
          }
        }
      }
    }

    return results;
  }

  scanProject() {
    const roots = ["lib", "backend", "ai-os", "src"];

    let allFiles = [];

    for (const folder of roots) {
      const fullPath = path.join(this.root, folder);
      allFiles = allFiles.concat(this.scanDirectory(fullPath));
    }

    return allFiles;
  }

  run() {
    const files = this.scanProject();

    console.log("🚀 FILES FOUND:", files.length);

    // debug intelligent
    console.log("📁 SAMPLE:");
    console.log(files.slice(0, 15));

    return files;
  }
}

export default ProjectScanner;
