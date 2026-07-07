import { Request, Response } from "firebase-functions/v1";
import { rateLimiter } from "./rate_limiter";
import { validateVerificationRequest } from "./request_validator";
import { isAllowedOrigin } from "./origin_guard";

export const secureVerificationRequest = (
  req: Request,
  res: Response
): boolean => {

  const ip =
    req.headers["x-forwarded-for"]?.toString() ||
    req.socket.remoteAddress ||
    "unknown";

  const origin = req.headers.origin;

  // RATE LIMIT
  const allowed = rateLimiter(ip);

  if (!allowed) {
    res.status(429).send({
      success: false,
      error: "Too many requests",
    });

    return false;
  }

  // ORIGIN CHECK
  if (!isAllowedOrigin(origin)) {
    res.status(403).send({
      success: false,
      error: "Origin blocked",
    });

    return false;
  }

  // REQUEST VALIDATION
  if (!validateVerificationRequest(req.body)) {
    res.status(400).send({
      success: false,
      error: "Invalid request",
    });

    return false;
  }

  return true;
};