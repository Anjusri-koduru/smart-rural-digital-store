const cartService = require(
  "../services/cartService"
);


// Get cart
const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(
      req.user.id
    );

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Add to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const cart =
      await cartService.addToCart(
        req.user.id,
        productId,
        Number(quantity) || 1
      );

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Update quantity
const updateCartItem = async (
  req,
  res
) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart =
      await cartService.updateCartItem(
        req.user.id,
        productId,
        Number(quantity)
      );

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Remove item
const removeFromCart = async (
  req,
  res
) => {
  try {
    const { productId } = req.params;

    const cart =
      await cartService.removeFromCart(
        req.user.id,
        productId
      );

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// Clear cart
const clearCart = async (req, res) => {
  try {
    await cartService.clearCart(
      req.user.id
    );

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};