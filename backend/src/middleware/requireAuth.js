import jwt from "jsonwebtoken";
import db from "../../db/db.config.js";

function authError(message) {
  const error = new Error(message);
  error.statusCode = 401;
  return error;
}

export async function requireAuth(req, res, next) {
  const [scheme, token] = (req.get("Authorization") || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return next(authError("Authentication required"));
  }

  if (!process.env.JWT_SECRET) {
    return next(new Error("JWT_SECRET is not defined")); // our misconfiguration, so a 500
  }

  let userId;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
    userId = Number(payload.sub);
    if (!Number.isInteger(userId)) throw new Error("bad subject");
  } catch {
    return next(authError("Invalid or expired token"));
  }

  try {
    // A valid token is not enough: the account must still exist
    const [rows] = await db.execute(
      `SELECT user_id FROM users WHERE user_id = ?`,
      [userId],
    );
    if (!rows[0]) return next(authError("Invalid or expired token"));

    req.user = { id: userId };
    next();
  } catch (error) {
    next(error); // a database problem is a real 500, not a 401
  }
}
