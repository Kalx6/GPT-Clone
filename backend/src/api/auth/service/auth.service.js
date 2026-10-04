import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../../../../db/db.config.js";

const BCRYPT_COST = 12;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Used so a missing user takes as long to reject as a wrong password
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", BCRYPT_COST);

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export async function registerService(email, password) {
  if (typeof email !== "string" || typeof password !== "string") {
    throw httpError(400, "Email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail.length > 320 || !EMAIL_REGEX.test(normalizedEmail)) {
    throw httpError(400, "Please enter a valid email address");
  }

  // bcrypt only reads the first 72 bytes, so longer passwords would be silently cut
  if (password.length < 8 || Buffer.byteLength(password) > 72) {
    throw httpError(400, "Password must be between 8 and 72 characters");
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

  try {
    const [result] = await db.execute(
      `INSERT INTO users (email, password_hash) VALUES (?, ?)`,
      [normalizedEmail, passwordHash],
    );
    return { id: result.insertId, email: normalizedEmail };
  } catch (error) {
    // The UNIQUE constraint on email is the real duplicate check (safe even if two sign-ups race)
    if (error.code === "ER_DUP_ENTRY") {
      throw httpError(409, "An account with this email already exists");
    }
    throw error;
  }
}

function signToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign({}, process.env.JWT_SECRET, {
    algorithm: "HS256",
    subject: String(userId),
    expiresIn: "1d",
  });
}

export async function loginService(email, password) {
  if (typeof email !== "string" || typeof password !== "string") {
    throw httpError(400, "Email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const [rows] = await db.execute(
    `SELECT user_id, email, password_hash FROM users WHERE email = ?`,
    [normalizedEmail],
  );
  const user = rows[0];

  const passwordOk = await bcrypt.compare(
    password,
    user ? user.password_hash : DUMMY_HASH,
  );
  if (!user || !passwordOk) {
    throw httpError(401, "Invalid email or password");
  }

  return {
    token: signToken(user.user_id),
    user: { id: user.user_id, email: user.email },
  };
}
