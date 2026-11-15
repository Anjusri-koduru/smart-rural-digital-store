const validateProfileUpdate = (req, res, next) => {
  const { name, phone } = req.body;

  if (name !== undefined && name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Name must contain at least 2 characters",
    });
  }

  if (phone !== undefined && phone.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid phone number",
    });
  }

  next();
};

module.exports = {
  validateProfileUpdate,
};