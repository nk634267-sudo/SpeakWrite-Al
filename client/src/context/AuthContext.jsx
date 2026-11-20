import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, profileAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('speakwrite_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('speakwrite_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('speakwrite_token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('speakwrite_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session check failed, clearing token.');
          localStorage.removeItem('speakwrite_token');
          localStorage.removeItem('speakwrite_user');
          setUser(null);
          setToken('');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('speakwrite_token', newToken);
      localStorage.setItem('speakwrite_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    }
    return { success: false, message: res.data.message };
  };

  const register = async (name, email, password, englishLevel) => {
    const res = await authAPI.register({ name, email, password, englishLevel });
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('speakwrite_token', newToken);
      localStorage.setItem('speakwrite_user', JSON.stringify(newUser));
      return { success: true, user: newUser };
    }
    return { success: false, message: res.data.message };
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('speakwrite_token');
    localStorage.removeItem('speakwrite_user');
  };

  const saveOnboarding = async (preferences) => {
    const res = await authAPI.saveOnboarding(preferences);
    if (res.data.success && res.data.user) {
      setUser(res.data.user);
      localStorage.setItem('speakwrite_user', JSON.stringify(res.data.user));
      return { success: true };
    }
    return { success: false, message: res.data.message };
  };

  const updateProfile = async (data) => {
    const res = await profileAPI.updateProfile(data);
    if (res.data.success && res.data.profile) {
      setUser(res.data.profile);
      localStorage.setItem('speakwrite_user', JSON.stringify(res.data.profile));
      return { success: true };
    }
    return { success: false, message: res.data.message };
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
        saveOnboarding,
        updateProfile,
        isAuthenticated: Boolean(token && user)
      }}
    >
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
