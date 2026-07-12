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
 *    ↓
 * WebSocket Gateway V12
 *
 * ==========================================================
 */


import "dotenv/config";


import http from "http";


import crypto from "crypto";


import {
  assertCleanV12
}
from "./core/bootstrap/v12.guard.js";


import connectDatabase
from "./src/config/database.js";





/**
 * ==========================================================
 * CONFIG
 * ==========================================================
 */


const PORT = Number(
  process.env.PORT || 3000
);







/**
 * ==========================================================
 * RUNTIME STATE
 * ==========================================================
 */


const metrics = {

  messages:0,

  startedAt:new Date()

};









/**
 * ==========================================================
 * START SERVER
 * ==========================================================
 */


async function startServer(){


  let server;

  let wss;

  let heartbeat;

  let metricsInterval;


  try{


    /**
     * SECURITY
     */

    assertCleanV12();







    /**
     * DATABASE
     */

    await connectDatabase();







    /**
     * EXPRESS LOAD
     */

    const {

      default:app

    } = await import(

      "./bootstrap/app.js"

    );







    /**
     * HTTP
     */

    server = http.createServer(app);









    /**
     * ======================================================
     * WEBSOCKET V12
     * ======================================================
     */


    const {

      WebSocketServer

    } = await import("ws");




    wss = new WebSocketServer({

      server

    });




    console.log(
      "👉 WS INITIALIZING..."
    );









    /**
     * ======================================================
     * BROADCAST
     * ======================================================
     */


    const broadcast = (payload)=>{


      const message = JSON.stringify(payload);



      wss.clients.forEach(

        client=>{


          if(

            client.readyState === 1

          ){

            client.send(message);

          }


        }

      );


    };









    /**
     * ======================================================
     * METRICS BUILDER
     * ======================================================
     */


    const buildMetrics = ()=>{


      return {


        clients:

          wss.clients.size,


        messages:

          metrics.messages,


        uptime:

          Math.floor(

            process.uptime()

          ),


        memory:

          Math.round(

            process.memoryUsage()
            .heapUsed /
            1024 /
            1024

          ) + " MB",



        startedAt:

          metrics.startedAt.toISOString(),



        timestamp:

          new Date().toISOString()


      };


    };









    /**
     * ======================================================
     * WS CONNECTION
     * ======================================================
     */


    wss.on(

      "connection",

      socket=>{


        const clientId =
          crypto.randomUUID();



        socket.clientId =
          clientId;



        socket.isAlive =
          true;





        console.log(

          "🟢 WS CLIENT CONNECTED:",

          clientId

        );







        /**
         * WELCOME
         */


        socket.send(

          JSON.stringify({

            type:"WELCOME",

            clientId,

            system:"UniMentorAI",

            version:"V12",

            message:
            "WebSocket Gateway Online"

          })

        );








        /**
         * INITIAL METRICS
         */


        socket.send(

          JSON.stringify({

            type:"METRIC",

            data:
            buildMetrics()

          })

        );









        /**
         * PONG
         */


        socket.on(

          "pong",

          ()=>{

            socket.isAlive = true;

          }

        );








        /**
         * MESSAGE
         */


        socket.on(

          "message",

          message=>{


            metrics.messages++;



            console.log(

              "📩 WS MESSAGE:",

              message.toString()

            );



            broadcast({

              type:"METRIC",

              data:
              buildMetrics()

            });


          }

        );









        /**
         * CLOSE
         */


        socket.on(

          "close",

          ()=>{


            console.log(

              "🔴 WS CLIENT DISCONNECTED:",

              clientId

            );


          }

        );




      }

    );









    /**
     * ======================================================
     * AUTO METRICS STREAM
     * ======================================================
     */


    metricsInterval = setInterval(()=>{


      broadcast({

        type:"METRIC",

        data:
        buildMetrics()

      });


    },5000);









    /**
     * ======================================================
     * HEARTBEAT
     * ======================================================
     */


    heartbeat = setInterval(()=>{


      wss.clients.forEach(

        socket=>{


          if(

            socket.isAlive === false

          ){

            return socket.terminate();

          }



          socket.isAlive = false;


          socket.ping();



        }

      );


    },30000);









    /**
     * ======================================================
     * ERROR
     * ======================================================
     */


    server.on(

      "error",

      error=>{


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
     * ======================================================
     * START LISTEN
     * ======================================================
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

          `WS: ws://localhost:${PORT}`

        );


        console.log(

          "STATUS: ONLINE"

        );


      }

    );









    /**
     * ======================================================
     * SHUTDOWN
     * ======================================================
     */


    const shutdown = ()=>{


      console.log(

        "\n🛑 SHUTDOWN V12"

      );



      if(heartbeat)

        clearInterval(heartbeat);



      if(metricsInterval)

        clearInterval(metricsInterval);




      if(wss){


        wss.clients.forEach(

          client=>{

            client.close();

          }

        );


        wss.close();


      }





      if(server){


        server.close(()=>{


          console.log(

            "✅ HTTP SERVER CLOSED"

          );


          process.exit(0);


        });


      }


    };








    process.once(

      "SIGINT",

      shutdown

    );


    process.once(

      "SIGTERM",

      shutdown

    );





  }

  catch(error){


    console.error(

      "❌ BOOT FAILURE:",

      error

    );


    process.exit(1);


  }


}









/**
 * ==========================================================
 * GLOBAL SAFETY
 * ==========================================================
 */


process.on(

  "unhandledRejection",

  error=>{


    console.error(

      "UNHANDLED REJECTION:",

      error

    );


  }

);





process.on(

  "uncaughtException",

  error=>{


    console.error(

      "UNCAUGHT EXCEPTION:",

      error

    );


    process.exit(1);


  }

);







startServer();