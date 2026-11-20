const { AppError } = require("../utils/AppError");

const validate = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => ({
      field: issue.path.join(".") || "body",
      message: issue.message,
    }));
    return next(new AppError("Validation failed", 422, details));
  }
  req.body = parsed.data;
  return next();
};

module.exports = { validate };
