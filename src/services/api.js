import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/5ti",
});

export default api;

// Roles API
export const getRoles = () => api.get("/rols");
export const getRole = (id) => api.get(`/rols/${id}`);
export const createRole = (data) => api.post("/rols", data);
export const updateRole = (id, data) => api.put(`/rols/${id}`, data);
export const deleteRole = (id) => api.delete(`/rols/${id}`);

export const getUsers = () => api.get("/users");