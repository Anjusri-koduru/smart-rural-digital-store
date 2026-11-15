const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const customerMiddleware = require(
  "../middleware/customerMiddleware"
);

const cartController = require(
  "../controllers/cartController"
);


router.use(authMiddleware);
router.use(customerMiddleware);


// Get cart
router.get(
  "/",
  cartController.getCart
);


// Add product
router.post(
  "/",
  cartController.addToCart
);


// Update quantity
router.put(
  "/:productId",
  cartController.updateCartItem
);


// Remove product
router.delete(
  "/:productId",
  cartController.removeFromCart
);


// Clear cart
router.delete(
  "/",
  cartController.clearCart
);


module.exports = router;