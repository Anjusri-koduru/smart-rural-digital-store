const express = require("express");

const router = express.Router();

const {
  getAdminDashboard,
  getAllUsers,
  getAllSellers,
  getAllCustomers,
} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Every route below requires:
// 1. Login
// 2. Admin role
// 3. Predefined admin email

router.use(authMiddleware);
router.use(adminMiddleware);

// Dashboard
router.get(
  "/dashboard",
  getAdminDashboard
);

// All users
router.get(
  "/users",
  getAllUsers
);

// All sellers
router.get(
  "/sellers",
  getAllSellers
);

// All customers
router.get(
  "/customers",
  getAllCustomers
);

module.exports = router;