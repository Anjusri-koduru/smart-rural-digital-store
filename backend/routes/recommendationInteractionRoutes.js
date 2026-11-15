const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  trackProductView,
  trackSearch,
} = require(
  "../controllers/recommendationInteractionController"
);

router.use(authMiddleware);

router.post(
  "/view",
  trackProductView
);

router.post(
  "/search",
  trackSearch
);

module.exports = router;