const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const adminMiddleware = require(
  "../middleware/adminMiddleware"
);

const couponController = require(
  "../controllers/couponController"
);


// Admin routes
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  couponController.createCoupon
);

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  couponController.getCoupons
);


// Customer apply coupon
router.post(
  "/apply",
  authMiddleware,
  couponController.applyCoupon
);


module.exports = router;