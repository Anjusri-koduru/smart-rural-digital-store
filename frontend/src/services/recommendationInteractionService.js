import api from "./api";

export const trackProductView = async (
  productId
) => {
  const response = await api.post(
    "/recommendation-interactions/view",
    {
      productId,
    }
  );

  return response.data;
};

export const trackSearch = async (
  searchTerm
) => {
  const response = await api.post(
    "/recommendation-interactions/search",
    {
      searchTerm,
    }
  );

  return response.data;
};