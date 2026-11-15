const recommendationService = require(
  "../services/recommendationService"
);

// Personalized recommendations
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    const recommendations =
      await recommendationService.getPersonalizedRecommendations(
        userId
      );

    res.status(200).json({
      success: true,
      count: recommendations.length,
      products: recommendations,
      recommendations,
    });
  } catch (error) {
    console.error(
      "Get recommendations error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to load recommendations.",
    });
  }
};

// Similar products
const getSimilarProducts = async (req, res) => {
  try {
    const { productId } = req.params;

    const products =
      await recommendationService.getSimilarProducts(
        productId
      );

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(
      "Get similar products error:",
      error
    );

    res.status(404).json({
      success: false,
      message:
        error.message ||
        "Unable to load similar products.",
    });
  }
};

module.exports = {
  getRecommendations,
  getSimilarProducts,
};