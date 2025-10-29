import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", 
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

export const login = async (email, password) => {
  const response = await api.post("auth/login", { email, password });
  return response.data;
};

export const createPost = async( id, description, type) => {
  const response = await api.post(`coaches/${id}/post`, { description, type , status: "DRAFT"});
  return response.data;
}

export const getCoachPosts = async (id) => {
  const response = await api.get(`coaches/${id}/posts`)
  return response.data
}

export const getCoachMessages = async (id) => {
  return []
}

export const getMe = async (token) => {
  const response = await api.get("/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default api;
