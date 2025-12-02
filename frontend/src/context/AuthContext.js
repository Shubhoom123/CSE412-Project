import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

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
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Error loading user data:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const register = async (username, email, password) => {
    try {
      console.log('Attempting registration...', { username, email });
      
      const response = await authAPI.register(username, email, password);
      
      console.log('Registration response:', response.data);

      if (response.data.success) {
        const { token, data } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        
        return { success: true };
      }
      
      return {
        success: false,
        error: response.data.error || 'Registration failed'
      };
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response) {
        return {
          success: false,
          error: error.response.data.error || 'Registration failed. Please try again.'
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Cannot connect to server. Make sure backend is running on port 3001.'
        };
      } else {
        return {
          success: false,
          error: 'An unexpected error occurred'
        };
      }
    }
  };

  const login = async (username, password) => {
    try {
      console.log('Attempting login...', { username });
      
      const response = await authAPI.login(username, password);
      
      console.log('Login response:', response.data);

      if (response.data.success) {
        const { token, data } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        
        return { success: true };
      }
      
      return {
        success: false,
        error: response.data.error || 'Login failed'
      };
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        return {
          success: false,
          error: error.response.data.error || 'Invalid username or password'
        };
      } else if (error.request) {
        return {
          success: false,
          error: 'Cannot connect to server. Make sure backend is running on port 3001.'
        };
      } else {
        return {
          success: false,
          error: 'An unexpected error occurred'
        };
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};