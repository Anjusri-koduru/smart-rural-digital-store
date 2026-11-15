const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  getAvailableRoles,
  switchRole,
} = require("../controllers/accountController");


router.use(authMiddleware);


router.get(
  "/roles",
  getAvailableRoles
);


router.post(
  "/switch-role",
  switchRole
);


module.exports = router;