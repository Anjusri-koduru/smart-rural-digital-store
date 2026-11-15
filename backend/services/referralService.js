const User = require("../models/User");
const Referral = require(
  "../models/Referral"
);


const generateReferralCode = (
  name,
  userId
) => {
  const namePart = name
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 4)
    .toUpperCase();

  const idPart = userId
    .toString()
    .slice(-5)
    .toUpperCase();

  return `${namePart}${idPart}`;
};


// Create referral code
const createReferralCode = async (
  userId
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.referralCode) {
    return user.referralCode;
  }

  const code = generateReferralCode(
    user.name,
    user._id
  );

  user.referralCode = code;

  await user.save();

  return code;
};


// Get referral information
const getReferralInfo = async (
  userId
) => {
  const user = await User.findById(
    userId
  );

  if (!user) {
    throw new Error("User not found");
  }

  const referrals =
    await Referral.find({
      referrer: userId,
    }).populate(
      "referredUser",
      "name email"
    );

  return {
    referralCode:
      user.referralCode,
    referrals,
  };
};


// Use referral code
const useReferralCode = async (
  userId,
  referralCode
) => {
  const newUser = await User.findById(
    userId
  );

  if (!newUser) {
    throw new Error("User not found");
  }

  if (newUser.referredBy) {
    throw new Error(
      "Referral code already used"
    );
  }

  const referrer =
    await User.findOne({
      referralCode:
        referralCode.toUpperCase(),
    });

  if (!referrer) {
    throw new Error(
      "Invalid referral code"
    );
  }

  if (
    referrer._id.toString() ===
    userId.toString()
  ) {
    throw new Error(
      "You cannot use your own referral code"
    );
  }

  newUser.referredBy =
    referrer._id;

  await newUser.save();

  const referral =
    await Referral.create({
      referrer: referrer._id,
      referredUser: newUser._id,
      referralCode:
        referralCode.toUpperCase(),
    });

  return referral;
};


module.exports = {
  createReferralCode,
  getReferralInfo,
  useReferralCode,
};