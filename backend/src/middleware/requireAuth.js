import jwt from "jsonwebtoken";

function authError(message) {
  const error = new Error(message);
  error.statusCode = 401;
  return error;
}

export function requireAuth(req, res, next) {
  const [scheme, token] = (req.get("Authorization") || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return next(authError("Authentication required"));
  }

  if (!process.env.JWT_SECRET) {
    return next(new Error("JWT_SECRET is not defined")); // our misconfiguration, so a 500, not a 401
  }

  try {
    // Pinning the algorithm stops attackers from swapping in a weaker one
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    const userId = Number(payload.sub);
    if (!Number.isInteger(userId)) throw new Error("bad subject");
    req.user = { id: userId };
    next();
  } catch {
    next(authError("Invalid or expired token"));
  }
}