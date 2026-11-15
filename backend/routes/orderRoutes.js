const express = require("express");

const router = express.Router();

const {
  createOrder,
  getCustomerOrders,
  getSellerOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");

const customerMiddleware =
  require("../middleware/customerMiddleware");

const sellerMiddleware =
  require("../middleware/sellerMiddleware");

const {
  validateOrder,
} = require("../validators/orderValidator");

// ==========================================
// Customer
// ==========================================

router.post(
  "/",
  authMiddleware,
  customerMiddleware,
  validateOrder,
  createOrder
);

router.get(
  "/customer/my-orders",
  authMiddleware,
  customerMiddleware,
  getCustomerOrders
);

router.put(
  "/:id/cancel",
  authMiddleware,
  customerMiddleware,
  cancelOrder
);

// ==========================================
// Seller
// ==========================================

router.get(
  "/seller/my-orders",
  authMiddleware,
  sellerMiddleware,
  getSellerOrders
);

router.put(
  "/:id/status",
  authMiddleware,
  sellerMiddleware,
  updateOrderStatus
);

// ==========================================
// Single Order
// ==========================================

router.get(
  "/:id",
  authMiddleware,
  getOrderById
);

module.exports = router;