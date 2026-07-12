/**
 * ==========================================================
 * UNIMENTORAI AUTH ROUTES V12.1
 * HTTP ROUTER LAYER
 * PRODUCTION STABLE
 * ==========================================================
 *
 * ROLE:
 *
 * HTTP routing only
 *
 *
 * FLOW:
 *
 * Request
 *    ↓
 * Router
 *    ↓
 * AuthController
 *    ↓
 * AuthService
 *    ↓
 * UserRepository
 *    ↓
 * MongoDB
 *
 * ==========================================================
 */


import { Router } from "express";


import {
  authController
}
from "./index.js";


import {
  authMiddleware
}
from "./auth.middleware.js";






const router = Router();








/**
 * ==========================================================
 * SAFE CONTROLLER CHECK
 * ==========================================================
 */


function controllerMethod(method){


  if(

    !authController ||

    typeof authController[method] !== "function"

  ){


    return (

      req,

      res

    )=>{


      return res.status(500).json({

        success:false,

        code:
          "AUTH_CONTROLLER_METHOD_MISSING",

        message:
          `Auth controller method ${method} unavailable`

      });


    };


  }







  return (

    req,

    res,

    next

  )=>{


    return authController[method]

      .call(

        authController,

        req,

        res,

        next

      );


  };


}









/**
 * ==========================================================
 * AUTH MODULE ROOT CHECK
 * PUBLIC
 *
 * GET /api/auth
 * ==========================================================
 */


router.get(

  "/",

  (

    req,

    res

  )=>{


    return res.status(200).json({

      success:true,

      module:"AUTH",

      system:"UniMentorAI",

      version:"V12.1",

      status:"ONLINE",

      endpoints:[

        "GET /api/auth",

        "GET /api/auth/health",

        "POST /api/auth/register",

        "POST /api/auth/login",

        "POST /api/auth/refresh",

        "POST /api/auth/logout",

        "GET /api/auth/me"

      ],

      timestamp:

        Date.now()


    });


  }

);









/**
 * ==========================================================
 * HEALTH CHECK
 * PUBLIC
 *
 * GET /api/auth/health
 * ==========================================================
 */


router.get(

  "/health",

  (

    req,

    res

  )=>{


    return res.status(200).json({

      success:true,

      module:"auth",

      status:"healthy",

      version:"V12.1",

      ok:true,

      timestamp:

        Date.now()

    });


  }

);









/**
 * ==========================================================
 * REGISTER
 * PUBLIC
 *
 * POST /api/auth/register
 * ==========================================================
 */


router.post(

  "/register",

  controllerMethod(

    "register"

  )

);









/**
 * ==========================================================
 * LOGIN
 * PUBLIC
 *
 * POST /api/auth/login
 * ==========================================================
 */


router.post(

  "/login",

  controllerMethod(

    "login"

  )

);









/**
 * ==========================================================
 * REFRESH TOKEN
 * PUBLIC
 *
 * POST /api/auth/refresh
 * ==========================================================
 */


router.post(

  "/refresh",

  controllerMethod(

    "refreshToken"

  )

);









/**
 * ==========================================================
 * LOGOUT
 * AUTH REQUIRED
 *
 * POST /api/auth/logout
 * ==========================================================
 */


router.post(

  "/logout",

  authMiddleware,

  controllerMethod(

    "logout"

  )

);









/**
 * ==========================================================
 * CURRENT AUTH USER
 * AUTH REQUIRED
 *
 * GET /api/auth/me
 * ==========================================================
 */


router.get(

  "/me",

  authMiddleware,

  controllerMethod(

    "me"

  )

);









/**
 * ==========================================================
 * EXPORT ROUTER
 * ==========================================================
 */


export default router;