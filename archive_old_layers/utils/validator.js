/* =========================
   VALIDATION CORE ENGINE (SAAS V5)
   - Clean architecture
   - AI-ready
   - Production-grade
========================= */

/* =========================
   ERROR CLASS
========================= */
export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

/* =========================
   CORE TYPE CHECKERS
========================= */
export const is = {
  string: (v) => typeof v === "string",
  number: (v) => typeof v === "number" && !Number.isNaN(v),

  object: (v) =>
    v !== null && typeof v === "object" && !Array.isArray(v),

  nonEmptyString: (v) =>
    typeof v === "string" && v.trim().length > 0,

  email: (v) =>
    typeof v === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim().toLowerCase()),

  positive: (v) =>
    typeof v === "number" && v > 0,
};

/* =========================
   CORE ASSERT ENGINE
========================= */
export function assert(condition, message, field = null) {
  if (!condition) {
    throw new ValidationError(message, field);
  }
}

/* =========================
   SAFE FIELD CHECK
========================= */
export function require(obj, field, message = "FIELD_REQUIRED") {
  assert(
    obj?.[field] !== undefined && obj?.[field] !== null,
    message,
    field
  );
}

/* =========================
   DOMAIN VALIDATORS
========================= */
export const validateEmail = (email) =>
  assert(is.email(email), "INVALID_EMAIL", "email");

export const validatePassword = (password) =>
  assert(
    is.string(password) && password.length >= 6,
    "WEAK_PASSWORD",
    "password"
  );

/* =========================
   SAFE WRAPPER (NO THROW)
========================= */
export function safeValidate(fn, data) {
  try {
    fn(data);
    return { valid: true, error: null };
  } catch (err) {
    return {
      valid: false,
      error: {
        message: err.message,
        field: err.field || null,
      },
    };
  }
}

/* =========================
   USER VALIDATION
========================= */
export function validateUser(user) {
  assert(is.object(user), "INVALID_USER_OBJECT");

  require(user, "email");
  require(user, "password");
  require(user, "name");

  validateEmail(user.email);
  validatePassword(user.password);

  assert(
    is.nonEmptyString(user.name),
    "INVALID_NAME",
    "name"
  );

  return true;
}

/* =========================
   COURSE VALIDATION
========================= */
export function validateCourse(course) {
  assert(is.object(course), "INVALID_COURSE_OBJECT");

  require(course, "title");

  assert(
    is.nonEmptyString(course.title),
    "INVALID_COURSE_TITLE",
    "title"
  );

  return true;
}

/* =========================
   DEFAULT EXPORT
========================= */
export default {
  ValidationError,
  is,
  assert,
  require,
  validateEmail,
  validatePassword,
  validateUser,
  validateCourse,
  safeValidate,
};
