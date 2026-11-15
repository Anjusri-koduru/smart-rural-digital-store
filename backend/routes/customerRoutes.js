const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const customerMiddleware = require(
  "../middleware/customerMiddleware"
);

const {
  getCustomerProfile,
  getCustomerDashboard,
  getCustomerProducts,
  getFavorites,
  addFavorite,
  removeFavorite,
  followSeller,
  unfollowSeller,
  getFollowedSellers,
} = require(
  "../controllers/customerController"
);


// Authentication + Customer/Seller/Admin access
router.use(authMiddleware);
router.use(customerMiddleware);


// ==========================================
// CUSTOMER PROFILE
// ==========================================

router.get(
  "/profile",
  getCustomerProfile
);


// ==========================================
// CUSTOMER DASHBOARD
// ==========================================

router.get(
  "/dashboard",
  getCustomerDashboard
);


// ==========================================
// BROWSE PRODUCTS
// ==========================================

router.get(
  "/products",
  getCustomerProducts
);


// ==========================================
// FAVORITES
// ==========================================

router.get(
  "/favorites",
  getFavorites
);

router.post(
  "/favorites/:productId",
  addFavorite
);

router.delete(
  "/favorites/:productId",
  removeFavorite
);


// ==========================================
// SELLER FOLLOW
// ==========================================

router.post(
  "/sellers/:sellerId/follow",
  followSeller
);

router.delete(
  "/sellers/:sellerId/follow",
  unfollowSeller
);

router.get(
  "/sellers/following",
  getFollowedSellers
);


module.exports = router;