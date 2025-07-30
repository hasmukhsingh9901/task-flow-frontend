import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/v1/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/v1/login', credentials),
  register: (userData) => api.post('/auth/v1/register', userData),
  logout: (refreshToken) => api.post('/auth/v1/logout', { refreshToken }),
  refreshToken: (refreshToken) => api.post('/auth/v1/refresh', { refreshToken }),
  getUsers: () => api.get('/auth/v1/users'),
  updateUserRole: (userId) => api.patch(`/auth/v1/users/${userId}/role`),
  getUserLogs: () => api.get('/auth/v1/user-logs'),
  deleteUserLog: (logId) => api.delete(`/auth/v1/user-logs/${logId}`),
};

// Task API calls
export const taskAPI = {
  getTasks: (params) => api.get('/api/v1/tasks', { params }),
  createTask: (taskData) => api.post('/api/v1/tasks', taskData),
  updateTask: (taskId, taskData) => api.put(`/api/v1/tasks/${taskId}`, taskData),
  deleteTask: (taskId) => api.delete(`/api/v1/tasks/${taskId}`),
};

export default api; 