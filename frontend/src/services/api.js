import axios from 'axios';

// Ensure VITE_API_URL can be either root (e.g. https://host.com) or include /api/v1
const apiHost = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
const apiBaseUrl = apiHost.endsWith('/api/v1') ? apiHost : `${apiHost}/api/v1`;
const API = axios.create({
  baseURL: apiBaseUrl,
});

// Interceptor to add Authorization header
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth Services
export const loginUser = (formData) => API.post('/auth/login', formData);
export const registerUser = (formData) => API.post('/auth/register', formData);
export const fetchMe = () => API.get('/auth/me');

// Image Services
export const fetchImages = (params) => {
  // params can include: category, search, view, page, limit
  return API.get('/images', { params });
};
export const uploadImage = (formData) => API.post('/images/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteImage = (id) => API.delete(`/images/${id}`);

export default API;
