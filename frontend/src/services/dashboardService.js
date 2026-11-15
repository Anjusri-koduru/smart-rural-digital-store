import api from "./api";

// Seller dashboard
export const getSellerDashboardData = async () => {
  const response = await api.get("/dashboard/seller");
  return response.data;
};

// Customer dashboard
export const getCustomerDashboardData = async () => {
  const response = await api.get("/dashboard/customer");
  return response.data;
};

// Admin dashboard
export const getAdminDashboardData = async () => {
  const response = await api.get("/dashboard/admin");
  return response.data;
};