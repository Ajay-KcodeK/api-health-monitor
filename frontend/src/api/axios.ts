import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',  // your Spring Boot URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR
// Runs before every request — automatically attaches JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// RESPONSE INTERCEPTOR
// Runs after every response — handles 401 globally
api.interceptors.response.use(
  (response) => response,  // success — just pass through
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';  // force redirect
    }
    return Promise.reject(error);
  }
);

export default api;