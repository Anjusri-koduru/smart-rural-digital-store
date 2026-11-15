const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");


// ========================================
// CREATE REVIEW
// ========================================

const createReview = async (
  userId,
  productId,
  rating,
  comment
) => {
  // Check product
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  // ========================================
  // CHECK PURCHASE + DELIVERY
  // ========================================

  const deliveredOrder = await Order.findOne({
    customer: userId,
    orderStatus: "delivered",
    "items.product": productId,
  });

  if (!deliveredOrder) {
    throw new Error(
      "You can review this product only after purchasing and receiving it"
    );
  }

  // ========================================
  // CHECK EXISTING REVIEW
  // ========================================

  const existingReview = await Review.findOne({
    product: productId,
    customer: userId,
  });

  if (existingReview) {
    throw new Error(
      "You have already reviewed this product"
    );
  }

  // ========================================
  // CREATE REVIEW
  // ========================================

  const review = await Review.create({
    product: productId,
    customer: userId,
    rating,
    comment,
  });

  // Update product rating
  await updateProductRating(productId);

  return await Review.findById(review._id)
    .populate(
      "customer",
      "name profileImage"
    )
    .populate(
      "product",
      "name price image"
    );
};


// ========================================
// GET PRODUCT REVIEWS
// ========================================

const getProductReviews = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const reviews = await Review.find({
    product: productId,
  })
    .populate(
      "customer",
      "name profileImage"
    )
    .sort({
      createdAt: -1,
    });

  return reviews;
};


// ========================================
// UPDATE REVIEW
// ========================================

const updateReview = async (
  userId,
  reviewId,
  rating,
  comment
) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  // Only review owner can update
  if (
    review.customer.toString() !==
    userId.toString()
  ) {
    throw new Error(
      "You are not authorized to update this review"
    );
  }

  review.rating = rating;
  review.comment = comment;

  await review.save();

  // Update product rating
  await updateProductRating(
    review.product
  );

  return await Review.findById(review._id)
    .populate(
      "customer",
      "name profileImage"
    )
    .populate(
      "product",
      "name price image"
    );
};


// ========================================
// DELETE REVIEW
// ========================================

const deleteReview = async (
  userId,
  reviewId
) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  // Only review owner can delete
  if (
    review.customer.toString() !==
    userId.toString()
  ) {
    throw new Error(
      "You are not authorized to delete this review"
    );
  }

  const productId = review.product;

  await Review.findByIdAndDelete(reviewId);

  // Update product rating
  await updateProductRating(productId);

  return true;
};


// ========================================
// UPDATE PRODUCT RATING
// ========================================

const updateProductRating = async (
  productId
) => {
  const result = await Review.aggregate([
    {
      $match: {
        product: productId,
      },
    },
    {
      $group: {
        _id: "$product",
        averageRating: {
          $avg: "$rating",
        },
        totalReviews: {
          $sum: 1,
        },
      },
    },
  ]);

  if (result.length === 0) {
    await Product.findByIdAndUpdate(
      productId,
      {
        rating: 0,
        totalReviews: 0,
      }
    );

    return;
  }

  await Product.findByIdAndUpdate(
    productId,
    {
      rating: Number(
        result[0].averageRating.toFixed(1)
      ),
      totalReviews:
        result[0].totalReviews,
    }
  );
};


module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
};