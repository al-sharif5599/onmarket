import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refresh = localStorage.getItem('refresh');
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh,
        });
        
        localStorage.setItem('token', response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login/', data),
  register: (data) => api.post('/auth/register/', data),
  logout: (refresh) => api.post('/auth/logout/', { refresh }),
  getUser: () => api.get('/auth/user/'),
  updateProfile: (data) => api.patch('/auth/profile/', data),
  changePassword: (data) => api.post('/auth/change-password/', data),
};

// Businesses API
export const businessesAPI = {
  getAll: (params) => api.get('/businesses/', { params }),
  getById: (id) => api.get(`/businesses/${id}/`),
  create: (data) => api.post('/businesses/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id, data) => api.patch(`/businesses/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id) => api.delete(`/businesses/${id}/`),
  getMyBusinesses: () => api.get('/businesses/my_businesses/'),
  uploadImage: (id, formData) => api.post(`/businesses/${id}/upload_image/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadVideo: (id, formData) => api.post(`/businesses/${id}/upload_video/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  addReview: (id, data) => api.post(`/businesses/${id}/add_review/`, data),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories/'),
  getById: (id) => api.get(`/categories/${id}/`),
  create: (data) => api.post('/categories/', data),
  update: (id, data) => api.patch(`/categories/${id}/`, data),
  delete: (id) => api.delete(`/categories/${id}/`),
};

// Admin API
export const adminAPI = {
  getBusinesses: (params) => api.get('/admin/businesses/', { params }),
  approveBusiness: (id) => api.post(`/admin/businesses/${id}/approve/`),
  rejectBusiness: (id) => api.post(`/admin/businesses/${id}/reject/`),
  featureBusiness: (id) => api.post(`/admin/businesses/${id}/feature/`),
  getPending: () => api.get('/admin/businesses/pending/'),
  getStatistics: () => api.get('/admin/businesses/statistics/'),
  getUsers: (params) => api.get('/auth/users/', { params }),
  updateUser: (id, data) => api.patch(`/auth/users/${id}/`, data),
  deleteUser: (id) => api.delete(`/auth/users/${id}/`),
};
