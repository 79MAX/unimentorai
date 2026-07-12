/**
 * ==========================================================
 * UNIMENTORAI AUTH MODULE V12
 * DEPENDENCY INJECTION ROOT
 * ==========================================================
 *
 * ROLE:
 * - Create AuthService instance
 * - Inject dependencies
 * - Create AuthController instance
 * - Export module instances
 *
 * FLOW:
 *
 * auth.routes.js
 *        |
 *        ▼
 * authController
 *        |
 *        ▼
 * AuthService
 *        |
 *        ▼
 * Repository + TokenStore
 *
 * ==========================================================
 */


/**
 * ==========================================================
 * IMPORTS
 * ==========================================================
 */

import AuthService from "./auth.service.js";

import authRepository from "./auth.repository.js";

import TokenStore from "./token.store.js";

import AuthController from "./auth.controller.js";



/**
 * ==========================================================
 * DEPENDENCIES
 * ==========================================================
 */


const userRepository =
  authRepository;


const tokenStore =
  new TokenStore();



/**
 * ==========================================================
 * AUTH SERVICE INSTANCE
 * ==========================================================
 */


const authService =
  new AuthService({

    userRepository,

    tokenStore

  });



console.log(
  "AUTH SERVICE CLASS:",
  authService.constructor.name
);



console.log(
  "AUTH SERVICE METHODS:",
  Object.getOwnPropertyNames(
    Object.getPrototypeOf(authService)
  )
);



/**
 * ==========================================================
 * AUTH CONTROLLER INSTANCE
 * ==========================================================
 */


const authController =
  new AuthController(
    authService
  );



console.log(
  "AUTH MODULE READY"
);



/**
 * ==========================================================
 * EXPORTS
 * ==========================================================
 */


export {

  authService,

  authController,

  userRepository,

  tokenStore

};