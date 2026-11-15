import api from "./api";

// ================= CUSTOMER PROFILE =================

export const getCustomerProfile = async () => {
  const response = await api.get("/customer/profile");
  return response.data;
};

// ================= CUSTOMER DASHBOARD =================

export const getCustomerDashboard = async () => {
  const response = await api.get("/customer/dashboard");
  return response.data;
};

// ================= CUSTOMER PRODUCTS =================

export const getCustomerProducts = async (params = {}) => {
  const response = await api.get("/customer/products", {
    params,
  });

  return response.data;
};

// ================= FAVORITES =================

export const getFavorites = async () => {
  const response = await api.get("/customer/favorites");
  return response.data;
};

export const addToFavorites = async (productId) => {
  const response = await api.post(
    `/customer/favorites/${productId}`
  );

  return response.data;
};

export const removeFromFavorites = async (productId) => {
  const response = await api.delete(
    `/customer/favorites/${productId}`
  );

  return response.data;
};

// ================= SELLER FOLLOW =================

export const followSeller = async (sellerId) => {
  const response = await api.post(
    `/customer/sellers/${sellerId}/follow`
  );

  return response.data;
};

export const unfollowSeller = async (sellerId) => {
  const response = await api.delete(
    `/customer/sellers/${sellerId}/follow`
  );

  return response.data;
};

export const getFollowingSellers = async () => {
  const response = await api.get(
    "/customer/sellers/following"
  );

  return response.data;
};