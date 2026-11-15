const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  register,
  login,
  getMe,
  logout,
} = require("../controllers/authController");

const {
  validateRegister,
  validateLogin,
} = require("../validators/authValidator");

// Register
router.post(
  "/register",
  validateRegister,
  register
);

// Login
router.post(
  "/login",
  validateLogin,
  login
);

// Current logged-in user
router.get(
  "/me",
  authMiddleware,
  getMe
);

// Logout
router.post(
  "/logout",
  authMiddleware,
  logout
);

module.exports = router;