const express = require("express");

const router = express.Router();

const {
  getProfile,
  updateProfile,
  getAllUsers,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  validateProfileUpdate,
} = require("../validators/userValidator");

// Logged-in user
router.get(
  "/profile",
  authMiddleware,
  getProfile
);

// Update profile
router.put(
  "/profile",
  authMiddleware,
  validateProfileUpdate,
  updateProfile
);

// Admin only
router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);

module.exports = router;