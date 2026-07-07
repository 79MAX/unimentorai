/* =========================
   RESPONSE UTILITIES (SAAS CORE V2)
   - DRY architecture
   - scalable API standard
   - AI & observability ready
========================= */

/* =========================
   BASE RESPONSE FACTORY
========================= */
function baseResponse(success, message, data = null, meta = {}, error = null) {
  return {
    success,
    message,
    data,
    meta,
    error,
    timestamp: Date.now(),
  };
}

/* =========================
   SUCCESS RESPONSE (200)
========================= */
export function success(res, data = null, message = "SUCCESS", meta = {}) {
  return res.status(200).json(
    baseResponse(true, message, data, meta)
  );
}

/* =========================
   CREATED RESPONSE (201)
========================= */
export function created(res, data = null, message = "CREATED", meta = {}) {
  return res.status(201).json(
    baseResponse(true, message, data, meta)
  );
}

/* =========================
   ERROR RESPONSE (GENERIC)
========================= */
export function error(
  res,
  message = "INTERNAL_SERVER_ERROR",
  statusCode = 500,
  details = null
) {
  return res.status(statusCode).json(
    baseResponse(false, message, null, {}, details)
  );
}

/* =========================
   COMMON HTTP RESPONSES (DRY WRAPPERS)
========================= */
export const notFound = (res, message = "NOT_FOUND") =>
  res.status(404).json(baseResponse(false, message));

export const unauthorized = (res, message = "UNAUTHORIZED") =>
  res.status(401).json(baseResponse(false, message));

export const forbidden = (res, message = "FORBIDDEN") =>
  res.status(403).json(baseResponse(false, message));

/* =========================
   PAGINATION RESPONSE
========================= */
export function paginated(
  res,
  data,
  page = 1,
  limit = 10,
  total = 0,
  message = "SUCCESS"
) {
  return res.status(200).json(
    baseResponse(true, message, data, {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    })
  );
}

/* =========================
   EXPORT DEFAULT (OPTIONAL)
========================= */
export default {
  success,
  created,
  error,
  notFound,
  unauthorized,
  forbidden,
  paginated,
};
