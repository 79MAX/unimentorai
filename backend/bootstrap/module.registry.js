/**
 * ==================================================
 * UNIMENTORAI MODULE REGISTRY V12
 * ==================================================
 *
 * ROLE:
 * - Centraliser les modules API
 * - Charger les routes automatiquement
 * - Préparer l'évolution micro-modules
 *
 * FLOW:
 *
 * Bootstrap
 *    ↓
 * Module Registry
 *    ↓
 * Routes
 *    ↓
 * Controllers
 *    ↓
 * Services
 *
 * ==================================================
 */


import authRoutes from "../src/routes/auth.routes.js";
import userRoutes from "../src/modules/users/user.routes.js";


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


console.log(
  "🚀 MODULE REGISTRY V12 LOADED:",
  moduleRegistry.map(
    module => `${module.name}:${module.path}`
  )
);


export default moduleRegistry;