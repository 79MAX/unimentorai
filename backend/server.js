/**
 * ==========================================================
 * UNIMENTORAI BACKEND V12
 * SERVER ENTRY POINT
 * PRODUCTION READY
 * ==========================================================
 *
 * BOOT FLOW:
 *
 * server.js
 *    ↓
 * V12 Guard
 *    ↓
 * MongoDB
 *    ↓
 * Express App
 *    ↓
 * HTTP Server
 *
 * ==========================================================
 */


import "dotenv/config";


import http from "http";


import {
  assertCleanV12
}
from "./core/bootstrap/v12.guard.js";


import connectDatabase
from "./src/config/database.js";








/**
 * ==========================================================
 * CONFIGURATION
 * ==========================================================
 */


const PORT =

  Number(
    process.env.PORT || 3000
  );









/**
 * ==========================================================
 * START SERVER
 * ==========================================================
 */


async function startServer(){


  try{


    /**
     * SECURITY CHECK
     */

    assertCleanV12();






    /**
     * DATABASE FIRST
     */

    await connectDatabase();







    /**
     * LOAD EXPRESS AFTER DB
     */

    const {

      default:app

    } = await import(

      "./bootstrap/app.js"

    );







    const server =

      http.createServer(app);









    /**
     * PORT ERROR HANDLER
     *
     * évite crash EADDRINUSE
     */

    server.on(

      "error",

      (error)=>{


        if(
          error.code === "EADDRINUSE"
        ){


          console.error(

            `❌ PORT ${PORT} ALREADY IN USE`

          );


          process.exit(1);


        }



        throw error;


      }

    );









    /**
     * START LISTEN
     */

    server.listen(

      PORT,

      ()=>{


        console.log("");

        console.log(
          "🚀 UNIMENTORAI BACKEND V12"
        );


        console.log(
          `HTTP: http://localhost:${PORT}`
        );


        console.log(
          "STATUS: ONLINE"
        );


      }

    );









    /**
     * SAFE SHUTDOWN
     */

    const shutdown = async()=>{


      console.log(

        "\n🛑 SHUTDOWN V12"

      );



      server.close(()=>{


        console.log(

          "✅ HTTP SERVER CLOSED"

        );


        process.exit(0);


      });


    };





    process.on(

      "SIGINT",

      shutdown

    );



    process.on(

      "SIGTERM",

      shutdown

    );





  }


  catch(error){


    console.error(

      "❌ BOOT FAILURE:",

      error.message

    );


    process.exit(1);


  }


}









/**
 * ==========================================================
 * GLOBAL PROCESS SAFETY
 * ==========================================================
 */


process.on(

  "unhandledRejection",

  (error)=>{


    console.error(

      "UNHANDLED REJECTION:",

      error

    );


  }

);



process.on(

  "uncaughtException",

  (error)=>{


    console.error(

      "UNCAUGHT EXCEPTION:",

      error

    );


    process.exit(1);


  }

);







startServer();