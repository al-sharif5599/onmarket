import React, { createContext, useContext, useEffect, useState } from 'react';

import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    authAPI.me()
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const response = await authAPI.login({ username, password });
    localStorage.setItem('token', response.data.tokens.access);
    localStorage.setItem('refresh', response.data.tokens.refresh);
    setUser(response.data.user);
  };

  const register = async (payload) => {
    const response = await authAPI.register(payload);
    localStorage.setItem('token', response.data.tokens.access);
    localStorage.setItem('refresh', response.data.tokens.refresh);
    setUser(response.data.user);
  };

  const logout = async () => {
    const refresh = localStorage.getItem('refresh');
    if (refresh) {
      try {
        await authAPI.logout(refresh);
      } catch {
        // Ignore logout API errors and clear local session.
      }
    }

    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
