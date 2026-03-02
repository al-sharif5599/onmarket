import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refresh');
        if (!refresh) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, { refresh });
        localStorage.setItem('token', response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  logout: (refresh) => api.post('/auth/logout/', { refresh }),
  me: () => api.get('/auth/user/'),
};

export const productsAPI = {
  list: (params) => api.get('/products/', { params }),
  detail: (id) => api.get(`/products/${id}/`),
  create: (data) =>
    api.post('/products/', data, data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}),
  update: (id, data) =>
    api.patch(
      `/products/${id}/`,
      data,
      data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}
    ),
  remove: (id) => api.delete(`/products/${id}/`),
  myProducts: () => api.get('/products/my/'),
};

export const ordersAPI = {
  list: () => api.get('/orders/'),
  create: (data) => api.post('/orders/', data),
  remove: (id) => api.delete(`/orders/${id}/`),
};

export const adminAPI = {
  stats: () => api.get('/admin/statistics/'),
  approveProduct: (id) => api.post(`/admin/products/${id}/approve/`),
  rejectProduct: (id) => api.post(`/admin/products/${id}/reject/`),
  users: () => api.get('/auth/users/'),
  createUser: (data) => api.post('/auth/users/create/', data),
  deleteUser: (id) => api.delete(`/auth/users/${id}/`),
};
