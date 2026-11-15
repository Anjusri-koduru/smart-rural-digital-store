const RecommendationInteraction = require(
  "../models/RecommendationInteraction"
);

const Product = require("../models/Product");

// Track product view
const trackProductView = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await RecommendationInteraction.create({
      customer: req.user.id,
      product: productId,
      action: "view",
    });

    res.status(201).json({
      success: true,
      message: "Product view tracked",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Track search
const trackSearch = async (req, res) => {
  try {
    const { searchTerm } = req.body;

    if (
      !searchTerm ||
      !searchTerm.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Search term is required",
      });
    }

    await RecommendationInteraction.create({
      customer: req.user.id,
      action: "search",
      searchTerm: searchTerm.trim().toLowerCase(),
    });

    res.status(201).json({
      success: true,
      message: "Search tracked",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  trackProductView,
  trackSearch,
};