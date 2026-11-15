
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    // FormData uploads: let Axios/browser set multipart boundary
    if (config.data instanceof FormData) {
      if (config.headers.delete) {
        config.headers.delete("Content-Type");
      } else {
        delete config.headers["Content-Type"];
      }
    }

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
