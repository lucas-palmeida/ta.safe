import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data)
};

// Users
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getUserById: (id) => api.get(`/users/${id}`)
};

// Rides
export const rideService = {
  list: (params) => api.get('/rides', { params }),
  getById: (id) => api.get(`/rides/${id}`),
  create: (data) => api.post('/rides', data),
  update: (id, data) => api.put(`/rides/${id}`, data),
  delete: (id) => api.delete(`/rides/${id}`),
  getMyOffered: () => api.get('/rides/my/offered')
};

// Requests
export const requestService = {
  create: (data) => api.post('/requests', data),
  getMy: () => api.get('/requests/my'),
  accept: (id) => api.put(`/requests/${id}/accept`),
  reject: (id) => api.put(`/requests/${id}/reject`),
  cancel: (id) => api.delete(`/requests/${id}`)
};

export default api;