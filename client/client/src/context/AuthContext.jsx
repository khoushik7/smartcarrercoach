import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount or token change
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await apiRequest('/auth/me');
        setUser(userData);
      } catch (err) {
        console.warn('Token verification failed:', err.message);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    const data = await apiRequest('/auth/login', 'POST', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (formData) => {
    const data = await apiRequest('/auth/register', 'POST', formData);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Request password reset email
  const forgotPassword = async (email) => {
    return await apiRequest('/auth/forgot-password', 'POST', { email });
  };

  // Set new password using token from reset link
  const resetPassword = async (resetToken, newPassword) => {
    return await apiRequest('/auth/reset-password', 'POST', {
      token: resetToken,
      newPassword,
    });
  };

  const updateUserData = (updatedFields) => {
    setUser(prev => ({ ...prev, ...updatedFields }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}