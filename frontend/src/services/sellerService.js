import api from "./api";

// Get seller profile
export const getSellerProfile = async () => {
  const response = await api.get("/seller/profile");
  return response.data;
};

// Get seller dashboard
export const getSellerDashboard = async () => {
  const response = await api.get("/seller/dashboard");
  return response.data;
};

// Get seller products
export const getSellerProducts = async () => {
  const response = await api.get("/seller/products");
  return response.data;
};