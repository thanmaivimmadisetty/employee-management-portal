import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Attach Authorization Token to requests if it exists in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('emp_portal_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercept responses for auth errors (expired sessions)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('emp_portal_token');
      localStorage.removeItem('emp_portal_user');
      // Redirect to login only if not already on the login page
      if (!window.location.pathname.endsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
