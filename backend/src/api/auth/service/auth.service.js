import bcrypt from "bcryptjs";
import db from "../../../../db/db.config.js";

const BCRYPT_COST = 12;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
