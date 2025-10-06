import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;
        localStorage.setItem('access_token', access);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  login: (username: string, password: string) =>
    axios.post(`${API_BASE_URL}/auth/token/`, { username, password }),
  
  refresh: (refresh: string) =>
    axios.post(`${API_BASE_URL}/auth/token/refresh/`, { refresh }),
  
  register: (data: {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => api.post('/register/', data),
};

export const categoriesAPI = {
  list: () => api.get('/categories/'),
  create: (data: { name: string; type: 'income' | 'expense' }) => 
    api.post('/categories/', data),
  update: (id: number, data: { name: string; type: 'income' | 'expense' }) =>
    api.put(`/categories/${id}/`, data),
  delete: (id: number) => api.delete(`/categories/${id}/`),
};

export const transactionsAPI = {
  list: (params?: {
    page?: number;
    page_size?: number;
    start_date?: string;
    end_date?: string;
    category?: number;
    min_amount?: number;
    max_amount?: number;
    type?: 'income' | 'expense';
  }) => api.get('/transactions/', { params }),
  
  get: (id: number) => api.get(`/transactions/${id}/`),
  
  create: (data: {
    category: number;
    amount: string;
    date: string;
    note?: string;
  }) => api.post('/transactions/', data),
  
  update: (id: number, data: {
    category: number;
    amount: string;
    date: string;
    note?: string;
  }) => api.put(`/transactions/${id}/`, data),
  
  delete: (id: number) => api.delete(`/transactions/${id}/`),
  
  stats: (params?: { start?: string; end?: string }) =>
    api.get('/transactions/stats/', { params }),
};

export const budgetAPI = {
  list: (params?: { year?: number; month?: number }) =>
    api.get('/budgets/', { params }),
  
  create: (data: { year: number; month: number; amount: string }) =>
    api.post('/budgets/', data),
  
  update: (id: number, data: { year: number; month: number; amount: string }) =>
    api.put(`/budgets/${id}/`, data),
  
  delete: (id: number) => api.delete(`/budgets/${id}/`),
};

export const summaryAPI = {
  get: (params?: { year?: number; month?: number }) =>
    api.get('/summary/', { params }),
};
