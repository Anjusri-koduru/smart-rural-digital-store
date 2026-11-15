const sellerMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (
    req.user.role !== "seller" &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message:
        "Seller access is required for this operation.",
    });
  }

  next();
};

module.exports = sellerMiddleware;