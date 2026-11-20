const { env } = require("../config/env");
const { AppError } = require("../utils/AppError");

function prismaCode(error) {
  if (error.code === "P2002") {
    const field = error.meta?.target?.[0] || "field";
    return new AppError(`${field} is already in use`, 409);
  }
  if (error.code === "P2025") {
    return new AppError("Record not found", 404);
  }
  if (error.code === "P2003") {
    return new AppError("Related record does not exist", 400);
  }
  return null;
}

const errorHandler = (err, _req, res, _next) => {
  const mapped = prismaCode(err) || err;
  const status = mapped.statusCode || 500;
  const payload = {
    success: false,
    message: status === 500 ? "Internal server error" : mapped.message,
  };
  if (mapped.details) payload.details = mapped.details;
  if (env.nodeEnv !== "production" && status === 500) {
    payload.debug = err.message;
  }
  if (status === 500) {
    console.error(err);
  }
  res.status(status).json(payload);
};

const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

module.exports = { errorHandler, notFound };
