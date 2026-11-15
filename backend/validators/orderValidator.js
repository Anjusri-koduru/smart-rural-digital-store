const validateOrder = (
  req,
  res,
  next
) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
  } = req.body;

  if (
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "At least one product is required",
    });
  }

  for (const item of items) {
    if (!item.product) {
      return res.status(400).json({
        success: false,
        message:
          "Product ID is required",
      });
    }

    if (
      !item.quantity ||
      Number(item.quantity) < 1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid product quantity is required",
      });
    }
  }

  if (!shippingAddress) {
    return res.status(400).json({
      success: false,
      message:
        "Shipping address is required",
    });
  }

  const requiredAddressFields = [
    "name",
    "phone",
    "addressLine",
    "city",
    "state",
    "pincode",
  ];

  for (
    const field of requiredAddressFields
  ) {
    if (
      !shippingAddress[field] ||
      !String(
        shippingAddress[field]
      ).trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          `${field} is required`,
      });
    }
  }

  if (
    paymentMethod &&
    !["COD", "ONLINE"].includes(
      paymentMethod
    )
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid payment method",
    });
  }

  next();
};

module.exports = {
  validateOrder,
};