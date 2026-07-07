/**
 * ==================================================
 * UNIMENTORAI AUTH VALIDATOR
 * Production-grade input validation
 * ==================================================
 */

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const regex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate password strength
 * - min 8 chars
 * - at least 1 letter
 * - at least 1 number
 */
const isStrongPassword = (password) => {
  if (typeof password !== "string")
    return false;

  return (
    password.length >= 8 &&
    /[A-Za-z]/.test(password) &&
    /[0-9]/.test(password)
  );
};

/**
 * Validate role
 */
const allowedRoles = [
  "user",
  "admin",
  "mentor",
  "student",
];

const isValidRole = (role) => {
  if (!role) return true; // optional field

  return allowedRoles.includes(role);
};

/**
 * ==================================================
 * REGISTER VALIDATION
 * ==================================================
 */
export const validateRegister = (
  req,
  res,
  next
) => {
  try {
    const {
      email,
      password,
      role,
      name,
    } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message:
          "EMAIL_PASSWORD_NAME_REQUIRED",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message:
          "INVALID_EMAIL_FORMAT",
      });
    }

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "WEAK_PASSWORD_MIN_8_CHARS_REQUIRED",
      });
    }

    if (!isValidRole(role)) {
      return res.status(400).json({
        success: false,
        message:
          "INVALID_ROLE",
        allowedRoles,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "VALIDATION_ERROR",
    });
  }
};

/**
 * ==================================================
 * LOGIN VALIDATION
 * ==================================================
 */
export const validateLogin = (
  req,
  res,
  next
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "EMAIL_AND_PASSWORD_REQUIRED",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message:
          "INVALID_EMAIL_FORMAT",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "VALIDATION_ERROR",
    });
  }
};

/**
 * ==================================================
 * EXPORT HELPERS (optional reuse)
 * ==================================================
 */
export {
  isValidEmail,
  isStrongPassword,
  isValidRole,
};
