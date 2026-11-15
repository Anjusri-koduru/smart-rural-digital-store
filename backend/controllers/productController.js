const productService = require("../services/productService");

// Create product
const createProduct = async (req, res) => {
  try {
    const productData = {
      seller: req.user.id,
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      category: req.body.category,
      location: req.body.location || "",
      shopName: req.body.shopName || "",
      image: req.file
        ? `/uploads/products/${req.file.filename}`
        : "",
    };

    const product =
      await productService.createProduct(productData);

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products =
      await productService.getAllProducts(req.query);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product =
      await productService.getProductById(
        req.params.id
      );

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Get seller products
const getSellerProducts = async (req, res) => {
  try {
    const products =
      await productService.getSellerProducts(
        req.user.id
      );

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
    };

    if (req.file) {
      updateData.image =
        `/uploads/products/${req.file.filename}`;
    }

    const product =
      await productService.updateProduct(
        req.params.id,
        req.user.id,
        updateData
      );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getSellerProducts,
  updateProduct,
  deleteProduct,
};