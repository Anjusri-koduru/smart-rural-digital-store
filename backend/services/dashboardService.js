const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// ==========================================
// Seller Dashboard
// ==========================================

const getSellerDashboard = async (
  sellerId
) => {
  const products =
    await Product.find({
      seller: sellerId,
    });

  const orders =
    await Order.find({
      "items.seller": sellerId,
    });

  let totalItemsSold = 0;
  let totalRevenue = 0;

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (
        item.seller.toString() ===
        sellerId.toString()
      ) {
        if (
          order.orderStatus !== "cancelled"
        ) {
          totalItemsSold += item.quantity;
          totalRevenue += item.subtotal;
        }
      }
    });
  });

  const pendingOrders =
    orders.filter(
      (order) =>
        [
          "placed",
          "confirmed",
          "packed",
          "shipped",
        ].includes(
          order.orderStatus
        )
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "delivered"
    ).length;

  const outOfStockProducts =
    products.filter(
      (product) =>
        product.quantity === 0
    ).length;

  const availableProducts =
    products.filter(
      (product) =>
        product.quantity > 0 &&
        product.isAvailable
    ).length;

  const recentOrders =
    await Order.find({
      "items.seller": sellerId,
    })
      .populate(
        "customer",
        "name email phone"
      )
      .sort({
        createdAt: -1,
      })
      .limit(5);

  return {
    totalProducts: products.length,
    availableProducts,
    outOfStockProducts,
    totalOrders: orders.length,
    totalItemsSold,
    totalRevenue,
    pendingOrders,
    deliveredOrders,
    recentOrders,
  };
};

// ==========================================
// Customer Dashboard
// ==========================================

const getCustomerDashboard = async (
  customerId
) => {
  const orders =
    await Order.find({
      customer: customerId,
    }).sort({
      createdAt: -1,
    });

  let totalSpending = 0;

  orders.forEach((order) => {
    if (
      order.orderStatus !== "cancelled"
    ) {
      totalSpending +=
        order.totalAmount;
    }
  });

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "delivered"
    ).length;

  const cancelledOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "cancelled"
    ).length;

  const recentOrders =
    orders.slice(0, 5);

  return {
    totalOrders: orders.length,
    deliveredOrders,
    cancelledOrders,
    totalSpending,
    recentOrders,
  };
};

// ==========================================
// Admin Dashboard
// ==========================================

const getAdminDashboard = async () => {
  const totalUsers =
    await User.countDocuments();

  const totalSellers =
    await User.countDocuments({
      role: "seller",
    });

  const totalCustomers =
    await User.countDocuments({
      role: "customer",
    });

  const totalProducts =
    await Product.countDocuments();

  const totalOrders =
    await Order.countDocuments();

  const deliveredOrders =
    await Order.find({
      orderStatus: "delivered",
    });

  let totalRevenue = 0;

  deliveredOrders.forEach(
    (order) => {
      totalRevenue +=
        order.totalAmount;
    }
  );

  return {
    totalUsers,
    totalSellers,
    totalCustomers,
    totalProducts,
    totalOrders,
    totalRevenue,
  };
};

module.exports = {
  getSellerDashboard,
  getCustomerDashboard,
  getAdminDashboard,
};