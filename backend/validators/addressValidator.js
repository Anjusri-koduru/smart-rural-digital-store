const validateAddress = (
  req,
  res,
  next
) => {
  const {
    name,
    phone,
    addressLine,
    city,
    state,
    pincode,
  } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Valid name is required",
    });
  }

  if (!phone || phone.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: "Valid phone number is required",
    });
  }

  if (
    !addressLine ||
    addressLine.trim().length < 5
  ) {
    return res.status(400).json({
      success: false,
      message: "Address is required",
    });
  }

  if (!city || city.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "City is required",
    });
  }

  if (!state || state.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "State is required",
    });
  }

  if (
    !pincode ||
    !/^\d{6}$/.test(pincode)
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid 6-digit pincode is required",
    });
  }

  next();
};

module.exports = {
  validateAddress,
};