import authRoutes from "../src/routes/auth.routes.js";
import userRoutes from "../src/modules/users/user.routes.js";

export const moduleRegistry = [
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