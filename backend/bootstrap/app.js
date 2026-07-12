/**
 * ==========================================================
 * UNIMENTORAI BACKEND V12.1
 * EXPRESS APPLICATION BOOTSTRAP
 * PRODUCTION READY
 * ==========================================================
 */


import express from "express";

import cors from "cors";

import helmetConfig from "../src/security/helmet.config.js";

import morgan from "morgan";





/**
 * ==========================================================
 * CREATE APP
 * ==========================================================
 */


const app = express();







/**
 * ==========================================================
 * SECURITY MIDDLEWARE V12.1
 * ==========================================================
 */


app.use(

  helmetConfig()

);



app.use(

  cors({

    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",

    credentials:true

  })

);









/**
 * ==========================================================
 * BODY PARSER
 * ==========================================================
 */


app.use(

  express.json({

    limit:"2mb"

  })

);



app.use(

  express.urlencoded({

    extended:true

  })

);









/**
 * ==========================================================
 * LOGGER
 * ==========================================================
 */


if(

  process.env.NODE_ENV !== "production"

){

  app.use(

    morgan("dev")

  );

}









/**
 * ==========================================================
 * ROOT HEALTH CHECK
 * ==========================================================
 */


app.get(

  "/",

  (req,res)=>{


    res.status(200).json({

      success:true,

      system:"UniMentorAI",

      version:"V12.1",

      security:"HARDENED",

      status:"ONLINE",

      timestamp:
        Date.now()

    });


  }

);









/**
 * ==========================================================
 * LOAD MODULES
 * ==========================================================
 *
 * IMPORTANT:
 *
 * user.routes.js initialise :
 *
 * UserService
 *      ↓
 * UserRepository
 *      ↓
 * Controllers
 *
 * ==========================================================
 */



const {

  default:userRoutes

} = await import(

  "../src/modules/users/user.routes.js"

);






const {

  default:authRoutes

} = await import(

  "../src/modules/auth/auth.routes.js"

);









/**
 * ==========================================================
 * API ROUTES
 * ==========================================================
 */


app.use(

  "/api/auth",

  authRoutes

);



app.use(

  "/api/users",

  userRoutes

);









/**
 * ==========================================================
 * GLOBAL ERROR HANDLER
 * ==========================================================
 */


app.use(

  (

    error,

    req,

    res,

    next

  )=>{


    console.error(

      "SERVER ERROR:",

      error.message

    );




    return res.status(

      error.status || 500

    )
    .json({

      success:false,


      message:

        error.message ||

        "Internal server error",



      code:

        error.code ||

        "SERVER_ERROR"


    });



  }

);









export default app;