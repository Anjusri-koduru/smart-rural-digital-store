import api from "./api";

// Create new order
export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

// Get logged-in customer's orders
export const getMyOrders = async () => {
  const response = await api.get("/orders/customer/my-orders");
  return response.data;
};

// Get single order
export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

// Cancel order
export const cancelOrder = async (orderId) => {
  const response = await api.put(`/orders/${orderId}/cancel`);
  return response.data;
};

// Seller orders - used in later Seller Module
export const getSellerOrders = async () => {
  const response = await api.get("/orders/seller/my-orders");
  return response.data;
};

// Seller update order status - used in later Seller Module
export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/orders/${orderId}/status`, {
    status,
  });

  return response.data;
};