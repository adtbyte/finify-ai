import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import marketSocket from '../api/socketConfig';

// 1. CRITICAL: Export AuthContext itself so useContext(AuthContext) works in other files
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token')); // 2. Track token state
  const [loading, setLoading] = useState(true);

  const verify = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      setToken(currentToken);
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verify();
  }, [verify]);

  const login = async (email, password) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const res = await api.post('/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const accessToken = res.data.access_token;
    localStorage.setItem('token', accessToken);
    setToken(accessToken); // Update token state immediately
    await verify();
    
    if (marketSocket && typeof marketSocket.connect === 'function') {
      marketSocket.connect();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    if (marketSocket && typeof marketSocket.disconnect === 'function') {
      marketSocket.disconnect();
    }
  };

  const register = async ({ name, email, password }) => {
    await api.post('/auth/register', { full_name: name, email, password });
    await login(email, password);
  };

  return (
    // 3. Add 'token' to the value so LiveMarketPage can access it directly
    <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);