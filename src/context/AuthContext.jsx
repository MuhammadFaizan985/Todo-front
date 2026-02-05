import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { data } = await API.get('/users/me');
        // Structure: { isStatus: true, data: userObject }
        if (data && data.data) {
          setUser(data.data);
        } else if (data.user) {
          setUser(data.user);
        } else {
          // If we got a response but no user data, token might be invalid/expired or format changed
          // but do not clear immediately if it's just a format mismatch, log it.
          // However for safety, if we can't get user, we can't proceed.
          console.warn('Unexpected user response format:', data);
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error('Session check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/users/login', { email, password });

      // Handle the response: data.data contains { user, token }
      if (data.data && data.data.token) {
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
      } else if (data.token) { // Fallback
        localStorage.setItem('token', data.token);
        setUser(data.user);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const { data } = await API.post('/users/signup', userData);
      console.log('Signup response:', data);

      // Handle different response formats
      if (data.token && data.user) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
      } else if (data.data && data.data.token) {
        localStorage.setItem('token', data.data.token);
        setUser(data.data.user);
      } else {
        console.error('Invalid signup response:', data);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await API.get('/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);