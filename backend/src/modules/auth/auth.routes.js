/**
 * ==========================================================
 * UNIMENTORAI AUTH ROUTES V12
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
 * HEALTH CHECK
 * PUBLIC
 * ==========================================================
 */


router.get(

  "/health",

  (

    req,

    res

  )=>{


    return res.status(200).json({

      module:"auth",

      status:"healthy",

      version:"V12",

      ok:true,

      timestamp:Date.now()

    });


  }

);









/**
 * ==========================================================
 * REGISTER
 * PUBLIC
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
 * ==========================================================
 */


router.get(

  "/me",

  authMiddleware,

  controllerMethod(
    "me"
  )

);









export default router;