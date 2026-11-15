const Cart = require("../models/Cart");
const Product = require("../models/Product");


// Get cart
const getCart = async (userId) => {
  let cart = await Cart.findOne({
    user: userId,
  }).populate(
    "items.product",
    "name price image quantity category seller"
  );

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });

    cart = await Cart.findById(cart._id).populate(
      "items.product",
      "name price image quantity category seller"
    );
  }

  return cart;
};


// Add product to cart
const addToCart = async (
  userId,
  productId,
  quantity
) => {
  const product = await Product.findById(
    productId
  );

  if (!product) {
    throw new Error("Product not found");
  }

  if (!product.isAvailable || product.quantity <= 0) {
    throw new Error("Product is out of stock");
  }

  if (quantity > product.quantity) {
    throw new Error(
      `Only ${product.quantity} items are available`
    );
  }

  let cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item) =>
      item.product.toString() ===
      productId.toString()
  );

  if (existingItem) {
    const newQuantity =
      existingItem.quantity + quantity;

    if (newQuantity > product.quantity) {
      throw new Error(
        `Only ${product.quantity} items are available`
      );
    }

    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
    });
  }

  await cart.save();

  return await Cart.findById(cart._id).populate(
    "items.product",
    "name price image quantity category seller"
  );
};


// Update quantity
const updateCartItem = async (
  userId,
  productId,
  quantity
) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const product = await Product.findById(
    productId
  );

  if (!product) {
    throw new Error("Product not found");
  }

  if (quantity > product.quantity) {
    throw new Error(
      `Only ${product.quantity} items are available`
    );
  }

  const item = cart.items.find(
    (item) =>
      item.product.toString() ===
      productId.toString()
  );

  if (!item) {
    throw new Error(
      "Product is not available in cart"
    );
  }

  item.quantity = quantity;

  await cart.save();

  return await Cart.findById(cart._id).populate(
    "items.product",
    "name price image quantity category seller"
  );
};


// Remove item
const removeFromCart = async (
  userId,
  productId
) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) =>
      item.product.toString() !==
      productId.toString()
  );

  await cart.save();

  return await Cart.findById(cart._id).populate(
    "items.product",
    "name price image quantity category seller"
  );
};


// Clear cart
const clearCart = async (userId) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    return null;
  }

  cart.items = [];

  await cart.save();

  return cart;
};


module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};