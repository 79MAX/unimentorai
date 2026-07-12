/**
 * ==========================================================
 * UNIMENTORAI AUTH ROUTES V12
 * ==========================================================
 *
 * Flow:
 *
 * Request
 *    ↓
 * Routes
 *    ↓
 * AuthController INSTANCE
 *    ↓
 * AuthService INSTANCE
 *
 * ==========================================================
 */


import { Router } from "express";
import { authController } from "../modules/auth/index.js";
import { authMiddleware } from "../modules/auth/auth.middleware.js";


const router = Router();



/**
 * ==========================================================
 * PUBLIC ROUTES
 * ==========================================================
 */


router.post(
  "/register",
  (req,res,next)=>
    authController.register(req,res,next)
);



router.post(
  "/login",
  (req,res,next)=>
    authController.login(req,res,next)
);



router.post(
  "/refresh",
  (req,res,next)=>
    authController.refreshToken(req,res,next)
);




/**
 * ==========================================================
 * PROTECTED ROUTES
 * ==========================================================
 */


router.post(
  "/logout",
  authMiddleware,
  (req,res,next)=>
    authController.logout(req,res,next)
);



router.get(
  "/me",
  authMiddleware,
  (req,res,next)=>
    authController.me(req,res,next)
);



export default router;