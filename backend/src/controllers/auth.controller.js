import authService from "../services/auth.service.js";

/**
 * =====================================
 * RESPONSE HELPERS (LOCK SAFE)
 * =====================================
 */
const sendSuccess = (res, status = 200, message = "OK", data = null) => {
  return res.status(status).json({
    success: true,
    message,
    ...(data !== null ? { data } : {}),
  });
};

const sendError = (res, status = 400, message = "Error") => {
  return res.status(status).json({
    success: false,
    message,
  });
};

/**
 * =====================================
 * REGISTER
 * =====================================
 */
export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return sendSuccess(res, 201, "User registered successfully", result);
  } catch (err) {
    next(err);
  }
};

/**
 * =====================================
 * LOGIN
 * =====================================
 */
export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return sendSuccess(res, 200, "Login successful", result);
  } catch (err) {
    next(err);
  }
};

/**
 * =====================================
 * REFRESH TOKEN
 * =====================================
 */
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.body?.refreshToken;

    if (!token) {
      return sendError(res, 400, "Refresh token required");
    }

    const result = await authService.refreshToken(token);
    return sendSuccess(res, 200, "Token refreshed", result);
  } catch (err) {
    next(err);
  }
};

/**
 * =====================================
 * LOGOUT
 * =====================================
 */
export const logout = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return sendError(res, 401, "Unauthorized");
    }

    await authService.logout(userId);
    return sendSuccess(res, 200, "Logout successful");
  } catch (err) {
    next(err);
  }
};

/**
 * =====================================
 * PROFILE
 * =====================================
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return sendError(res, 401, "Unauthorized");

    const profile = await authService.getProfile(userId);
    return sendSuccess(res, 200, "Profile loaded", { user: profile });
  } catch (err) {
    next(err);
  }
};

/**
 * =====================================
 * UPDATE PROFILE
 * =====================================
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return sendError(res, 401, "Unauthorized");

    const profile = await authService.updateProfile(userId, req.body);
    return sendSuccess(res, 200, "Profile updated", { user: profile });
  } catch (err) {
    next(err);
  }
};

/**
 * =====================================
 * CHANGE PASSWORD
 * =====================================
 */
export const changePassword = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return sendError(res, 401, "Unauthorized");

    await authService.changePassword(
      userId,
      req.body.currentPassword,
      req.body.newPassword
    );

    return sendSuccess(res, 200, "Password updated successfully");
  } catch (err) {
    next(err);
  }
};

/**
 * =====================================
 * VERIFY EMAIL
 * =====================================
 */
export const verifyEmail = async (req, res, next) => {
  try {
    const result = await authService.verifyEmail(req.params.token);
    return sendSuccess(res, 200, "Email verified successfully", result);
  } catch (err) {
    next(err);
  }
};

/**
 * =====================================
 * FORGOT PASSWORD
 * =====================================
 */
export const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    return sendSuccess(res, 200, "Password reset instructions sent");
  } catch (err) {
    next(err);
  }
};

/**
 * =====================================
 * RESET PASSWORD
 * =====================================
 */
export const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(
      req.params.token,
      req.body.password
    );

    return sendSuccess(res, 200, "Password reset successful");
  } catch (err) {
    next(err);
  }
};

/**
 * =====================================
 * EXPORT DEFAULT (MODULE REGISTRY COMPATIBLE)
 * =====================================
 */
export default {
  register,
  login,
  logout,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
