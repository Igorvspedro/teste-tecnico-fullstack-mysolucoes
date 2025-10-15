import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:25060/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("taskflow-token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("taskflow-token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
