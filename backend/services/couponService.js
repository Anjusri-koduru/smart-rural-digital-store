const Coupon = require("../models/Coupon");


// Create coupon
const createCoupon = async (data) => {
  const {
    code,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscount,
    expiryDate,
    usageLimit,
  } = data;

  const existingCoupon = await Coupon.findOne({
    code: code.toUpperCase(),
  });

  if (existingCoupon) {
    throw new Error("Coupon code already exists");
  }

  if (
    discountType === "percentage" &&
    discountValue > 100
  ) {
    throw new Error(
      "Percentage discount cannot exceed 100"
    );
  }

  if (
    new Date(expiryDate) <= new Date()
  ) {
    throw new Error(
      "Expiry date must be in the future"
    );
  }

  return await Coupon.create({
    code: code.toUpperCase(),
    discountType,
    discountValue,
    minOrderAmount: minOrderAmount || 0,
    maxDiscount: maxDiscount || null,
    expiryDate,
    usageLimit: usageLimit || null,
  });
};


// Get all coupons
const getCoupons = async () => {
  return await Coupon.find().sort({
    createdAt: -1,
  });
};


// Apply coupon
const applyCoupon = async (
  code,
  orderAmount
) => {
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
  });

  if (!coupon) {
    throw new Error("Invalid coupon code");
  }

  if (
    new Date(coupon.expiryDate) < new Date()
  ) {
    throw new Error("Coupon has expired");
  }

  if (
    coupon.usageLimit !== null &&
    coupon.usedCount >= coupon.usageLimit
  ) {
    throw new Error(
      "Coupon usage limit reached"
    );
  }

  if (
    orderAmount < coupon.minOrderAmount
  ) {
    throw new Error(
      `Minimum order amount is ₹${coupon.minOrderAmount}`
    );
  }

  let discount = 0;

  if (
    coupon.discountType === "percentage"
  ) {
    discount =
      (orderAmount *
        coupon.discountValue) /
      100;

    if (
      coupon.maxDiscount !== null &&
      discount > coupon.maxDiscount
    ) {
      discount = coupon.maxDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  if (discount > orderAmount) {
    discount = orderAmount;
  }

  return {
    couponId: coupon._id,
    code: coupon.code,
    discount: Number(discount.toFixed(2)),
    finalAmount: Number(
      (orderAmount - discount).toFixed(2)
    ),
  };
};


// Increase usage
const increaseCouponUsage = async (
  couponId
) => {
  await Coupon.findByIdAndUpdate(
    couponId,
    {
      $inc: {
        usedCount: 1,
      },
    }
  );
};


module.exports = {
  createCoupon,
  getCoupons,
  applyCoupon,
  increaseCouponUsage,
};