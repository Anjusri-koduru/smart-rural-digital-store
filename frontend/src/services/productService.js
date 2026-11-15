
import api from "./api";

// Get all products
export const getProducts = async (params = {}) => {
  const response = await api.get("/products", {
    params,
  });

  return response.data;
};

// Get single product
export const getProductById = async (productId) => {
  const response = await api.get(`/products/${productId}`);

  return response.data;
};

// Customer products
export const getCustomerProducts = async (params = {}) => {
  const response = await api.get("/customer/products", {
    params,
  });

  return response.data;
};

// Seller products
export const getSellerProducts = async () => {
  const response = await api.get("/products/seller/my-products");

  return response.data;
};

// Add product
export const createProduct = async (productData) => {
  const response = await api.post(
    "/products",
    productData
  );

  return response.data;
};

// Update product
export const updateProduct = async (productId, productData) => {
  const response = await api.put(
    `/products/${productId}`,
    productData
  );

  return response.data;
};

// Delete product
export const deleteProduct = async (productId) => {
  const response = await api.delete(`/products/${productId}`);

  return response.data;
};
