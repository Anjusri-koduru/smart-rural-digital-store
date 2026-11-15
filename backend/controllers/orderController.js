const orderService = require("../services/orderService");

// ==========================================
// Create Order
// ==========================================

const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
    } = req.body;

    const order =
      await orderService.createOrder(
        req.user.id,
        items,
        shippingAddress,
        paymentMethod
      );

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Customer Orders
// ==========================================

const getCustomerOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await orderService.getCustomerOrders(
        req.user.id
      );

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to fetch customer orders",
      error: error.message,
    });
  }
};

// ==========================================
// Seller Orders
// ==========================================

const getSellerOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await orderService.getSellerOrders(
        req.user.id
      );

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to fetch seller orders",
      error: error.message,
    });
  }
};

// ==========================================
// Get Single Order
// ==========================================

const getOrderById = async (
  req,
  res
) => {
  try {
    const order =
      await orderService.getOrderById(
        req.params.id,
        req.user.id,
        req.user.role
      );

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(403).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Update Order Status
// ==========================================

const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { status } = req.body;

    const order =
      await orderService.updateOrderStatus(
        req.params.id,
        req.user.id,
        status
      );

    res.status(200).json({
      success: true,
      message:
        "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Cancel Order
// ==========================================

const cancelOrder = async (
  req,
  res
) => {
  try {
    const order =
      await orderService.cancelOrder(
        req.params.id,
        req.user.id
      );

    res.status(200).json({
      success: true,
      message:
        "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getCustomerOrders,
  getSellerOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};