import api from "./api";

export const getForYouRecommendations = async () => {
  const response = await api.get("/recommendations/for-you");
  return response.data;
};

export const getSimilarProducts = async (productId) => {
  const response = await api.get(
    `/recommendations/similar/${productId}`
  );

  return response.data;
};