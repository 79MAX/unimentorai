export function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "No token" });
    }

    // TODO: verify JWT

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
