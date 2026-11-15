const express = require("express");

const router = express.Router();

const {
  getSellerProfile,
  getSellerDashboard,
  getMyProducts,
} = require("../controllers/sellerController");

const authMiddleware = require("../middleware/authMiddleware");
const sellerMiddleware = require("../middleware/sellerMiddleware");

router.use(authMiddleware);
router.use(sellerMiddleware);

// Seller dashboard
router.get(
  "/dashboard",
  getSellerDashboard
);

// Seller profile
router.get(
  "/profile",
  getSellerProfile
);

// Seller products
router.get(
  "/products",
  getMyProducts
);

module.exports = router;