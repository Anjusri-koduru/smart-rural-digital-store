import api from "./api";

export const getFavorites = async () => {
  const response = await api.get("/customer/favorites");
  return response.data;
};

export const addFavorite = async (productId) => {
  const response = await api.post(
    `/customer/favorites/${productId}`
  );

  return response.data;
};

export const removeFavorite = async (productId) => {
  const response = await api.delete(
    `/customer/favorites/${productId}`
  );

  return response.data;
};