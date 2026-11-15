const User = require("../models/User");
const Product = require("../models/Product");

// Seller profile
const getSellerProfile = async (req, res) => {
  try {
    const seller = await User.findById(
      req.user.id
    ).select("-password");

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch seller profile",
      error: error.message,
    });
  }
};

// Seller dashboard
const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const totalProducts =
      await Product.countDocuments({
        seller: sellerId,
      });

    const availableProducts =
      await Product.countDocuments({
        seller: sellerId,
        isAvailable: true,
      });

    const outOfStockProducts =
      await Product.countDocuments({
        seller: sellerId,
        quantity: 0,
      });

    const products = await Product.find({
      seller: sellerId,
    });

    res.status(200).json({
      success: true,
      dashboard: {
        totalProducts,
        availableProducts,
        outOfStockProducts,
        products,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load seller dashboard",
      error: error.message,
    });
  }
};

// Seller's products
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      seller: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch seller products",
      error: error.message,
    });
  }
};

module.exports = {
  getSellerProfile,
  getSellerDashboard,
  getMyProducts,
};