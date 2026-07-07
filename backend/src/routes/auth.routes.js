import { Router } from "express";
import AuthController from "./auth.controller.js";

const router = Router();

/**
 * 🔐 AUTH ROUTES (STANDARDIZED)
 */

router.post("/login", (req, res, next) =>
  AuthController.login(req, res, next)
);

router.post("/register", (req, res, next) =>
  AuthController.register(req, res, next)
);

router.post("/refresh", (req, res, next) =>
  AuthController.refresh(req, res, next)
);

router.post("/logout", (req, res, next) =>
  AuthController.logout(req, res, next)
);

router.get("/me", (req, res, next) =>
  AuthController.me(req, res, next)
);

// 🔒 IMPORTANT: required for module registry
export default router;
