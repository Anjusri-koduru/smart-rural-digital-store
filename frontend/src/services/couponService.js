import api from "./api";

// Admin - Create Coupon
export const createCoupon = async (couponData) => {
  const response = await api.post(
    "/coupons/",
    couponData
  );

  return response.data;
};

// Admin - Get All Coupons
export const getCoupons = async () => {
  const response = await api.get("/coupons/");

  return response.data;
};

// Customer - Apply Coupon
export const applyCoupon = async (
  code,
  orderAmount
) => {
  const response = await api.post(
    "/coupons/apply",
    {
      code,
      orderAmount,
    }
  );

  return response.data;
};