const Product = require("../models/Product");

// Add product
const createProduct = async (data) => {
  const product = await Product.create(data);
  return product;
};

// Get all products
const getAllProducts = async (filters = {}) => {
  const query = {};

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.search) {
    query.name = {
      $regex: filters.search,
      $options: "i",
    };
  }

  if (filters.available === "true") {
    query.isAvailable = true;
  }

  let sort = {
    createdAt: -1,
  };

  if (filters.sort === "price_low") {
    sort = { price: 1 };
  }

  if (filters.sort === "price_high") {
    sort = { price: -1 };
  }

  if (filters.sort === "rating") {
    sort = { rating: -1 };
  }

  const products = await Product.find(query)
    .populate("seller", "name email phone profileImage")
    .sort(sort);

  return products;
};

// Get single product
const getProductById = async (productId) => {
  const product = await Product.findById(productId)
    .populate("seller", "name email phone profileImage");

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

// Get seller products
const getSellerProducts = async (sellerId) => {
  return await Product.find({
    seller: sellerId,
  }).sort({
    createdAt: -1,
  });
};

// Update product
const updateProduct = async (
  productId,
  sellerId,
  data
) => {
  const product = await Product.findOne({
    _id: productId,
    seller: sellerId,
  });

  if (!product) {
    throw new Error(
      "Product not found or you are not authorized"
    );
  }

  const allowedFields = [
    "name",
    "description",
    "price",
    "quantity",
    "category",
    "location",
    "shopName",
    "isAvailable",
    "image",
  ];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      product[field] = data[field];
    }
  });

  await product.save();

  return product;
};

// Delete product
const deleteProduct = async (
  productId,
  sellerId
) => {
  const product = await Product.findOneAndDelete({
    _id: productId,
    seller: sellerId,
  });

  if (!product) {
    throw new Error(
      "Product not found or you are not authorized"
    );
  }

  return product;
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getSellerProducts,
  updateProduct,
  deleteProduct,
};