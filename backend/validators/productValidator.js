const validateProduct = (req, res, next) => {
  const {
    name,
    description,
    price,
    quantity,
    category,
  } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: "Valid product name is required",
    });
  }

  if (!description || description.trim().length < 5) {
    return res.status(400).json({
      success: false,
      message: "Product description is required",
    });
  }

  if (
    price === undefined ||
    Number(price) < 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid product price is required",
    });
  }

  if (
    quantity === undefined ||
    Number(quantity) < 0
  ) {
    return res.status(400).json({
      success: false,
      message: "Valid product quantity is required",
    });
  }

  if (!category || category.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Product category is required",
    });
  }

  next();
};

module.exports = {
  validateProduct,
};