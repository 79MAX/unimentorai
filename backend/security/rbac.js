export const rbac = ({ roles = [] }) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "UNAUTHORIZED",
      });
    }

    const userRole = req.user.role || "user";

    if (roles.length && !roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "FORBIDDEN",
        role: userRole,
        required: roles,
      });
    }

    next();
  };
};
