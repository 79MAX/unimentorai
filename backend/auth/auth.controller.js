import { authService } from "../services/auth.service.js";

/**
 * ========================
 * 🔐 AUTH CONTROLLER
 * HTTP LAYER ONLY
 * ========================
 */
class AuthController {
  /**
   * LOGIN
   */
  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const result = await authService.login({ email, password });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: err.message || "Authentication failed",
      });
    }
  };

  /**
   * REGISTER
   */
  register = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email and password are required",
        });
      }

      const result = await authService.register({ email, password });

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: result,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Registration failed",
      });
    }
  };

  /**
   * REFRESH TOKEN
   */
  refresh = async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: "Refresh token required",
        });
      }

      const result = await authService.refreshToken({ refreshToken });

      return res.status(200).json({
        success: true,
        message: "Token refreshed",
        data: result,
      });
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: err.message || "Invalid refresh token",
      });
    }
  };

  /**
   * LOGOUT
   */
  logout = async (req, res) => {
    try {
      const userId = req.user?.id;

      await authService.logout(userId);

      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Logout failed",
      });
    }
  };

  /**
   * CURRENT USER
   */
  me = async (req, res) => {
    try {
      const user = await authService.getCurrentUser(req.user.id);

      return res.status(200).json({
        success: true,
        message: "User fetched",
        data: user,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };
}

export const authController = new AuthController();
