import authRoutes from "../src/routes/auth.routes.js";
import userRoutes from "../src/modules/users/user.routes.js";

/**
 * ==================================================
 * MODULE REGISTRY - LOCK SYSTEM V1
 * ==================================================
 * 🎯 OBJECTIF:
 * - Centraliser tous les modules API
 * - Éviter imports cassés dispersés
 * - Permettre future auto-repair engine
 */

export function registerModules(app) {
  if (!app) {
    throw new Error("❌ App instance is required for module registration");
  }

  console.log("🔒 MODULE REGISTRY STARTING...");

  const modules = [
    {
      name: "auth",
      path: "/api/auth",
      router: authRoutes,
    },
    {
      name: "users",
      path: "/api/users",
      router: userRoutes,
    },
  ];

  for (const mod of modules) {
    if (!mod.router) {
      throw new Error(`❌ Missing router for module: ${mod.name}`);
    }

    app.use(mod.path, mod.router);

    console.log(`✅ Module loaded: ${mod.name} → ${mod.path}`);
  }

  console.log("🚀 MODULE REGISTRY COMPLETE");
}
