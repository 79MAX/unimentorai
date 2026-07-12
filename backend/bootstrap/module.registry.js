/**
 * ==========================================================
 * UNIMENTORAI MODULE REGISTRY V12
 * ==========================================================
 *
 * ROLE
 * ----------------------------------------------------------
 * Single source of truth for all API modules.
 *
 * RESPONSIBILITIES
 * ----------------------------------------------------------
 * • Register every Express module
 * • Mount routes with their API prefixes
 * • Keep the bootstrap layer independent from business logic
 * • Simplify module addition/removal
 * • Prevent scattered route registration
 * • Support future auto-discovery and self-healing engines
 * • Prepare migration toward a modular architecture
 *
 * ARCHITECTURE
 * ----------------------------------------------------------
 * server.js
 *      │
 *      ▼
 * bootstrap/app.js
 *      │
 *      ▼
 * bootstrap/module.registry.js
 *      │
 *      ├── /api/auth
 *      ├── /api/users
 *      └── ...
 *
 * RULES
 * ----------------------------------------------------------
 * • Register modules only here.
 * • Do not call app.use() elsewhere for application modules.
 * • Every module must export a default Express Router.
 * • Every module manages its own controllers, services
 *   and middlewares.
 *
 * VERSION : V12
 * STATUS  : STABLE
 * ==========================================================
 */

import authRoutes from "../src/modules/auth/auth.routes.js";
import userRoutes from "../src/modules/users/user.routes.js";

/* ==========================================================
   MODULE REGISTRY
========================================================== */

const moduleRegistry = [
  {
    name: "auth",
    path: "/api/auth",
    handler: authRoutes
  },
  {
    name: "users",
    path: "/api/users",
    handler: userRoutes
  }
];

/* ==========================================================
   STARTUP LOG
========================================================== */

console.log(
  "🚀 MODULE REGISTRY V12 LOADED:",
  moduleRegistry.map(module => `${module.name}:${module.path}`)
);

export default moduleRegistry;