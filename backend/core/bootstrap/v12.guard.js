import fs from "fs";
import path from "path";

/* =====================================================
   UNIMENTORAI V12 CLEAN GUARD PRO
   ARCHITECTURE PROTECTION LAYER
   ESM VERSION
===================================================== */

export function assertCleanV12() {

  const root = process.cwd();


  /**
   * =====================================================
   * LEGACY SIGNATURES INTERDITES
   * =====================================================
   */
  const forbiddenPatterns = [
    "V11\\.1 STABLE",
    "ws-server\\.js",
    "realtime\\.server\\.js",
    "control-center\\.server\\.js",
    "src/bootstrap/module\\.registry\\.js",
    "backend/src/bootstrap/module\\.registry\\.js"
  ];


  /**
   * =====================================================
   * DOSSIERS EXCLUS DU SCAN
   * =====================================================
   */
  const skipDirs = new Set([
    "node_modules",
    ".git",
    "archive-v12",
    "audit-report",
    "coverage",
    "dist",
    "build"
  ]);


  /**
   * =====================================================
   * EXTENSIONS SCANNEES
   * =====================================================
   */
  const allowedExtensions = new Set([
    ".js",
    ".mjs",
    ".cjs"
  ]);


  /**
   * =====================================================
   * FICHIERS EXCLUS
   * =====================================================
   */
  const ignoredFiles = new Set([
    "v12.guard.js"
  ]);


  let scannedFiles = 0;
  let violations = 0;


  /**
   * =====================================================
   * DIRECTORY SCANNER
   * =====================================================
   */
  function scanDir(dir) {

    let entries;

    try {

      entries = fs.readdirSync(
        dir,
        {
          withFileTypes: true
        }
      );

    } catch {

      console.warn(
        `⚠️ Unable to scan: ${dir}`
      );

      return;
    }


    for (const entry of entries) {


      const fullPath = path.join(
        dir,
        entry.name
      );


      /**
       * DIRECTORY
       */
      if (entry.isDirectory()) {

        if (skipDirs.has(entry.name)) {
          continue;
        }

        scanDir(fullPath);
        continue;
      }


      /**
       * FILE CHECK
       */
      if (!entry.isFile()) {
        continue;
      }


      if (ignoredFiles.has(entry.name)) {
        continue;
      }


      const ext = path.extname(
        entry.name
      );


      if (!allowedExtensions.has(ext)) {
        continue;
      }


      scannedFiles++;


      let content;


      try {

        content = fs.readFileSync(
          fullPath,
          "utf8"
        );

      } catch {

        console.warn(
          `⚠️ Cannot read: ${fullPath}`
        );

        continue;
      }



      /**
       * LEGACY DETECTION
       */
      for (const pattern of forbiddenPatterns) {


        if (
          new RegExp(pattern)
            .test(content)
        ) {

          violations++;


          throw new Error(
            [
              "",
              "🚨 V12 ARCHITECTURE VIOLATION",
              "--------------------------------",
              `Pattern : ${pattern}`,
              `File    : ${fullPath}`,
              ""
            ].join("\n")
          );
        }
      }
    }
  }


  /**
   * EXECUTION
   */
  scanDir(root);



  /**
   * RESULT
   */
  console.log(
    "🔒 V12 CLEAN GUARD PASSED"
  );


  console.log(
    `📁 Files scanned: ${scannedFiles}`
  );


  return {
    status: "OK",
    scannedFiles,
    violations,
    version: "V12-CLEAN-GUARD-PRO"
  };

}