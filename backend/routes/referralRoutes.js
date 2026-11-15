const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const referralController = require(
  "../controllers/referralController"
);


router.use(authMiddleware);


// Get referral code
router.get(
  "/code",
  referralController.getReferralCode
);


// Get referral information
router.get(
  "/",
  referralController.getReferralInfo
);


// Apply referral code
router.post(
  "/apply",
  referralController.useReferralCode
);


module.exports = router;