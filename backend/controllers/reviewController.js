const reviewService = require("../services/reviewService");
const validateReview = require("../validators/reviewValidator");


// Create review
const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    const validationError = validateReview(
      req.body
    );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const review =
      await reviewService.createReview(
        req.user.id,
        productId,
        Number(rating),
        comment || ""
      );

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Get product reviews
const getProductReviews = async (
  req,
  res
) => {
  try {
    const { productId } = req.params;

    const reviews =
      await reviewService.getProductReviews(
        productId
      );

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Update review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const validationError = validateReview(
      req.body
    );

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const review =
      await reviewService.updateReview(
        req.user.id,
        reviewId,
        Number(rating),
        comment || ""
      );

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    await reviewService.deleteReview(
      req.user.id,
      reviewId
    );

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
};