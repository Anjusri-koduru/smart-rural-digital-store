const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const recommendationController =
  require(
    "../controllers/recommendationController"
  );


// Personalized recommendations
router.get(
  "/for-you",
  authMiddleware,
  recommendationController.getRecommendations
);


// Similar products
router.get(
  "/similar/:productId",
  recommendationController.getSimilarProducts
);


module.exports = router;