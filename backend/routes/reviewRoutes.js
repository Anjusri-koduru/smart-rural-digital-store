const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const reviewController = require(
  "../controllers/reviewController"
);


// Get reviews of a product
router.get(
  "/product/:productId",
  reviewController.getProductReviews
);


// Create review
router.post(
  "/product/:productId",
  authMiddleware,
  reviewController.createReview
);


// Update own review
router.put(
  "/:reviewId",
  authMiddleware,
  reviewController.updateReview
);


// Delete own review
router.delete(
  "/:reviewId",
  authMiddleware,
  reviewController.deleteReview
);


module.exports = router;