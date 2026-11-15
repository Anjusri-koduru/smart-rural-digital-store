const express = require("express");

const router = express.Router();

const {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/addressController");

const authMiddleware =
  require("../middleware/authMiddleware");

const customerMiddleware =
  require("../middleware/customerMiddleware");

const {
  validateAddress,
} = require("../validators/addressValidator");

router.use(authMiddleware);
router.use(customerMiddleware);

// Add
router.post(
  "/",
  validateAddress,
  createAddress
);

// Get all
router.get(
  "/",
  getAddresses
);

// Get single
router.get(
  "/:id",
  getAddressById
);

// Update
router.put(
  "/:id",
  validateAddress,
  updateAddress
);

// Set default
router.put(
  "/:id/default",
  setDefaultAddress
);

// Delete
router.delete(
  "/:id",
  deleteAddress
);

module.exports = router;