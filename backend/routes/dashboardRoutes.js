const express = require("express");

const router = express.Router();

const {
  sellerDashboard,
  customerDashboard,
  adminDashboard,
} = require("../controllers/dashboardController");

const authMiddleware =
  require("../middleware/authMiddleware");

const sellerMiddleware =
  require("../middleware/sellerMiddleware");

const customerMiddleware =
  require("../middleware/customerMiddleware");

const adminMiddleware =
  require("../middleware/adminMiddleware");

// ==========================================
// Seller Dashboard
// ==========================================

router.get(
  "/seller",
  authMiddleware,
  sellerMiddleware,
  sellerDashboard
);

// ==========================================
// Customer Dashboard
// ==========================================

router.get(
  "/customer",
  authMiddleware,
  customerMiddleware,
  customerDashboard
);

// ==========================================
// Admin Dashboard
// ==========================================

router.get(
  "/admin",
  authMiddleware,
  adminMiddleware,
  adminDashboard
);

module.exports = router;