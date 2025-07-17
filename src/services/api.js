import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/5ti",
});

// Interceptor para agregar el token JWT a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// Roles API
export const getRoles = () => api.get("/rols");
export const getRole = (id) => api.get(`/rols/${id}`);
export const createRole = (data) => api.post("/rols", data);
export const updateRole = (id, data) => api.put(`/rols/${id}`, data);
export const deleteRole = (id) => api.delete(`/rols/${id}`);

export const getUsers = () => api.get("/users");
export const login = (data) => api.post("/login", data);
export const register = (data) => api.post("/register", data);
export const logout = () => api.post("/logout");
export const getMe = () => api.get("/me");