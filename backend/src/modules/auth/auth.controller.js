import authService from "./auth.service.js";

/**
 * ==================================================
 * AUTH CONTROLLER V3 - CLEAN HTTP LAYER
 * ==================================================
 */

export class AuthController {
  async register(req, res, next) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const result = await authService.register({
        email,
        password,
        name,
      });

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const result = await authService.login({
        email,
        password,
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: "Refresh token required",
        });
      }

      const result = await authService.refreshToken(refreshToken);

      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      await authService.logout(userId);

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (err) {
      next(err);
    }
  }

  async me(req, res, next) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const user = await authService.getCurrentUser(userId);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  }
}

/**
 * Singleton instance (IMPORTANT for Registry V3)
 */
export default new AuthController();
