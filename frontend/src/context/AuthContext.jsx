import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cachedUser = localStorage.getItem('emp_portal_user');
    return cachedUser ? JSON.parse(cachedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUserSession = async () => {
      const token = localStorage.getItem('emp_portal_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          const userData = res.data.user;
          setUser(userData);
          localStorage.setItem('emp_portal_user', JSON.stringify(userData));
        } catch (error) {
          console.error('Session verification failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUserSession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user: loggedUser } = res.data;
      
      localStorage.setItem('emp_portal_token', token);
      localStorage.setItem('emp_portal_user', JSON.stringify(loggedUser));
      setUser(loggedUser);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    }
  };

  const logout = async () => {
  try {
    await api.put("/tracker/logout");
  } catch (err) {
    console.log("Tracker logout failed", err);
  }

  localStorage.removeItem("emp_portal_token");
  localStorage.removeItem("emp_portal_user");
  setUser(null);
};

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
