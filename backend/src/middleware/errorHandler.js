export default function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    console.error(err); // full details stay in the server logs
  }

  res.status(statusCode).json({
    success: false,
    message:
      statusCode >= 500
        ? "Something went wrong. Please try again later."
        : err.message,
  });
}
