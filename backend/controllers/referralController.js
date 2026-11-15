const referralService = require(
  "../services/referralService"
);


// Generate/get referral code
const getReferralCode = async (
  req,
  res
) => {
  try {
    const code =
      await referralService
        .createReferralCode(
          req.user.id
        );

    res.status(200).json({
      success: true,
      referralCode: code,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Referral information
const getReferralInfo = async (
  req,
  res
) => {
  try {
    const data =
      await referralService
        .getReferralInfo(
          req.user.id
        );

    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Use referral code
const useReferralCode = async (
  req,
  res
) => {
  try {
    const { referralCode } =
      req.body;

    if (!referralCode) {
      return res.status(400).json({
        success: false,
        message:
          "Referral code is required",
      });
    }

    const referral =
      await referralService
        .useReferralCode(
          req.user.id,
          referralCode
        );

    res.status(200).json({
      success: true,
      message:
        "Referral code applied successfully",
      referral,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  getReferralCode,
  getReferralInfo,
  useReferralCode,
};