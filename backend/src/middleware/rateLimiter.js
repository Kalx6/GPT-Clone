import rateLimit from "express-rate-limit";

// 10 attempts per 15 minutes per IP on login/register
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  // Goes through your errorHandler so the response shape matches your other errors
  handler: (req, res, next) => {
    const error = new Error("Too many attempts. Please try again later.");
    error.statusCode = 429;
    next(error);
  },
});
