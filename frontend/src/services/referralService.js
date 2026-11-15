import api from "./api";

// Get own referral code
export const getReferralCode = async () => {
  const response = await api.get(
    "/referrals/code"
  );

  return response.data;
};

// Get referral information
export const getReferralInfo = async () => {
  const response = await api.get(
    "/referrals/"
  );

  return response.data;
};

// Apply another user's referral code
export const applyReferralCode = async (
  referralCode
) => {
  const response = await api.post(
    "/referrals/apply",
    {
      referralCode,
    }
  );

  return response.data;
};