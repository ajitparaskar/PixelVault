import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
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
