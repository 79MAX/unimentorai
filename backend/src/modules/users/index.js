/**
 * ==========================================================
 * UNIMENTORAI USERS MODULE V12
 * DEPENDENCY INJECTION ROOT
 * PRODUCTION READY
 * ==========================================================
 *
 * RESPONSIBILITY
 * ----------------------------------------------------------
 * - Create UserService
 * - Inject UserService into Controller
 * - Export module dependencies
 * ==========================================================
 */

import UserService from "./user.service.js";
import userRepository from "./user.repository.js";

import {
  userController,
  injectUserService
} from "./user.controller.js";

/**
 * ==========================================================
 * VALIDATION
 * ==========================================================
 */

if (!userRepository) {
  throw new Error("USERS MODULE: userRepository missing");
}

if (!userController) {
  throw new Error("USERS MODULE: userController missing");
}

/**
 * ==========================================================
 * SERVICE INSTANCE
 * ==========================================================
 */

const userService = new UserService({
  userRepository
});

/**
 * ==========================================================
 * DEPENDENCY INJECTION
 * ==========================================================
 */

injectUserService(userService);

/**
 * ==========================================================
 * MODULE READY
 * ==========================================================
 */

console.log("USERS MODULE READY");
console.log("USER SERVICE:", userService.constructor.name);
console.log("USER REPOSITORY:", userRepository.constructor.name);

/**
 * ==========================================================
 * EXPORTS
 * ==========================================================
 */

export {
  userService,
  userRepository,
  userController
};