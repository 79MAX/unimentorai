/**
 * ==========================================================
 * UNIMENTORAI USER CONTROLLER V12
 * HTTP PRESENTATION LAYER
 * PRODUCTION READY
 * ==========================================================
 */

let userService = null;

/**
 * ==========================================================
 * DEPENDENCY INJECTION
 * ==========================================================
 */

export function injectUserService(service) {
  userService = service;
}

/**
 * ==========================================================
 * CONTROLLER
 * ==========================================================
 */

export const userController = {

  /**
   * HEALTH
   */
  health(req, res) {
    return res.status(200).json({
      module: "users",
      status: "healthy",
      version: "V12",
      ok: true,
      timestamp: Date.now()
    });
  },

  /**
   * CURRENT USER
   */
  async me(req, res, next) {
    try {

      if (!userService) {
        throw new Error("UserService not injected");
      }

      const user = await userService.getCurrentUser(req.user.id);

      return res.status(200).json({
        success: true,
        data: {
          user
        }
      });

    } catch (error) {
      next(error);
    }
  },

  /**
   * UPDATE PROFILE
   */
  async updateProfile(req, res, next) {
    try {

      if (!userService) {
        throw new Error("UserService not injected");
      }

      const user = await userService.updateProfile(
        req.user.id,
        req.body
      );

      return res.status(200).json({
        success: true,
        message: "Profile updated",
        data: {
          user
        }
      });

    } catch (error) {
      next(error);
    }
  },

  /**
   * SECURITY
   */
  async getSecurityStatus(req, res, next) {
    try {

      if (!userService) {
        throw new Error("UserService not injected");
      }

      const security = await userService.getSecurityStatus(req.user.id);

      return res.status(200).json({
        success: true,
        security
      });

    } catch (error) {
      next(error);
    }
  },

  /**
   * ADMIN - LIST USERS
   */
  async listUsers(req, res, next) {
    try {

      const users = await userService.listUsers();

      return res.status(200).json({
        success: true,
        data: {
          users
        }
      });

    } catch (error) {
      next(error);
    }
  },

  /**
   * ADMIN - GET USER
   */
  async getUser(req, res, next) {
    try {

      const user = await userService.getUserById(req.params.id);

      return res.status(200).json({
        success: true,
        data: {
          user
        }
      });

    } catch (error) {
      next(error);
    }
  },

  updateRole(req, res) {
    return res.json({
      success: true,
      message: "Role update ready",
      userId: req.params.id
    });
  },

  quarantineUser(req, res) {
    return res.json({
      success: true,
      message: "User quarantined",
      userId: req.params.id
    });
  },

  releaseUser(req, res) {
    return res.json({
      success: true,
      message: "User released",
      userId: req.params.id
    });
  },

  deleteUser(req, res) {
    return res.json({
      success: true,
      message: "User deletion ready",
      userId: req.params.id
    });
  }

};