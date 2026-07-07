import fs from "fs";
import path from "path";

/**
 * ==================================================
 * AUTO-FIX ENGINE V1 (SELF-HEALING BACKEND)
 * ==================================================
 *
 * 🎯 ROLE:
 * - Detect broken imports
 * - Detect missing critical files
 * - Detect architecture violations
 * - Generate fix report
 */

const ROOT = path.resolve("backend");

const REQUIRED_STRUCTURE = [
  "modules/auth/auth.controller.js",
  "modules/auth/auth.service.js",
  "modules/auth/auth.routes.js",
  "modules/courses/course.controller.js",
  "modules/courses/course.service.js",
  "modules/courses/course.routes.js",
  "bootstrap/app.js",
  "bootstrap/module.registry.js",
];

class AutoFixEngine {
  constructor() {
    this.issues = [];
  }

  /**
   * ==========================
   * RUN FULL SCAN
   * ==========================
   */
  runScan() {
    console.log("🚀 AUTO-FIX ENGINE STARTING SCAN...");

    this.checkMissingFiles();
    this.checkInvalidImports();

    return this.generateReport();
  }

  /**
   * ==========================
   * CHECK MISSING FILES
   * ==========================
   */
  checkMissingFiles() {
    REQUIRED_STRUCTURE.forEach((file) => {
      const fullPath = path.join(ROOT, file);

      if (!fs.existsSync(fullPath)) {
        this.issues.push({
          type: "MISSING_FILE",
          file,
          severity: "HIGH",
          fix: `Create file: ${file}`,
        });
      }
    });
  }

  /**
   * ==========================
   * CHECK BASIC IMPORT ERRORS
   * ==========================
   */
  checkInvalidImports() {
    const files = this.getAllJsFiles(ROOT);

    files.forEach((file) => {
      const content = fs.readFileSync(file, "utf-8");

      const importRegex = /from\s+["'](.+?)["']/g;
      let match;

      while ((match = importRegex.exec(content)) !== null) {
        const importedPath = match[1];

        if (
          importedPath.startsWith(".") &&
          !fs.existsSync(path.resolve(path.dirname(file), importedPath))
        ) {
          this.issues.push({
            type: "BROKEN_IMPORT",
            file,
            severity: "MEDIUM",
            fix: `Fix import path: ${importedPath}`,
          });
        }
      }
    });
  }

  /**
   * ==========================
   * GET ALL JS FILES
   * ==========================
   */
  getAllJsFiles(dir) {
    let results = [];

    const list = fs.readdirSync(dir);

    list.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat && stat.isDirectory()) {
        results = results.concat(this.getAllJsFiles(fullPath));
      } else if (file.endsWith(".js")) {
        results.push(fullPath);
      }
    });

    return results;
  }

  /**
   * ==========================
   * REPORT
   * ==========================
   */
  generateReport() {
    const report = {
      status: this.issues.length === 0 ? "CLEAN" : "ISSUES_FOUND",
      totalIssues: this.issues.length,
      issues: this.issues,
    };

    console.log("===================================");
    console.log("🧠 AUTO-FIX REPORT");
    console.log("===================================");
    console.log(JSON.stringify(report, null, 2));

    return report;
  }
}

/**
 * RUN ENGINE
 */
const engine = new AutoFixEngine();
engine.runScan();

export default engine;
