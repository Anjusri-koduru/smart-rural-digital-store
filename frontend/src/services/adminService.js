import api from "./api";

// Admin dashboard
export const getAdminDashboard = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

// Get all users
export const getAllUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

// Get all sellers
export const getAllSellers = async () => {
  const response = await api.get("/admin/sellers");
  return response.data;
};

// Get all customers
export const getAllCustomers = async () => {
  const response = await api.get("/admin/customers");
  return response.data;
};