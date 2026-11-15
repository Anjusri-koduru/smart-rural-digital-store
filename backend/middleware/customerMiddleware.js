const customerMiddleware = (
  req,
  res,
  next
) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const allowedRoles = [
    "customer",
    "seller",
    "admin",
  ];

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "Customer access required",
    });
  }

  next();
};

module.exports = customerMiddleware;