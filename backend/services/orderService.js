const Order = require("../models/Order");
const Product = require("../models/Product");
const Notification = require("../models/Notification");

// ==========================================
// Create Order
// ==========================================

const createOrder = async (
  customerId,
  items,
  shippingAddress,
  paymentMethod = "COD"
) => {
  if (!items || items.length === 0) {
    throw new Error(
      "At least one product is required"
    );
  }

  const orderItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const product =
      await Product.findById(item.product);

    if (!product) {
      throw new Error(
        `Product not found: ${item.product}`
      );
    }

    const requestedQuantity =
      Number(item.quantity);

    if (
      !requestedQuantity ||
      requestedQuantity < 1
    ) {
      throw new Error(
        "Product quantity must be at least 1"
      );
    }

    if (
      product.quantity <
      requestedQuantity
    ) {
      throw new Error(
        `${product.name} has only ${product.quantity} items available`
      );
    }

    const subtotal =
      product.price * requestedQuantity;

    orderItems.push({
      product: product._id,
      seller: product.seller,
      productName: product.name,
      image: product.image,
      quantity: requestedQuantity,
      price: product.price,
      subtotal,
    });

    totalAmount += subtotal;

    // Reduce stock
    product.quantity -= requestedQuantity;

    if (product.quantity === 0) {
      product.isAvailable = false;
    }

    await product.save();
  }

  // ==========================================
  // Create Order
  // ==========================================

  const order = await Order.create({
    customer: customerId,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentMethod,
  });

  // ==========================================
  // Seller Notifications
  // ==========================================

  try {
    // Get unique seller IDs from order items
    const sellerIds = [
      ...new Set(
        orderItems.map((item) =>
          item.seller.toString()
        )
      ),
    ];

    // Create only ONE notification
    // for each seller
    for (const sellerId of sellerIds) {
      await Notification.create({
        user: sellerId,

        title: "New Order Received",

        message:
          "You received a new order from a customer. " +
          `Order ID: ${order._id}`,

        type: "order",

        relatedId: order._id,

        isRead: false,
      });
    }
  } catch (notificationError) {
    // Notification failure should NOT
    // make the successful order fail
    console.error(
      "Seller notification error:",
      notificationError.message
    );
  }

  return order;
};

// ==========================================
// Customer Orders
// ==========================================

const getCustomerOrders = async (
  customerId
) => {
  return await Order.find({
    customer: customerId,
  })
    .populate(
      "items.product",
      "name image price"
    )
    .populate(
      "items.seller",
      "name email phone"
    )
    .sort({
      createdAt: -1,
    });
};

// ==========================================
// Seller Orders
// ==========================================

const getSellerOrders = async (
  sellerId
) => {
  return await Order.find({
    "items.seller": sellerId,
  })
    .populate(
      "customer",
      "name email phone"
    )
    .populate(
      "items.product",
      "name image price"
    )
    .sort({
      createdAt: -1,
    });
};

// ==========================================
// Get Single Order
// ==========================================

const getOrderById = async (
  orderId,
  userId,
  role
) => {
  const order = await Order.findById(
    orderId
  )
    .populate(
      "customer",
      "name email phone"
    )
    .populate(
      "items.product",
      "name image price"
    )
    .populate(
      "items.seller",
      "name email phone"
    );

  if (!order) {
    throw new Error("Order not found");
  }

  const isCustomer =
    order.customer._id.toString() ===
    userId.toString();

  const isSeller = order.items.some(
    (item) =>
      item.seller._id.toString() ===
      userId.toString()
  );

  if (
    role !== "admin" &&
    !isCustomer &&
    !isSeller
  ) {
    throw new Error(
      "You are not authorized to view this order"
    );
  }

  return order;
};

// ==========================================
// Update Order Status
// ==========================================

const updateOrderStatus = async (
  orderId,
  sellerId,
  status
) => {
  const allowedStatuses = [
    "confirmed",
    "packed",
    "shipped",
    "delivered",
  ];

  if (
    !allowedStatuses.includes(status)
  ) {
    throw new Error(
      "Invalid order status"
    );
  }

  const order = await Order.findById(
    orderId
  );

  if (!order) {
    throw new Error("Order not found");
  }

  const sellerOwnsOrder =
    order.items.some(
      (item) =>
        item.seller.toString() ===
        sellerId.toString()
    );

  if (!sellerOwnsOrder) {
    throw new Error(
      "You are not authorized to update this order"
    );
  }

  order.orderStatus = status;

  await order.save();

  return order;
};

// ==========================================
// Cancel Order
// ==========================================

const cancelOrder = async (
  orderId,
  customerId
) => {
  const order = await Order.findOne({
    _id: orderId,
    customer: customerId,
  });

  if (!order) {
    throw new Error("Order not found");
  }

  if (
    [
      "shipped",
      "delivered",
      "cancelled",
    ].includes(order.orderStatus)
  ) {
    throw new Error(
      "This order cannot be cancelled"
    );
  }

  // Restore product stock
  for (const item of order.items) {
    const product =
      await Product.findById(
        item.product
      );

    if (product) {
      product.quantity += item.quantity;

      if (product.quantity > 0) {
        product.isAvailable = true;
      }

      await product.save();
    }
  }

  order.orderStatus = "cancelled";
  order.cancelledAt = new Date();

  await order.save();

  return order;
};

module.exports = {
  createOrder,
  getCustomerOrders,
  getSellerOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
};