const env = require("../config/env");

const adminMiddleware = (req, res, next) => {
  // Authentication check
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  // Role check
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to access the Admin panel.",
    });
  }

  // Predefined admin email check
  if (
    !env.ADMIN_EMAIL ||
    req.user.email.toLowerCase() !==
      env.ADMIN_EMAIL.toLowerCase()
  ) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to access the Admin panel.",
    });
  }

  next();
};

module.exports = adminMiddleware;