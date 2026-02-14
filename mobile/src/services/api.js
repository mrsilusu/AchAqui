import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000
});

// Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    // TODO: Obter token do AsyncStorage
    // const token = await AsyncStorage.getItem('auth_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para erro
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // TODO: Fazer logout e redirecionar para login
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (email, password) => api.post('/auth/login', { email, password }),
};

export const serviceService = {
  searchServices: (params) => api.get('/services', { params }),
  getServiceById: (id) => api.get(`/services/${id}`),
  createService: (data) => api.post('/services', data),
  updateService: (id, data) => api.put(`/services/${id}`, data),
};

export const ratingService = {
  getRatings: (serviceId, params) =>
    api.get(`/ratings/service/${serviceId}`, { params }),
  addRating: (data) => api.post('/ratings', data),
};

export const userService = {
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
};

export const whatsappService = {
  getContactUrl: (providerId) =>
    api.get(`/whatsapp/contact-url/${providerId}`),
  sendMessage: (data) => api.post('/whatsapp/send-message', data),
};

export default api;
