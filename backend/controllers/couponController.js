const couponService = require(
  "../services/couponService"
);


// Admin create coupon
const createCoupon = async (
  req,
  res
) => {
  try {
    const coupon =
      await couponService.createCoupon(
        req.body
      );

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Admin get coupons
const getCoupons = async (
  req,
  res
) => {
  try {
    const coupons =
      await couponService.getCoupons();

    res.status(200).json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Customer apply coupon
const applyCoupon = async (
  req,
  res
) => {
  try {
    const {
      code,
      orderAmount,
    } = req.body;

    if (!code || orderAmount === undefined) {
      return res.status(400).json({
        success: false,
        message:
          "Coupon code and order amount are required",
      });
    }

    const result =
      await couponService.applyCoupon(
        code,
        Number(orderAmount)
      );

    res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  createCoupon,
  getCoupons,
  applyCoupon,
};