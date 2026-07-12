/**
 * ==========================================================
 * UNIMENTORAI USERS ROUTES V12
 * HTTP ROUTER LAYER
 * PRODUCTION STABLE
 * ==========================================================
 *
 * FLOW:
 *
 * Request
 *    ↓
 * Router
 *    ↓
 * Auth Middleware
 *    ↓
 * UserController
 *    ↓
 * UserService
 *    ↓
 * UserRepository
 *    ↓
 * MongoDB
 *
 * ==========================================================
 */


import express from "express";


import {
  userController
}
from "./index.js";


import {
  authMiddleware
}
from "../auth/auth.middleware.js";


import {
  requireRole
}
from "../auth/rbac/role.middleware.js";



const router = express.Router();




/**
 * ==========================================================
 * CONTROLLER BINDING
 * ==========================================================
 *
 * Important:
 * conserve le contexte du contrôleur
 *
 * ==========================================================
 */


function bindController(method){


  if(!userController[method]){


    return (req,res)=>{

      return res.status(501).json({

        success:false,

        message:
          `${method} not implemented`

      });

    };

  }



  return async(req,res,next)=>{


    try{


      return await userController[method](

        req,

        res,

        next

      );


    }

    catch(error){


      next(error);


    }


  };


}







/**
 * ==========================================================
 * HEALTH
 * PUBLIC
 * ==========================================================
 */


router.get(

  "/health",

  bindController(
    "health"
  )

);









/**
 * ==========================================================
 * CURRENT USER
 * ==========================================================
 */


router.get(

  "/me",

  authMiddleware,

  bindController(
    "me"
  )

);







/**
 * ==========================================================
 * UPDATE PROFILE
 * ==========================================================
 */


router.patch(

  "/me",

  authMiddleware,

  bindController(
    "updateProfile"
  )

);








/**
 * ==========================================================
 * SECURITY STATUS
 * ==========================================================
 */


router.get(

  "/me/security",

  authMiddleware,

  bindController(
    "getSecurityStatus"
  )

);










/**
 * ==========================================================
 * ADMIN USER LIST
 * ==========================================================
 */


router.get(

  "/",

  authMiddleware,

  requireRole(
    "admin",
    "super_admin"
  ),

  bindController(
    "listUsers"
  )

);









/**
 * ==========================================================
 * ADMIN GET USER
 * ==========================================================
 */


router.get(

  "/:id",

  authMiddleware,

  requireRole(
    "admin",
    "super_admin"
  ),

  bindController(
    "getUser"
  )

);









/**
 * ==========================================================
 * ROLE MANAGEMENT
 * ==========================================================
 */


router.patch(

  "/:id/role",

  authMiddleware,

  requireRole(
    "super_admin"
  ),

  bindController(
    "updateRole"
  )

);









/**
 * ==========================================================
 * QUARANTINE
 * ==========================================================
 */


router.patch(

  "/:id/quarantine",

  authMiddleware,

  requireRole(
    "admin",
    "super_admin"
  ),

  bindController(
    "quarantineUser"
  )

);









/**
 * ==========================================================
 * RELEASE
 * ==========================================================
 */


router.patch(

  "/:id/release",

  authMiddleware,

  requireRole(
    "admin",
    "super_admin"
  ),

  bindController(
    "releaseUser"
  )

);









/**
 * ==========================================================
 * DELETE
 * ==========================================================
 */


router.delete(

  "/:id",

  authMiddleware,

  requireRole(
    "super_admin"
  ),

  bindController(
    "deleteUser"
  )

);







export default router;