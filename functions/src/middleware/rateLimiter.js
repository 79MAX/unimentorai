/**
 * Rate limiter simple en mémoire pour Cloud Functions HTTPS / callable.
 * Objectif : limiter les abus par utilisateur/IP sans changer massivement l’architecture.
 */

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_CALLS_PER_WINDOW = 60; // 60 requêtes / minute / clé

const buckets = new Map();

function getKey(contextOrReq) {
  // Pour les functions callable : context.auth.uid si possible
  if (contextOrReq && contextOrReq.auth && contextOrReq.auth.uid) {
    return `user:${contextOrReq.auth.uid}`;
  }
  // Pour les requêtes HTTP classiques : IP
  if (contextOrReq && contextOrReq.ip) {
    return `ip:${contextOrReq.ip}`;
  }
  return 'anonymous';
}

function checkRateLimit(key) {
  const now = Date.now();
  const bucket = buckets.get(key) || { count: 0, windowStart: now };
  if (now - bucket.windowStart > WINDOW_MS) {
    bucket.count = 0;
    bucket.windowStart = now;
  }
  bucket.count += 1;
  buckets.set(key, bucket);
  return bucket.count <= MAX_CALLS_PER_WINDOW;
}

function withRateLimitCallable(handler, functions) {
  return async (data, context) => {
    const key = getKey(context);
    if (!checkRateLimit(key)) {
      throw new functions.https.HttpsError(
        'resource-exhausted',
        'Trop de requêtes. Merci de réessayer plus tard.'
      );
    }
    return handler(data, context);
  };
}

function withRateLimitHttp(handler) {
  return async (req, res) => {
    const key = getKey(req);
    if (!checkRateLimit(key)) {
      res.status(429).json({ error: 'rate_limit', message: 'Too many requests' });
      return;
    }
    return handler(req, res);
  };
}

module.exports = {
  withRateLimitCallable,
  withRateLimitHttp,
  WINDOW_MS,
  MAX_CALLS_PER_WINDOW,
};


