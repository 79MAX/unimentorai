import fs from "fs";
import path from "path";

/* =====================================================
   UNIMENTORAI V12 CLEAN GUARD PRO+
   ARCHITECTURE PROTECTION LAYER
   ESM VERSION

   PURPOSE:
   - Block V11 legacy code
   - Protect V12 modular architecture
   - Prevent duplicate systems
===================================================== */


export function assertCleanV12() {


  const root = process.cwd();


  /**
   * =====================================================
   * LEGACY SIGNATURES CONTENT BLOCK
   * =====================================================
   */
  const forbiddenPatterns = [

    // OLD ARCHITECTURE
    "V11\\.1 STABLE",
    "ws-server\\.js",
    "realtime\\.server\\.js",
    "control-center\\.server\\.js",


    // OLD BOOTSTRAP
    "src/bootstrap/module\\.registry\\.js",
    "backend/src/bootstrap/module\\.registry\\.js",


    // OLD AUTH SYSTEM
    "src/controllers/auth\\.controller\\.js",
    "src/services/auth\\.service\\.js"

  ];



  /**
   * =====================================================
   * FORBIDDEN ACTIVE FILE PATHS
   * =====================================================
   */
  const forbiddenPaths = [

    "src/controllers/auth.controller.js",

    "src/services/auth.service.js"

  ];




  /**
   * =====================================================
   * DIRECTORIES EXCLUDED FROM SCAN
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
   * FILE TYPES
   * =====================================================
   */
  const allowedExtensions = new Set([

    ".js",
    ".mjs",
    ".cjs"

  ]);




  /**
   * =====================================================
   * IGNORED FILES
   * =====================================================
   */
  const ignoredFiles = new Set([

    "v12.guard.js"

  ]);




  let scannedFiles = 0;

  let violations = [];





  /**
   * =====================================================
   * NORMALIZE PATH
   * =====================================================
   */
  function normalize(filePath){

    return filePath
      .replaceAll("\\","/")
      .replace(root.replaceAll("\\","/"),"")
      .replace(/^\/+/,"");

  }





  /**
   * =====================================================
   * SCANNER
   * =====================================================
   */
  function scanDir(dir){


    let entries;


    try {

      entries = fs.readdirSync(

        dir,

        {
          withFileTypes:true
        }

      );


    }

    catch(error){


      console.warn(
        "⚠️ Cannot scan:",
        dir
      );


      return;

    }




    for(const entry of entries){


      const fullPath =
        path.join(
          dir,
          entry.name
        );




      /**
       * DIRECTORY
       */
      if(entry.isDirectory()){


        if(skipDirs.has(entry.name)){

          continue;

        }


        scanDir(fullPath);

        continue;

      }




      /**
       * FILE
       */
      if(!entry.isFile()){

        continue;

      }




      if(ignoredFiles.has(entry.name)){

        continue;

      }




      const ext =
        path.extname(
          entry.name
        );



      if(!allowedExtensions.has(ext)){

        continue;

      }




      scannedFiles++;




      const relativePath =
        normalize(fullPath);





      /**
       * ACTIVE LEGACY PATH CHECK
       */
      for(const forbidden of forbiddenPaths){


        if(relativePath === forbidden){


          violations.push({

            type:"LEGACY_FILE",

            file:relativePath

          });


        }

      }





      let content;


      try {


        content =
          fs.readFileSync(
            fullPath,
            "utf8"
          );


      }

      catch {


        continue;

      }





      /**
       * CONTENT CHECK
       */
      for(const pattern of forbiddenPatterns){


        if(
          new RegExp(pattern)
          .test(content)
        ){


          violations.push({

            type:"LEGACY_PATTERN",

            pattern,

            file:relativePath

          });


        }

      }

    }

  }





  /**
   * =====================================================
   * EXECUTE SCAN
   * =====================================================
   */

  scanDir(root);





  /**
   * =====================================================
   * BLOCK BOOT IF FAILED
   * =====================================================
   */

  if(violations.length > 0){


    console.error("");

    console.error(
      "🚨 V12 ARCHITECTURE VIOLATION"
    );


    console.table(
      violations
    );


    throw new Error(

      "V12 CLEAN GUARD FAILED - LEGACY CODE DETECTED"

    );

  }





  /**
   * =====================================================
   * SUCCESS
   * =====================================================
   */

  console.log("");

  console.log(
    "🔒 V12 CLEAN GUARD PASSED"
  );


  console.log(
    `📁 Files scanned: ${scannedFiles}`
  );


  return {


    status:"OK",

    scannedFiles,

    violations:0,

    version:
      "V12-CLEAN-GUARD-PRO+"


  };


}